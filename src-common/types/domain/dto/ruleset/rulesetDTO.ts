import { ISearchDomain, SearchDomain } from '@cm/domain/common/SearchDomain';
import { Prisma } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import { IRuleDTO, RuleDTO, UpdateRuleDTO } from '../rule/ruleDTO';

export interface IRulesetDTO {
    id?: number;
    title?: string;
    description?: string;
    rules?: IRuleDTO[];
    create_time?: Date | string;
    modify_time?: Date | string;
}

export interface IRulesetResDTO {
    id?: number;
    title?: string;
    description?: string;
    rules?: IRuleOnRuleset[];
    create_time?: Date | string;
    modify_time?: Date | string;
}

export interface IRuleOnRuleset {
    ruleset?: IRulesetDTO;
    ruleset_id?: number;
    rule?: IRuleDTO;
    rule_id?: number;
}

export interface ISearchRulesetDTO extends ISearchDomain {
    id?: number;
    title?: string;
}

@Exclude()
export class RulesetDTO {
    @Expose()
    id: number;
    @Expose()
    title: string;
    @Expose()
    description?: string;
    @Expose()
    rules: Prisma.RuleOnRulesetUncheckedCreateNestedManyWithoutRulesetInput;
    @Expose()
    create_time?: Date | string;
    @Expose()
    modify_time?: Date | string;

    constructor(
        id: number,
        title: string,
        description: string,
        rules: Prisma.RuleOnRulesetUncheckedCreateNestedManyWithoutRulesetInput,
        create_time?: Date | string,
        modify_time?: Date | string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rules = rules;
        this.create_time = create_time;
        this.modify_time = modify_time;
    }
}
@Exclude()
export class SearchRulesetDTO extends SearchDomain {
    @Expose()
    id?: number;
    @Expose()
    title?: string;

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
        title?: string
    ) {
        super(paging, page_per_data, page, sort, create_time_from, create_time_to);
        this.id = id;
        this.title = title;
    }
}

@Exclude()
export class CreateRulesetDTO {
    @Expose()
    title: string;
    @Expose()
    description?: string;
    @Expose()
    rules: RuleDTO[];
    @Expose()
    create_time?: Date | string;
    @Expose()
    modify_time?: Date | string;

    constructor(
        title: string,
        description: string,
        rules: RuleDTO[],
        create_time?: Date | string,
        modify_time?: Date | string
    ) {
        this.title = title;
        this.description = description;
        this.rules = rules;
        this.create_time = create_time;
        this.modify_time = modify_time;
    }
}

@Exclude()
export class UpdateRulesetDTO {
    @Expose()
    id: number;
    @Expose()
    title?: string;
    @Expose()
    description?: string | null;
    @Expose()
    @Type(() => UpdateRuleDTO)
    rules: UpdateRuleDTO[];
    @Expose()
    create_time?: Date | string;
    @Expose()
    modify_time?: Date | string;

    constructor(
        id: number,
        title: string,
        description: string,
        rules: UpdateRuleDTO[],
        create_time?: Date | string,
        modify_time?: Date | string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rules = rules;
        this.create_time = create_time;
        this.modify_time = modify_time;
    }
}

@Exclude()
export class DeleteRulesetDTO {
    @Expose()
    id!: number;
    @Expose()
    title?: string;
}
