import { browser } from '$app/environment';

const clientLogger = {
	debug: (...args: unknown[]) => browser && console.debug('[DEBUG]', ...args),
	info: (...args: unknown[]) => browser && console.log('[INFO]', ...args),
	warn: (...args: unknown[]) => browser && console.warn('[WARN]', ...args),
	error: (...args: unknown[]) => browser && console.error('[ERROR]', ...args)
};

export default clientLogger;
