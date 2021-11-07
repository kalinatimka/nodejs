import express from 'express';
import { Request, Response, Express } from 'express';
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation';
import { DataTypes, Model, ModelCtor, Op, Sequelize } from 'sequelize';

import { UserRequestSchema, userSchema } from './schemas/user-schema';
import { AutoSuggestRequestSchema, autoSuggestSchema } from './schemas/autosuggest-schema';

interface UserInstance extends Model {
    login: string;
    password: string;
    age: number;
    isDeleted: boolean;
}

// move to env file
const host = 'ec2-3-219-154-115.compute-1.amazonaws.com';
const database = 'd2gp8ustn5070e';
const username = 'szlcnwtjuqdaxs';
const port = 5432;
const password = '38a24e51d39acaf6c307eeebfab6ef8dff4505cdc510c9d1145061019690bc5d';

const sequelize = new Sequelize({
    database,
    username,
    password,
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

let DBUser: ModelCtor<UserInstance>;

async function initRoutes(app: Express) {
    const validator = createValidator({ statusCode: 400 });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/getAllUsers', async (req: Request, res: Response) => {
        const dbUsers = await DBUser.findAll({
            attributes: ['id', 'login', 'password', 'age'],
            where: {
                isDeleted: false
            }
        });
        res.send(dbUsers);
    });

    app.get('/user/:userId', async (req: Request, res: Response) => {
        const user = await DBUser.findOne({
            where: {
                id: req.params.userId
            }
        });

        if (!user) {
            res.status(400).send('No users with such ID');
        } else {
            res.send(user);
        }
    });

    app.get(
        '/getAutoSuggestUsers',
        validator.query(autoSuggestSchema),
        async (req: ValidatedRequest<AutoSuggestRequestSchema>, res: Response) => {
            const autoSuggestList = await DBUser.findAll({
                where: {
                    isDeleted: false,
                    login: {
                        [Op.like]: `%${req.query.loginSubstring}%`
                    }
                },
                order: [
                    ['login', 'ASC']
                ],
                limit: req.query.limit
            });

            res.send(autoSuggestList);
        },
    );

    app.post(
        '/createUser',
        validator.body(userSchema),
        // check on unique login
        async (req: ValidatedRequest<UserRequestSchema>, res: Response) => {
            await DBUser.create({
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
        validator.body(userSchema),
        // check on unique login
        async (req: Request, res: Response) => {
            const updatedUser = await DBUser.update(req.body, {
                where: {
                    id: req.params.userId
                }
            });

            if (!updatedUser) {
                res.status(400).send('No users with such ID');
            } else {
                res.sendStatus(200);
            }
        }
    );

    app.delete('/deleteUser/:userId', async (req: Request, res: Response) => {
        const updatedUser = await DBUser.update({ isDeleted: true }, {
            where: {
                id: req.params.userId
            }
        });

        if (!updatedUser) {
            res.status(400).send('No users with such ID');
        } else {
            res.sendStatus(200);
        }
    });
}

async function createConnection() {
    DBUser = sequelize.define('User', {
        login: DataTypes.TEXT,
        password: DataTypes.TEXT,
        age: DataTypes.INTEGER,
        isDeleted: DataTypes.BOOLEAN
    });
    await DBUser.sync();
}

async function startServer() {
    const app = express();

    await createConnection();

    await initRoutes(app);

    app.listen(3000, () => {
        console.log('Application started on port 3000!');
    });
}

startServer();
