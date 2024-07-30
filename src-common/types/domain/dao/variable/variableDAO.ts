import { Prisma } from '@prisma/client';

export interface VariableSearchDAO {
    id: number;
    type_cd: string;
    key: string;
    value: string;
    create_time_from: Date | string;
    create_time_to: Date | string;
}

export interface VariableInsertDAO extends Prisma.VariableCreateInput {}

export interface VariableUpdateDAO extends Prisma.VariableUpdateInput {
    id: number;
}
