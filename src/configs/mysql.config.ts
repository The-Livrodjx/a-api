import * as env from 'dotenv';

env.config();

export const mysqlConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.DB_PASS,
    database: 'aproject',
    synchronize: true,
};
