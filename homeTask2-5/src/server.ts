import express from 'express';

import db from './data-access/database';
import UserService from './services/user.service';
import GroupService from './services/group.service';
import usersRouter from './routers/users.router';
import groupsRouter from './routers/groups.router';

async function startServer() {
    const app = express();

    await db.sync();

    const userService = new UserService();
    const groupService = new GroupService();

    await userService.fillTableIfEmpty();
    await groupService.fillTableIfEmpty();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/users', usersRouter);
    app.use('/groups', groupsRouter);

    app.listen(3000, () => {
        console.log('Application started on port 3000!');
    });
}

startServer();
