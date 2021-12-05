import { Op } from 'sequelize';
import DBUser from '../models/user.model';

export default class UserService {
    public async fillTableIfEmpty() {
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
    }

    public async getAllUsers() {
        return await DBUser.findAll({
            attributes: ['id', 'login', 'password', 'age'],
            where: {
                isDeleted: false
            }
        });
    }

    public async findUserById(id: string) {
        return await DBUser.findOne({
            where: { id }
        });
    }

    public async getAutoSuggestUsers(substring: string, limit: number) {
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
    }

    public async createUser(login: string, password: string, age: number) {
        return await DBUser.create({
            login,
            password,
            age,
            isDeleted: false
        });
    }

    public async updateUser(id: string, login: string, password: string, age: number) {
        return await DBUser.update({ login, password, age }, {
            where: { id }
        });
    }

    public async deleteUser(id: string) {
        return await DBUser.update({ isDeleted: true }, {
            where: { id }
        });
    }

    public async isLoginExist(login: string): Promise<boolean> {
        const user = await DBUser.findOne({
            where: { login }
        });

        return !!user;
    }
}
