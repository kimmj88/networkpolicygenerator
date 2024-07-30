import { ModuleValueDAO } from '@cm/types/domain/dao/module/moduleValueDAO';

export interface ModuleDAO {
    id?: number;
    type_cd?: string;
    title?: string;
    create_time?: Date;
    modify_time?: Date;
    module_value_list?: ModuleValueDAO[];
}
