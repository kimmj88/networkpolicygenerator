import { Expose } from 'class-transformer';

export interface IRuleNonPayloadDTO {
    id?: number;
    rule_id?: number;
    fragoffset?: string;
    ttl?: string;
    tos?: string;
    ip_header_id?: string;
    ipopts?: string;
    fragbits?: string;
    ip_proto?: string;
    flags?: string;
    seq?: string;
    ack?: string;
    window?: string;
    stream_reassemble?: string;
    stream_size?: string;
    flow?: string;
    flowbits?: string;
    itype?: string;
    icode?: string;
    icmp_id?: string;
    icmp_seq?: string;
}

@Expose()
export class RuleNonPayloadDTO {
    @Expose()
    id?: number;
    @Expose()
    fragoffset?: string;
    @Expose()
    ttl?: string;
    @Expose()
    tos?: string;
    @Expose()
    ip_header_id?: string;
    @Expose()
    ipopts?: string;
    @Expose()
    fragbits?: string;
    @Expose()
    ip_proto?: string;
    @Expose()
    flags?: string;
    @Expose()
    seq?: string;
    @Expose()
    ack?: string;
    @Expose()
    window?: string;
    @Expose()
    stream_reassemble?: string;
    @Expose()
    stream_size?: string;
    @Expose()
    flow?: string;
    @Expose()
    flowbits?: string;
    @Expose()
    itype?: string;
    @Expose()
    icode?: string;
    @Expose()
    icmp_id?: string;
    @Expose()
    icmp_seq?: string;

    constructor(
        id?: number,
        fragoffset?: string,
        ttl?: string,
        tos?: string,
        ip_header_id?: string,
        ipopts?: string,
        fragbits?: string,
        ip_proto?: string,
        flags?: string,
        seq?: string,
        ack?: string,
        window?: string,
        stream_reassemble?: string,
        stream_size?: string,
        flow?: string,
        flowbits?: string,
        itype?: string,
        icode?: string,
        icmp_id?: string,
        icmp_seq?: string
    ) {
        this.id = id;
        this.fragoffset = fragoffset;
        this.ttl = ttl;
        this.tos = tos;
        this.ip_header_id = ip_header_id;
        this.ipopts = ipopts;
        this.fragbits = fragbits;
        this.ip_proto = ip_proto;
        this.flags = flags;
        this.seq = seq;
        this.ack = ack;
        this.window = window;
        this.stream_reassemble = stream_reassemble;
        this.stream_size = stream_size;
        this.flow = flow;
        this.flowbits = flowbits;
        this.itype = itype;
        this.icode = icode;
        this.icmp_id = icmp_id;
        this.icmp_seq = icmp_seq;
    }
}

@Expose()
export class CreateRuleNonPayloadDTO {
    @Expose()
    fragoffset?: string;
    @Expose()
    ttl?: string;
    @Expose()
    tos?: string;
    @Expose()
    ip_header_id?: string;
    @Expose()
    ipopts?: string;
    @Expose()
    fragbits?: string;
    @Expose()
    ip_proto?: string;
    @Expose()
    flags?: string;
    @Expose()
    seq?: string;
    @Expose()
    ack?: string;
    @Expose()
    window?: string;
    @Expose()
    stream_reassemble?: string;
    @Expose()
    stream_size?: string;
    @Expose()
    flow?: string;
    @Expose()
    flowbits?: string;
    @Expose()
    itype?: string;
    @Expose()
    icode?: string;
    @Expose()
    icmp_id?: string;
    @Expose()
    icmp_seq?: string;

    constructor(
        fragoffset?: string,
        ttl?: string,
        tos?: string,
        ip_header_id?: string,
        ipopts?: string,
        fragbits?: string,
        ip_proto?: string,
        flags?: string,
        seq?: string,
        ack?: string,
        window?: string,
        stream_reassemble?: string,
        stream_size?: string,
        flow?: string,
        flowbits?: string,
        itype?: string,
        icode?: string,
        icmp_id?: string,
        icmp_seq?: string
    ) {
        this.fragoffset = fragoffset;
        this.ttl = ttl;
        this.tos = tos;
        this.ip_header_id = ip_header_id;
        this.ipopts = ipopts;
        this.fragbits = fragbits;
        this.ip_proto = ip_proto;
        this.flags = flags;
        this.seq = seq;
        this.ack = ack;
        this.window = window;
        this.stream_reassemble = stream_reassemble;
        this.stream_size = stream_size;
        this.flow = flow;
        this.flowbits = flowbits;
        this.itype = itype;
        this.icode = icode;
        this.icmp_id = icmp_id;
        this.icmp_seq = icmp_seq;
    }
}
@Expose()
export class UpdateRuleNonPayloadDTO {
    @Expose()
    id?: number;
    @Expose()
    fragoffset?: string;
    @Expose()
    ttl?: string;
    @Expose()
    tos?: string;
    @Expose()
    ip_header_id?: string;
    @Expose()
    ipopts?: string;
    @Expose()
    fragbits?: string;
    @Expose()
    ip_proto?: string;
    @Expose()
    flags?: string;
    @Expose()
    seq?: string;
    @Expose()
    ack?: string;
    @Expose()
    window?: string;
    @Expose()
    stream_reassemble?: string;
    @Expose()
    stream_size?: string;
    @Expose()
    flow?: string;
    @Expose()
    flowbits?: string;
    @Expose()
    itype?: string;
    @Expose()
    icode?: string;
    @Expose()
    icmp_id?: string;
    @Expose()
    icmp_seq?: string;

    constructor(
        id?: number,
        fragoffset?: string,
        ttl?: string,
        tos?: string,
        ip_header_id?: string,
        ipopts?: string,
        fragbits?: string,
        ip_proto?: string,
        flags?: string,
        seq?: string,
        ack?: string,
        window?: string,
        stream_reassemble?: string,
        stream_size?: string,
        flow?: string,
        flowbits?: string,
        itype?: string,
        icode?: string,
        icmp_id?: string,
        icmp_seq?: string
    ) {
        this.id = id;
        this.fragoffset = fragoffset;
        this.ttl = ttl;
        this.tos = tos;
        this.ip_header_id = ip_header_id;
        this.ipopts = ipopts;
        this.fragbits = fragbits;
        this.ip_proto = ip_proto;
        this.flags = flags;
        this.seq = seq;
        this.ack = ack;
        this.window = window;
        this.stream_reassemble = stream_reassemble;
        this.stream_size = stream_size;
        this.flow = flow;
        this.flowbits = flowbits;
        this.itype = itype;
        this.icode = icode;
        this.icmp_id = icmp_id;
        this.icmp_seq = icmp_seq;
    }
}
