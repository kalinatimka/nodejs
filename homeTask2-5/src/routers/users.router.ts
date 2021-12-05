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
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbUsers = await userService.getAllUsers();
            res.send(dbUsers);
        } catch (e) {
            return next(e);
        }
    }
);

usersRouter.get(
    '/user/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.findUserById(req.params.userId);

            if (!user) {
                res.status(400).send('No users with such ID');
            } else {
                res.send(user);
            }
        } catch (e) {
            return next(e);
        }
    }
);

usersRouter.get(
    '/getAutoSuggestUsers',
    validator.query(autoSuggestSchema),
    async (req: ValidatedRequest<AutoSuggestRequestSchema>, res: Response, next: NextFunction) => {
        try {
            const { loginSubstring, limit } = req.query;

            const autoSuggestList = await userService.getAutoSuggestUsers(
                loginSubstring,
                limit,
            );

            res.send(autoSuggestList);
        } catch (e) {
            return next(e);
        }
    },
);

usersRouter.post(
    '/createUser',
    validator.body(userSchema),
    loginValidator,
    async (req: ValidatedRequest<UserRequestSchema>, res: Response, next: NextFunction) => {
        try {
            const { login, password, age } = req.body;

            await userService.createUser(login, password, age);

            res.sendStatus(200);
        } catch (e) {
            return next(e);
        }
    },
);

usersRouter.put(
    '/updateUser/:userId',
    validator.body(userSchema),
    loginValidator,
    async (req: ValidatedRequest<UserRequestSchema>, res: Response, next: NextFunction) => {
        try {
            const { login, password, age } = req.body;
            const { userId } = req.params;

            const [affectedRows] = await userService.updateUser(
                userId,
                login,
                password,
                age,
            );

            if (!affectedRows) {
                res.status(400).send('No users with such ID');
            } else {
                res.sendStatus(200);
            }
        } catch (e) {
            return next(e);
        }
    }
);

usersRouter.delete(
    '/deleteUser/:userId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;

            const [affectedRows] = await userService.deleteUser(userId);

            if (!affectedRows) {
                res.status(400).send('No users with such ID');
            } else {
                res.sendStatus(200);
            }
        } catch (e) {
            return next(e);
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
