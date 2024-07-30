import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initMenuData: Prisma.MngMenuCreateInput[] = [
    {
        menu_id: '000000',
        menu_nm: 'Root',
        menu_url: 'subdir',
        menu_dc: 'Root',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '00',
        use_yn: 'Y'
    },
    {
        menu_id: '100000',
        menu_nm: 'Variable',
        menu_url: '/npg/variable/list',
        menu_dc: 'Variable',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '10',
        use_yn: 'Y'
    },
    {
        menu_id: '200000',
        menu_nm: 'Rule',
        menu_url: 'subdir',
        menu_dc: 'Rule',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '20',
        use_yn: 'Y'
    },
    {
        menu_id: '201000',
        menu_nm: 'Rule',
        menu_url: '/npg/rule/rule/list',
        menu_dc: 'Rule',
        up_menu_id: '200000',
        menu_icon_class: '',
        sort_order: '21',
        use_yn: 'Y'
    },
    {
        menu_id: '202000',
        menu_nm: 'RuleSet',
        menu_url: '/npg/rule/ruleset/list',
        menu_dc: 'Ruleset',
        up_menu_id: '200000',
        menu_icon_class: '',
        sort_order: '22',
        use_yn: 'Y'
    },
    {
        menu_id: '300000',
        menu_nm: 'Module',
        menu_url: '/npg/module/list',
        menu_dc: 'Module',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '30',
        use_yn: 'Y'
    },
    {
        menu_id: '400000',
        menu_nm: 'Policy',
        menu_url: '/npg/policy/list',
        menu_dc: 'policy',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '40',
        use_yn: 'Y'
    },
    {
        menu_id: '900000',
        menu_nm: 'System Mng.',
        menu_url: 'subdir',
        menu_dc: 'System Management',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '90',
        use_yn: 'Y'
    },
    {
        menu_id: '901000',
        menu_nm: 'Code',
        menu_url: 'subdir',
        menu_dc: 'Code Management',
        up_menu_id: '900000',
        menu_icon_class: '',
        sort_order: '91',
        use_yn: 'Y'
    },
    {
        menu_id: '901100',
        menu_nm: 'Group Code',
        menu_url: '/mng/grpcode/list',
        menu_dc: 'Code-GroupCode Management',
        up_menu_id: '901000',
        menu_icon_class: '',
        sort_order: '1',
        use_yn: 'Y'
    },
    {
        menu_id: '901200',
        menu_nm: 'Code',
        menu_url: '/mng/code/list',
        menu_dc: 'Code-Code Management',
        up_menu_id: '901000',
        menu_icon_class: '',
        sort_order: '2',
        use_yn: 'Y'
    },
    {
        menu_id: '902000',
        menu_nm: 'Menu',
        menu_url: '/mng/menu/list',
        menu_dc: 'Menu Management',
        up_menu_id: '900000',
        menu_icon_class: '',
        sort_order: '92',
        use_yn: 'Y'
    }
];

const initMenuMlData: Prisma.MngMenuMlCreateWithoutMng_menuInput[] = [
    { menu_id: '000000', lang_cd: 'EN', name: 'Root' },
    { menu_id: '100000', lang_cd: 'EN', name: 'Variable' },
    { menu_id: '200000', lang_cd: 'EN', name: 'Rule' },
    { menu_id: '201000', lang_cd: 'EN', name: 'Rule' },
    { menu_id: '202000', lang_cd: 'EN', name: 'RuleSet' },
    { menu_id: '300000', lang_cd: 'EN', name: 'Module' },
    { menu_id: '400000', lang_cd: 'EN', name: 'Policy' },
    { menu_id: '900000', lang_cd: 'EN', name: 'System Mng.' },
    { menu_id: '901000', lang_cd: 'EN', name: 'Code' },
    { menu_id: '901100', lang_cd: 'EN', name: 'Group Code' },
    { menu_id: '901200', lang_cd: 'EN', name: 'Code' },
    { menu_id: '902000', lang_cd: 'EN', name: 'Menu' }
];

async function seedMngMenu() {
    for (const menu of initMenuData) {
        const mlData: Prisma.MngMenuMlCreateWithoutMng_menuInput[] = [];
        for (const ml of initMenuMlData) {
            if (menu.menu_id === ml.menu_id) {
                mlData.push(ml);
            }
        }
        menu.ml_info = { create: mlData };
        await prisma.mngMenu.create({
            data: menu
        });
    }
    // for (const menuMl of initMenuMlData) {
    //     await prisma.mngMenuMl.create({
    //         data: menuMl
    //     });
    // }
}

export default seedMngMenu;
