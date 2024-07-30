import * as mngCodeService from '@be/service/mng/code/mngCodeService';
import * as variableService from '@be/service/variable/variableService';
import * as rulesetService from '@be/service/rule/rulesetService';

import { SearchMngCodeDTO } from '@cm/types/domain/dto/mng/mngCodeDTO';
import { SearchRulesetDTO } from '@cm/types/domain/dto/ruleset/rulesetDTO';
import { PolicyExportDTO } from '@cm/types/domain/dto/policy/policyDTO';
import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import { plainToInstance } from 'class-transformer';
import { VariableDTO } from '@cm/types/domain/dto/variable/variableDTO';

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type IpMacPair = {
    ip: string;
    mac: string;
};

const ExRule = {
    EX: '@ex',
    TRUE: 'Y',
    FALSE: 'N'
} as const;

function parseIpMacString(data: string): IpMacPair[] {
    const pairs = data.split(',');

    return pairs.map((pair) => {
        const [ip, mac] = pair.trim().split(' ');
        return { ip, mac };
    });
}

function exChangeValue(moduleValue: any, item: string): string {
    let appendString = '';
    moduleValue.value = moduleValue.value.replaceAll(',', ' ');
    if (moduleValue.value === ExRule.TRUE) {
        appendString += `\n\t ${item.replace(ExRule.EX, 'true')},`;
    } else if (moduleValue.value === ExRule.FALSE) {
        appendString += `\n\t ${item.replace(ExRule.EX, 'false')},`;
    } else {
        if (moduleValue.type_cd == 'LIMIT') {
            appendString += `\n\t ${item.replace(ExRule.EX, moduleValue.value.toUpperCase())},`;
        } else {
            appendString += `\n\t ${item.replace(ExRule.EX, moduleValue.value.toLowerCase())},`;
        }
    }
    return appendString;
}

async function getCommonCodes(): Promise<Map<string, { item5: string }>> {
    const commonCodes = await mngCodeService.getAll();
    const moduleCodesMap = new Map<string, { item5: string }>();
    commonCodes.forEach((code: { cd_nm: string; item5: any }) => {
        moduleCodesMap.set(code.cd_nm, { item5: code.item5 });
    });
    return moduleCodesMap;
}

async function getModuleTypes(modules: any[]): Promise<Map<string, any>> {
    const modulesMap = new Map<string, any>();
    modules.forEach((module: { type_cd: string | undefined }) => {
        if (module !== null && module.type_cd !== undefined) {
            modulesMap.set(module.type_cd, module);
        }
    });
    return modulesMap;
}

function handleReputationModule(moduleValue: any, item: string): string {
    const includeList: string[] = ['BLOCKLIST', 'ALLOWLIST'];
    if (includeList.includes(moduleValue.type_cd)) {
        return `\n\t ${item},`;
    }

    return exChangeValue(moduleValue, item);
}

function handleArpSpoofModule(moduleValue: any, item: string): string {
    const parsedData = parseIpMacString(moduleValue.value);
    const formattedString = parsedData.map((pair) => `\n\t\t { ip = "${pair.ip}", mac = "${pair.mac}" }`).join(',');
    return `\n\t ${item.replace(ExRule.EX, formattedString)}`;
}

