import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL must be set. Current value: ${process.env.DATABASE_URL}`);
}

const prisma = new PrismaClient();

export default prisma;
