import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
const database = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const port = Number(process.env.DB_PORT);
const password = process.env.DB_PASSWORD;

const db = new Sequelize({
    database,
    username,
    password,
    host,
    port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default db;
