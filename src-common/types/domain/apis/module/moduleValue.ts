import { ResBaseData } from '@cm/types/domain/apis/common';
import { DeleteModuleValueDTO, ModuleValueDTO, UpdateModuleValueDTO } from '@cm/types/domain/dto/module/moduleValueDTO';

export const API_MODULE_VALUE = 'api/modulevalue';

export interface ResListModuleValues extends ResBaseData {
    moduleValues: ModuleValueDTO[];
}

export interface ReqInsertModuleValue {
    data: ModuleValueDTO;
}

export interface ReqUpdateModuleValue {
    data: UpdateModuleValueDTO;
}

export interface ReqDeleteModuleValue {
    data: DeleteModuleValueDTO;
}

export interface ReqListModuleValue {
    data: ModuleValueDTO;
}
