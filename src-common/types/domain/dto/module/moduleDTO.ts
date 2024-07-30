import { ModuleValueDTO } from './moduleValueDTO';

export interface ModuleDTO {
    id?: number;
    type_cd?: string;
    title?: string;
    module_value_list?: ModuleValueDTO[];
    create_time?: Date;
    modify_time?: Date;
}

export interface UpdateModuleDTO {
    id: number;
    type_cd: string;
    title: string;
    module_value_list?: ModuleValueDTO[];
}

export interface DeleteModuleDTO {
    id: number;
}

export interface SearchModuleDTO {
    type_cd?: string;
    paging?: string;
    page_per_data?: number;
    page?: number;
    sort?: string;
    create_time_from?: string;
    create_time_to?: string;
    title?: string;
}

export interface CountModuleDTO {
    type_cd?: string;
    paging?: string;
    page_per_data?: number;
    page?: number;
    sort?: string;
    create_time_from?: string;
    create_time_to?: string;
    title?: string;
}
