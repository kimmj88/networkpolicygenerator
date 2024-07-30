// export default seedRule;
import 'reflect-metadata';
import { PrismaClient, Ruleset } from '@prisma/client';
import * as rulesetService from '@be/service/rule/rulesetService';
import * as ruleService from '@be/service/rule/ruleService';

const prisma = new PrismaClient();
const dummyRules = [
    //0.allow
    {
        title: 'allowlist_rule',
        action: 'alert',
        msg: 'reputation event: allowlist',
        sid: 2,
        rev: 1,
        gid: 136
    },
    //1.black
    {
        title: 'blacklist_rule',
        action: 'alert',
        msg: 'reputation event: blacklist',
        sid: 1,
        rev: 1,
        gid: 136
    },
    //2.invalid_payload_rule_base
    {
        title: 'invalid_payload_rule_0',
        action: 'alert',
        msg: 'ECU1: Invalid method ID detected',
        sid: 1000001,
        rev: 1,
        rule_header: {
            protocol: 'udp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            content: '|02 01|',
            offset: 2,
            depth: 2
        }
    },
    {
        title: 'invalid_payload_rule_1',
        action: 'alert',
        msg: 'ECU1: Invalid method ID detected',
        sid: 1000002,
        rev: 1,
        rule_header: {
            protocol: 'tcp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            content: '|02 01|',
            offset: 2,
            depth: 2
        }
    },
    {
        title: 'invalid_payload_rule_2',
        action: 'alert',
        msg: 'ECU2: Invalid method ID detected',
        sid: 1000003,
        rev: 1,
        rule_header: {
            protocol: 'udp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            content: '|02 01|',
            offset: 2,
            depth: 2
        }
    },
    {
        title: 'invalid_payload_rule_3',
        action: 'alert',
        msg: 'ECU2: Invalid method ID detected',
        sid: 1000004,
        rev: 1,
        rule_header: {
            protocol: 'tcp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            content: '|02 01|',
            offset: 2,
            depth: 2
        }
    },
    //3.invalid_payload_rule - pcre
    {
        title: 'invalid_payload_rule_4',
        action: 'alert',
        msg: 'ECU1: Invalid service ID detected',
        sid: 1000011,
        rev: 1,
        rule_header: {
            protocol: 'udp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            pcre: '/^(?!(\\x11\\x11|\\x22\\x22|\\x33\\x33|\\x44\\x44|\\x55\\x55|\\x66\\x66|\\x77\\x77|\\x88\\x88|\\x99\\x99|\\xAA\\xAA))/'
        }
    },
    {
        title: 'invalid_payload_rule_5',
        action: 'alert',
        msg: 'ECU1: Invalid service ID detected',
        sid: 1000012,
        rev: 1,
        rule_header: {
            protocol: 'tcp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            pcre: '/^(?!(\\x11\\x11|\\x22\\x22|\\x33\\x33|\\x44\\x44|\\x55\\x55|\\x66\\x66|\\x77\\x77|\\x88\\x88|\\x99\\x99|\\xAA\\xAA))/'
        }
    },
    {
        title: 'invalid_payload_rule_6',
        action: 'alert',
        msg: 'ECU1: Invalid service ID detected',
        sid: 1000013,
        rev: 1,
        rule_header: {
            protocol: 'udp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            pcre: '/^(?!(\\x10\\x10|\\x20\\x20|\\x30\\x30|\\x40\\x40|\\x50\\x50|\\x60\\x60|\\x70\\x70|\\x80\\x80|\\x90\\x90|\\xA0\\xA0))/'
        }
    },
    {
        title: 'invalid_payload_rule_7',
        action: 'alert',
        msg: 'ECU1: Invalid service ID detected',
        sid: 1000014,
        rev: 1,
        rule_header: {
            protocol: 'tcp',
            source_address: '$HOME_NET1',
            source_port: '$HOME_PORT1',
            direction_operator: '->',
            dest_address: '$HOME_NET2',
            dest_port: '$HOME_PORT2'
        },
        rule_payload: {
            pcre: '/^(?!(\\x10\\x10|\\x20\\x20|\\x30\\x30|\\x40\\x40|\\x50\\x50|\\x60\\x60|\\x70\\x70|\\x80\\x80|\\x90\\x90|\\xA0\\xA0))/'
        }
    },
    //4.port_scan
    {
        title: 'port_scan_rule_0',
        action: 'alert',
        msg: '[1] port scan detected',
        sid: 1,
        rev: 1,
        gid: 122
    },
    {
        title: 'port_scan_rule_1',
        action: 'alert',
        msg: '[2] port scan detected',
        sid: 2,
        rev: 1,
        gid: 122
    },
    {
        title: 'port_scan_rule_2',
        action: 'alert',
        msg: '[3] port scan detected',
        sid: 3,
        rev: 1,
        gid: 122
    },
    //5.threshold
    {
        title: 'threshold_rule_0',
        action: 'alert',
        msg: 'ICMP Flooding Attack detected',
        sid: 1000300,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: 'any',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        },
        rule_detection_filter: {
            track: 'by_src',
            count: 100,
            seconds: 10
        }
    },
    {
        title: 'threshold_rule_1',
        action: 'alert',
        msg: 'ICMP(same-dst) Flooding Attack detected',
        sid: 1000301,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: 'any',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        },
        rule_detection_filter: {
            track: 'by_dst',
            count: 100,
            seconds: 10
        }
    },
    {
        title: 'threshold_rule_2',
        action: 'alert',
        msg: 'ICMP Land Attack detected',
        sid: 1000302,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: '$HOME_NET1',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        }
    },
    {
        title: 'threshold_rule_3',
        action: 'alert',
        msg: 'Invalid ICMP type Attack detected',
        sid: 1000303,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: '$HOME_NET1',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        },
        rule_non_payload: {
            itype: '1<=>2'
        }
    },
    {
        title: 'threshold_rule_4',
        action: 'alert',
        msg: 'Invalid ICMP type Attack detected',
        sid: 1000303,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: '$HOME_NET1',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        },
        rule_non_payload: {
            itype: '7'
        }
    },
    {
        title: 'threshold_rule_5',
        action: 'alert',
        msg: 'Invalid ICMP type Attack detected',
        sid: 1000303,
        rev: 1,
        rule_header: {
            protocol: 'icmp',
            source_address: '$HOME_NET1',
            source_port: 'any',
            direction_operator: '->',
            dest_address: '$HOME_NET1',
            dest_port: 'any'
        },
        rule_non_payload: {
            itype: '19<=>29'
        }
    }
];

