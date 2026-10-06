import type { LayoutLoad } from './$types';
import { parseLang } from '$lib/i18n';

export const load: LayoutLoad = ({ params }) => {
	return { lang: parseLang(params.lang) };
};
