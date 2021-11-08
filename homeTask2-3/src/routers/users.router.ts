import { Request, Response, Router, NextFunction } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';

import { AutoSuggestRequestSchema, autoSuggestSchema } from '../schemas/autosuggest-schema';
import { UserRequestSchema, userSchema } from '../schemas/user-schema';
import UserService from '../services/user.service';

const usersRouter = Router();
const validator = createValidator({ statusCode: 400 });
const userService = new UserService();

usersRouter.get(
    '/getAllUsers',
    async (req: Request, res: Response) => {
        const dbUsers = await userService.getAllUsers();
        res.send(dbUsers);
    }
);

usersRouter.get(
    '/user/:userId',
    async (req: Request, res: Response) => {
        const user = await userService.findUserById(req.params.userId);

        if (!user) {
            res.status(400).send('No users with such ID');
        } else {
            res.send(user);
        }
    }
);

usersRouter.get(
    '/getAutoSuggestUsers',
    validator.query(autoSuggestSchema),
    async (req: ValidatedRequest<AutoSuggestRequestSchema>, res: Response) => {
        const { loginSubstring, limit } = req.query;

        const autoSuggestList = await userService.getAutoSuggestUsers(
            loginSubstring,
            limit,
        );

        res.send(autoSuggestList);
    },
);

usersRouter.post(
    '/createUser',
    validator.body(userSchema),
    loginValidator,
    async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const { login, password, age } = req.body;

        await userService.createUser(login, password, age);

        res.sendStatus(200);
    },
);

usersRouter.put(
    '/updateUser/:userId',
    validator.body(userSchema),
    loginValidator,
    async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
        const { login, password, age } = req.body;
        const { userId } = req.params;

        const updatedUser = await userService.updateUser(
            userId,
            login,
            password,
            age,
        );

        if (!updatedUser) {
            res.status(400).send('No users with such ID');
        } else {
            res.sendStatus(200);
        }
    }
);

usersRouter.delete(
    '/deleteUser/:userId',
    async (req: Request, res: Response) => {
        const { userId } = req.params;

        const updatedUser = await userService.deleteUser(userId);

        if (!updatedUser) {
            res.status(400).send('No users with such ID');
        } else {
            res.sendStatus(200);
        }
    }
);

async function loginValidator(req: ValidatedRequest<UserRequestSchema>, res: Response, next: NextFunction) {
    const { login } = req.body;
    const isLoginExist = await userService.isLoginExist(login);

    if (isLoginExist) {
        res.status(400).send('Such login already exists!');
        return next('route');
    }
    next();
}

export default usersRouter;
