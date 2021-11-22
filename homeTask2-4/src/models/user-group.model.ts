import { Model } from 'sequelize';

import db from '../data-access/database';
import DBGroup from './group.model';
import DBUser from './user.model';

class DBUserGroup extends Model {}

DBUserGroup.init({}, {
    sequelize: db,
    modelName: 'UserGroup',
    timestamps: false
});

DBUser.belongsToMany(DBGroup, { through: DBUserGroup, onDelete: 'CASCADE' });
DBGroup.belongsToMany(DBUser, { through: DBUserGroup, onDelete: 'CASCADE' });

export default DBUserGroup;
