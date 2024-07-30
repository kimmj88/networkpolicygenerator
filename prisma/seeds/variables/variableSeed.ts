import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VARIABLE_SEED: Prisma.VariableCreateInput[] = [
    { key: 'HOME_NET1', type_cd: 'IP', value: '192.168.32.74' },
    { key: 'HOME_NET2', type_cd: 'IP', value: '192.168.33.0/24' },
    { key: 'HOME_NET3', type_cd: 'IP', value: '192.168.110.44' },
    { key: 'HOME_PORT1', type_cd: 'PORT', value: '80' },
    { key: 'HOME_PORT2', type_cd: 'PORT', value: '500:' },
    { key: 'HOME_PORT3', type_cd: 'PORT', value: '500:900' }
];

async function seedVariable() {
    for (const data of VARIABLE_SEED) {
        await prisma.variable.upsert({
            where: {
                key: data.key
            },
            create: data,
            update: {}
        });
    }
}

export default seedVariable;
