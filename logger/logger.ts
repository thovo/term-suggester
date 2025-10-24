// Export a class logger that accept a debug param(boolean) to log the value
import signale from 'signale';
export class CustomLogger {
	#debug: boolean;
	constructor(debug: boolean) {
		this.#debug = debug;
	}
	log(message: string, type: string = 'info'): void {
		if (this.#debug) {
			if (type === 'info') {
				signale.info(message);
			}
			if (type === 'debug') {
				signale.debug(message);
			}
			if (type === 'warning') {
				signale.warn(message);
			}
		}
	}
}
