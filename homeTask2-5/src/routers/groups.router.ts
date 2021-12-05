import { Router, Request, Response } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { groupSchema, GroupRequestSchema } from '../schemas/group-schema';

import GroupService from '../services/group.service';

const groupsRouter = Router();
const validator = createValidator({ statusCode: 400 });
const groupService = new GroupService();

groupsRouter.get(
    '/getAllGroups',
    async (req: Request, res: Response) => {
        const dbGroups = await groupService.getAllGroups();
        res.send(dbGroups);
    }
);

groupsRouter.get(
    '/group/:groupId',
    async (req: Request, res: Response) => {
        const group = await groupService.getGroupById(req.params.groupId);

        if (!group) {
            res.status(400).send('No groups with such ID');
        } else {
            res.send(group);
        }
    }
);

groupsRouter.post(
    '/createGroup',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
        const { name, permissions } = req.body;

        await groupService.createGroup(name, permissions);

        res.sendStatus(200);
    },
);

groupsRouter.put(
    '/updateGroup/:groupId',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response) => {
        const { name, permissions } = req.body;
        const { groupId } = req.params;

        const updatedUser = await groupService.updateGroup(
            groupId,
            name,
            permissions,
        );

        if (!updatedUser) {
            res.status(400).send('No groups with such ID');
        } else {
            res.sendStatus(200);
        }
    }
);

groupsRouter.delete(
    '/deleteGroup/:groupId',
    async (req: Request, res: Response) => {
        const { groupId } = req.params;

        await groupService.deleteGroup(groupId);

        res.sendStatus(200);
    }
);

groupsRouter.post(
    '/addUsersToGroup',
    async (req: Request, res: Response) => {
        const { groupId, userIds } = req.body;

        const groupsUsers = await groupService.addUsersToGroup(groupId, userIds);

        res.send(groupsUsers);
    },
);

export default groupsRouter;
