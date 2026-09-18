import { base } from '$app/paths';
import type { Lang } from '$lib/types/content';

// Prefixes an already-base-relative path with /en when switching to English. Used
// anywhere a link is built by hand instead of coming from content.ts's routeFor()
// (which already embeds the prefix into ContentSummary.url).
export function langPath(lang: Lang, pathname: string): string {
	return lang === 'en' ? `${base}/en${pathname}` : `${base}${pathname}`;
}

// Maps a same-language pathname to its counterpart in the other language, for the
// header's LanguageSwitch and hreflang tags. Strips/adds the leading /en segment
// only — intentionally drops any query string, since page.url.search can't be
// read during prerendering (and a lang switch doesn't need to preserve ?q=...).
export function otherLangUrl(pathname: string): string {
	const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	return `${base}${otherLangPathname(withoutBase)}`;
}

// Same /en swap, but with no `base` involved — `$app/paths`'s base is resolved
// relative (e.g. "." or "..") during prerendering, which is right for in-page
// navigation hrefs but wrong for an absolute hreflang URL (https://kzgrm.com + a
// relative fragment produces garbage like "https://kzgrm.com../"). Use this one
// for anything that gets a real https://kzgrm.com origin prepended.
export function otherLangPathname(pathname: string): string {
	return pathname.startsWith('/en/') || pathname === '/en'
		? pathname.replace(/^\/en/, '') || '/'
		: `/en${pathname}`;
}

const tagLabels: Record<string, string> = {
	'PV': 'PV',
	'イベント': 'Event',
	'サイト制作': 'Site build',
	'映像': 'Video',
	'出演': 'Appearance',
	'踊ってみた': 'Dance cover'
};

export function tagLabel(lang: Lang, tag: string): string {
	return lang === 'en' ? tagLabels[tag] ?? tag : tag;
}

export const strings = {
	ja: {
		nav: {
			homeAria: 'かざぐるま ホーム',
			search: '作品を検索',
			mainNavAria: 'メインナビゲーション',
			works: '作品',
			records: '記録',
			about: 'かざぐるまについて',
			openMenuAria: 'すべての機能を開く',
			menuAria: 'すべての機能',
			home: 'ホーム',
			homeDesc: '全体を見渡す',
			worksDesc: '作品を一覧する',
			recordsDesc: '制作や出来事を読む',
			news: 'お知らせ',
			newsDesc: '過去のお知らせも見る',
			aboutDesc: 'メンバーと風下について',
			langSwitch: 'English'
		},
		announcement: { label: 'お知らせ', seeAll: 'すべて見る' },
		resultCount: (n: number) => `${n}件`,
		viewItem: (title: string) => `${title}を見る`,
		imageOf: (title: string) => `${title}の画像`,
		byAuthor: '文：',
		records: { back: '記録一覧へ', eyebrow: 'Record' },
		news: { back: 'お知らせ一覧へ', eyebrow: 'News' },
		home: { allWorks: '≫ 作品をぜんぶ見る', moreRecords: '≫ もっと読む', recordBadge: '制作記録' },
		footer: { externalLinksAria: '外部リンク', contactSoon: 'お問い合わせ準備中' },
		listPages: {
			works: { title: '作品 | かざぐるま', description: 'かざぐるまの作品一覧です。', heading: '作品' },
			records: { title: '記録 | かざぐるま', description: 'かざぐるまの制作・開発・出演の記録です。', heading: '記録' },
			news: { title: 'お知らせ | かざぐるま', description: 'かざぐるまからのお知らせです。', heading: 'お知らせ' }
		},
		home_meta: { title: 'かざぐるま', description: 'KZGRM・かざぐるまの公式サイトです。' },
		about: {
			title: 'かざぐるまについて | かざぐるま',
			description: 'かざぐるまとは、風下が所属するサークルで、4人のメンバーがイラスト・映像・音楽などを持ち寄り、作品をつくっています。',
			heading: 'かざぐるまについて',
			intro: 'かざぐるまとは、風下が所属するサークルで、4人のメンバーがイラスト・映像・音楽などを持ち寄り、作品をつくっています。',
			wishlist: 'ほしい物リスト',
			membersHeading: 'MEMBERS',
			roles: {
				haru: '犬・監督・演出・アート',
				forune: '企画・撮影・編集・開発',
				windal: '企画・演出・撮影・編集',
				nattsu: '開発・サウンド・編集・企画'
			},
			contactHeading: 'CONTACT',
			contactBody: 'お問い合わせフォームは現在準備中です。'
		}
	},
	en: {
		nav: {
			homeAria: 'Kazashimo home',
			search: 'Search works',
			mainNavAria: 'Main navigation',
			works: 'Works',
			records: 'Records',
			about: 'About',
			openMenuAria: 'Open all sections',
			menuAria: 'All sections',
			home: 'Home',
			homeDesc: 'See everything at a glance',
			worksDesc: 'Browse all works',
			recordsDesc: 'Read production notes and events',
			news: 'News',
			newsDesc: 'See past announcements too',
			aboutDesc: 'About the members and Kazashimo',
			langSwitch: '日本語'
		},
		announcement: { label: 'News', seeAll: 'See all' },
		resultCount: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
		viewItem: (title: string) => `View ${title}`,
		imageOf: (title: string) => `Image for ${title}`,
		byAuthor: 'By: ',
		records: { back: 'Back to records', eyebrow: 'Record' },
		news: { back: 'Back to news', eyebrow: 'News' },
		home: { allWorks: '≫ See all works', moreRecords: '≫ Read more', recordBadge: 'Production record' },
		footer: { externalLinksAria: 'External links', contactSoon: 'Contact form coming soon' },
		listPages: {
			works: { title: 'Works | Kazashimo', description: 'All works by Kazashimo.', heading: 'Works' },
			records: { title: 'Records | Kazashimo', description: 'Production, development, and appearance records from Kazashimo.', heading: 'Records' },
			news: { title: 'News | Kazashimo', description: 'Announcements from Kazashimo.', heading: 'News' }
		},
		home_meta: { title: 'Kazashimo', description: 'The official site of KZGRM / Kazashimo.' },
		about: {
			title: 'About | Kazashimo',
			description: 'Kazashimo is the circle Kazashimo (a character) belongs to — four members bringing illustration, video, and music together to make works.',
			heading: 'About Kazashimo',
			intro: 'Kazashimo is the circle Kazashimo (a character) belongs to — four members bringing illustration, video, and music together to make works.',
			wishlist: 'Wishlist',
			membersHeading: 'MEMBERS',
			roles: {
				haru: 'Dog, director, direction, art',
				forune: 'Planning, filming, editing, development',
				windal: 'Planning, direction, filming, editing',
				nattsu: 'Development, sound, editing, planning'
			},
			contactHeading: 'CONTACT',
			contactBody: 'The contact form is currently in preparation.'
		}
	}
} as const;

export function t(lang: Lang) {
	return strings[lang];
}
