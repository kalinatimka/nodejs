import express, { NextFunction, Request, Response } from 'express';

import db from './data-access/database';
import UserService from './services/user.service';
import GroupService from './services/group.service';
import usersRouter from './routers/users.router';
import groupsRouter from './routers/groups.router';
import { logger } from './services/logger.service';

async function startServer() {
    const app = express();

    await db.sync();

    const userService = new UserService();
    const groupService = new GroupService();

    await userService.fillTableIfEmpty();
    await groupService.fillTableIfEmpty();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(loggerMiddleware);

    app.use('/users', usersRouter);
    app.use('/groups', groupsRouter);

    app.use(errorHandlerMiddleware);

    app.listen(3000, () => {
        logger.info('Application started on port 3000!');
    });
}

startServer();

function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const message = [
        req.method,
        req.path,
        `Body: ${JSON.stringify(req.body)}`,
        `Params: ${JSON.stringify(req.params)}`
    ].filter(item => !!item).join(' ');

    logger.debug(message);
    next();
}

function errorHandlerMiddleware(err: Error, req: Request, res: Response) {
    logger.error(err.message);
    res.status(500).send('Internal Server Error');
}

process.on('uncaughtException', (error: Error) => {
    logger.error('uncaught Exception', error.message);
});
process.on('unhandledRejection', (error: Error) => {
    logger.error('unhandled Rejection', error.message);
});
