import prisma from '@be/database/prismaClient';
import * as ruleService from '@be/service/rule/ruleService';
import * as rulesetService from '@be/service/rule/rulesetService';
import { RuleDTO, UpdateRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { UpdateRulesetDTO } from '@cm/types/domain/dto/ruleset/rulesetDTO';
import { plainToClass } from 'class-transformer';
import 'reflect-metadata';

const payloadContent = 'Sample content';
const DUMMY_RULE_TITLE = 'TestRule';
let dummyRules: RuleDTO[];
let dummyRuleset: any;

beforeAll(async () => {
    await prisma.ruleset.deleteMany();
    await prisma.rule.deleteMany();
});

beforeEach(async () => {
    dummyRules = [
        {
            title: DUMMY_RULE_TITLE,
            action: 'alert',
            msg: 'Message 1',
            sid: 1000000,
            rev: 1,
            gid: 123,
            rule_header: {
                protocol: 'TCP',
                source_address: 'any',
                source_port: 'any',
                direction_operator: '->',
                dest_address: 'any',
                dest_port: '80'
            },
            rule_payload: {
                content: 'Sample content',
                pcre: 'Sample pcre',
                fast_pattern: 'Sample fast pattern',
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
                flowbits: 'noalert',
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
        },
        {
            title: 'Rule2',
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
        }
    ];
    dummyRuleset = {
        title: 'TestRuleset',
        description: 'Description for TestRuleset',
        rules: dummyRules
    };
});

afterEach(async () => {
    // Initialize Ruleset Table(Using Casacade Delete to delete all of relative datas.)
    await prisma.ruleset.deleteMany();
    await prisma.rule.deleteMany();
});

test('Create Test', async () => {
    /**
     * given
     * Ruleset 생성은 이미 존재하는 Rule들로 이루어진다.
     */
    const insertedRules = [];
    for (const rule of dummyRules) {
        const inserted = await ruleService.insertData(rule);
        insertedRules.push(inserted);
    }
    //when
    const result = await rulesetService.insertData(dummyRuleset);

    //then
    //Ruleset이 정상적으로 insert된 후 id가 리턴되어야 한다.
    expect(result.id).not.toBeNull();
    expect(result.rules[0].rule.title).toBe(DUMMY_RULE_TITLE);
});

test('Create Test with imperfect Context', async () => {
    /**
     * given
     * Ruleset 생성은 이미 존재하는 Rule들로 이루어진다.
     */
    const DUMMY_PAYLOAD_CONTENT = 'TEST_CONTENT';
    const DUMMY_RULE_FIRST_TITLE = 'FirstTestRuleImperfect';
    const DUMMY_RULE_SECOND_TITLE = 'SecondTestRuleImperfect';
    dummyRules = [
        {
            title: DUMMY_RULE_FIRST_TITLE,
            action: 'alert',
            msg: 'Message 1',
            sid: 1000000,
            rev: 1,
            gid: 123,
            rule_header: {
                protocol: 'TCP',
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
            rule_detection_filter: {
                track: 'by_src',
                count: 5,
                seconds: 60
            }
        },
        {
            title: DUMMY_RULE_SECOND_TITLE,
            action: 'alert',
            msg: 'Message 1',
            sid: 1000000,
            rev: 1,
            gid: 123,
            rule_header: {
                protocol: 'TCP',
                source_address: 'any',
                source_port: 'any',
                direction_operator: '->',
                dest_address: 'any',
                dest_port: '80'
            },
            rule_payload: {
                content: DUMMY_PAYLOAD_CONTENT,
                pcre: 'Sample pcre',
                fast_pattern: 'Sample fast pattern',
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
                flowbits: 'noalert',
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
        }
    ];
    const dummyRuleset = {
        title: 'TestRulese2t',
        description: 'Description for TestRuleset',
        rules: dummyRules
    };
    const insertedRules = [];
    for (const rule of dummyRules) {
        const inserted = await ruleService.insertData(rule);
        insertedRules.push(inserted);
    }

    //when
    const result = await rulesetService.insertData(dummyRuleset);

    //then
    //Ruleset이 정상적으로 insert된 후 id가 리턴되어야 한다.
    expect(result.id).not.toBeNull();

    result.rules.forEach((connectedRule) => {
        if (connectedRule.rule.title === DUMMY_RULE_FIRST_TITLE) {
            //DUMMY_RULE_FIRST_TITLE은 Payload가 없고,
            expect(connectedRule.rule.rule_payload).toBeNull();
        } else if (connectedRule.rule.title === DUMMY_RULE_SECOND_TITLE) {
            //DUMMY_RULE_SECOND_TITLE은 4개 필드가 모두 존재한다.
            expect(connectedRule.rule.rule_header).not.toBeNull();
            expect(connectedRule.rule.rule_payload).not.toBeNull();
            expect(connectedRule.rule.rule_non_payload).not.toBeNull();
            expect(connectedRule.rule.rule_detection_filter).not.toBeNull();
        }
    });
});

test('Update Test', async () => {
    /**
     * given
     * Ruleset 생성은 이미 존재하는 Rule들로 이루어진다.
     */
    const DUMMY_PAYLOAD_CONTENT = 'TEST_CONTENT';
    const DUMMY_RULE_FIRST_TITLE = 'FirstTestRuleImperfect';
    const FIRST_SID = 1000000;
    const DUMMY_RULE_SECOND_TITLE = 'SecondTestRuleImperfect';
    const SEC_SID = 1000001;
    const DUMMY_RULE_THIRD_TITLE = 'ThirdTestRuleImperfect';
    const THIRD_SID = 1000002;
    const THIRD_PAYLOAD_CONTENT = 'THIRD_TEST_CONTENT';
    const FIRST_DUMMY_RULE = {
        title: DUMMY_RULE_FIRST_TITLE,
        action: 'alert',
        msg: 'Message 1',
        sid: FIRST_SID,
        rev: 1,
        gid: 123,
        rule_header: {
            protocol: 'TCP',
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
        rule_detection_filter: {
            track: 'by_src',
            count: 5,
            seconds: 60
        }
    };
    const SEC_DUMMY_RULE = {
        title: DUMMY_RULE_SECOND_TITLE,
        action: 'alert',
        msg: 'Message 1',
        sid: SEC_SID,
        rev: 1,
        gid: 123,
        rule_header: {
            protocol: 'TCP',
            source_address: 'any',
            source_port: 'any',
            direction_operator: '->',
            dest_address: 'any',
            dest_port: '80'
        },
        rule_payload: {
            content: DUMMY_PAYLOAD_CONTENT,
            pcre: 'Sample pcre',
            fast_pattern: 'Sample fast pattern',
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
            flowbits: 'noalert',
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
    const THIRD_DUMMY_RULE = {
        title: DUMMY_RULE_THIRD_TITLE,
        action: 'alert',
        msg: 'Message 1',
        sid: THIRD_SID,
        rev: 1,
        gid: 123,
        rule_header: {
            protocol: 'TCP',
            source_address: 'any',
            source_port: 'any',
            direction_operator: '->',
            dest_address: 'any',
            dest_port: '80'
        },
        rule_payload: {
            content: THIRD_PAYLOAD_CONTENT,
            pcre: 'Sample pcre',
            fast_pattern: 'Sample fast pattern',
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
            flowbits: 'noalert',
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
    dummyRules = [FIRST_DUMMY_RULE, SEC_DUMMY_RULE];

    const dummyRuleset = {
        title: 'TestRulese2t',
        description: 'Description for TestRuleset',
        rules: dummyRules
    };
    for (const rule of dummyRules) {
        await ruleService.insertData(rule);
    }

    const insertedThirdRule = await ruleService.insertData(THIRD_DUMMY_RULE);

    const ruleset = await rulesetService.insertData(dummyRuleset);

    /**
     * update Process
     * 1. Ruleset Title 업데이트
     * 2. 기존의 Ruleset Rule(1, 2)에서 1번 제거
     * 3. 기존의 Ruleset Rule에 3번 rule 추가
     */
    const UPDATED_RULE_SET_TILE = 'UPDATED_RULESET_TITLE_IT_IS';
    const updateTargetRuleset = plainToClass(UpdateRulesetDTO, ruleset, { excludeExtraneousValues: true });
    updateTargetRuleset.title = UPDATED_RULE_SET_TILE;
    // 첫 번째 Rule 제거
    const rules = ruleset.rules.map((ruleOnRules) => plainToClass(UpdateRuleDTO, ruleOnRules.rule));
    updateTargetRuleset.rules = rules.filter((rule) => rule.title !== DUMMY_RULE_FIRST_TITLE);
    // 세 번째 Rule 추가
    updateTargetRuleset.rules.push(plainToClass(UpdateRuleDTO, insertedThirdRule));

    //when
    const result = await rulesetService.updateData(updateTargetRuleset);

    /**
     * then
     * 1. Ruleset의 타이틀이 업데이트된다.
     * 2. Ruleset이 가지고 있는 Rule은 2번과 3번 Rule만 가지고 있어야 한다.
     */
    const foundRuleset = await rulesetService.detail(result.id);
    //0.
    expect(foundRuleset).not.toBeNull();
    if (foundRuleset) {
        //1.
        expect(foundRuleset.title).toBe(UPDATED_RULE_SET_TILE);
        //2-1. rule은 두개(2, 3)를 가지고 있어야 한다.
        expect(foundRuleset.rules.length).toBe(2);
        //2-2. rule은 두번째 rule이어야 한다.
        let hasSec = false;
        let hasThird = false;
        for (const rule of foundRuleset.rules) {
            if (rule.rule.title === DUMMY_RULE_SECOND_TITLE) {
                hasSec = true;
                expect(rule.rule.title).toBe(DUMMY_RULE_SECOND_TITLE);
                expect(rule.rule.sid).toBe(SEC_SID);
                expect(rule.rule.rule_payload?.content).toBe(DUMMY_PAYLOAD_CONTENT);
            } else if (rule.rule.title === DUMMY_RULE_THIRD_TITLE) {
                hasThird = true;
                expect(rule.rule.title).toBe(DUMMY_RULE_THIRD_TITLE);
                expect(rule.rule.sid).toBe(THIRD_SID);
                expect(rule.rule.rule_payload?.content).toBe(THIRD_PAYLOAD_CONTENT);
            }
        }

        expect(hasSec).toBe(true);
        expect(hasThird).toBe(true);
    }
});

test('Delete Test', async () => {
    /**
     * given
     * Ruleset 생성은 이미 존재하는 Rule들로 이루어진다.
     */
    const DUMMY_PAYLOAD_CONTENT = 'TEST_CONTENT';
    const DUMMY_RULE_FIRST_TITLE = 'FirstTestRuleImperfect';
    const FIRST_SID = 1000000;
    const DUMMY_RULE_SECOND_TITLE = 'SecondTestRuleImperfect';
    const SEC_SID = 1000001;
    dummyRules = [
        {
            title: DUMMY_RULE_FIRST_TITLE,
            action: 'alert',
            msg: 'Message 1',
            sid: FIRST_SID,
            rev: 1,
            gid: 123,
            rule_header: {
                protocol: 'TCP',
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
            rule_detection_filter: {
                track: 'by_src',
                count: 5,
                seconds: 60
            }
        },
        {
            title: DUMMY_RULE_SECOND_TITLE,
            action: 'alert',
            msg: 'Message 1',
            sid: SEC_SID,
            rev: 1,
            gid: 123,
            rule_header: {
                protocol: 'TCP',
                source_address: 'any',
                source_port: 'any',
                direction_operator: '->',
                dest_address: 'any',
                dest_port: '80'
            },
            rule_payload: {
                content: DUMMY_PAYLOAD_CONTENT,
                pcre: 'Sample pcre',
                fast_pattern: 'Sample fast pattern',
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
                flowbits: 'noalert',
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
        }
    ];
    const dummyRuleset = {
        title: 'TestRulese2t',
        description: 'Description for TestRuleset',
        rules: dummyRules
    };
    const insertedRules = [];
    for (const rule of dummyRules) {
        const inserted = await ruleService.insertData(rule);
        insertedRules.push(inserted);
    }
    const insertedRuleset = await rulesetService.insertData(dummyRuleset);

    //when
    const result = await rulesetService.deleteData(insertedRuleset.id);

    /**
     * then
     * Ruleset을 삭제하였을 때,
     * 관계테이블(RuleOnRuleset)의 데이터는 삭제되어야 하지만,
     * RuleTable의 Rule들은 삭제되지 않아야 한다.
     */

    //Ruleset 삭제 테스트
    expect(await rulesetService.detail(result.id)).toBeNull();
    //RuleOnRuleset 데이터 삭제 테스트
    expect(await prisma.ruleOnRuleset.findMany()).toEqual([]);
    //RuleTable 데이터 유지 테스트
    for (const rule of insertedRules) {
        const foundRule = await ruleService.detail(rule.id);
        expect(foundRule).not.toBeNull();
        expect(foundRule?.title).not.toBeNull();
        if (foundRule?.title === DUMMY_RULE_FIRST_TITLE) {
            expect(foundRule.sid).toBe(FIRST_SID);
        } else if (foundRule?.title === DUMMY_RULE_SECOND_TITLE) {
            expect(foundRule.sid).toBe(SEC_SID);
        }
    }
});

test('convert Text Test', async () => {
    /**
     * given
     * Ruleset 생성은 이미 존재하는 Rule들로 이루어진다.
     */
    const insertedRules = [];
    for (const rule of dummyRules) {
        const inserted = await ruleService.insertData(rule);
        insertedRules.push(inserted);
    }
    //when
    const result = await rulesetService.insertData(dummyRuleset);
    const rulesetStr = await rulesetService.detailAsText(result.id);

    const expected0 =
        'alert TCP any any -> any 80 (msg:"Message 1"; sid:1000000; sid:1000000; sid:1000000; content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre"; fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; flowbits:noalert; itype:0; icode:0; icmp_id:0; icmp_seq:0;)';
    const expected1 =
        'alert tcp [$HOME_NET1, $HOME_NET2, 192.168.32.0/24] [$HOME_PORT1, $HOME_PORT2, 500:] -> any 80 (msg:"Message 1"; sid:1000000; sid:1000000; sid:1000000; content:"Sample content",fast_pattern, depth 1, within 1; pcre:"Sample pcre"; fragoffset:0; ttl:64; tos:0x10; ip_header_id:0; ipopts:0; fragbits:M; ip_proto:TCP; flags:A; seq:0; ack:0; window:0; stream_reassemble:no; stream_size:0; flow:established; itype:0; icode:0; icmp_id:0; icmp_seq:0;)';

    //then
    expect(rulesetStr).toBe(expected0 + '\n' + expected1);
});
