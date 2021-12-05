import { DataTypes, HasManyAddAssociationMixin, Model } from 'sequelize';

import db from '../data-access/database';
import DBUser from './user.model';

class DBGroup extends Model {
    public addUsers!: HasManyAddAssociationMixin<DBUser[], number>;
}

DBGroup.init({
    name: DataTypes.TEXT,
    permissions: DataTypes.ARRAY(DataTypes.TEXT)
}, {
    sequelize: db,
    modelName: 'Group',
    timestamps: false
});

export default DBGroup;
