export interface ModuleValueDTO {
    id?: number;
    module_id?: number;
    type_cd: string;
    value: string;
}

export interface UpdateModuleValueDTO {
    id: number;
    module_id: number;
    type_cd: string;
    value: string;
}

export interface DeleteModuleValueDTO {
    id: number;
    type_cd: string;
}

export interface GetModuleValueDTO {
    module_id: number;
}

export interface DeleteManyModuleValueDTO {
    ids: number[];
}
