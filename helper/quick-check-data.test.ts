import { describe, expect, mock, test } from 'bun:test';
import { quickCheckData } from './quick-check-data';
import { CustomLogger } from '../logger/logger';
import signale from 'signale';

const logger = new CustomLogger(true);
const warnMock = mock();

signale.warn = warnMock;
describe('Quick check data helper', () => {
	test('returns null when term length is smaller than word length and term length is not 0', () => {
		const result = quickCheckData(4, 10, 'abcdefghij', logger);
		expect(result).toBe(null);
	});
	test('returns 0 when term length is 0', () => {
		const result = quickCheckData(0, 10, 'abcdefghij', logger);
		expect(result).toBe(0);
	});

	test('returns Infinity and logs warning when word length is smaller than term length', () => {
		const result = quickCheckData(10, 4, 'abcd', logger);
		expect(result).toBe(Infinity);
		expect(warnMock).toHaveBeenCalledWith(`"abcd" too short (wordLength=4 < termLength=10) => skip`);
	});
});
