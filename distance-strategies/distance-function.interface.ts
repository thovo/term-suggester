import type { CustomLogger } from '../logger/logger';

export type DistanceFn = (term: string, word: string, logger?: CustomLogger) => number;
