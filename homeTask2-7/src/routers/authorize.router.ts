import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserService from '../services/user/user.service';

const authRouter = Router();
const userService = new UserService();

authRouter.post(
    '/login',
    async (req: Request, res: Response) => {
        const user = await userService.findUserByLogin(req.body.login);

        if (!user) {
            res.status(400).send('No users with such login');
        }

        const password = user.getDataValue('password');
        if (password !== req.body.password) {
            res.status(400).send('Incorrect password for this login!');
        }

        const token = jwt.sign({}, process.env.JWT_SECRET_KEY, { expiresIn: 60 });
        res.send({ token });
    }
);

export default authRouter;
