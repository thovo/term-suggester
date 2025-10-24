import type { CustomLogger } from '../logger/logger';

export function quickCheckData(
	normalizedTermLength: number,
	normalizedWordLength: number,
	word: string,
	logger: CustomLogger
): number | null {
	if (normalizedTermLength === 0) return 0;
	if (normalizedWordLength < normalizedTermLength) {
		logger.log(
			`"${word}" too short (wordLength=${normalizedWordLength} < termLength=${normalizedTermLength}) => skip`,
			'warning'
		);
		return Infinity;
	}
	return null;
}
