import DBGroup from '../../models/group.model';
import GroupService from './group.service';

jest.mock('../../models/group.model');

const DBGroupMock = DBGroup as jest.MockedClass<typeof DBGroup>;

describe('Group service class', () => {
    beforeEach(() => {
        DBGroupMock.mockClear();
    });

    it('"fillTableIfEmpty" should not call bulkCreate if db has users', () => {
        const groupService = new GroupService();
        groupService.fillTableIfEmpty();

        expect(DBGroupMock.findAll).toHaveBeenCalledTimes(1);
        expect(DBGroupMock.bulkCreate).toHaveBeenCalledTimes(0);
    });

    it('"getAllGroups" should call "findAll" with correct args', () => {
        const findAllConfig = {
            attributes: ['id', 'name', 'permissions']
        };

        const groupService = new GroupService();
        groupService.getAllGroups();

        expect(DBGroupMock.findAll).toHaveBeenCalledWith(findAllConfig);
    });

    it('"getGroupById" should call "findOne" with correct args', () => {
        const id = '1';

        const findOneConfig = {
            where: { id }
        };

        const groupService = new GroupService();
        groupService.getGroupById(id);

        expect(DBGroupMock.findOne).toHaveBeenCalledWith(findOneConfig);
    });

    it('"createGoup" should call "create" with correct args', () => {
        const name = 'name';
        const permissions = ['WRITE'];

        const createConfig = {
            name,
            permissions
        };

        const groupService = new GroupService();
        groupService.createGroup(name, permissions);

        expect(DBGroupMock.create).toHaveBeenCalledWith(createConfig);
    });

    it('"updateGroup" should call "update" with correct args', () => {
        const id = '1';
        const name = 'name';
        const permissions = ['WRITE'];

        const updateConfigArg1 = { name, permissions };
        const updateConfigArg2 = {
            where: { id }
        };

        const groupService = new GroupService();
        groupService.updateGroup(id, name, permissions);

        expect(DBGroupMock.update).toHaveBeenCalledWith(updateConfigArg1, updateConfigArg2);
    });

    it('"deleteGroup" should call "destroy" with correct args', () => {
        const id = '1';

        const findOneConfig = {
            where: { id }
        };

        const groupService = new GroupService();
        groupService.deleteGroup(id);

        expect(DBGroupMock.destroy).toHaveBeenCalledWith(findOneConfig);
    });
});
