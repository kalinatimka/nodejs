import express from 'express';

import DBUser from './models/user.model';
import usersRouter from './routers/users.router';
import UserService from './services/user.service';

async function startServer() {
    const app = express();
    const userService = new UserService();

    await DBUser.sync();
    await userService.fillTableIfEmpty();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/users', usersRouter);

    app.listen(3000, () => {
        console.log('Application started on port 3000!');
    });
}

startServer();
