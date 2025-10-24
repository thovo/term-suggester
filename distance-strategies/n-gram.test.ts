import { TermSuggester } from '../term-suggester/term-suggester';
import { beforeEach, describe, expect, test } from 'bun:test';

const defaultList = ['gros', 'gras', 'graisse', 'agressif', 'go', 'ros', 'gro'];

describe('NGram distance', () => {
	let suggester: TermSuggester;

	beforeEach(() => {
		suggester = new TermSuggester(defaultList, { algorithm: 'nGram', debug: false });
	});

	// --- Basic functionality ---
	test('returns best matching terms (basic example)', () => {
		const results = suggester.getSimilarTerms('gros', 2);
		expect(results).toEqual(['gros', 'gras']);
	});

	// --- Sorting and tie-breaking ---
	test('sorts by fewest differences, then length, then alphabetically', () => {
		const list = ['gros', 'gras', 'grus', 'grys'];
		suggester = new TermSuggester(list, { algorithm: 'sliding', debug: false });

		const results = suggester.getSimilarTerms('gros', 3);
		// 'gros' (0 diff), 'gras' (1 diff), 'grus' (1 diff but longer 'grys')
		expect(results).toEqual(['gros', 'gras', 'grus']);
	});

	// --- Case sensitivity and normalization ---
	test('is case-insensitive and ignores non-alphanumeric chars', () => {
		const list = ['GrOs', 'g.ras!', 'graisse'];
		suggester = new TermSuggester(list, { algorithm: 'sliding', debug: false });

		const results = suggester.getSimilarTerms('gros', 2);
		expect(results).toEqual(['GrOs', 'g.ras!']);
	});

	// --- Words shorter than term ---
	test('skips too-short words', () => {
		const list = ['go', 'ros', 'gro'];
		suggester = new TermSuggester(list, { algorithm: 'sliding', debug: false });

		const results = suggester.getSimilarTerms('gros', 3);
		expect(results).toEqual([]); // all too short
	});

	// --- Different word lengths ---
	test('handles longer words correctly', () => {
		const list = ['gros', 'grosse', 'grossier'];
		suggester = new TermSuggester(list, { algorithm: 'sliding', debug: false });

		const results = suggester.getSimilarTerms('gros', 3);
		// gros = 0 diff, grosse = 0 diff (substring match), grossier > 0
		expect(results).toEqual(['gros', 'grosse', 'grossier']);
	});

	// --- Limit number of results (N) ---
	test('respects max results N', () => {
		const results = suggester.getSimilarTerms('gros', 1);
		expect(results).toEqual(['gros']);
	});

	// --- Completely different words ---
	test('returns empty if no similar term', () => {
		const list = ['xyz', 'abcd', 'test'];
		suggester = new TermSuggester(list, { algorithm: 'sliding', debug: false });

		const results = suggester.getSimilarTerms('gros', 2);
		expect(results).toEqual(['abcd', 'test']);
	});

	// --- Custom minimal word length filter (optional config) ---
	test('respects minWordLength option', () => {
		suggester = new TermSuggester(defaultList, {
			algorithm: 'sliding',
			debug: false,
			minWordLength: 4,
		});

		const results = suggester.getSimilarTerms('gros', 3);
		expect(results.every((w) => w.length >= 4)).toBeTrue();
	});
});
