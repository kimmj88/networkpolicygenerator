import 'reflect-metadata';

import prisma from '@be/database/prismaClient';
import * as ruleService from '@be/service/rule/ruleService';
import { IRuleDTO, UpdateRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { IRulePayloadDTO } from '@cm/types/domain/dto/rule/rulePlayloadDTO';
import {
    convertRuleObjectToSnortRule,
    getNonPayloadText,
    getPayloadText,
    getRuleBodyText
} from '@cm/utils/ConvertUtil';
import { plainToClass } from 'class-transformer';

const DUMMY_RULE_TITLE1 = 'DUMMY_RULE_TITLE_1';
const DUMMY_ACTION = 'DUMMY_ACTION';
const DUMMY_MSG = 'SOME DUMMY RULE MSG';
const SID_1 = 1000000;
const GID_1 = 123;
let DUMMY_DETECTION_FILTER = {
    track: 'by_src',
    count: 5,
    seconds: 60
};
let DUMMY_RULE_WITHOUT_PAYLOAD = {
    title: DUMMY_RULE_TITLE1,
    action: DUMMY_ACTION,
    msg: DUMMY_MSG,
    sid: SID_1,
    rev: 1,
    gid: GID_1,
    rule_header: {
        protocol: 'tcp',
        source_address: 'any',
        source_port: 'any',
        direction_operator: '->',
        dest_address: 'any',
        dest_port: '80'
    },
    rule_non_payload: {
        fragoffset: '0',
        ttl: '64',
        tos: '0x10',
        ip_header_id: '0',
        ipopts: '0',
        fragbits: 'M',
        ip_proto: 'TCP',
        flags: 'A',
        seq: '0',
        ack: '0',
        window: '0',
        stream_reassemble: 'no',
        stream_size: '0',
        flow: 'established',
        flowbits: 'noalert',
        itype: '0',
        icode: '0',
        icmp_id: '0',
        icmp_seq: '0'
    },
    rule_detection_filter: DUMMY_DETECTION_FILTER
};
let DUMMY_RULE_WITH_PAYLOAD = {
    title: 'Rule1',
    action: 'alert',
    msg: 'Message 1',
    sid: 1000000,
    rev: 1,
    gid: 123,
    rule_header: {
        protocol: 'tcp',
        source_address: 'any',
        source_port: 'any',
        direction_operator: '->',
        dest_address: 'any',
        dest_port: '80'
    },
    rule_payload: {
        content: 'Sample content',
        pcre: 'Sample pcre',
        fast_pattern: 'fast_pattern',
        nocase: true,
        offset: 0,
        depth: 1,
        distance: 0,
        within: 1
    },
    rule_non_payload: {
        fragoffset: '0',
        ttl: '64',
        tos: '0x10',
        ip_header_id: '0',
        ipopts: '0',
        fragbits: 'M',
        ip_proto: 'TCP',
        flags: 'A',
        seq: '0',
        ack: '0',
        window: '0',
        stream_reassemble: 'no',
        stream_size: '0',
        flow: 'established',
        itype: '0',
        icode: '0',
        icmp_id: '0',
        icmp_seq: '0'
    },
    rule_detection_filter: {
        track: 'by_src',
        count: 5,
        seconds: 60
    }
};
let DUMMY_RULE_WITH_MULTIPLE_ADDRESS = {
    title: 'Rule1',
    action: 'alert',
    msg: 'Message 1',
    sid: 1000000,
    rev: 1,
    gid: 123,
    rule_header: {
        protocol: 'tcp',
        source_address: '[$HOME_NET1, $HOME_NET2, 192.168.32.0/24]',
        source_port: '[$HOME_PORT1, $HOME_PORT2, 500:]',
        direction_operator: '->',
        dest_address: 'any',
        dest_port: '80'
    },
    rule_payload: {
        content: 'Sample content',
        pcre: 'Sample pcre',
        fast_pattern: 'fast_pattern',
        nocase: true,
        offset: 0,
        depth: 1,
        distance: 0,
        within: 1
    },
    rule_non_payload: {
        fragoffset: '0',
        ttl: '64',
        tos: '0x10',
        ip_header_id: '0',
        ipopts: '0',
        fragbits: 'M',
        ip_proto: 'TCP',
        flags: 'A',
        seq: '0',
        ack: '0',
        window: '0',
        stream_reassemble: 'no',
        stream_size: '0',
        flow: 'established',
        itype: '0',
        icode: '0',
        icmp_id: '0',
        icmp_seq: '0'
    },
    rule_detection_filter: {
        track: 'by_src',
        count: 5,
        seconds: 60
    }
};
beforeAll(async () => {
    await prisma.ruleset.deleteMany();
    await prisma.rule.deleteMany();
});

afterEach(async () => {
    await prisma.ruleset.deleteMany();
    await prisma.rule.deleteMany();
});

test('Create Test', async () => {
    //given
    //when
    const result = await ruleService.insertData(DUMMY_RULE_WITHOUT_PAYLOAD);
    //then
    const found = await ruleService.detail(result.id);
    expect(found?.title).toBe(DUMMY_RULE_TITLE1);
    expect(found?.action).toBe(DUMMY_ACTION);
    expect(found?.msg).toBe(DUMMY_MSG);
    expect(found?.sid).toBe(SID_1);
    expect(found?.gid).toBe(GID_1);
});

test('Update Test', async () => {
    //given
    const insertResult = await ruleService.insertData(DUMMY_RULE_WITHOUT_PAYLOAD);
    const UPDATE_TITLE = 'UPDATED_RULE_TITLE';
    const DUMMY_CONTENT = 'NEW_PAYLOAD_CONTENT';
    const DUMMY_PCRE = 'DUMMY_PCRE';
    const DUMMY_NOCASE = false;
    const DUMMY_PAYLOAD = {
        rule_id: 4,
        content: DUMMY_CONTENT,
        pcre: DUMMY_PCRE,
        fast_pattern: 'Sample fast pattern',
        nocase: DUMMY_NOCASE,
        offset: 0,
        depth: 1,
        distance: 0,
        within: 1
    };
    const UPDATED_SECONDS = 6000;

    const found = await ruleService.detail(insertResult.id);

    /**
     * update Process
     * 1. Rule Title 업데이트
     * 2. 기존의 Rule(rule_header, rule_non_payload, rule_detection_filter 만 존재)에 rule_payload 추가
     * 3. 기존 Rule의 detection_filter 값 수정
     * 4. 기존 Rule에서 rule_header 제거
     */
    const updateTargetRule = plainToClass(UpdateRuleDTO, found, { excludeExtraneousValues: true });
    //1.
    updateTargetRule.title = UPDATE_TITLE;
    //2.
    updateTargetRule.rule_payload = DUMMY_PAYLOAD;
    //3.
    if (updateTargetRule.rule_detection_filter) {
        updateTargetRule.rule_detection_filter.seconds = UPDATED_SECONDS;
    }
    //4.
    updateTargetRule.rule_header = undefined;

    //when
    const result = await ruleService.updateData(updateTargetRule);

    /**
     * then
     */

    //1.
    expect(result.title).toBe(UPDATE_TITLE);
    //2. payload 추가
    expect(result.rule_payload?.content).toBe(DUMMY_CONTENT);
    expect(result.rule_payload?.pcre).toBe(DUMMY_PCRE);
    expect(result.rule_payload?.nocase).toBe(DUMMY_NOCASE);
    //3. detection_filter 필드 수정
    expect(result.rule_detection_filter?.seconds).toBe(UPDATED_SECONDS);
    //4. rule_header 제거
    expect(result.rule_header).toBeNull();
});

test('Update Test', async () => {
    //given
    const insertResult = await ruleService.insertData(DUMMY_RULE_WITHOUT_PAYLOAD);
    const UPDATE_TITLE = 'UPDATED_RULE_TITLE';
    const DUMMY_CONTENT = 'NEW_PAYLOAD_CONTENT';
    const DUMMY_PCRE = 'DUMMY_PCRE';
    const DUMMY_NOCASE = false;
    const DUMMY_PAYLOAD = {
        rule_id: 4,
        content: DUMMY_CONTENT,
        pcre: DUMMY_PCRE,
        fast_pattern: 'Sample fast pattern',
        nocase: DUMMY_NOCASE,
        offset: 0,
        depth: 1,
        distance: 0,
        within: 1
    };
    const UPDATED_SECONDS = 6000;

    const found = await ruleService.detail(insertResult.id);

    const updateTargetRule = plainToClass(UpdateRuleDTO, found, { excludeExtraneousValues: true });
    updateTargetRule.title = UPDATE_TITLE;

    //when
    const result = await ruleService.updateData(updateTargetRule);

    //then
    expect(result.title).toBe(UPDATE_TITLE);
});

test('obj to string test', async () => {
    //given
    const result = await ruleService.insertData(DUMMY_RULE_WITH_PAYLOAD);
    const found = await ruleService.detail(result.id);

    const payload = found?.rule_payload as IRulePayloadDTO;
    if (payload) {
        const payloadString = getPayloadText(payload);
        const expectedResult = 'content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre";';
        expect(payloadString).toBe(expectedResult);
    }
});
test('nonPayload obj to string test', async () => {
    //given
    const result = await ruleService.insertData(DUMMY_RULE_WITH_PAYLOAD);
    const found = await ruleService.detail(result.id);

    const nonPayload = found?.rule_non_payload as IRulePayloadDTO;
    if (nonPayload) {
        const nonPayloadString = getNonPayloadText(nonPayload);
        const expectedResult =
            'fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; itype:0; icode:0; icmp_id:0; icmp_seq:0;';
        expect(nonPayloadString).toBe(expectedResult);
    }
});

test('body obj to string test', async () => {
    //given
    const result = await ruleService.insertData(DUMMY_RULE_WITH_PAYLOAD);
    const found = await ruleService.detail(result.id);

    const ruleDTO = found as IRuleDTO;
    if (ruleDTO) {
        const ruleDTOString = getRuleBodyText(ruleDTO);
        const expectedResult =
            '(msg:"Message 1"; sid:1000000; sid:1000000; sid:1000000; content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre"; fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; itype:0; icode:0; icmp_id:0; icmp_seq:0;)';
        expect(ruleDTOString).toBe(expectedResult);
    }
});

test('snort obj to string test', async () => {
    //given
    const result = await ruleService.insertData(DUMMY_RULE_WITH_PAYLOAD);
    const found = await ruleService.detail(result.id);

    const ruleDTO = found as IRuleDTO;
    if (ruleDTO) {
        const ruleDTOString = convertRuleObjectToSnortRule(ruleDTO);
        const expectedResult =
            'alert tcp any any -> any 80 (msg:"Message 1"; sid:1000000; sid:1000000; sid:1000000; content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre"; fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; itype:0; icode:0; icmp_id:0; icmp_seq:0;)';
        expect(ruleDTOString).toBe(expectedResult);
    }
});
test('snort obj to string test with multiple address', async () => {
    //given
    const result = await ruleService.insertData(DUMMY_RULE_WITH_MULTIPLE_ADDRESS);
    const found = await ruleService.detail(result.id);

    const ruleDTO = found as IRuleDTO;
    if (ruleDTO) {
        const ruleDTOString = convertRuleObjectToSnortRule(ruleDTO);
        const expectedResult =
            'alert tcp [$HOME_NET1, $HOME_NET2, 192.168.32.0/24] [$HOME_PORT1, $HOME_PORT2, 500:] -> any 80 (msg:"Message 1"; sid:1000000; sid:1000000; sid:1000000; content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre"; fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; itype:0; icode:0; icmp_id:0; icmp_seq:0;)';
        expect(ruleDTOString).toBe(expectedResult);
    }
});
