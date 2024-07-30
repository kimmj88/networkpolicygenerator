import { Expose } from 'class-transformer';

export interface IRuleHeaderDTO {
    id?: number;
    rule_id?: number;
    protocol: string;
    source_address: string;
    source_port: string;
    direction_operator: string;
    dest_address: string;
    dest_port: string;
}

@Expose()
export class RuleHeaderDTO {
    @Expose()
    id?: number;
    @Expose()
    protocol: string;
    @Expose()
    source_address: string;
    @Expose()
    source_port: string;
    @Expose()
    direction_operator: string;
    @Expose()
    dest_address: string;
    @Expose()
    dest_port: string;

    constructor(
        id: number,
        protocol: string,
        source_address: string,
        source_port: string,
        direction_operator: string,
        dest_address: string,
        dest_port: string
    ) {
        this.id = id;
        this.protocol = protocol;
        this.source_address = source_address;
        this.source_port = source_port;
        this.direction_operator = direction_operator;
        this.dest_address = dest_address;
        this.dest_port = dest_port;
    }
}

@Expose()
export class CreateRuleHeaderDTO {
    @Expose()
    protocol: string;
    @Expose()
    source_address: string;
    @Expose()
    source_port: string;
    @Expose()
    direction_operator: string;
    @Expose()
    dest_address: string;
    @Expose()
    dest_port: string;

    constructor(
        protocol: string,
        source_address: string,
        source_port: string,
        direction_operator: string,
        dest_address: string,
        dest_port: string
    ) {
        this.protocol = protocol;
        this.source_address = source_address;
        this.source_port = source_port;
        this.direction_operator = direction_operator;
        this.dest_address = dest_address;
        this.dest_port = dest_port;
    }
}
@Expose()
export class UpdateRuleHeaderDTO {
    @Expose()
    id?: number;
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
        id?: number,
        protocol?: string,
        source_address?: string,
        source_port?: string,
        direction_operator?: string,
        dest_address?: string,
        dest_port?: string
    ) {
        this.id = id;
        this.protocol = protocol;
        this.source_address = source_address;
        this.source_port = source_port;
        this.direction_operator = direction_operator;
        this.dest_address = dest_address;
        this.dest_port = dest_port;
    }
}
