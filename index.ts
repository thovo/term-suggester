import signale from 'signale';
import { TermSuggester } from './term-suggester/term-suggester';

import { input, number, select } from '@inquirer/prompts';
// Example usage of TermSuggester
// 'example', 'samples', 'temple', 'simple', 'examine', 'apple', 'templeton'
// term: sample

// CLI interaction to get words and term
signale.info('Please provide a list of words to initialize the TermSuggester.');
const list = await input({
	message: 'Enter a list of words (comma separated):',
	required: true,
	transformer: (value: string) =>
		value
			.split(',')
			.map((w) => w.trim())
			.filter((w) => w.length > 0)
			.join(', '),
});
const algorithm = await select({
	message: 'Select the distance algorithm to use:',
	choices: [
		{ name: 'sliding', value: 'sliding', description: 'Sliding Replacement following Hamming distance' },
		{ name: 'nGram', value: 'nGram', description: 'n-Gram Distance(not really replacement, in development)' },
	],
});
const debugMode = await input({
	message: 'Enable debug mode? (y/n):',
	required: true,
	default: 'n',
	transformer: (value: string) => (value.toLowerCase().startsWith('y') ? 'y' : 'n'),
});
const minWordLength = await number({
	message: 'Minimum word length to consider (default 2):',
	default: 2,
	min: 0,
});
const term = await input({
	message: 'Enter the term to find similar words for:',
	required: true,
});

// Initialize TermSuggester
const termSuggester = new TermSuggester([...list.split(',')], {
	algorithm,
	debug: debugMode === 'y',
	minWordLength,
});

const result = termSuggester.getSimilarTerms(term, 2);
if (result.length > 0) {
	signale.success(`Found ${result.length} ${result.length === 1 ? 'term' : 'terms'}: ${result.join(', ')}`);
} else {
	signale.info('No similar terms found.');
}
