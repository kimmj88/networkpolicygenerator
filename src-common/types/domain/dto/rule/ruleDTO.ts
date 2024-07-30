import { ISearchDomain, SearchDomain } from '@cm/domain/common/SearchDomain';
import { Exclude, Expose, Type } from 'class-transformer';
import {
    CreateRuleDetectionFilterDTO,
    IRuleDetectionFilterDTO,
    RuleDetectionFilterDTO,
    UpdateRuleDetectionFilterDTO
} from './ruleDetectionFilterDTO';
import { CreateRuleHeaderDTO, IRuleHeaderDTO, RuleHeaderDTO, UpdateRuleHeaderDTO } from './ruleHeaderDTO';
import {
    CreateRuleNonPayloadDTO,
    IRuleNonPayloadDTO,
    RuleNonPayloadDTO,
    UpdateRuleNonPayloadDTO
} from './ruleNonPayloadDTO';
import { CreateRulePayloadDTO, IRulePayloadDTO, RulePayloadDTO, UpdateRulePayloadDTO } from './rulePlayloadDTO';

export interface IRuleDTO {
    id?: number;
    title?: string;
    action?: string;
    msg?: string;
    sid?: number;
    rev?: number;
    gid?: number | null;
    create_time?: Date | string;
    modify_time?: Date | string;
    rule_header?: IRuleHeaderDTO;
    rule_payload?: IRulePayloadDTO;
    rule_non_payload?: IRuleNonPayloadDTO;
    rule_detection_filter?: IRuleDetectionFilterDTO;
}

export interface ISearchRuleDTO extends ISearchDomain {
    id?: number;
    title?: string;
    action?: string;
    protocol?: string;
    source_address?: string;
    source_port?: string;
    direction_operator?: string;
    dest_address?: string;
    dest_port?: string;
}
@Exclude()
export class RuleDTO implements IRuleDTO {
    @Expose()
    id?: number;
    @Expose()
    title: string;
    @Expose()
    action: string;
    @Expose()
    msg: string;
    @Expose()
    sid: number;
    @Expose()
    rev: number;
    @Expose()
    gid?: number | null;
    @Expose()
    create_time?: Date | string;
    @Expose()
    modify_time?: Date | string;
    @Expose()
    rule_header?: RuleHeaderDTO;
    @Expose()
    rule_payload?: RulePayloadDTO;
    @Expose()
    rule_non_payload?: RuleNonPayloadDTO;
    @Expose()
    rule_detection_filter?: RuleDetectionFilterDTO;

    constructor(
        id: number,
        title: string,
        action: string,
        msg: string,
        sid: number,
        rev: number,
        gid?: number | null,
        create_time?: Date | string,
        modify_time?: Date | string,
        rule_header?: RuleHeaderDTO,
        rule_payload?: RulePayloadDTO,
        rule_non_payload?: RuleNonPayloadDTO,
        rule_detection_filter?: RuleDetectionFilterDTO
    ) {
        this.id = id;
        this.title = title;
        this.action = action;
        this.msg = msg;
        this.sid = sid;
        this.rev = rev;
        this.gid = gid ?? null;
        this.create_time = create_time;
        this.modify_time = modify_time;
        this.rule_header = rule_header;
        this.rule_payload = rule_payload;
        this.rule_non_payload = rule_non_payload;
        this.rule_detection_filter = rule_detection_filter;
    }
}

@Exclude()
export class CreateRuleDTO {
    @Expose()
    title: string;
    @Expose()
    action: string;
    @Expose()
    msg: string;
    @Expose()
    sid: number;
    @Expose()
    rev: number;
    @Expose()
    gid?: number | null;
    @Expose()
    rule_header?: CreateRuleHeaderDTO;
    @Expose()
    rule_payload?: CreateRulePayloadDTO;
    @Expose()
    rule_non_payload?: CreateRuleNonPayloadDTO;
    @Expose()
    rule_detection_filter?: CreateRuleDetectionFilterDTO;

    constructor(
        title: string,
        action: string,
        msg: string,
        sid: number,
        rev: number,
        gid?: number | null,
        rule_header?: CreateRuleHeaderDTO,
        rule_payload?: CreateRulePayloadDTO,
        rule_non_payload?: CreateRuleNonPayloadDTO,
        rule_detection_filter?: CreateRuleDetectionFilterDTO
    ) {
        this.title = title;
        this.action = action;
        this.msg = msg;
        this.sid = sid;
        this.rev = rev;
        this.gid = gid ?? null;
        this.rule_header = rule_header;
        this.rule_payload = rule_payload;
        this.rule_non_payload = rule_non_payload;
        this.rule_detection_filter = rule_detection_filter;
    }
}

