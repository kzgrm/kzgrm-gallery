export const siteEditions = [
	{ id: 'nostalgic', name: '古い個人サイト', description: '方眼紙とリンクの作品棚' },
	{ id: 'zine', name: '風下ZINE', description: '写真と文字のスクラップ' },
	{ id: 'desktop', name: '風下デスクトップ', description: '古いOSのファイルと窓' },
	{ id: 'broadcast', name: '風下放送局', description: '番組とニューステロップ' },
	{ id: 'manga', name: '風下まんが', description: 'モノクロのコマ割り' }
] as const;

export type SiteEditionId = (typeof siteEditions)[number]['id'];

export function isSiteEdition(value: string | null): value is SiteEditionId {
	return siteEditions.some((edition) => edition.id === value);
}
