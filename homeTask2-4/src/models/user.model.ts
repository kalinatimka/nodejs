import { DataTypes } from 'sequelize';

import db from '../data-access/database';

const DBUser = db.define('User', {
    login: DataTypes.TEXT,
    password: DataTypes.TEXT,
    age: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
});

export default DBUser;
