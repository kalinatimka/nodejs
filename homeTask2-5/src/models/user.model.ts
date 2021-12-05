import { DataTypes, Model } from 'sequelize';

import db from '../data-access/database';

class DBUser extends Model {}

DBUser.init({
    login: DataTypes.TEXT,
    password: DataTypes.TEXT,
    age: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
}, {
    sequelize: db,
    modelName: 'User',
    timestamps: false
});

export default DBUser;
