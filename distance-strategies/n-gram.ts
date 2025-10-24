import { prepareData } from '../helper/prepare-data';
import { quickCheckData } from '../helper/quick-check-data';
import { CustomLogger } from '../logger/logger';
import type { DistanceFn } from './distance-function.interface';

/**
 * Generate n-grams from a given string.
 */
function generateNGrams(text: string, n = 3): string[] {
	if (text.length < n) return [text];
	const grams: string[] = [];
	for (let i = 0; i <= text.length - n; i++) {
		grams.push(text.slice(i, i + n));
	}
	return grams;
}

/**
 * Compute n-gram Jaccard distance between two strings.
 * Range: [0, 1] where 0 = identical, 1 = completely different.
 */
export const nGramDistance: DistanceFn = (term, word, logger = new CustomLogger(false)) => {
	const { normalizedTerm, normalizedWord, normalizedTermLength, normalizedWordLength } = prepareData(term, word);

	const quickCheckResult = quickCheckData(normalizedTermLength, normalizedWordLength, word, logger);
	if (quickCheckResult !== null) {
		return quickCheckResult;
	}

	// Calculate n-gram size
	const n = normalizedTermLength ? normalizedTermLength - 1 : 0;
	const termNGrams = generateNGrams(normalizedTerm, n);
	const wordNGrams = generateNGrams(normalizedWord, n);

	const setA = new Set(termNGrams);
	const setB = new Set(wordNGrams);

	const intersection = new Set([...setA].filter((x) => setB.has(x)));
	const union = new Set([...setA, ...setB]);

	const similarity = union.size === 0 ? 0 : intersection.size / union.size;
	const distance = 1 - similarity;

	if (logger) {
		logger.log(
			`n-Gram Distance computation:
        term: "${term}",
        word: "${word}",
        n: ${n},
        termNGrams: ${[...setA]},
        wordNGrams: ${[...setB]},
        intersection: ${[...intersection]},
        union: ${[...union]},
        similarity: ${similarity},
        distance: ${distance} 
        `,
			'debug'
		);
	}

	return distance;
};
