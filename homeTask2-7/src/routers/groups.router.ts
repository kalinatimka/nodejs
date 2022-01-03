import { Router, Request, Response, NextFunction } from 'express';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import { groupSchema, GroupRequestSchema } from '../schemas/group-schema';

import GroupService from '../services/group/group.service';

const groupsRouter = Router();
const validator = createValidator({ statusCode: 400 });
const groupService = new GroupService();

groupsRouter.get(
    '/getAllGroups',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dbGroups = await groupService.getAllGroups();
            res.send(dbGroups);
        } catch (e) {
            return next(e);
        }
    }
);

groupsRouter.get(
    '/group/:groupId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const group = await groupService.getGroupById(req.params.groupId);

            if (!group) {
                res.status(400).send('No groups with such ID');
            } else {
                res.send(group);
            }
        } catch (e) {
            return next(e);
        }
    }
);

groupsRouter.post(
    '/createGroup',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response, next: NextFunction) => {
        try {
            const { name, permissions } = req.body;

            await groupService.createGroup(name, permissions);

            res.sendStatus(200);
        } catch (e) {
            return next(e);
        }
    },
);

groupsRouter.put(
    '/updateGroup/:groupId',
    validator.body(groupSchema),
    async (req: ValidatedRequest<GroupRequestSchema>, res: Response, next: NextFunction) => {
        try {
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
        } catch (e) {
            return next(e);
        }
    }
);

groupsRouter.delete(
    '/deleteGroup/:groupId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { groupId } = req.params;

            const destroyedRows = await groupService.deleteGroup(groupId);

            if (!destroyedRows) {
                res.status(400).send('No groups with such ID');
            } else {
                res.sendStatus(200);
            }
        } catch (e) {
            return next(e);
        }
    }
);

groupsRouter.post(
    '/addUsersToGroup',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { groupId, userIds } = req.body;

            const groupsUsers = await groupService.addUsersToGroup(groupId, userIds);

            res.send(groupsUsers);
        } catch (e) {
            return next(e);
        }
    },
);

export default groupsRouter;
