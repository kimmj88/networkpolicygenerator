import { ResBaseData, ResGetData } from '@cm/types/domain/apis/common';
import {
    CountModuleDTO,
    DeleteModuleDTO,
    ModuleDTO,
    SearchModuleDTO,
    UpdateModuleDTO
} from '@cm/types/domain/dto/module/moduleDTO';

export const API_MODULE = 'api/module';

export interface ResGetAllModules extends ResBaseData {
    modules: ModuleDTO[];
}

export interface ResCountModule extends ResBaseData {
    count: number;
}

export interface ResSearchModule extends ResGetData {
    modules: ModuleDTO[];
}

export interface ResDetailModule extends ResGetData {
    module?: ModuleDTO;
}

export interface ReqCreateModule {
    data: ModuleDTO;
}

export interface ReqUpdateModule {
    data: UpdateModuleDTO;
}

export interface ReqDeleteModule {
    data: DeleteModuleDTO;
}

export interface ReqCountModule {
    data: CountModuleDTO;
}

export interface ReqSearchModule {
    data: SearchModuleDTO;
}

export interface ReqDetailModule {
    data: ModuleDTO;
}
