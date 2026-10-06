import { base } from '$app/paths';
import type { Lang } from '$lib/types/content';

export const langs: Lang[] = ['ja', 'en', 'zh-TW', 'ko'];
export const langPrefix = (lang: Lang) => lang === 'ja' ? '' : `/${lang}`;
export const parseLang = (value: string | undefined): Lang =>
	langs.includes(value as Lang) ? value as Lang : 'ja';
export const articleTitle = (lang: Lang, title: string) =>
	lang === 'ja' ? `${title} | かざぐるま` : `かざぐるま | ${title}`;

export function langPath(lang: Lang, pathname: string): string {
	return `${base}${langPrefix(lang)}${pathname}`;
}

export function localizedPathname(pathname: string, lang: Lang): string {
	const withoutLang = pathname.replace(/^\/(?:en|zh-TW|ko)(?=\/|$)/, '') || '/';
	return `${langPrefix(lang)}${withoutLang}`;
}

const tagLabelsEn: Record<string, string> = {
	'PV': 'PV',
	'イベント': 'Event',
	'サイト制作': 'Site build',
	'映像': 'Video',
	'出演': 'Appearance',
	'踊ってみた': 'Dance cover'
};
const tagLabelsZh: Record<string, string> = {
	'イベント': '活動', 'サイト制作': '網站製作', '映像': '影像',
	'出演': '演出', '踊ってみた': '試跳影片'
};
const tagLabelsKo: Record<string, string> = {
	'イベント': '행사', 'サイト制作': '사이트 제작', '映像': '영상',
	'出演': '출연', '踊ってみた': '춤춰보았다'
};

