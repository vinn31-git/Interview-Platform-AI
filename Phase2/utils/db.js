require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { PrismaNeonHTTP } = require('@prisma/adapter-neon');
const { PrismaClient } = require('@prisma/client');

const connectionString = `${process.env.DATABASE_URL}`;
const sql = neon(connectionString);
const adapter = new PrismaNeonHTTP(sql);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
