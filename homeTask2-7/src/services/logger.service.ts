import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.printf((info) => `${info.level} - ${info.message}`),
    ),
    transports: [
        new transports.Console()
    ]
});