export function tagLabel(lang: Lang, tag: string): string {
	const labels: Record<string, string> = { ja: {}, en: tagLabelsEn, 'zh-TW': tagLabelsZh, ko: tagLabelsKo }[lang];
	return labels[tag] ?? tag;
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
			aboutDesc: 'メンバーと風下について'
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
				haru: '犬・企画・演出・アート',
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
			aboutDesc: 'About the members and Kazashimo'
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
			works: { title: 'かざぐるま | Works', description: 'All works by かざぐるま.', heading: 'Works' },
			records: { title: 'かざぐるま | Records', description: 'Production, development, and appearance records from かざぐるま.', heading: 'Records' },
			news: { title: 'かざぐるま | News', description: 'Announcements from かざぐるま.', heading: 'News' }
		},
		home_meta: { title: 'かざぐるま', description: 'The official site of かざぐるま.' },
		about: {
			title: 'かざぐるま | About',
			description: 'Kazashimo is the circle Kazashimo (a character) belongs to — four members bringing illustration, video, and music together to make works.',
			heading: 'About',
			intro: 'Kazashimo is the circle Kazashimo (a character) belongs to — four members bringing illustration, video, and music together to make works.',
			wishlist: 'Wishlist',
			membersHeading: 'MEMBERS',
			roles: {
				haru: 'Dog, planning, direction, art',
				forune: 'Planning, filming, editing, development',
				windal: 'Planning, direction, filming, editing',
				nattsu: 'Development, sound, editing, planning'
			},
			contactHeading: 'CONTACT',
			contactBody: 'The contact form is currently in preparation.'
		}
	},
	'zh-TW': {
		nav: {
			homeAria: 'かざぐるま首頁', search: '搜尋作品', mainNavAria: '主選單',
			works: '作品', records: '紀錄', about: '關於我們', openMenuAria: '開啟完整選單',
			menuAria: '完整選單', home: '首頁', homeDesc: '一覽所有內容',
			worksDesc: '瀏覽所有作品', recordsDesc: '閱讀製作紀錄與活動記事',
			news: '最新消息', newsDesc: '瀏覽過往消息', aboutDesc: '認識成員與風下'
		},
		announcement: { label: '最新消息', seeAll: '查看全部' },
		resultCount: (n: number) => `${n} 項`,
		viewItem: (title: string) => `查看${title}`,
		imageOf: (title: string) => `${title}的圖片`,
		byAuthor: '撰文：',
		records: { back: '返回紀錄列表', eyebrow: 'Record' },
		news: { back: '返回消息列表', eyebrow: 'News' },
		home: { allWorks: '≫ 查看所有作品', moreRecords: '≫ 閱讀更多', recordBadge: '製作紀錄' },
		footer: { externalLinksAria: '外部連結', contactSoon: '聯絡表單準備中' },
		listPages: {
			works: { title: 'かざぐるま | 作品', description: 'かざぐるま的作品一覽。', heading: '作品' },
			records: { title: 'かざぐるま | 紀錄', description: 'かざぐるま的製作、開發與演出紀錄。', heading: '紀錄' },
			news: { title: 'かざぐるま | 最新消息', description: '來自かざぐるま的最新消息。', heading: '最新消息' }
		},
		home_meta: { title: 'かざぐるま', description: 'かざぐるま的官方網站。' },
		about: {
			title: 'かざぐるま | 關於我們', description: 'かざぐるま是風下所屬的創作團體，四位成員共同創作插畫、影像與音樂。',
			heading: '關於我們', intro: 'かざぐるま是風下所屬的創作團體，四位成員共同創作插畫、影像與音樂。',
			wishlist: '願望清單', membersHeading: 'MEMBERS',
			roles: { haru: '狗狗、企劃、導演、美術', forune: '企劃、攝影、剪輯、開發', windal: '企劃、導演、攝影、剪輯', nattsu: '開發、音效、剪輯、企劃' },
			contactHeading: 'CONTACT', contactBody: '聯絡表單目前準備中。'
		}
	},
	ko: {
		nav: {
			homeAria: 'かざぐるま 홈', search: '작품 검색', mainNavAria: '메인 메뉴',
			works: '작품', records: '기록', about: '소개', openMenuAria: '전체 메뉴 열기',
			menuAria: '전체 메뉴', home: '홈', homeDesc: '전체 둘러보기',
			worksDesc: '모든 작품 보기', recordsDesc: '제작 기록과 활동 읽기',
			news: '소식', newsDesc: '지난 소식 보기', aboutDesc: '멤버와 카자시모 소개'
		},
		announcement: { label: '소식', seeAll: '모두 보기' },
		resultCount: (n: number) => `${n}건`,
		viewItem: (title: string) => `${title} 보기`,
		imageOf: (title: string) => `${title} 이미지`,
		byAuthor: '글: ',
		records: { back: '기록 목록으로', eyebrow: 'Record' },
		news: { back: '소식 목록으로', eyebrow: 'News' },
		home: { allWorks: '≫ 모든 작품 보기', moreRecords: '≫ 더 읽기', recordBadge: '제작 기록' },
		footer: { externalLinksAria: '외부 링크', contactSoon: '문의 양식 준비 중' },
		listPages: {
			works: { title: 'かざぐるま | 작품', description: 'かざぐるま의 작품 목록입니다.', heading: '작품' },
			records: { title: 'かざぐるま | 기록', description: 'かざぐるま의 제작, 개발, 출연 기록입니다.', heading: '기록' },
			news: { title: 'かざぐるま | 소식', description: 'かざぐるま의 소식입니다.', heading: '소식' }
		},
		home_meta: { title: 'かざぐるま', description: 'かざぐるま 공식 사이트입니다.' },
		about: {
			title: 'かざぐるま | 소개', description: 'かざぐるま는 카자시모가 소속된 창작 동아리입니다. 네 명의 멤버가 일러스트, 영상, 음악을 함께 만들고 있습니다.',
			heading: '소개', intro: 'かざぐるま는 카자시모가 소속된 창작 동아리입니다. 네 명의 멤버가 일러스트, 영상, 음악을 함께 만들고 있습니다.',
			wishlist: '위시리스트', membersHeading: 'MEMBERS',
			roles: { haru: '강아지, 기획, 연출, 아트', forune: '기획, 촬영, 편집, 개발', windal: '기획, 연출, 촬영, 편집', nattsu: '개발, 사운드, 편집, 기획' },
			contactHeading: 'CONTACT', contactBody: '문의 양식을 준비하고 있습니다.'
		}
	}
} as const;

export function t(lang: Lang) {
	return strings[lang];
}
