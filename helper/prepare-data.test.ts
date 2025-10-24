import { describe, expect, test } from 'bun:test';
import { prepareData } from './prepare-data';

describe('Prepare data helper', () => {
	test('normalizes term and word correctly', () => {
		const { normalizedTerm, normalizedWord } = prepareData('HeLLo!', 'WorLD@123');
		expect(normalizedTerm).toBe('hello');
		expect(normalizedWord).toBe('world123');
	});

	test('calculates lengths correctly', () => {
		const { normalizedTermLength, normalizedWordLength } = prepareData('Test123', 'Another-Test!');
		expect(normalizedTermLength).toBe(7); // 'test123'
		expect(normalizedWordLength).toBe(11); // 'anothertest'
	});

	test('handles empty strings', () => {
		const { normalizedTerm, normalizedWord, normalizedTermLength, normalizedWordLength } = prepareData('', '');
		expect(normalizedTerm).toBe('');
		expect(normalizedWord).toBe('');
		expect(normalizedTermLength).toBe(0);
		expect(normalizedWordLength).toBe(0);
	});

	test('handles strings with only non-alphanumeric characters', () => {
		const { normalizedTerm, normalizedWord, normalizedTermLength, normalizedWordLength } = prepareData(
			'!@#$',
			'%^&*'
		);
		expect(normalizedTerm).toBe('');
		expect(normalizedWord).toBe('');
		expect(normalizedTermLength).toBe(0);
		expect(normalizedWordLength).toBe(0);
	});

	test('handles mixed alphanumeric and non-alphanumeric characters', () => {
		const { normalizedTerm, normalizedWord } = prepareData('H3ll0 W0rld!', 'T3st!@#123');
		expect(normalizedTerm).toBe('h3ll0w0rld');
		expect(normalizedWord).toBe('t3st123');
	});
});
