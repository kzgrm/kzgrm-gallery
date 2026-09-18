import type { ParamMatcher } from '@sveltejs/kit';

// Only "en" is a valid prefix — the optional [[lang=lang]] segment falls through
// (no match) for anything else, so unprefixed paths stay the Japanese default.
export const match: ParamMatcher = (param) => param === 'en';
