import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

// Scope note (2026-08-28): X/Twitter is intentionally out of scope here -- it
// stopped offering a free feed years ago, and free-tier API access can't list
// a user's posts. Posts there stay X-only; this only helps with YouTube.
const channelId = process.env.KZGRM_GALLERY_YOUTUBE_CHANNEL_ID ?? 'UCSWkDMHojCiw7zSTToLbptg'; // 風下-kazashimo- (@Kazashimo_Ch)
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const projectRoot = new URL('..', import.meta.url).pathname;
const contentRoot = join(projectRoot, 'src/content');

// `kind: work` content isn't only under content/works/ -- pre-migration
// entries still live under content/activities/ and render fine there (the
// site classifies by frontmatter `kind`, not by directory), so every root
// has to be scanned or already-published videos show up as false positives.
const contentDirectories = ['works', 'activities', 'records'];

function videoIdFromUrl(url) {
	try {
		const parsed = new URL(url);
		if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
		if (parsed.hostname.endsWith('youtube.com')) {
			if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
			const shorts = parsed.pathname.match(/^\/shorts\/([^/]+)/);
			if (shorts) return shorts[1];
		}
	} catch {
		// not a URL -- ignore
	}
	return null;
}

async function knownVideoIds() {
	const ids = new Set();
	for (const directoryName of contentDirectories) {
		const directoryPath = join(contentRoot, directoryName);
		let entries;
		try {
			entries = await readdir(directoryPath, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			let source;
			try {
				source = await readFile(join(directoryPath, entry.name, 'index.md'), 'utf8');
			} catch {
				continue;
			}
			const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
			if (!match) continue;
			const attributes = parseYaml(match[1]) ?? {};
			if (attributes.kind !== 'work') continue;
			const externalUrl = attributes.externalUrl;
			if (typeof externalUrl !== 'string') continue;
			const id = videoIdFromUrl(externalUrl);
			if (id) ids.add(id);
		}
	}
	return ids;
}

function parseFeedEntries(xml) {
	return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, block]) => ({
		videoId: block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? null,
		title: block.match(/<title>([^<]*)<\/title>/)?.[1] ?? '(タイトル不明)',
		url: block.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? null,
		published: block.match(/<published>([^<]+)<\/published>/)?.[1] ?? null
	}));
}

const response = await fetch(feedUrl);
if (!response.ok) throw new Error(`YouTube RSSの取得に失敗しました（HTTP ${response.status}）: ${feedUrl}`);
const entries = parseFeedEntries(await response.text());
const existing = await knownVideoIds();
const missing = entries.filter((entry) => entry.videoId && !existing.has(entry.videoId));

if (missing.length === 0) {
	process.stdout.write(`未反映の動画はありません（フィード上の直近${entries.length}件はすべてgalleryに反映済み）。\n`);
} else {
	process.stdout.write(`未反映の動画が${missing.length}件あります:\n\n`);
	for (const video of missing) {
		process.stdout.write(`- ${video.title}\n  ${video.url}\n  公開日: ${video.published?.slice(0, 10) ?? '不明'}\n\n`);
	}
}
