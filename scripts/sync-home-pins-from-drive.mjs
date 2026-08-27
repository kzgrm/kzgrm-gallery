import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const remote = process.env.KZGRM_HOME_PINS_REMOTE ?? 'gdrive:kzgrm-hub/compass/homepage-pins/';
const projectRoot = new URL('..', import.meta.url).pathname;
const publicRoot = join(projectRoot, 'static/home-pins');
const manifestPath = join(projectRoot, 'src/content/home-pins.json');
const maximumPhotos = 100;

async function run(command, args, timeout = 180_000) {
	return (await exec(command, args, { timeout, maxBuffer: 4 * 1024 * 1024 })).stdout;
}

const workspace = await mkdtemp(join(tmpdir(), 'kzgrm-home-pins-'));
try {
	const listing = JSON.parse(await run('/usr/bin/rclone', ['lsjson', '--files-only', remote]));
	const sources = listing
		.filter((item) => item && typeof item.Path === 'string' && ['.jpg', '.jpeg'].includes(extname(item.Path).toLowerCase()))
		.sort((a, b) => a.Path.localeCompare(b.Path, 'ja'));
	if (sources.length < 10) throw new Error(`DriveのJPEGが10枚未満です（${sources.length}枚）`);
	if (sources.length > maximumPhotos) throw new Error(`DriveのJPEGが上限${maximumPhotos}枚を超えています`);

	const preparedRoot = join(workspace, 'prepared');
	await mkdir(preparedRoot);
	const photos = [];
	const hashes = new Set();
	for (const [index, source] of sources.entries()) {
		const extension = extname(source.Path).toLowerCase();
		const input = join(workspace, `source-${index}${extension}`);
		const temporaryOutput = join(preparedRoot, `photo-${index}.jpg`);
		await run('/usr/bin/rclone', ['copyto', `${remote}${source.Path}`, input]);
		await run('/usr/bin/magick', [
			`${input}[0]`, '-auto-orient', '-strip', '-resize', '1600x1600>', '-colorspace', 'sRGB',
			'-quality', '82', '-interlace', 'Plane', temporaryOutput
		], 120_000);
		const body = await readFile(temporaryOutput);
		const id = createHash('sha256').update(body).digest('hex');
		if (hashes.has(id)) continue;
		hashes.add(id);
		await copyFile(temporaryOutput, join(preparedRoot, `${id}.jpg`));
		photos.push({ id, src: `/home-pins/${id}.jpg`, alt: '', caption: '' });
		process.stdout.write(`[${index + 1}/${sources.length}] ${source.Path}\n`);
	}
	if (photos.length < 10) throw new Error(`重複除外後の写真が10枚未満です（${photos.length}枚）`);

	await rm(publicRoot, { recursive: true, force: true });
	await mkdir(publicRoot, { recursive: true });
	for (const photo of photos) await copyFile(join(preparedRoot, `${photo.id}.jpg`), join(publicRoot, `${photo.id}.jpg`));
	await writeFile(manifestPath, `${JSON.stringify({ schemaVersion: 1, photos }, null, '\t')}\n`);
	process.stdout.write(`Driveから${photos.length}枚をホーム写真プールへ同期しました。\n`);
} finally {
	await rm(workspace, { recursive: true, force: true });
}
