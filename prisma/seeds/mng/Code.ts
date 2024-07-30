import * as convertUtil from '@cm/utils/ConvertUtil';
import { PrismaClient } from '@prisma/client';
import { RuleCode, RuleMlCode } from './ruleCode/RuleCode';

const prisma = new PrismaClient();

const initCodeData = [
    {
        grpCd: 'CMM001',
        cd: 'ALL',
        cdNm: '전체',
        cdDc: '전체',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM001',
        cd: 'NPG',
        cdNm: 'Network Policy Generator',
        cdDc: 'Network Policy Generator with Snort',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM100',
        cd: 'IP',
        cdNm: 'IP',
        cdDc: 'IP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM100',
        cd: 'PORT',
        cdNm: 'PORT',
        cdDc: 'PORT',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM100',
        cd: 'PATH',
        cdNm: 'PATH',
        cdDc: 'PATH',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM100',
        cd: 'CUSTOM',
        cdNm: 'CUSTOM',
        cdDc: 'CUSTOM',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '4',
        useYn: 'Y'
    },

    ...RuleCode,
    {
        grpCd: 'CMM300',
        cd: 'CMM301',
        cdNm: 'SNORT',
        cdDc: 'SNORT',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'snort = { @ex }',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM302',
        cdNm: 'REPUTATION',
        cdDc: 'REPUTATION',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'reputation = { @ex }',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM303',
        cdNm: 'PORT_SCAN',
        cdDc: 'PORT SCAN',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'port_scan = { @ex }',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM304',
        cdNm: 'IPS',
        cdDc: 'IPS',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'ips = { @ex }',
        sortOrder: '4',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM306',
        cdNm: 'ARP_SPOOF',
        cdDc: 'ARP SPOOF',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'arp_spoof = { @ex }',
        sortOrder: '5',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM307',
        cdNm: 'ALERT_SYSLOG',
        cdDc: 'ALERT SYSLOG',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'alert_syslog = { @ex }',
        sortOrder: '6',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: '',
        cdNm: 'ALERT_UNIXSOCK',
        cdDc: 'ALERT UNIXSOCK',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'alert_unixsock = { @ex }',
        sortOrder: '7',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM308',
        cdNm: 'ALERT_FULL',
        cdDc: 'ALERT FULL',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'alert_full = { @ex }',
        sortOrder: '8',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM300',
        cd: 'CMM305',
        cdNm: 'ALERT_FAST',
        cdDc: 'ALERT FAST',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: 'alert_fast = { @ex }',
        sortOrder: '5',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM301',
        cd: 'INTERFACE',
        cdNm: 'INTERFACE',
        cdDc: 'INTERFACE',
        item1: 'Input',
        item2: 'voca.moduleValue.options.interface.default',
        item3: '',
        item4: '',
        item5: `['-i'] = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM301',
        cd: 'VERBOSE',
        cdNm: 'VERBOSE',
        cdDc: 'VERBOSE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.verbose.default',
        item3: '',
        item4: '',
        item5: `['-v'] = @ex`,
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM301',
        cd: 'CMM358',
        cdNm: 'DAQ',
        cdDc: 'DAQ',
        item1: 'Select',
        item2: 'voca.moduleValue.options.daq.default',
        item3: '',
        item4: '',
        item5: `['--daq'] = '@ex'`,
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM301',
        cd: 'LOGDIR',
        cdNm: 'LOG_DIR',
        cdDc: 'LOGDIR',
        item1: 'Input',
        item2: 'voca.moduleValue.options.logDir.default',
        item3: '',
        item4: '',
        item5: `['-l'] = '@ex'`,
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM301',
        cd: 'INLINEMODE',
        cdNm: 'INLINE_MODE',
        cdDc: 'INLINEMODE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.inlineMode.default',
        item3: '',
        item4: '',
        item5: `['-Q'] = @ex`,
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM301',
        cd: 'CMM359',
        cdNm: 'DAQ_MODE',
        cdDc: 'DAQMODE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.daqMode.default',
        item3: '',
        item4: '',
        item5: `['--daq-mode'] = '@ex'`,
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM302',
        cd: 'SCAN_LOCAL',
        cdNm: 'SCAN_LOCAL',
        cdDc: 'SCAN LOCAL',
        item1: 'Select',
        item2: 'voca.moduleValue.options.scanLocal.default',
        item3: '',
        item4: '',
        item5: `scan_local = @ex`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM302',
        cd: 'CMM350',
        cdNm: 'PRIORITY',
        cdDc: 'PRIORITY',
        item1: 'Select',
        item2: 'voca.moduleValue.options.priority.default',
        item3: '',
        item4: '',
        item5: `priority = '@ex'`,
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM302',
        cd: 'CMM351',
        cdNm: 'ALLOW',
        cdDc: 'ALLOW',
        item1: 'Select',
        item2: 'voca.moduleValue.options.allow.default',
        item3: '',
        item4: '',
        item5: `allow = '@ex'`,
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM302',
        cd: 'BLOCKLIST',
        cdNm: 'BLOCKLIST',
        cdDc: 'BLOCKLIST',
        item1: 'List',
        item2: 'voca.moduleValue.options.blockList.default',
        item3: '',
        item4: '',
        item5: `blocklist = './iplists/blocklist.blf'`,
        sortOrder: '4',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM302',
        cd: 'ALLOWLIST',
        cdNm: 'ALLOWLIST',
        cdDc: 'ALLOWLIST',
        item1: 'List',
        item2: 'voca.moduleValue.options.allowList.default',
        item3: '',
        item4: '',
        item5: `allowlist = './iplists/allowlist.wlf'`,
        sortOrder: '5',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM303',
        cd: 'CMM352',
        cdNm: 'PROTOS',
        cdDc: 'PROTOS',
        item1: 'Checkbox',
        item2: 'voca.moduleValue.options.protos.default',
        item3: '',
        item4: '',
        item5: `protos = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM303',
        cd: 'CMM353',
        cdNm: 'SCAN_TYPES',
        cdDc: 'SCAN TYPES',
        item1: 'Checkbox',
        item2: 'voca.moduleValue.options.scanTypes.default',
        item3: '',
        item4: '',
        item5: `scan_types = '@ex'`,
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM303',
        cd: 'ALERT_ALL',
        cdNm: 'ALERT_ALL',
        cdDc: 'ALERT ALL',
        item1: 'Select',
        item2: 'voca.moduleValue.options.alertAll.default',
        item3: '',
        item4: '',
        item5: `alert_all = @ex`,
        sortOrder: '3',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM304',
        cd: 'CMM354',
        cdNm: 'MODE',
        cdDc: 'MODE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.mode.default',
        item3: '',
        item4: '',
        item5: 'mode = @ex',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM304',
        cd: 'RULES',
        cdNm: 'RULES',
        cdDc: 'RULES',
        item1: 'ListPopup',
        item2: 'voca.moduleValue.options.rules.default',
        item3: 'RuleSetSelectModal',
        item4: 'voca.ruleset.plural.default',
        item5: 'rules = @ex',
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM305',
        cd: 'FILE',
        cdNm: 'FILE',
        cdDc: 'FILE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.file.default',
        item3: '',
        item4: '',
        item5: 'file = @ex',
        sortOrder: '1',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM306',
        cd: 'HOSTS',
        cdNm: 'HOSTS',
        cdDc: 'HOSTS',
        item1: 'ListHost',
        item2: 'voca.moduleValue.options.hosts.default',
        item3: '',
        item4: '',
        item5: 'hosts = { @ex }',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM307',
        cd: 'CMM355',
        cdNm: 'FACILITY',
        cdDc: 'FACILITY',
        item1: 'Select',
        item2: 'voca.moduleValue.options.facility.default',
        item3: '',
        item4: '',
        item5: `facility = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM307',
        cd: 'CMM356',
        cdNm: 'LEVEL',
        cdDc: 'LEVEL',
        item1: 'Select',
        item2: 'voca.moduleValue.options.level.default',
        item3: '',
        item4: '',
        item5: `level = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM307',
        cd: 'CMM357',
        cdNm: 'OPTIONS',
        cdDc: 'OPTIONS',
        item1: 'Select',
        item2: 'voca.moduleValue.options.options.default',
        item3: '',
        item4: '',
        item5: `options = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM308',
        cd: 'FILE',
        cdNm: 'FILE',
        cdDc: 'FILE',
        item1: 'Select',
        item2: 'voca.moduleValue.options.file.default',
        item3: '',
        item4: '',
        item5: 'file = @ex',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM308',
        cd: 'LIMIT',
        cdNm: 'LIMIT',
        cdDc: 'LIMIT',
        item1: 'Input',
        item2: 'voca.moduleValue.options.limit.default',
        item3: '',
        item4: '',
        item5: `limit = '@ex'`,
        sortOrder: '1',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM350',
        cd: 'BLOCKLIST',
        cdNm: 'BLOCKLIST',
        cdDc: 'BLOCKLIST',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: `blocklist = './iplists/blocklist.blf'`,
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM350',
        cd: 'ALLOWLIST',
        cdNm: 'ALLOWLIST',
        cdDc: 'ALLOWLIST',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: `allowlist = './iplists/allowlist.wlf'`,
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM351',
        cd: 'DO_NOT_BLOCK',
        cdNm: 'DO_NOT_BLOCK',
        cdDc: 'DO NOT BLOCK',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM351',
        cd: 'TRUST',
        cdNm: 'TRUST',
        cdDc: 'TRUST',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM352',
        cd: 'TCP',
        cdNm: 'TCP',
        cdDc: 'TCP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM352',
        cd: 'UDP',
        cdNm: 'UDP',
        cdDc: 'UDP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM352',
        cd: 'ICMP',
        cdNm: 'ICMP',
        cdDc: 'ICMP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM352',
        cd: 'IP',
        cdNm: 'IP',
        cdDc: 'IP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '4',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM353',
        cd: 'PORTSCAN',
        cdNm: 'PORTSCAN',
        cdDc: 'PORTSCAN',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM353',
        cd: 'PORTSWEEP',
        cdNm: 'PORTSWEEP',
        cdDc: 'PORTSWEEP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM353',
        cd: 'DECOY_PORTSCAN',
        cdNm: 'DECOY_PORTSCAN',
        cdDc: 'DECOY PORTSCAN',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM353',
        cd: 'DISTRIBUTED_PORTSCAN',
        cdNm: 'DISTRIBUTED_PORTSCAN',
        cdDc: 'DISTRIBUTED PORTSCAN',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '4',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM354',
        cd: 'TAP',
        cdNm: 'TAP',
        cdDc: 'TAP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM354',
        cd: 'INLINE',
        cdNm: 'INLINE',
        cdDc: 'INLINE',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM354',
        cd: 'INLINE_TEST',
        cdNm: 'INLINE_TEST',
        cdDc: 'INLINE TEST',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },

    {
        grpCd: 'CMM355',
        cd: 'AUTH',
        cdNm: 'AUTH',
        cdDc: 'AUTH',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'AUTHPRIV',
        cdNm: 'AUTHPRIV',
        cdDc: 'AUTHPRIV',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'DAEMON',
        cdNm: 'DAEMON',
        cdDc: 'DAEMON',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'USER',
        cdNm: 'USER',
        cdDc: 'USER',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL0',
        cdNm: 'LOCAL0',
        cdDc: 'LOCAL0',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL1',
        cdNm: 'LOCAL1',
        cdDc: 'LOCAL1',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL2',
        cdNm: 'LOCAL2',
        cdDc: 'LOCAL2',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL3',
        cdNm: 'LOCAL3',
        cdDc: 'LOCAL3',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL4',
        cdNm: 'LOCAL4',
        cdDc: 'LOCAL4',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL5',
        cdNm: 'LOCAL5',
        cdDc: 'LOCAL5',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL6',
        cdNm: 'LOCAL6',
        cdDc: 'LOCAL6',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL7',
        cdNm: 'LOCAL7',
        cdDc: 'LOCAL7',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'EMERG',
        cdNm: 'EMERG',
        cdDc: 'EMERG',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'ALERT',
        cdNm: 'ALERT',
        cdDc: 'ALERT',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'CRIT',
        cdNm: 'CRIT',
        cdDc: 'CRIT',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'ERR',
        cdNm: 'ERR',
        cdDc: 'ERR',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'WARNING',
        cdNm: 'WARNING',
        cdDc: 'WARNING',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'NOTICE',
        cdNm: 'NOTICE',
        cdDc: 'NOTICE',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'INFO',
        cdNm: 'INFO',
        cdDc: 'INFO',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM356',
        cd: 'DEBUG',
        cdNm: 'DEBUG',
        cdDc: 'DEBUG',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM357',
        cd: 'CONS',
        cdNm: 'CONS',
        cdDc: 'CONS',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM357',
        cd: 'NDELAY',
        cdNm: 'NDELAY',
        cdDc: 'NDELAY',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM357',
        cd: 'PERROR',
        cdNm: 'PERROR',
        cdDc: 'PERROR',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM357',
        cd: 'PID',
        cdNm: 'PID',
        cdDc: 'PID',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'PCAP',
        cdNm: 'PCAP',
        cdDc: 'PCAP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'AFPACKET',
        cdNm: 'AFPACKET',
        cdDc: 'AFPACKET',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'DUMP',
        cdNm: 'DUMP',
        cdDc: 'DUMP',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'NFQ',
        cdNm: 'NFQ',
        cdDc: 'NFQ',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'IPQ',
        cdNm: 'IPQ',
        cdDc: 'IPQ',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM358',
        cd: 'IPFW',
        cdNm: 'IPFW',
        cdDc: 'IPFW',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM359',
        cd: 'READ-FILE',
        cdNm: 'READ FILE',
        cdDc: 'READ-FILE',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM359',
        cd: 'PASSIVE',
        cdNm: 'PASSIVE',
        cdDc: 'PASSIVE',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM359',
        cd: 'INLINE',
        cdNm: 'INLINE',
        cdDc: 'INLINE',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM900',
        cd: '030',
        cdNm: '30',
        cdDc: '30',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM900',
        cd: '050',
        cdNm: '50',
        cdDc: '50',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM900',
        cd: '070',
        cdNm: '70',
        cdDc: '70',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '3',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM900',
        cd: '100',
        cdNm: '100',
        cdDc: '100',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '4',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM900',
        cd: '300',
        cdNm: '300',
        cdDc: '300',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '5',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM901',
        cd: 'EN',
        cdNm: 'English',
        cdDc: 'English',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM902',
        cd: 'Y',
        cdNm: '사용',
        cdDc: '사용',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM902',
        cd: 'N',
        cdNm: '미사용',
        cdDc: '미사용',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM903',
        cd: 'Y',
        cdNm: '적용',
        cdDc: '적용',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '1',
        useYn: 'Y'
    },
    {
        grpCd: 'CMM903',
        cd: 'N',
        cdNm: '미적용',
        cdDc: '미적용',
        item1: '',
        item2: '',
        item3: '',
        item4: '',
        item5: '',
        sortOrder: '2',
        useYn: 'Y'
    }
];

const initCodeMlData = [
    {
        grpCd: 'CMM001',
        cd: 'ALL',
        langCd: 'EN',
        name: 'ALL'
    },
    {
        grpCd: 'CMM001',
        cd: 'NPG',
        langCd: 'EN',
        name: 'Network Policy Generator'
    },

    {
        grpCd: 'CMM100',
        cd: 'IP',
        langCd: 'EN',
        name: 'IP'
    },
    {
        grpCd: 'CMM100',
        cd: 'PORT',
        langCd: 'EN',
        name: 'PORT'
    },
    {
        grpCd: 'CMM100',
        cd: 'PATH',
        langCd: 'EN',
        name: 'PATH'
    },
    {
        grpCd: 'CMM100',
        cd: 'CUSTOM',
        langCd: 'EN',
        name: 'CUSTOM'
    },
    ...RuleMlCode,
    {
        grpCd: 'CMM300',
        cd: 'SNORT',
        langCd: 'EN',
        name: 'SNORT'
    },
    {
        grpCd: 'CMM300',
        cd: 'REPUTATION',
        langCd: 'EN',
        name: 'REPUTATION'
    },
    {
        grpCd: 'CMM300',
        cd: 'PORT_SCAN',
        langCd: 'EN',
        name: 'PORT SCAN'
    },
    {
        grpCd: 'CMM300',
        cd: 'IPS',
        langCd: 'EN',
        name: 'IPS'
    },
    {
        grpCd: 'CMM300',
        cd: 'ALERT_FAST',
        langCd: 'EN',
        name: 'ALERT FAST'
    },

    {
        grpCd: 'CMM301',
        cd: 'INTERFACE',
        langCd: 'EN',
        name: 'INTERFACE'
    },
    {
        grpCd: 'CMM301',
        cd: 'VERBOSE',
        langCd: 'EN',
        name: 'VERBOSE'
    },
    {
        grpCd: 'CMM301',
        cd: 'DAQ',
        langCd: 'EN',
        name: 'DAQ'
    },
    {
        grpCd: 'CMM301',
        cd: 'LOGDIR',
        langCd: 'EN',
        name: 'LOGDIR'
    },
    {
        grpCd: 'CMM301',
        cd: 'INLINEMODE',
        langCd: 'EN',
        name: 'INLINEMODE'
    },
    {
        grpCd: 'CMM301',
        cd: 'DAQMODE',
        langCd: 'EN',
        name: 'DAQMODE'
    },

    {
        grpCd: 'CMM302',
        cd: 'SCAN_LOCAL',
        langCd: 'EN',
        name: 'SCAN LOCAL'
    },
    {
        grpCd: 'CMM302',
        cd: 'PRIORITY',
        langCd: 'EN',
        name: 'PRIORITY'
    },
    {
        grpCd: 'CMM302',
        cd: 'ALLOW',
        langCd: 'EN',
        name: 'ALLOW'
    },

    {
        grpCd: 'CMM303',
        cd: 'PROTOS',
        langCd: 'EN',
        name: 'PROTOS'
    },
    {
        grpCd: 'CMM303',
        cd: 'SCAN_TYPES',
        langCd: 'EN',
        name: 'SCAN TYPES'
    },
    {
        grpCd: 'CMM303',
        cd: 'ALERT_ALL',
        langCd: 'EN',
        name: 'ALERT ALL'
    },

    {
        grpCd: 'CMM304',
        cd: 'MODE',
        langCd: 'EN',
        name: 'MODE'
    },
    {
        grpCd: 'CMM304',
        cd: 'RULES',
        langCd: 'EN',
        name: 'RULES'
    },

    {
        grpCd: 'CMM305',
        cd: 'FILE',
        langCd: 'EN',
        name: 'FILE'
    },

    {
        grpCd: 'CMM306',
        cd: 'HOSTS',
        langCd: 'EN',
        name: 'HOSTS'
    },
    {
        grpCd: 'CMM307',
        cd: 'FACILITY',
        langCd: 'EN',
        name: 'FACILITY'
    },
    {
        grpCd: 'CMM307',
        cd: 'LEVEL',
        langCd: 'EN',
        name: 'LEVEL'
    },
    {
        grpCd: 'CMM307',
        cd: 'OPTIONS',
        langCd: 'EN',
        name: 'OPTIONS'
    },
    {
        grpCd: 'CMM308',
        cd: 'FILE',
        langCd: 'EN',
        name: 'FILE'
    },
    {
        grpCd: 'CMM308',
        cd: 'LIMIT',
        langCd: 'EN',
        name: 'LIMIT'
    },
    {
        grpCd: 'CMM350',
        cd: 'BLOCKLIST',
        langCd: 'EN',
        name: 'BLOCKLIST'
    },
    {
        grpCd: 'CMM350',
        cd: 'ALLOWLIST',
        langCd: 'EN',
        name: 'ALLOWLIST'
    },

    {
        grpCd: 'CMM351',
        cd: 'DO_NOT_BLOCK',
        langCd: 'EN',
        name: 'DO NOT BLOCK'
    },
    {
        grpCd: 'CMM351',
        cd: 'TRUST',
        langCd: 'EN',
        name: 'TRUST'
    },

    {
        grpCd: 'CMM352',
        cd: 'TCP',
        langCd: 'EN',
        name: 'TCP'
    },
    {
        grpCd: 'CMM352',
        cd: 'UDP',
        langCd: 'EN',
        name: 'UDP'
    },
    {
        grpCd: 'CMM352',
        cd: 'ICMP',
        langCd: 'EN',
        name: 'ICMP'
    },
    {
        grpCd: 'CMM352',
        cd: 'IP',
        langCd: 'EN',
        name: 'IP'
    },

    {
        grpCd: 'CMM353',
        cd: 'PORTSCAN',
        langCd: 'EN',
        name: 'PORTSCAN'
    },
    {
        grpCd: 'CMM353',
        cd: 'PORTSWEEP',
        langCd: 'EN',
        name: 'PORTSWEEP'
    },
    {
        grpCd: 'CMM353',
        cd: 'DECOY_PORTSCAN',
        langCd: 'EN',
        name: 'DECOY PORTSCAN'
    },
    {
        grpCd: 'CMM353',
        cd: 'DISTRIBUTED_PORTSCAN',
        langCd: 'EN',
        name: 'DISTRIBUTED PORTSCAN'
    },

    {
        grpCd: 'CMM354',
        cd: 'TAP',
        langCd: 'EN',
        name: 'TAP'
    },
    {
        grpCd: 'CMM354',
        cd: 'INLINE',
        langCd: 'EN',
        name: 'INLINE'
    },
    {
        grpCd: 'CMM354',
        cd: 'INLINE_TEST',
        langCd: 'EN',
        name: 'INLINE TEST'
    },
    {
        grpCd: 'CMM355',
        cd: 'AUTH',
        langCd: 'EN',
        name: 'AUTH'
    },

    {
        grpCd: 'CMM355',
        cd: 'AUTHPRIV',
        langCd: 'EN',
        name: 'AUTHPRIV'
    },

    {
        grpCd: 'CMM355',
        cd: 'DAEMON',
        langCd: 'EN',
        name: 'DAEMON'
    },
    {
        grpCd: 'CMM355',
        cd: 'USER',
        langCd: 'EN',
        name: 'USER'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL0',
        langCd: 'EN',
        name: 'LOCAL0'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL1',
        langCd: 'EN',
        name: 'LOCAL1'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL2',
        langCd: 'EN',
        name: 'LOCAL2'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL3',
        langCd: 'EN',
        name: 'LOCAL3'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL4',
        langCd: 'EN',
        name: 'LOCAL4'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL5',
        langCd: 'EN',
        name: 'LOCAL5'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL6',
        langCd: 'EN',
        name: 'LOCAL6'
    },
    {
        grpCd: 'CMM355',
        cd: 'LOCAL7',
        langCd: 'EN',
        name: 'LOCAL7'
    },
    {
        grpCd: 'CMM356',
        cd: 'EMERG',
        langCd: 'EN',
        name: 'EMERG'
    },
    {
        grpCd: 'CMM356',
        cd: 'ALERT',
        langCd: 'EN',
        name: 'ALERT'
    },
    {
        grpCd: 'CMM356',
        cd: 'CRIT',
        langCd: 'EN',
        name: 'CRIT'
    },
    {
        grpCd: 'CMM356',
        cd: 'ERR',
        langCd: 'EN',
        name: 'ERR'
    },
    {
        grpCd: 'CMM356',
        cd: 'NOTICE',
        langCd: 'EN',
        name: 'NOTICE'
    },
    {
        grpCd: 'CMM356',
        cd: 'INFO',
        langCd: 'EN',
        name: 'INFO'
    },
    {
        grpCd: 'CMM356',
        cd: 'DEBUG',
        langCd: 'EN',
        name: 'DEBUG'
    },
    {
        grpCd: 'CMM357',
        cd: 'CONS',
        langCd: 'EN',
        name: 'CONS'
    },
    {
        grpCd: 'CMM357',
        cd: 'NDELAY',
        langCd: 'EN',
        name: 'NDELAY'
    },
    {
        grpCd: 'CMM357',
        cd: 'PERROR',
        langCd: 'EN',
        name: 'PERROR'
    },
    {
        grpCd: 'CMM357',
        cd: 'PID',
        langCd: 'EN',
        name: 'PID'
    },
    {
        grpCd: 'CMM358',
        cd: 'PCAP',
        langCd: 'EN',
        name: 'PCAP'
    },
    {
        grpCd: 'CMM358',
        cd: 'AFPACKET',
        langCd: 'EN',
        name: 'AFPACKET'
    },
    {
        grpCd: 'CMM358',
        cd: 'DUMP',
        langCd: 'EN',
        name: 'DUMP'
    },
    {
        grpCd: 'CMM358',
        cd: 'NFQ',
        langCd: 'EN',
        name: 'NFQ'
    },
    {
        grpCd: 'CMM358',
        cd: 'IPQ',
        langCd: 'EN',
        name: 'IPQ'
    },
    {
        grpCd: 'CMM358',
        cd: 'IPFW',
        langCd: 'EN',
        name: 'IPFW'
    },
    {
        grpCd: 'CMM359',
        cd: 'READ-FILE',
        langCd: 'EN',
        name: 'READ-FILE'
    },
    {
        grpCd: 'CMM359',
        cd: 'PASSIVE',
        langCd: 'EN',
        name: 'PASSIVE'
    },
    {
        grpCd: 'CMM359',
        cd: 'INLINE',
        langCd: 'EN',
        name: 'INLINE'
    },
    { grpCd: 'CMM900', cd: '030', langCd: 'EN', name: '30' },
    { grpCd: 'CMM900', cd: '050', langCd: 'EN', name: '50' },
    { grpCd: 'CMM900', cd: '070', langCd: 'EN', name: '70' },
    { grpCd: 'CMM900', cd: '100', langCd: 'EN', name: '100' },
    { grpCd: 'CMM900', cd: '300', langCd: 'EN', name: '300' },
    { grpCd: 'CMM901', cd: 'EN', langCd: 'EN', name: 'English' },
    { grpCd: 'CMM902', cd: 'Y', langCd: 'EN', name: 'Use' },
    { grpCd: 'CMM902', cd: 'N', langCd: 'EN', name: 'Not use' },
    { grpCd: 'CMM903', cd: 'Y', langCd: 'EN', name: 'Apply' },
    { grpCd: 'CMM903', cd: 'N', langCd: 'EN', name: 'Not apply' }
];

async function seedMngCode() {
    try {
        for (const code of initCodeData) {
            let sCode = convertUtil.camelToSnake(code as any);
            await prisma.mngCode.create({
                data: sCode
            });
        }
        for (const codeMl of initCodeMlData) {
            let sCodeMl = convertUtil.camelToSnake(codeMl as any);
            await prisma.mngCodeMl.create({
                data: sCodeMl
            });
        }
    } catch (e) {
        console.log(`Create seed data error : \n${e}`);
    }
}

export default seedMngCode;
