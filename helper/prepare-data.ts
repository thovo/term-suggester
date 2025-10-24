import { normalize } from './normalize';

export type PreparedData = {
	normalizedTerm: string;
	normalizedWord: string;
	normalizedTermLength: number;
	normalizedWordLength: number;
};

export function prepareData(term: string, word: string): PreparedData {
	const normalizedTerm = normalize(term);
	const normalizedWord = normalize(word);
	const normalizedTermLength = normalizedTerm.length;
	const normalizedWordLength = normalizedWord.length;
	return { normalizedTerm, normalizedWord, normalizedTermLength, normalizedWordLength };
}
