import { prepareData } from '../helper/prepare-data';
import { quickCheckData } from '../helper/quick-check-data';
import { CustomLogger } from '../logger/logger';
import type { DistanceFn } from './distance-function.interface';

/**
 * Compute a sliding Hamming-like distance between `term` and `word`.
 *
 * This function first normalizes both inputs by lower-casing and removing
 * any non-alphanumeric characters (a-z, 0-9). It then treats `term` as a
 * short pattern of length k and `word` as a longer text of length m and
 * computes the minimum number of character substitutions required to
 * transform any contiguous length-k substring of `word` into `term`.
 *
 * Special cases:
 * - If the normalized `term` is empty, the distance is 0.
 * - If the normalized `word` is shorter than the normalized `term`, the
 *   function logs a skip message and returns Infinity to indicate an
 *   incomparable/invalid alignment.
 *
 * The algorithm performs an O((m-k+1) * k) comparison in the worst case,
 * with an early-exit optimization per alignment when the current diff
 * already exceeds the best found so far.
 *
 * Parameters:
 * @param term - the search term / pattern to match (string)
 * @param word - the candidate word to compare against (string)
 * @param logger - optional Logger instance used for debug logging
 *
 * Returns:
 * The minimum number of differing characters (substitutions) between the
 * normalized `term` and any equal-length substring of the normalized
 * `word`. Returns `Infinity` when `word` is too short to align with
 * `term` after normalization.
 */
export const slidingReplacement: DistanceFn = (term, word, logger = new CustomLogger(false)) => {
	const { normalizedTerm, normalizedWord, normalizedTermLength, normalizedWordLength } = prepareData(term, word);

	const quickCheckResult = quickCheckData(normalizedTermLength, normalizedWordLength, word, logger);
	if (quickCheckResult !== null) {
		return quickCheckResult;
	}

	let best = Infinity;
	for (let start = 0; start <= normalizedWordLength - normalizedTermLength; start++) {
		let diff = 0;
		for (let i = 0; i < normalizedTermLength; i++) {
			if (normalizedTerm[i] !== normalizedWord[start + i]) {
				diff++;
				if (diff >= best) break; // early stop
			}
		}
		logger.log(
			`[sliding] align "${normalizedWord.slice(
				start,
				start + normalizedTermLength
			)}" with "${normalizedTerm}" => diff=${diff}`,
			'debug'
		);
		if (diff < best) best = diff;
		if (best === 0) break;
	}
	return best;
};
