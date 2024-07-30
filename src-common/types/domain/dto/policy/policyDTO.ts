import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';

export interface PolicySearchDTO {
    id: number;
    title?: string | '';
    create_time_from?: string | null;
    create_time_to?: string | null;
    [key: string]: any;
}

export interface PolicyDTO {
    id?: number;
    title?: string;
    create_time?: Date;
    modify_time?: Date;
    modules?: ModuleDTO[];
}

export interface PolicyExportDTO {
    policyTitle?: string;
    selectedFolderPath?: string;
    modules?: ModuleDTO[];
    modulePrevObj?: Map<string, string>;
    variablePreview: string;
    allowlist: string[];
    blocklist: string[];
    rulesList?: Map<string, string>;
}
