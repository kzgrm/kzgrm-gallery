import assert from 'node:assert/strict';
import test from 'node:test';
import { decodePreviewMessage, validPreviewToken } from '../src/lib/preview-contract.js';

const token = 'a'.repeat(48);
const content = {
	slug: '260822-preview', title: 'プレビュー', date: '2026-08-22', kind: 'record', tags: ['サイト制作'],
	summary: '', caption: '', author: 'なっつ', externalUrl: '', rail: false, body: '# 本文', thumbnailUrl: '', assetBaseUrl: ''
};

test('accepts the exact versioned preview message for the fragment token', () => {
	assert.equal(validPreviewToken(token), true);
	assert.deepEqual(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content }, token), content);
});

test('rejects a different token, unknown keys, invalid URLs, and oversized bodies', () => {
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token: 'b'.repeat(48), content }, token), null);
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content, extra: true }, token), null);
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, externalUrl: 'javascript:alert(1)' } }, token), null);
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, body: 'x'.repeat(128 * 1024 + 1) } }, token), null);
});

test('allows only HTTPS or image data thumbnails and HTTPS asset roots', () => {
	assert.ok(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, thumbnailUrl: 'https://example.com/image.jpg', assetBaseUrl: 'https://compass.example/api/assets' } }, token));
	assert.ok(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, thumbnailUrl: 'data:image/jpeg;base64,/9j/' } }, token));
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, thumbnailUrl: 'file:///secret.jpg' } }, token), null);
	assert.equal(decodePreviewMessage({ type: 'kzgrm.homepage-preview/v1', token, content: { ...content, assetBaseUrl: 'http://example.com/assets' } }, token), null);
});
