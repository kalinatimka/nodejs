import db from '../data-access/database';
import DBUser from '../models/user.model';
import DBGroup from '../models/group.model';
import DBUserGroup from '../models/user-group.model';
import { logger } from './logger.service';

export default class GroupService {
    public async fillTableIfEmpty() {
        try {
            const groups = await DBGroup.findAll();

            if (!groups.length) {
                await DBGroup.bulkCreate(
                    Array(3).fill('').map((_, index) => ({
                        name: `group${ index + 1 }`,
                        permissions: ['WRITE']
                    }))
                );
            }
        } catch (e) {
            logger.error(`Method: "fillTableIfEmpty". Message: ${e.message}`);
        }
    }

    public async getAllGroups() {
        try {
            return await DBGroup.findAll({
                attributes: ['id', 'name', 'permissions']
            });
        } catch (e) {
            logger.error(`Method: "getAllGroups". Message: ${e.message}`);
        }
    }

    public async getGroupById(id: string) {
        try {
            return await DBGroup.findOne({
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "getGroupById". Arguments: id - ${id} Message: ${e.message}`);
        }
    }

    public async createGroup(name: string, permissions: string[]) {
        try {
            return await DBGroup.create({
                name,
                permissions
            });
        } catch (e) {
            logger.error(`Method: "createGroup". Arguments: name - ${name}, permissions - ${permissions}. Message: ${e.message}`);
        }
    }

    public async updateGroup(id: string, name: string, permissions: string[]) {
        try {
            return await DBGroup.update({ name, permissions }, {
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "updateGroup". Arguments: id - ${id}, name - ${name}, permissions - ${permissions}. Message: ${e.message}`);
        }
    }

    public async deleteGroup(id: string) {
        try {
            return await DBGroup.destroy({
                where: { id }
            });
        } catch (e) {
            logger.error(`Method: "deleteGroup". Arguments: id - ${id}. Message: ${e.message}`);
        }
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
            logger.error(`Method: "addUsersToGroup". Arguments: groupId - ${groupId}, userIds - ${userIds}. Message: ${err.message}`);
        }
    }
}
