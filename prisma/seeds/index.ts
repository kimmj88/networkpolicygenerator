import prisma from '../../src-electron/backend/database/prismaClient';
import seedMngCode from './mng/Code';
import seedMngGrpCode from './mng/GrpCode';
import seedMngMenu from './mng/Menu';
import * as seedModule from './module/moduleSeed';
import seedRule from './rules/ruleSeed';
import seedVariable from './variables/variableSeed';
import seedPolicy from './policy/policySeed';

async function main() {
    await seedMngMenu();
    await seedMngGrpCode();
    await seedMngCode();
    await seedRule();
    await seedVariable();
    await seedModule.create();
    await seedPolicy();
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
