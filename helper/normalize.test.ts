import { describe, expect, test } from 'bun:test';
import { normalize } from './normalize';

describe('Normalization helper', () => {
	test('converts to lowercase', () => {
		expect(normalize('HeLLo')).toBe('hello');
	});

	test('removes non-alphanumeric characters', () => {
		expect(normalize('h@e#l$l%o^')).toBe('hello');
	});

	test('handles empty strings', () => {
		expect(normalize('')).toBe('');
	});

	test('handles strings with only non-alphanumeric characters', () => {
		expect(normalize('!@#$%^&*()')).toBe('');
	});

	test('handles mixed alphanumeric and non-alphanumeric characters', () => {
		expect(normalize('H3ll0 W0rld!')).toBe('h3ll0w0rld');
	});
});
