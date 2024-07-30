import { HTTP_STATUS_CODE, HttpException, PrismaException } from '@be/common/httpException';
import prisma from '@be/database/prismaClient';
import { convertRuleObjectToSnortRule } from '@cm/utils/ConvertUtil';
import { Prisma } from '@prisma/client';
import { PrismaErrorCode } from '@cm/enum/errorCode';

import * as ruleDTO from '@cm/types/domain/dto/rule/ruleDTO';
import * as rulesetDTO from '@cm/types/domain/dto/ruleset/rulesetDTO';

export async function count(searchDTO: rulesetDTO.SearchRulesetDTO) {
    const where = searchDTO.getWhereClause(searchDTO, { title: 'contains' });
    return await prisma.ruleset.count({
        where
    });
}

export async function list(searchDTO: rulesetDTO.SearchRulesetDTO) {
    const where = searchDTO.getWhereClause(searchDTO, { title: 'contains' });
    return await prisma.ruleset.findMany({
        where,
        skip: searchDTO.getSkipNumber(),
        take: searchDTO.page_per_data,
        include: {
            rules: {
                include: {
                    rule: {
                        include: {
                            rule_header: true,
                            rule_payload: true,
                            rule_non_payload: true,
                            rule_detection_filter: true
                        }
                    }
                }
            }
        }
    });
}

export async function insertData(ruleset: rulesetDTO.CreateRulesetDTO) {
    const { rules, ...rulesetWithoutRules } = ruleset;

    try {
        return await prisma.ruleset.create({
            data: {
                ...rulesetWithoutRules,
                rules: {
                    create: rules.map((rule) => {
                        return {
                            rule: {
                                connect: rule.id
                                    ? {
                                          id: rule.id
                                      }
                                    : {
                                          title: rule.title
                                      }
                            }
                        };
                    })
                }
            },
            include: {
                rules: {
                    include: {
                        rule: {
                            include: {
                                rule_header: true,
                                rule_payload: true,
                                rule_non_payload: true,
                                rule_detection_filter: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new PrismaException(409, error.message, error.code, error.meta);
        }
        throw new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string);
    }
}

export async function updateData(ruleset: rulesetDTO.UpdateRulesetDTO) {
    //Rule이 추가되거나 삭제된 것이 있는지 확인하여, 관계테이블에 업데이트.
    const { id: ruleset_id, rules, ...withoutIdRuleset } = ruleset;
    const currrentRules = await prisma.ruleOnRuleset.findMany({
        where: {
            ruleset_id
        }
    });
    const tobeRuleIds = ruleset.rules.map((r) => r.id);
    const currentRuleIds = currrentRules.map((cr) => cr.rule_id);

    const shouldbeAddedIds: number[] = [];
    const shouldbeDeletedIds: number[] = [];

    // id 중복제거를 위해 Set으로 처리
    const allIdSet = new Set([...tobeRuleIds, ...currentRuleIds]);

    allIdSet.forEach((id) => {
        if (tobeRuleIds.includes(id) && !currentRuleIds.includes(id)) {
            //관계 추가되어야 하는 Rule 추가(tobe에 있지만, cur에 없는 경우)
            shouldbeAddedIds.push(id);
        } else if (currentRuleIds.includes(id) && !tobeRuleIds.includes(id)) {
            //관계 삭제되어야 하는 Rule 추가(cur에 있지만, tobe에 없는 경우)
            shouldbeDeletedIds.push(id);
        }
    });

    //관계 삭제되어야 하는 Rule filter후 관계테이블에서 삭제
    await prisma.ruleOnRuleset.deleteMany({
        where: {
            rule_id: {
                in: shouldbeDeletedIds
            }
        }
    });
    //추가 되어야 하는 Rule 관계테이블에 추가
    await prisma.ruleOnRuleset.createMany({
        data: shouldbeAddedIds.map((rule_id) => {
            return { rule_id, ruleset_id };
        })
    });

    //Ruleset의 필드 업데이트
    return await prisma.ruleset.update({
        where: {
            id: ruleset_id
        },
        data: {
            ...withoutIdRuleset
        },
        include: {
            rules: {
                include: {
                    rule: {
                        include: {
                            rule_header: true,
                            rule_payload: true,
                            rule_non_payload: true,
                            rule_detection_filter: true
                        }
                    }
                }
            }
        }
    });
}

export async function deleteData(id: number) {
    return await prisma.ruleset.delete({
        where: {
            id
        }
    });
}

export async function detail(id: number) {
    try {
        return await prisma.ruleset.findUniqueOrThrow({
            where: { id },
            include: {
                rules: {
                    include: {
                        rule: {
                            include: {
                                rule_header: true,
                                rule_payload: true,
                                rule_non_payload: true,
                                rule_detection_filter: true
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === PrismaErrorCode.NotFound) {
                return null;
            }
        }
        throw error;
    }
}

export async function listAll() {
    return await prisma.ruleset.findMany({
        include: {
            rules: {
                include: {
                    rule: {
                        include: {
                            rule_header: true,
                            rule_payload: true,
                            rule_non_payload: true,
                            rule_detection_filter: true
                        }
                    }
                }
            }
        }
    });
}

export async function detailAsText(id: number) {
    const found = await detail(id);

    let str = '';
    if (found && found?.rules) {
        for (const ruleOnRuleset of found.rules) {
            const ruleStr = convertRuleObjectToSnortRule(ruleOnRuleset.rule as ruleDTO.IRuleDTO);
            if (str.length !== 0 && ruleStr.length > 0) str += '\n';
            str += ruleStr;
        }
    }
    return str;
}
