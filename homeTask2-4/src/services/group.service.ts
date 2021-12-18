import db from '../data-access/database';
import DBUser from '../models/user.model';
import DBGroup from '../models/group.model';
import DBUserGroup from '../models/user-group.model';

export default class GroupService {
    public async fillTableIfEmpty() {
        const groups = await DBGroup.findAll();

        if (!groups.length) {
            await DBGroup.bulkCreate(
                Array(3).fill('').map((_, index) => ({
                    name: `group${ index + 1 }`,
                    permissions: ['WRITE']
                }))
            );
        }
    }

    public async getAllGroups() {
        return await DBGroup.findAll({
            attributes: ['id', 'name', 'permissions']
        });
    }

    public async getGroupById(id: string) {
        return await DBGroup.findOne({
            where: { id }
        });
    }

    public async createGroup(name: string, permissions: string[]) {
        return await DBGroup.create({
            name,
            permissions
        });
    }

    public async updateGroup(id: string, name: string, permissions: string[]) {
        return await DBGroup.update({ name, permissions }, {
            where: { id }
        });
    }

    public async deleteGroup(id: string) {
        return await DBGroup.destroy({
            where: { id }
        });
    }

    public async addUsersToGroup(groupId: number, userIds: number[]) {
        try {
            return await db.transaction(async () => {
                const group = await DBGroup.findOne({
                    where: { id: groupId }
                });

                const users = [];
                for (let i = 0; i < userIds.length; i++) {
                    const user = await DBUser.findOne({
                        where: { id: userIds[i] }
                    });
                    users.push(user);
                }

                await group.addUsers(users);

                const usersGroups = await DBUserGroup.findAll();

                return usersGroups;
            });
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
