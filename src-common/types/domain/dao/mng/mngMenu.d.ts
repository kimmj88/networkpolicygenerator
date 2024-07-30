import { Prisma } from '@prisma/client';

export interface MngMenuBase {
    menu_id: string;
    menu_nm: string;
    menu_url: string;
    menu_dc: string;
    up_menu_id: string;
    menu_icon_class: string;
    sort_order: string;
    use_yn: string;

    ml_info?: MngMenuMl[] | Prisma.MngMenuMlUncheckedUpdateManyWithoutMng_menuNestedInput;
}
export interface MngMenu extends MngMenuBase {
    id: number;
    create_time: Date;
    modify_time: Date;
}

export interface MngMenuMlBase {
    menu_id: string;
    lang_cd: string;
    name: string;
}

export interface MngMenuMl extends MngMenuMlBase {
    id: number;
    create_time: Date;
    modify_time: Date;
}
