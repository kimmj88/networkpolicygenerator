type useYnType = 'Y' | 'N';

export type commonCodeType = {
    cd: string;
    cd_dc: string;
    cd_nm: string;
    grp_cd: string;
    create_id: string;
    create_time: Date;
    id: string;
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
    modify_id: string;
    modify_time: Date;
    page: number;
    page_per_data: number;
    paging: string;
    sort: any;
    sort_order: string;
    svc_location: string;
    svc_nation: string;
    svc_type: string;
    use_yn: useYnType;
};

export type AtLeastOne<T> = T extends { a: string } | { b: string } ? T : never;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
    }[Keys];

export type ListItemType = {
    [key: string]: any;
};

export type BtnDisabledType = {
    condition: Function; // btn disable 조건
    visible?: boolean; // btn disable 시 버튼 자체를 안보이게 할 것인지 여부 boolean (true -> 보임, false -> 안보임)
};

export type EmitMapperTypeDetail = {
    type?: 'btn' | 'text';
    label?: string;
    btn_icon_class?: string;
    show_condition?: Function;
    btn_disabled?: BtnDisabledType;
    key_name?: {
        prefix?: string;
        postfix?: string;
    };
};

export type EmitMapperType = {
    [key: string]: EmitMapperTypeDetail | EmitMapperTypeDetail[];
};

type Percentage = `${number}%` | `${number}.${number}%`;

export type HeaderConfig = {
    [key: string]: {
        msg: string;
        size: Percentage | Percentage[];
        show?: boolean;
        code?: string;
        textClass?: string;
    };
};

export type AuditDetailInfo = {
    svc_type: string;
    id: string;
    log_type: string;
    message: string;
    verify_status: string;
    signature: string;
    signature_key: string;
    create_time: string;
    create_id: string;
};

export type KeyType = {
    key: string;
    hexString: string;
    type: string;
    len: number;
};

export interface ListBaseProps {
    // headers: string[] | HeaderConfig,
    headers: HeaderConfig;
    dataList: ListItemType[];
    emitMapper?: EmitMapperType;
    commonCode?: { [key: string]: any };
    sortFlag?: boolean;
    verifySignature?: boolean;
}

export type FieldItemType = {
    id?: string;
    bp_code?: string;
    value?: string;
    new_field?: boolean;
};

export type PresetDetailInfoType = {
    svc_type?: string;
    id?: string;
    title?: string;
    bp_grp_code?: string;
    description?: string;
    fields?: FieldItemType[];
    sortOrder?: string;
    use_yn?: string;
};

export type PresetDetailResponseType = Omit<PresetDetailInfoType, 'fields'>;

export type ProfileType = {
    id: string;
    bp_grp_code: string;
    bp_grp_code_name: string;
    bp_grp_code_type: string;
    description: string;
    use_yn: string;
};

export type BpGrpCodeType = ProfileType;

export type BpCodeType = {
    id?: string;
    bp_grp_code?: string;
    bp_code?: string;
    bp_code_name?: string;
    description?: string;
    string_length?: number;
    use_yn?: useYnType;
};

export interface IInput {
    focusInputRef(): void;
}
export interface IPresetInputs {
    id?: string;
    focusKeyInputRef(): void;
    focusValueInputRef(): void;
}

export type PresetValidateCaseType =
    | 'empty title'
    | 'empty profile'
    | 'empty desc'
    | 'empty field'
    | 'empty key field'
    | 'empty value'
    | 'success';

export type Entries<T> = {
    [K in keyof T]-?: [K, T[K]]; // Using -? to remove optionality
}[keyof T][];

export type SelectItemType = {
    label: string;
    descriptopn?: string;
};

export type SelectListType = SelectItemType[];

export type ListHeaderType = {
    title: string;
    key?: string;
    value: string;
    ratio?: string;
    headerClass?: string;
    textAlign?: 'center' | 'left' | 'right';
}[];
