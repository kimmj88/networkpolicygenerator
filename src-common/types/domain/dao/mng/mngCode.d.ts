export interface MngGrpCodeBase {
    grp_cd: string;
    grp_cd_nm: string;
    grp_cd_dc: string;
    use_yn: string;
}
export interface MngGrpCode extends MngGrpCodeBase {
    id: number;
    grp_cd: string;
    grp_cd_nm: string;
    grp_cd_dc: string;
    use_yn: string;
    create_time: Date;
    modify_time: Date;
}

export interface MngCodeBase {
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
}

export interface MngCode extends MngCodeBase {
    id: number;
    create_time: Date;
    modify_time: Date;
}

export interface MngCodeMlBase {
    grp_cd: string;
    cd: string;
    lang_cd: string;
    name: string;
}
export interface MngCodeMl extends MngCodeMlBase {
    id: number;
    create_time: Date;
    modify_time: Date;
}

export interface MngCodeWithMl extends MngCode {
    ml_info: MngCodeMl[];
}
