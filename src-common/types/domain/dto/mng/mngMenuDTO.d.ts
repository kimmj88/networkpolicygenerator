export interface MngMenuDTO {
    [key: string]: any;
    id: number;
    menu_id: string;
    menu_nm: string;
    menu_url: string;
    menu_dc: string;
    up_menu_id: string;
    menu_icon_class: string;
    sort_order: string;
    use_yn: string;
    create_time: Date;
    modify_time: Date;

    ml_info: MngMenuMlDTO[];
    curr_lang_cd: string;
}
export interface SearchMngMenuDTO extends Partial<PageDomain> {
    [key: string]: any;
    // 검색 조건
    menu_id?: string;
    menu_nm?: string;

    use_yn?: string;
    // 사용중 언어
    curr_lang_cd?: string;
}

export interface MngMenuMlDTO {
    [key: string]: any;
    id: number;
    parent_id: number;
    menu_id: string;
    lang_cd: string;
    name: string;
    create_time: Date;
    modify_time: Date;
}

export interface SearchMngMenuMlDTO extends Partial<PageDomain> {
    [key: string]: any;
    menu_id?: string;
    lang_cd?: string;
    name?: string;
}
