import { ValidatedRequest } from "express-joi-validation";
import { UserRequestSchema } from "src/schemas/user-schema";

export async function loginValidator(req: ValidatedRequest<UserRequestSchema>, res: Response, next: NextFunction) {
    const { login } = req.body;
    const isLoginExist = await userService.isLoginExist(login);

    if (isLoginExist) {
        res.status(400).send('Such login already exists!');
        return next('route');
    }
    next();
}