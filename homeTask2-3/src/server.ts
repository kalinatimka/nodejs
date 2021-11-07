import express from 'express';
import { Request, Response } from 'express';
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation';
import { v4 as uuid } from 'uuid';

import { User } from './models/user.model';
import { UserRequestSchema, userSchema } from './schemas/user-schema';
import { AutoSuggestRequestSchema, autoSuggestSchema } from './schemas/autosuggest-schema';

const users: User[] = new Array(5).fill('').map((_, index) => ({
    id: uuid(),
    login: `login${index}`,
    password: `password${index}`,
    age: index + 18,
    isDeleted: false
}));

function findUserIndexById(id: string): number {
    return users
        .filter((user: User) => !user.isDeleted)
        .findIndex((user: User) => user.id === id);
}

const app = express();
const validator = createValidator({ statusCode: 400 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/getAllUsers', (req: Request, res: Response) => {
    res.send(
        users.filter((user: User) => !user.isDeleted),
    );
});

app.get('/user/:userId', (req: Request, res: Response) => {
    const userIndex = findUserIndexById(req.params.userId);

    if (userIndex === -1) {
        res.status(400).send('No users with such ID');
    } else {
        res.send(users[userIndex]);
    }
});

app.get(
    '/getAutoSuggestUsers',
    validator.query(autoSuggestSchema),
    (req: ValidatedRequest<AutoSuggestRequestSchema>, res: Response) => {
        const autoSuggestList = users
            .filter(user => user.login.includes(req.query.loginSubstring) && !user.isDeleted)
            .sort((userA, userB) => userA.login.localeCompare(userB.login))
            .slice(0, req.query.limit);
        res.send(autoSuggestList);
    },
);

app.post(
    '/createUser',
    validator.body(userSchema(users)),
    (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        users.push({
            id: uuid(),
            login: req.body.login,
            password: req.body.password,
            age: req.body.age,
            isDeleted: false
        });
        res.sendStatus(200);
    },
);

app.put(
    '/updateUser/:userId',
    validator.body(userSchema(users)),
    (req: Request, res: Response) => {
        const userIndex = findUserIndexById(req.params.userId);

        if (userIndex === -1) {
            res.status(400).send('No users with such ID');
        } else {
            users[userIndex] = {
                ...users[userIndex],
                ...req.body
            };
            res.sendStatus(200);
        }
    }
);

app.delete('/deleteUser/:userId', (req: Request, res: Response) => {
    const userIndex = findUserIndexById(req.params.userId);

    if (userIndex === -1) {
        res.status(400).send('No users with such ID');
    } else {
        users[userIndex] = {
            ...users[userIndex],
            isDeleted: true
        };
        res.sendStatus(200);
    }
});

app.listen(3000, () => {
    console.log('Application started on port 3000!');
});