async function handleIpsModule(moduleValue: any, item: string): Promise<string> {
    return new Promise<string>(async (resolve) => {
        let scanVariables: VariableDTO[] = [];
        let moduleValue_variable = `\t variables = {\n ${ExRule.EX} \n\t}`;
        let moduleValue_nets = `\t nets = {\n ${ExRule.EX} \t\t}`;
        let moduleValue_ports = `\t ports = {\n ${ExRule.EX} \t\t}`;

        let previewVariableIpList = '';
        let previewBaribalePortList = '';

        if (moduleValue.type_cd == 'RULES') {
            const rulesetList = moduleValue.value.split(',').map((item: string) => item.trim());
            const rules = `[[\n\t  ${rulesetList.map((item: string) => `\t include ./rules/${item}.rules`).join('\n\t  ')}\n\t\t]], \n`;

            if (rulesetList.length > 0) {
                scanVariables = await scanVariableByRuleset(moduleValue);

                for (const variable of scanVariables) {
                    if (variable.type_cd == 'IP') {
                        previewVariableIpList += `\t\t\t${variable.key} = ${variable.key}, \n`;
                    }
                    if (variable.type_cd == 'PORT') {
                        previewBaribalePortList += `\t\t\t${variable.key} = ${variable.key}, \n`;
                    }
                }

                moduleValue_nets =
                    previewVariableIpList != ''
                        ? '\t' + moduleValue_nets.replace(ExRule.EX, `${previewVariableIpList}`)
                        : '';
                moduleValue_ports =
                    previewBaribalePortList != ''
                        ? '\t' + moduleValue_ports.replace(ExRule.EX, previewBaribalePortList)
                        : '';

                moduleValue_variable = moduleValue_variable.replace(
                    ExRule.EX,
                    `${moduleValue_nets}, \n ${moduleValue_ports}`
                );
            }
            if (scanVariables.length > 0) {
                return resolve(`\n\t  ${item.replace(ExRule.EX, `${rules} ${moduleValue_variable}`)},`);
            } else {
                return resolve(`\n\t  ${item.replace(ExRule.EX, `${rules}`)} \n`);
            }
        }
        return resolve(`\n\t  ${item.replace(ExRule.EX, moduleValue.value.toLowerCase())},`);
    });
}

async function processModule(module: any, moduleCodesMap: Map<string, { item5: string }>): Promise<string> {
    return new Promise<string>(async (resolve) => {
        let appendString = '';
        for (const moduleValue of module.module_value_list) {
            let item: string = moduleCodesMap.get(moduleValue.type_cd)?.item5 as string;
            switch (module.type_cd) {
                case 'REPUTATION':
                    appendString += handleReputationModule(moduleValue, item);
                    break;
                case 'ARP_SPOOF':
                    appendString += handleArpSpoofModule(moduleValue, item);
                    break;
                case 'IPS':
                    appendString += await handleIpsModule(moduleValue, item);
                    break;
                default:
                    appendString += exChangeValue(moduleValue, item);

                    break;
            }
        }
        return resolve(appendString);
    });
}

async function scanVariableByRuleset(moduleValue: any): Promise<VariableDTO[]> {
    return new Promise<VariableDTO[]>(async (resolve) => {
        const uniqueArray: VariableDTO[] = [];
        const variables = await variableService.allVariable();
        const rulesetsList = moduleValue.value.split(',').map((item: string) => item.trim());

        for (const title of rulesetsList) {
            const searchDTO = plainToInstance(SearchRulesetDTO, { title: title } as SearchRulesetDTO, {
                excludeExtraneousValues: true
            });

            const rulesets = await rulesetService.list(searchDTO);
            for (const ruleset of rulesets) {
                const rulesetText = await rulesetService.detailAsText(ruleset.id);

                for (const variable of variables) {
                    if (rulesetText.includes(variable.key) == true) {
                        uniqueArray.push(variable as VariableDTO);
                    }
                }
            }
        }

        //Array클래스에서 Set을 사용하여 중복된값을 제거하고 반환
        return resolve(Array.from(new Set(uniqueArray)));
    });
}

