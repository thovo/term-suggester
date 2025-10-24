import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { CustomLogger } from './logger';
import signale from 'signale';

// Mock signale methods
const infoMock = mock();
const debugMock = mock();
const warnMock = mock();

// Replace signale's methods with mocks
signale.info = infoMock;
signale.debug = debugMock;
signale.warn = warnMock;

describe('Custom logger', () => {
	beforeEach(() => {
		// Reset call history before each test
		infoMock.mockReset();
		debugMock.mockReset();
		warnMock.mockReset();
	});

	test('should call signale.info when debug is true and type is info', () => {
		const logger = new CustomLogger(true);
		logger.log('Test info');

		expect(infoMock).toHaveBeenCalledWith('Test info');
		expect(debugMock).not.toHaveBeenCalled();
		expect(warnMock).not.toHaveBeenCalled();
	});

	test('should call signale.debug when type is debug', () => {
		const logger = new CustomLogger(true);
		logger.log('Debug message', 'debug');

		expect(debugMock).toHaveBeenCalledWith('Debug message');
	});

	test('should call signale.warn when type is warning', () => {
		const logger = new CustomLogger(true);
		logger.log('Warning message', 'warning');

		expect(warnMock).toHaveBeenCalledWith('Warning message');
	});

	test('should not log anything when debug is false', () => {
		const logger = new CustomLogger(false);
		logger.log('Should not appear');

		expect(infoMock).not.toHaveBeenCalled();
		expect(debugMock).not.toHaveBeenCalled();
		expect(warnMock).not.toHaveBeenCalled();
	});
});
