import { Op } from 'sequelize';
import DBUser from '../../models/user.model';
import { logger } from '../logger.service';

export default class UserService {
    public async fillTableIfEmpty() {
        try {
            const users = await DBUser.findAll();

            if (!users.length) {
                await DBUser.bulkCreate(
                    Array(5).fill('').map((_, index) => ({
                        login: `testUser${ index + 1 }`,
                        password: `password${ index }`,
                        age: index + 18,
                        isDeleted: false
                    }))
                );
            }
        } catch (e) {
            logger.error(`Method: "fillTableIfEmpty". Message: ${e.message}`);
        }
    }

    public async getAllUsers() {
        try {
            return await DBUser.findAll({
                attributes: ['id', 'login', 'password', 'age'],
                where: {
                    isDeleted: false
                }
            });
        } catch (e) {
            logger.error(`Method: "getAllUsers". Message: ${e.message}`);
        }
    }

    public async findUserById(id: string) {
        try {
            return await DBUser.findOne({
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "findUserById". Arguments: id - ${id}. Message: ${e.message}`);
        }
    }

    public async findUserByLogin(login: string) {
        try {
            return await DBUser.findOne({
                where: { login }
            });
        } catch (e) {
            logger.error(`Method: "findUserByLogin". Arguments: login - ${login}. Message: ${e.message}`);
        }
    }

    public async getAutoSuggestUsers(substring: string, limit: number) {
        try {
            return await DBUser.findAll({
                where: {
                    isDeleted: false,
                    login: {
                        [Op.like]: `%${substring}%`
                    }
                },
                order: [
                    ['login', 'ASC']
                ],
                limit
            });
        } catch (e) {
            logger.error(`Method: "getAutoSuggestUsers". Arguments: substring - ${substring}, limit - ${limit}. Message: ${e.message}`);
        }
    }

    public async createUser(login: string, password: string, age: number) {
        try {
            return await DBUser.create({
                login,
                password,
                age,
                isDeleted: false
            });
        } catch (e) {
            logger.error(`Method: "createUser". Arguments: login - ${login}, password - ${password}, age - ${age}. Message: ${e.message}`);
        }
    }

    public async updateUser(id: string, login: string, password: string, age: number) {
        try {
            return await DBUser.update({ login, password, age }, {
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "createUser". Arguments: id - ${id}, login - ${login}, password - ${password}, age - ${age}. Message: ${e.message}`);
        }
    }

    public async deleteUser(id: string) {
        try {
            return await DBUser.update({ isDeleted: true }, {
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "createUser". Arguments: id - ${id}. Message: ${e.message}`);
        }
    }

    public async isLoginExist(login: string): Promise<boolean> {
        try {
            const user = await DBUser.findOne({
                where: { login }
            });

            return !!user;
        } catch (e) {
            logger.error(`Method: "createUser". Arguments: login - ${login}. Message: ${e.message}`);
        }
    }
}
