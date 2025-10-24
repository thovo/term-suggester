import type { DistanceFn } from '../distance-strategies/distance-function.interface';
import { nGramDistance } from '../distance-strategies/n-gram';
import { slidingReplacement } from '../distance-strategies/sliding-replacement';
import { CustomLogger } from '../logger/logger';

export interface Options {
	algorithm: string;
	debug: boolean;
	minWordLength?: number;
}

// registry of strategies
const STRATEGIES: Record<string, DistanceFn> = {
	sliding: slidingReplacement,
	nGram: nGramDistance,
};

// -------------------- TermSuggester --------------------

export class TermSuggester {
	#logger: CustomLogger;
	#algorithmFn: DistanceFn;

	constructor(
		private words: string[],
		private options: Options
	) {
		this.#logger = new CustomLogger(!!options.debug);
		this.#algorithmFn = STRATEGIES[options.algorithm] ?? slidingReplacement;
	}

	setAlgorithm(name: string): void {
		this.#algorithmFn = STRATEGIES[name] ?? this.#algorithmFn;
		this.#logger.log(`Algorithm set to ${name}`);
	}

	setDebug(flag: boolean): void {
		this.#logger = new CustomLogger(flag);
	}

	getSimilarTerms(term: string, n = 5): string[] {
		const results: { word: string; diff: number; lengthDiff: number }[] = [];

		for (const w of this.words) {
			if (this.options.minWordLength && w.length < this.options.minWordLength) {
				this.#logger.log(`[filter] skip ${w} (too short)`, 'warning');
				continue;
			}
			const diff = this.#algorithmFn(term, w, this.#logger);
			if (!Number.isFinite(diff)) {
				this.#logger.log(`${w} considered not comparable (diff=Infinity)`, 'warning');
				continue;
			}
			results.push({ word: w, diff, lengthDiff: Math.abs(w.length - term.length) });
		}

		// sort by diff, then by length closeness, then alphabetically
		results.sort((a, b) => {
			if (a.diff !== b.diff) return a.diff - b.diff;
			if (a.lengthDiff !== b.lengthDiff) return a.lengthDiff - b.lengthDiff;
			return a.word.localeCompare(b.word);
		});

		this.#logger.log(
			`[final sorted results]: ${results
				.map((r) => `${r.word}(diff=${r.diff},lenDiff=${r.lengthDiff})`)
				.join(', ')}`
		);
		return results.slice(0, n).map((r) => r.word);
	}
}
