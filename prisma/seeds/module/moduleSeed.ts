import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const initModuleDatas = [
    {
        type_cd: 'SNORT',
        title: 'Snort_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'INTERFACE',
                    value: '1111'
                },
                {
                    type_cd: 'VERBOSE',
                    value: 'Y'
                }
            ]
        }
    },
    {
        type_cd: 'REPUTATION',
        title: 'Reputation_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'SCAN_LOCAL',
                    value: 'Y'
                },
                {
                    type_cd: 'PRIORITY',
                    value: 'ALLOWLIST'
                },
                {
                    type_cd: 'ALLOW',
                    value: 'DO_NOT_BLOCK'
                },
                {
                    type_cd: 'BLOCKLIST',
                    value: '111.111.111.111,222.222.222.222'
                },
                {
                    type_cd: 'ALLOWLIST',
                    value: '111.111.111.111,222.222.222.222'
                }
            ]
        }
    },
    {
        type_cd: 'PORT_SCAN',
        title: 'PortScan_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'PROTOS',
                    value: 'TCP,ICMP'
                },
                {
                    type_cd: 'SCAN_TYPES',
                    value: 'PORTSWEEP,DECOY_PORTSCAN'
                }
            ]
        }
    },
    {
        type_cd: 'IPS',
        title: 'Ips_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'MODE',
                    value: 'INLINE'
                },
                {
                    type_cd: 'RULES',
                    value: 'allowlist_ruleset,blacklist_ruleset,invalid_payload_ruleset,port_scan_ruleset,threshold_ruleset'
                }
            ]
        }
    },
    {
        type_cd: 'ARP_SPOOF',
        title: 'ARPSpoof_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'HOSTS',
                    value: '123.123.123.123 11:22:33:44:55:66'
                }
            ]
        }
    },
    {
        type_cd: 'ALERT_SYSLOG',
        title: 'AlertSyslog_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'FACILITY',
                    value: 'AUTH'
                },
                {
                    type_cd: 'LEVEL',
                    value: 'EMERG'
                },
                {
                    type_cd: 'OPTIONS',
                    value: 'CONS'
                }
            ]
        }
    },
    {
        type_cd: 'ALERT_UNIXSOCK',
        title: 'Alert_UnixSock_testData'
    },
    {
        type_cd: 'ALERT_FULL',
        title: 'AlertFull_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'FILE',
                    value: 'Y'
                },
                {
                    type_cd: 'LIMIT',
                    value: '100G'
                }
            ]
        }
    },
    {
        type_cd: 'ALERT_FAST',
        title: 'AlertFast_testData',
        module_value_list: {
            create: [
                {
                    type_cd: 'FILE',
                    value: 'Y'
                }
            ]
        }
    }
];

export async function create() {
    await createSeed('module', initModuleDatas);
}

export async function createSeed<T = void>(tableName: string, items: T[]) {
    for (const item of items) {
        await (prisma[tableName as any] as any).create({
            data: item
        });
    }
}
