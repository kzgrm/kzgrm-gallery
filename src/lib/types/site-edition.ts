export const siteEditions = [
	{ id: 'nostalgic', name: '古い個人サイト', description: '方眼紙とリンクの作品棚' },
	{ id: 'zine', name: '風下ZINE', description: '写真と文字のスクラップ' },
	{ id: 'playroom', name: '風下プレイルーム', description: '作品を選んで遊ぶ画面' }
] as const;

export type SiteEditionId = (typeof siteEditions)[number]['id'];

export function isSiteEdition(value: string | null): value is SiteEditionId {
	return siteEditions.some((edition) => edition.id === value);
}