@Exclude()
export class UpdateRuleDTO {
    @Expose()
    id: number;
    @Expose()
    title?: string;
    @Expose()
    action?: string;
    @Expose()
    msg?: string;
    @Expose()
    sid?: number;
    @Expose()
    rev?: number;
    @Expose()
    gid?: number | null;
    @Expose()
    @Type(() => UpdateRuleHeaderDTO)
    rule_header?: UpdateRuleHeaderDTO;
    @Expose()
    @Type(() => UpdateRulePayloadDTO)
    rule_payload?: UpdateRulePayloadDTO;
    @Expose()
    @Type(() => UpdateRuleNonPayloadDTO)
    rule_non_payload?: UpdateRuleNonPayloadDTO;
    @Expose()
    @Type(() => UpdateRuleDetectionFilterDTO)
    rule_detection_filter?: UpdateRuleDetectionFilterDTO;

    constructor(
        id: number,
        title?: string,
        action?: string,
        msg?: string,
        sid?: number,
        rev?: number,
        gid?: number | null,
        rule_header?: UpdateRuleHeaderDTO,
        rule_payload?: UpdateRulePayloadDTO,
        rule_non_payload?: UpdateRuleNonPayloadDTO,
        rule_detection_filter?: UpdateRuleDetectionFilterDTO
    ) {
        this.id = id;
        this.title = title;
        this.action = action;
        this.msg = msg;
        this.sid = sid;
        this.rev = rev;
        this.gid = gid ?? null;
        this.rule_header = rule_header;
        this.rule_payload = rule_payload;
        this.rule_non_payload = rule_non_payload;
        this.rule_detection_filter = rule_detection_filter;
    }
}

@Exclude()
export class DeleteRuleDTO {
    @Expose()
    id!: number;
    @Expose()
    title?: string;
}

@Exclude()
export class SearchRuleDTO extends SearchDomain {
    @Expose()
    id?: number;
    @Expose()
    title?: string;
    @Expose()
    action?: string;
    @Expose()
    protocol?: string;
    @Expose()
    source_address?: string;
    @Expose()
    source_port?: string;
    @Expose()
    direction_operator?: string;
    @Expose()
    dest_address?: string;
    @Expose()
    dest_port?: string;

    constructor(
        /**
         * SearchDomain 필드값
         */
        paging: string,
        page_per_data: number,
        page: number,
        sort: string,
        create_time_from?: Date | string,
        create_time_to?: Date | string,

        /**
         * optional field
         */
        id?: number,
        title?: string,
        action?: string,
        protocol?: string,
        source_address?: string,
        source_port?: string,
        direction_operator?: string,
        dest_address?: string,
        dest_port?: string
    ) {
        super(paging, page_per_data, page, sort, create_time_from, create_time_to);
        this.id = id;
        this.title = title;
        this.action = action;
        this.protocol = protocol;
        this.source_address = source_address;
        this.source_port = source_port;
        this.direction_operator = direction_operator;
        this.dest_address = dest_address;
        this.dest_port = dest_port;
    }
}

// export interface SearchRuleDTO{
//     title?: string;
//     action?: string;
//     msg?: string;
//     sid?: number;
//     rev?: number;
//     gid?: number | null;
//     create_time_from?: Date | string;
//     create_time_to?: Date | string;

//     paging: string;
//     page_per_data: number;
//     page: number;
//     sort: string;
// }

// export interface CreateRuleDTO {
//     title: string;
//     action: string;
//     msg: string;
//     sid: number;
//     rev: number;
//     gid?: number | null;
//     create_time?: Date | string;
//     modify_time?: Date | string;
//     ruleset?: Prisma.RulesetCreateNestedOneWithoutRulesInput;
//     rule_header?: Prisma.RuleHeaderCreateNestedOneWithoutRuleInput;
//     rule_payload?: Prisma.RulePayloadCreateNestedOneWithoutRuleInput;
//     rule_non_payload?: Prisma.RuleNonPayloadCreateNestedOneWithoutRuleInput;
//     rule_detection_filter?: Prisma.RuleDetectionFilterCreateNestedOneWithoutRuleInput;
// }

// export interface RuleResDTO {
//     title: string;
//     action: string;
//     msg: string;
//     sid: number;
//     rev: number;
//     gid?: number | null;
//     create_time?: Date | string;
//     modify_time?: Date | string;
//     rule_header: Prisma.RuleHeaderCreateNestedOneWithoutRuleInput | null;
//     rule_payload: Prisma.RulePayloadCreateNestedOneWithoutRuleInput | null;
//     rule_non_payload: Prisma.RuleNonPayloadCreateNestedOneWithoutRuleInput| null;
//     rule_detection_filter: Prisma.RuleDetectionFilterCreateNestedOneWithoutRuleInput | null;
// }
