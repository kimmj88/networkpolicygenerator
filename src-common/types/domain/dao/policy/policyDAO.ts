import { Prisma } from '@prisma/client';
import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';

export interface PolicySearchDAO {
    id: number;
    title: string;
    create_time_from: Date | string;
    create_time_to: Date | string;
}

export interface PolicyModulesInsertDAO {
    title: string;
    modules: ModuleDTO[];
}

export interface PolicyInsertDAO extends Prisma.PolicyCreateInput {}

export interface PolicyUpdateDAO {
    id: number;
    title: string;
    modules: ModuleDTO[];
}
