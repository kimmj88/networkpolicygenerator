export interface MngGrpCodeDTO {
    id: number;
    grp_cd: string;
    grp_cd_nm: string;
    grp_cd_dc: string;
    use_yn: string;
    create_time: Date;
    modify_time: Date;
}
export interface SearchMngGrpCodeDTO extends PageDomain {
    // 검색 조건
    grp_cd?: string;
    grp_cd_nm?: string;
}

export interface MngCodeDTO {
    id: number;
    grp_cd: string;
    cd: string;
    cd_nm: string;
    cd_dc: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
    sort_order: string;
    use_yn: string;
    create_time: Date;
    modify_time: Date;

    ml_info: MngCodeMlDTO[];
    curr_lang_cd: string;
}
export interface SearchMngCodeDTO extends Partial<PageDomain> {
    // 검색 조건
    grp_cd?: string;
    cd?: string;
    cd_nm?: string;

    use_yn?: string;
    // 사용중 언어
    curr_lang_cd?: string;
}

export interface MngCodeMlDTO {
    id: number;
    grp_cd: string;
    cd: string;
    lang_cd: string;
    name: string;
    create_time: Date;
    modify_time: Date;
}

export interface SearchMngCodeMlDTO extends Partial<PageDomain> {
    grp_cd?: string;
    cd?: string;
    lang_cd?: string;
    name?: string;
}
