export interface VariableSearchDTO {
    id: number;
    type_cd?: string | '';
    key?: string | '';
    value?: string | '';
    create_time_from?: string | null;
    create_time_to?: string | null;
}

export interface VariableDTO {
    id: number;
    type_cd?: string;
    key?: string;
    value?: string;
    create_time?: Date;
    modify_time?: Date;
}
