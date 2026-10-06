import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { langPrefix, parseLang } from '$lib/i18n';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	redirect(308, `${base}${langPrefix(parseLang(params.lang))}/works/`);
};