const ALLOW_LIST_RULE_TITLE_PREFIX = 'allowlist';
const BLACK_LIST_RULE_TITLE_PREFIX = 'blacklist';
const INVALID_PAYLOAD_RULE_TITLE_PREFIX = 'invalid_payload';
const PORT_SCAN_RULE_TITLE_PREFIX = 'port_scan';
const THRES_HOLD_RULE_TITLE_PREFIX = 'threshold';
const dummyRulesets = [
    {
        title: 'allowlist_ruleset',
        description: 'allowlist_rules',
        rules: [...dummyRules.filter((rule) => rule.title.includes(ALLOW_LIST_RULE_TITLE_PREFIX))]
    },
    {
        title: 'blacklist_ruleset',
        description: 'blacklist_rules',
        rules: [...dummyRules.filter((rule) => rule.title.includes(BLACK_LIST_RULE_TITLE_PREFIX))]
    },
    {
        title: 'invalid_payload_ruleset',
        description: 'invalid_payload_rules',
        rules: [...dummyRules.filter((rule) => rule.title.includes(INVALID_PAYLOAD_RULE_TITLE_PREFIX))]
    },
    {
        title: 'port_scan_ruleset',
        description: 'port_scan_rules',
        rules: [...dummyRules.filter((rule) => rule.title.includes(PORT_SCAN_RULE_TITLE_PREFIX))]
    },
    {
        title: 'threshold_ruleset',
        description: 'threshold_rules',
        rules: [...dummyRules.filter((rule) => rule.title.includes(THRES_HOLD_RULE_TITLE_PREFIX))]
    }
];

async function seedRule() {
    for (const rule of dummyRules) {
        const found = await ruleService.getRuleByTitle(rule.title);
        if (!found) {
            await ruleService.insertData(rule);
        }
    }

    for (const ruleset of dummyRulesets) {
        await rulesetService.insertData(ruleset);
    }
}

export default seedRule;
