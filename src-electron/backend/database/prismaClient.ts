import { PrismaClient } from '@prisma/client';
// import Prisma from '@prisma/client';
import path from 'node:path';
// const { PrismaClient } = Prisma;

const envDbPath = process.env.DATABASE_URL ?? 'file:' + path.join(process.resourcesPath, 'prisma', 'npg.db');

const prismaClientSingleton = () => {
    return new PrismaClient({
        datasourceUrl: envDbPath
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
