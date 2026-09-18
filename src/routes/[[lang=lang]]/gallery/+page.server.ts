import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	redirect(308, params.lang === 'en' ? `${base}/en/works/` : `${base}/works/`);
};
