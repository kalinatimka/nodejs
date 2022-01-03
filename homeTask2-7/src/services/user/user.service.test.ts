import { Op } from 'sequelize';
import DBUser from '../../models/user.model';
import UserService from './user.service';

jest.mock('../../models/user.model');

const DBUserMock = DBUser as jest.MockedClass<typeof DBUser>;

describe('User service class', () => {
    beforeEach(() => {
        DBUserMock.mockClear();
    });

    it('"fillTableIfEmpty" should not call bulkCreate if db has users', () => {
        const userService = new UserService();
        userService.fillTableIfEmpty();

        expect(DBUserMock.findAll).toHaveBeenCalledTimes(1);
        expect(DBUserMock.bulkCreate).toHaveBeenCalledTimes(0);
    });

    it('"getAllUsers" should call "findAll" with correct args', () => {
        const findAllConfig = {
            attributes: ['id', 'login', 'password', 'age'],
            where: {
                isDeleted: false
            }
        };

        const userService = new UserService();
        userService.getAllUsers();

        expect(DBUserMock.findAll).toHaveBeenCalledWith(findAllConfig);
    });

    it('"findUserById" should call "findOne" with correct args', () => {
        const id = '1';

        const findOneConfig = {
            where: { id }
        };

        const userService = new UserService();
        userService.findUserById(id);

        expect(DBUserMock.findOne).toHaveBeenCalledWith(findOneConfig);
    });

    it('"findUserByLogin" should call "findOne" with correct args', () => {
        const login = 'login';

        const findOneConfig = {
            where: { login }
        };

        const userService = new UserService();
        userService.findUserByLogin(login);

        expect(DBUserMock.findOne).toHaveBeenCalledWith(findOneConfig);
    });

    it('"getAutoSuggestUsers" should call "findOne" with correct args', () => {
        const substring = 'str';
        const limit = 5;

        const findAllConfig = {
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
        };

        const userService = new UserService();
        userService.getAutoSuggestUsers(substring, limit);

        expect(DBUserMock.findAll).toHaveBeenCalledWith(findAllConfig);
    });

    it('"createUser" should call "create" with correct args', () => {
        const login = 'login';
        const password = 'pwd';
        const age = 19;

        const createConfig = {
            login,
            password,
            age,
            isDeleted: false
        };

        const userService = new UserService();
        userService.createUser(login, password, age);

        expect(DBUserMock.create).toHaveBeenCalledWith(createConfig);
    });

    it('"updateUser" should call "create" with correct args', () => {
        const id = '1';
        const login = 'login';
        const password = 'pwd';
        const age = 19;

        const updateConfigArg1 = { login, password, age };
        const updateConfigArg2 = {
            where: { id }
        };

        const userService = new UserService();
        userService.updateUser(id, login, password, age);

        expect(DBUserMock.update).toHaveBeenCalledWith(updateConfigArg1, updateConfigArg2);
    });

    it('"deleteUser" should call "create" with correct args', () => {
        const id = '1';

        const deleteConfigArg1 = {
            isDeleted: true
        };
        const deleteConfigArg2 = {
            where: { id }
        };

        const userService = new UserService();
        userService.deleteUser(id);

        expect(DBUserMock.update).toHaveBeenCalledWith(deleteConfigArg1, deleteConfigArg2);
    });
});
