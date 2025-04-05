import pino from 'pino';

const options = {
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true
		}
	}
};

const logger = pino(options);

export default logger;
