import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => ['en', 'zh-TW', 'ko'].includes(param);
