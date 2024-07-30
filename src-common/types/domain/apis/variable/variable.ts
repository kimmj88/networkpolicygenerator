import { VariableDTO } from '@cm/types/domain/dto/variable/variableDTO';

export const API_VARIABLE = 'api/variable';

export interface ResponseVariable {
    message: string;
    result: boolean;
}

export interface ResponseLoadVariable extends ResponseVariable {
    variables: VariableDTO[];
}
