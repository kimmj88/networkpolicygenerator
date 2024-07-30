import prisma from '@be/database/prismaClient';
import { CreateRuleDetectionFilterDTO } from '@cm/types/domain/dto/rule/ruleDetectionFilterDTO';
import { CreateRuleHeaderDTO } from '@cm/types/domain/dto/rule/ruleHeaderDTO';
import { CreateRuleNonPayloadDTO } from '@cm/types/domain/dto/rule/ruleNonPayloadDTO';
import { CreateRulePayloadDTO } from '@cm/types/domain/dto/rule/rulePlayloadDTO';
import { plainToClass } from 'class-transformer';

import * as ruleDTO from '@cm/types/domain/dto/rule/ruleDTO';

export async function count(searchDto: ruleDTO.SearchRuleDTO) {
    const where = searchDto.getWhereClause(searchDto, {
        title: 'contains',
        protocol: 'ignore',
        source_address: 'ignore',
        source_port: 'ignore',
        direction_operator: 'ignore',
        dest_address: 'ignore',
        dest_port: 'ignore'
    });
    return await prisma.rule.count({
        where: {
            ...where,
            rule_header: {
                ...getRuleHeaderWhereClause(searchDto)
            }
        }
    });
}

export async function list(searchDto: ruleDTO.SearchRuleDTO) {
    return await prisma.rule.findMany({
        where: {
            title: {
                contains: searchDto.title ?? undefined
            },
            action: {
                contains: searchDto.action ?? undefined
            },
            rule_header: {
                ...getRuleHeaderWhereClause(searchDto)
            }
        },
        skip: searchDto.getSkipNumber(),
        take: searchDto.page_per_data,
        include: {
            rule_header: true,
            rule_non_payload: true,
            rule_payload: true,
            rule_detection_filter: true
        }
    });
}

export async function insertData(rule: ruleDTO.CreateRuleDTO) {
    const { rule_header, rule_payload, rule_non_payload, rule_detection_filter, ...withoutIdRule } = rule;
    return await prisma.rule.create({
        data: {
            ...withoutIdRule,
            rule_header: {
                create: rule_header
            },
            rule_payload: {
                create: rule_payload
            },
            rule_non_payload: {
                create: rule_non_payload
            },
            rule_detection_filter: {
                create: rule_detection_filter
            }
        },
        include: {
            rule_header: true,
            rule_non_payload: true,
            rule_payload: true,
            rule_detection_filter: true
        }
    });
}

/**
 * rule_header, rule_payload, rule_non_payload, rule_detection_filter 데이터를 수정, 추가, 삭제 가능 해야 한다.
 * @param rule
 * @returns
 */
export async function updateData(rule: ruleDTO.UpdateRuleDTO) {
    const { id, rule_header, rule_payload, rule_non_payload, rule_detection_filter, gid, ...withoutIdRule } = rule;
    const { id: rule_header_id, ...ruleHeaderWithoutId } = rule_header || {};
    const { id: rule_payload_id, ...rulePayloadWithoutId } = rule_payload || {};
    const { id: rule_non_payload_id, ...ruleNonPayloadWithoutId } = rule_non_payload || {};
    const { id: rule_detection_filter_id, ...ruleDetectionFieldWithoutId } = rule_detection_filter || {};

    await deleteAllChildRuleTable(rule.id);

    return await prisma.rule.update({
        where: {
            id: rule.id
        },
        data: {
            ...withoutIdRule,
            gid: gid ? gid : null,
            rule_header: !isEmptyObject(ruleHeaderWithoutId)
                ? {
                      create: {
                          ...plainToClass(CreateRuleHeaderDTO, ruleHeaderWithoutId, {
                              excludeExtraneousValues: true
                          })
                      }
                  }
                : undefined,
            rule_payload: !isEmptyObject(rulePayloadWithoutId)
                ? {
                      create: {
                          ...plainToClass(CreateRulePayloadDTO, rulePayloadWithoutId, {
                              excludeExtraneousValues: true
                          })
                      }
                  }
                : undefined,
            rule_non_payload: !isEmptyObject(ruleNonPayloadWithoutId)
                ? {
                      create: {
                          ...plainToClass(CreateRuleNonPayloadDTO, ruleNonPayloadWithoutId, {
                              excludeExtraneousValues: true
                          })
                      }
                  }
                : undefined,
            rule_detection_filter: !isEmptyObject(ruleDetectionFieldWithoutId)
                ? {
                      create: {
                          ...plainToClass(CreateRuleDetectionFilterDTO, ruleDetectionFieldWithoutId, {
                              excludeExtraneousValues: true
                          })
                      }
                  }
                : undefined
        },
        include: {
            rule_header: true,
            rule_non_payload: true,
            rule_payload: true,
            rule_detection_filter: true
        }
    });
}

export async function deleteData(ruleId: number) {
    const result = await prisma.rule.delete({
        where: {
            id: ruleId
        }
    });
    return result;
}

export async function detail(id?: number) {
    if (!id) {
        throw new Error('Id is required field.');
    }
    const found = await prisma.rule.findUnique({
        where: { id },
        include: {
            rule_header: true,
            rule_non_payload: true,
            rule_payload: true,
            rule_detection_filter: true
        }
    });
    return found;
}

export async function getRuleByTitle(title: string) {
    return await prisma.rule.findUnique({
        where: { title },
        include: {
            rule_header: true,
            rule_non_payload: true,
            rule_payload: true,
            rule_detection_filter: true
        }
    });
}

export async function listAll() {
    return await prisma.rule.findMany();
}

function isEmptyObject(obj: Object) {
    return Object.keys(obj).length === 0;
}

async function deleteAllChildRuleTable(rule_id: number) {
    await prisma.ruleHeader.deleteMany({
        where: {
            rule_id
        }
    });

    await prisma.rulePayload.deleteMany({
        where: {
            rule_id
        }
    });
    await prisma.ruleNonPayload.deleteMany({
        where: {
            rule_id
        }
    });
    await prisma.ruleDetectionFilter.deleteMany({
        where: {
            rule_id
        }
    });
    return true;
}

function getRuleHeaderWhereClause(searchDto: ruleDTO.SearchRuleDTO) {
    if (
        !searchDto.protocol &&
        !searchDto.source_address &&
        !searchDto.source_port &&
        !searchDto.direction_operator &&
        !searchDto.dest_address &&
        !searchDto.dest_port
    )
        return undefined;
    return {
        protocol: {
            contains: searchDto.protocol ?? undefined
        },
        source_address: {
            contains: searchDto.source_address ?? undefined
        },
        source_port: {
            contains: searchDto.source_port ?? undefined
        },
        direction_operator: {
            contains: searchDto.direction_operator ?? undefined
        },
        dest_address: {
            contains: searchDto.dest_address ?? undefined
        },
        dest_port: {
            contains: searchDto.dest_port ?? undefined
        }
    };
}