export async function doExport(policyExportDTO: PolicyExportDTO): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
        let modulesPreview: string = '';
        for (const [key, value] of policyExportDTO.modulePrevObj!) {
            modulesPreview += `${value} \n`;
        }

        const policyDirectory = path.join(
            policyExportDTO.selectedFolderPath!,
            `${policyExportDTO.policyTitle}-${uuidv4()}`
        );
        await fs.promises.mkdir(policyDirectory, { recursive: true });
        const luaFilePath = path.join(policyDirectory, `${policyExportDTO.policyTitle}.lua`);
        await fs.promises.writeFile(luaFilePath, `${policyExportDTO.variablePreview}\n ${modulesPreview}`, 'utf8');

        if (policyExportDTO.rulesList!.size > 0) {
            const rulesFolderPath = path.join(policyDirectory, 'rules');
            await fs.promises.mkdir(rulesFolderPath, { recursive: true });
            for (const [key, value] of policyExportDTO.rulesList!) {
                const ruleFilePath = path.join(rulesFolderPath, `${key}.rules`);
                await fs.promises.writeFile(ruleFilePath, value, 'utf8');
            }
        }

        const blocklistFilePath = path.join(policyDirectory, 'iplists');
        await fs.promises.mkdir(blocklistFilePath, { recursive: true });

        await fs.promises.writeFile(`${blocklistFilePath}/blocklist.blf`, policyExportDTO.blocklist.join('\n'), 'utf8');
        await fs.promises.writeFile(`${blocklistFilePath}/allowlist.wlf`, policyExportDTO.allowlist.join('\n'), 'utf8');

        return resolve(true);
    });
}

export async function getPreview(modules: ModuleDTO[]): Promise<PolicyExportDTO> {
    return new Promise<PolicyExportDTO>(async (resolve) => {
        let previewBlocklist: string[] = [];
        let previewAllowlist: string[] = [];
        let previewRulesList = new Map<string, string>();
        let previewModule = new Map<string, string>();
        let previewVariable: string = '';

        const moduleCodesMap = await getCommonCodes();
        const commonCodeModule = await mngCodeService.getList({ grp_cd: 'CMM300' } as SearchMngCodeDTO);
        const moduleTypes = await getModuleTypes(modules);

        //get variable preview
        const ipsModule = moduleTypes.get('IPS');
        let scanVariables: VariableDTO[] = [];

        if (ipsModule != undefined && ipsModule != null) {
            const filterData = ipsModule.module_value_list.filter((item: any) => item.type_cd == 'RULES');
            scanVariables = await scanVariableByRuleset(filterData[0]);

            for (const variable of scanVariables) {
                if (variable != undefined) {
                    previewVariable += `${variable.key} = '${variable.value}'\n`;
                }
            }

            const rulesetsList = filterData[0].value.split(',').map((item: string) => item.trim());
            for (const title of rulesetsList) {
                const searchDTO = plainToInstance(SearchRulesetDTO, { title: title } as SearchRulesetDTO, {
                    excludeExtraneousValues: true
                });

                const rulesets = await rulesetService.list(searchDTO);
                for (const ruleset of rulesets) {
                    previewRulesList.set(ruleset.title, await rulesetService.detailAsText(ruleset.id));
                }
            }
        }

        //get block/allow list preview
        const reputationModule = moduleTypes.get('REPUTATION');
        if (reputationModule != undefined && reputationModule != null) {
            const filterBlocklistData = reputationModule.module_value_list.filter(
                (item: any) => item.type_cd == 'BLOCKLIST'
            );
            const filterAllowlistData = reputationModule.module_value_list.filter(
                (item: any) => item.type_cd == 'ALLOWLIST'
            );

            previewBlocklist = filterBlocklistData[0].value.split(',').map((item: string) => item.trim());
            previewAllowlist = filterAllowlistData[0].value.split(',').map((item: string) => item.trim());
        }

        //get module preview
        for (const moduleCode of commonCodeModule) {
            const codeString: any = moduleCodesMap.get(moduleCode.cd_nm)?.item5;
            const module: any = moduleTypes.get(moduleCode.cd_nm);

            if (module != undefined && module.module_value_list != undefined) {
                const appendString = await processModule(module, moduleCodesMap);
                previewModule.set(module.type_cd!, `${codeString.replace(ExRule.EX, `${appendString}\n`)} \n\n`);
            }
        }

        const policyExportDTO: PolicyExportDTO = {
            modulePrevObj: previewModule,
            variablePreview: previewVariable,
            allowlist: previewAllowlist,
            blocklist: previewBlocklist,
            rulesList: previewRulesList
        };

        return resolve(policyExportDTO);
    });
}
