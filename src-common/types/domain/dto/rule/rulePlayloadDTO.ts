import { Expose } from 'class-transformer';

export interface IRulePayloadDTO {
    id?: number;
    rule_id?: number;
    content?: string;
    pcre?: string;
    fast_pattern?: string;
    negation?: boolean;
    nocase?: boolean;
    offset?: number;
    depth?: number;
    distance?: number;
    within?: number;
}

@Expose()
export class RulePayloadDTO {
    @Expose()
    id?: number;
    @Expose()
    content?: string;
    @Expose()
    pcre?: string;
    @Expose()
    fast_pattern?: string;
    @Expose()
    negation?: boolean = false;
    @Expose()
    nocase?: boolean;
    @Expose()
    offset?: number;
    @Expose()
    depth?: number;
    @Expose()
    distance?: number;
    @Expose()
    within?: number;

    constructor(
        id?: number,
        content?: string,
        pcre?: string,
        fast_pattern?: string,
        negation?: boolean,
        nocase?: boolean,
        offset?: number,
        depth?: number,
        distance?: number,
        within?: number
    ) {
        this.id = id;
        this.content = content;
        this.pcre = pcre;
        this.fast_pattern = fast_pattern;
        this.negation = negation;
        this.nocase = nocase;
        this.offset = offset;
        this.depth = depth;
        this.distance = distance;
        this.within = within;
    }
}

@Expose()
export class CreateRulePayloadDTO {
    @Expose()
    content?: string;
    @Expose()
    pcre?: string;
    @Expose()
    fast_pattern?: string;
    @Expose()
    negation?: boolean = false;
    @Expose()
    nocase?: boolean;
    @Expose()
    offset?: number;
    @Expose()
    depth?: number;
    @Expose()
    distance?: number;
    @Expose()
    within?: number;

    constructor(
        content?: string,
        pcre?: string,
        fast_pattern?: string,
        negation?: boolean,
        nocase?: boolean,
        offset?: number,
        depth?: number,
        distance?: number,
        within?: number
    ) {
        this.content = content;
        this.pcre = pcre;
        this.fast_pattern = fast_pattern;
        this.negation = negation;
        this.nocase = nocase;
        this.offset = offset;
        this.depth = depth;
        this.distance = distance;
        this.within = within;
    }
}
@Expose()
export class UpdateRulePayloadDTO {
    @Expose()
    id?: number;
    @Expose()
    content?: string;
    @Expose()
    pcre?: string;
    @Expose()
    fast_pattern?: string;
    @Expose()
    negation?: boolean = false;
    @Expose()
    nocase?: boolean;
    @Expose()
    offset?: number;
    @Expose()
    depth?: number;
    @Expose()
    distance?: number;
    @Expose()
    within?: number;

    constructor(
        id?: number,
        content?: string,
        pcre?: string,
        fast_pattern?: string,
        negation?: boolean,
        nocase?: boolean,
        offset?: number,
        depth?: number,
        distance?: number,
        within?: number
    ) {
        this.id = id;
        this.content = content;
        this.pcre = pcre;
        this.fast_pattern = fast_pattern;
        this.negation = negation;
        this.nocase = nocase;
        this.offset = offset;
        this.depth = depth;
        this.distance = distance;
        this.within = within;
    }
}
