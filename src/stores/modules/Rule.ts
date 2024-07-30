import { base } from '@/plugins/ts/base';
import { IRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { IRuleDetectionFilterDTO } from '@cm/types/domain/dto/rule/ruleDetectionFilterDTO';
import { IRuleHeaderDTO } from '@cm/types/domain/dto/rule/ruleHeaderDTO';
import { IRuleNonPayloadDTO } from '@cm/types/domain/dto/rule/ruleNonPayloadDTO';
import { IRulePayloadDTO } from '@cm/types/domain/dto/rule/rulePlayloadDTO';
import { convertRuleObjectToSnortRule } from '@cm/utils/ConvertUtil';
import axios from 'axios';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { DebuggerEvent } from 'vue';

const { stores, emitter, gProp, commonts, router, t } = base();
// const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();

export type TrafficDirectionType = 'SRC' | 'DEST';
export type PortOrIPType = 'IP' | 'PORT' | '';
export type RuleHeaderDataType = 'Database' | 'Manual';
export type HeaderFlagType = 'is_source_ip_any' | 'is_source_port_any' | 'is_dest_ip_any' | 'is_dest_port_any';
export type HeaderSelectedListLabelType =
    | 'selected_src_ip_list'
    | 'selected_dest_ip_list'
    | 'selected_src_port_list'
    | 'selected_dest_port_list';

export type AddressModalBaseType = {
    id?: string;
    type: PortOrIPType;
    dataType: RuleHeaderDataType;
    title: string;
    value: string;
};

export type VariableIPType = {
    id?: number;
    key: string;
    type_cd: string;
    value: string;
};

export type RuleBaseType = {
    id?: number;
    title?: string;
    action?: string;
};

export type RuleBasicOptionType = {
    msg?: string;
    sid?: number;
    rev?: number;
    gid?: number | null;
};

const INIT_RULE_BASE = {
    title: '',
    action: ''
} as RuleBaseType;

const INIT_RULE_HEADER = {
    id: undefined,
    protocol: '',
    source_address: '',
    source_port: '',
    direction_operator: '->',
    dest_address: '',
    dest_port: ''
} as IRuleHeaderDTO;

const INIT_BASIC_OPTIONS = {
    msg: '',
    sid: undefined as number | undefined,
    rev: undefined as number | undefined,
    gid: undefined as number | undefined
};

const INIT_PAYLOAD = {
    id: undefined,
    content: '',
    negation: false,
    fast_pattern: '',
    pcre: undefined,

    offset: undefined,
    depth: undefined,

    distance: undefined,
    within: undefined
} as IRulePayloadDTO & {
    negation?: boolean;
};

const INIT_NON_PAYLOAD = {
    //IP
    fragoffset: {
        flag: false,
        data: undefined
    },
    ttl: {
        flag: false,
        data: undefined
    },
    tos: {
        flag: false,
        data: undefined
    },
    ip_header_id: {
        flag: false,
        data: undefined
    },
    ipopts: {
        flag: false,
        data: undefined
    },
    fragbits: {
        flag: false,
        data: undefined
    },
    ip_proto: {
        flag: false,
        data: undefined
    },
    //TCP
    flags: {
        flag: true,
        data: ''
    },
    seq: {
        flag: false,
        data: undefined
    },
    ack: {
        flag: false,
        data: undefined
    },
    window: {
        flag: false,
        data: undefined
    },
    stream_reassemble: {
        flag: false,
        data: undefined
    },
    stream_size: {
        flag: false,
        data: undefined
    },
    //TCP && UDP
    flow: {
        flag: false,
        data: undefined
    },
    //ICMP
    itype: {
        flag: false,
        data: undefined
    },
    icode: {
        flag: false,
        data: undefined
    },
    icmp_id: {
        flag: false,
        data: undefined
    },
    icmp_seq: {
        flag: false,
        data: undefined
    }
};

const INIT_POST_DETECTION_DATA = {
    id: undefined,
    track: '',
    count: 1,
    seconds: 10
};

const NON_PAYLOAD_HASH_MAP = {
    ip: ['fragoffset', 'ttl', 'tos', 'ip_header_id', 'ipopts', 'fragbits', 'ip_proto'],
    tcp: ['flags', 'seq', 'ack', 'window', 'stream_reassemble', 'stream_size'],
    udp: ['flow'],
    icmp: ['itype', 'icode', 'icmp_id', 'icmp_seq']
} as { [key: string]: string[] };

const STRING_FORMAT_LIST = ['msg', 'content', 'pcre'];
const HEADER_TYPE = {
    manual: 'Manual',
    database: 'Database'
} as const;
const CONTENT_MODIFIER_TYPE = {
    offset: 'offset, depth',
    distance: 'distance, within'
} as const;

export const useRuleStore = defineStore('rule', {
    state: () => {
        return {
            id: undefined as number | undefined,
            rule_base: {
                ...INIT_RULE_BASE
            },
            rule_header_flag: true,
            is_source_ip_any: false,
            is_source_port_any: true,
            is_dest_ip_any: true,
            is_dest_port_any: true,
            rule_header: {
                ...INIT_RULE_HEADER
            },
            rule_payload: {},
            rule_non_payload: undefined,
            rule_detection_filter: undefined,
            /**
             * Header Modal에서 입력받은 데이터
             */
            ip_modal_data: {
                type: '',
                value: '',
                title: '',
                id: undefined
            } as AddressModalBaseType,

            port_modal_data: {
                type: '',
                value: '',
                title: '',
                id: undefined
            } as AddressModalBaseType,

            /**
             * Header Datas
             */
            selected_src_ip_list: [] as AddressModalBaseType[],
            selected_src_port_list: [] as AddressModalBaseType[],
            selected_dest_ip_list: [] as AddressModalBaseType[],
            selected_dest_port_list: [] as AddressModalBaseType[],

            /**
             * Variable List(IP, Port)
             */
            ip_variable_list: [] as VariableIPType[],
            port_variable_list: [] as VariableIPType[],

            /**
             * ########## Basic Option ##########
             */
            basic_option_flag: true,
            basic_options: { ...INIT_BASIC_OPTIONS },

            /**
             * ########## Payload ##########
             */
            payload_flag: false,
            content_modifier_flag: false,
            content_modifier_type: '',
            payload_data: {
                ...INIT_PAYLOAD
            },
            /**
             * ########## Non-Payload ##########
             */
            non_payload_flag: false,
            non_payload_data: {
                //IP
                fragoffset: {
                    flag: false,
                    data: undefined
                },
                ttl: {
                    flag: false,
                    data: undefined
                },
                tos: {
                    flag: false,
                    data: undefined
                },
                ip_header_id: {
                    flag: false,
                    data: undefined
                },
                ipopts: {
                    flag: false,
                    data: undefined
                },
                fragbits: {
                    flag: false,
                    data: undefined
                },
                ip_proto: {
                    flag: false,
                    data: undefined
                },
                //TCP
                flags: {
                    flag: true,
                    data: ''
                },
                seq: {
                    flag: false,
                    data: undefined
                },
                ack: {
                    flag: false,
                    data: undefined
                },
                window: {
                    flag: false,
                    data: undefined
                },
                stream_reassemble: {
                    flag: false,
                    data: undefined
                },
                stream_size: {
                    flag: false,
                    data: undefined
                },
                //TCP && UDP
                flow: {
                    flag: false,
                    data: undefined
                },
                //ICMP
                itype: {
                    flag: false,
                    data: undefined
                },
                icode: {
                    flag: false,
                    data: undefined
                },
                icmp_id: {
                    flag: false,
                    data: undefined
                },
                icmp_seq: {
                    flag: false,
                    data: undefined
                }
            } as { [key: string]: any },
            /**
             * ########## Detection Field ##########
             */
            post_detection_flag: false,
            detection_filter_flag: false,
            post_detection_data: {
                ...INIT_POST_DETECTION_DATA
            } as { [key: string]: any }
        };
    },
    getters: {
        ruleHeader() {
            if (!this.rule_header_flag) return undefined;
            const result = {} as IRuleHeaderDTO;
            result.protocol = this.protocol.trim();
            result.source_address = this.srcIp.trim();
            result.source_port = this.srcPort.trim();
            result.direction_operator = this.direction.trim();
            result.dest_address = this.destIP.trim();
            result.dest_port = this.destPort.trim();
            return result;
        },
        ruleBase: (state) => state.rule_base,
        ruleBasicOption: (state) => {
            // number Type의 Input을 지웠을 때 값이 emptystring이 되게 된다.
            // 이 경우, 강제적으로 undefined로 변환해준다.
            let gid = undefined;
            if (typeof state.basic_options.gid === 'number') {
                gid = state.basic_options.gid;
            }
            return {
                ...state.basic_options,
                gid: gid
            };
        },
        rulePayload: (state) => {
            if (!state.payload_flag) return undefined;
            const { id, ...withoutIdPayloadData } = state.payload_data;
            return withoutIdPayloadData as IRulePayloadDTO;
        },
        ruleNonPayload: (state) => {
            if (!state.non_payload_flag) return undefined;
            let result = {} as { [key: string]: any };
            if (state.non_payload_flag) {
                //Protocol에 따라 담기는 값 달라져야 한다.
                // for (const ptc in NON_PAYLOAD_HASH_MAP) {
                const protocol = state.rule_header.protocol;
                if (protocol) {
                    for (const nonPayloadProperty of NON_PAYLOAD_HASH_MAP[state.rule_header.protocol]) {
                        const nonPayloadDataObj = state.non_payload_data[nonPayloadProperty];
                        if (nonPayloadDataObj.flag && nonPayloadDataObj.data) {
                            result[nonPayloadProperty] = nonPayloadDataObj.data;
                        }
                    }
                }
            }
            return result as IRuleNonPayloadDTO;
        },
        rulePostDetection: (state) => {
            const { id, ...withoutId } = state.post_detection_data;
            return withoutId as IRuleDetectionFilterDTO;
        },
        ruleDTO() {
            const result = {
                id: this.id,
                ...this.ruleBase,
                ...this.ruleBasicOption,
                rule_header: this.ruleHeader,
                rule_payload: this.rulePayload,
                rule_non_payload: this.ruleNonPayload,
                rule_detection_filter: this.detection_filter_flag ? this.rulePostDetection : undefined
            } as IRuleDTO;
            return result;
        },
        selectedRuleIPList: (state) => state.selected_src_ip_list,
        // ############### PASRSING HEADER ###############
        action: (state) => (state.rule_base.action ? state.rule_base.action.toLowerCase() : ''),
        protocol: (state) => {
            return state.rule_header.protocol.length > 0 ? ' ' + state.rule_header.protocol : '';
        },
        srcIp: (state) => {
            let str = '';
            if (!state.rule_header_flag) return str;
            else if (state.is_source_ip_any) {
                str = 'any';
            } else {
                str = addressListToString(state.selected_src_ip_list);
            }
            return ' ' + str;
        },
        srcPort: (state) => {
            let str = '';
            if (!state.rule_header_flag) return str;
            else if (state.is_source_port_any) {
                str = 'any';
            } else {
                str = addressListToString(state.selected_src_port_list);
            }
            return ' ' + str;
        },
        direction: (state) => (state.rule_header_flag ? ' ' + state.rule_header.direction_operator : ''),
        destIP: (state) => {
            let str = '';
            if (!state.rule_header_flag) return str;
            else if (state.is_dest_ip_any) {
                str = 'any';
            } else {
                str = addressListToString(state.selected_dest_ip_list);
            }
            return ' ' + str;
        },
        destPort: (state) => {
            let str = '';
            if (!state.rule_header_flag) return str;
            else if (state.is_dest_port_any) {
                str = 'any';
            } else {
                str = addressListToString(state.selected_dest_port_list);
            }
            return ' ' + str;
        },

        preview() {
            return convertRuleObjectToSnortRule(this.ruleDTO as IRuleDTO);
        }
    },
    actions: {
        async initAll(exceptId: boolean = false) {
            if (!exceptId) {
                this.id = undefined;
            }
            this.initRuleBase();
            this.initBasicOptionData();
            await this.initHeaderData();
            this.initPayload();
            this.initNonPayload();
            this.initPostDetection();
        },

        initRuleBase() {
            this.rule_base = { ...INIT_RULE_BASE };
        },
        async initHeaderData() {
            // Protocol등 데이터 초기화
            this.rule_header = { ...INIT_RULE_HEADER };
            // 현재 선택한 IP, Port 리스트 초기화
            this.clearSelectedSrcIPList();
            this.clearSelectedSrcPortList();
            this.clearSelectedDestIPList();
            this.clearSelectedDestPortList();
            //Header any Flag 초기화
            this.initAnyFlags();
            // IP, Port 모달 데이터 초기화
            await this.initIPModalData();
            await this.initPortModalData();
        },
        initAnyFlags() {
            this.is_source_ip_any = true;
            this.is_source_port_any = true;
            this.is_dest_ip_any = true;
            this.is_dest_port_any = true;
        },
        async initIPModalData() {
            await this.getIPList();
            this.ip_modal_data.dataType = 'Database';
            this.ip_modal_data.value = '';
            this.ip_modal_data.title = '';
            this.ip_modal_data.id = undefined;
        },
        async initPortModalData() {
            await this.getPortList();
            this.port_modal_data.dataType = 'Database';
            this.port_modal_data.value = '';
            this.port_modal_data.title = '';
            this.port_modal_data.id = undefined;
        },
        clearSelectedSrcIPList() {
            this.selected_src_ip_list = [];
        },
        clearSelectedSrcPortList() {
            this.selected_src_port_list = [];
        },
        clearSelectedDestIPList() {
            this.selected_dest_ip_list = [];
        },
        clearSelectedDestPortList() {
            this.selected_dest_port_list = [];
        },
        initIPModalDataWithoutType() {
            this.ip_modal_data.value = '';
            this.ip_modal_data.title = '';
        },
        initPortModalDataWithoutType() {
            this.port_modal_data.value = '';
            this.port_modal_data.title = '';
        },
        addIPToRule(type: TrafficDirectionType) {
            const id = uuidv4();
            this.ip_modal_data.id = id;
            if (type === 'SRC') {
                this.selected_src_ip_list.push({ ...this.ip_modal_data });
            } else if (type === 'DEST') {
                this.selected_dest_ip_list.push({ ...this.ip_modal_data });
            }
        },
        deleteIPFromRule(type: TrafficDirectionType, ipId: string) {
            if (type === 'SRC') {
                this.selected_src_ip_list = this.selected_src_ip_list.filter((ipData) => ipData.id !== ipId);
            } else if (type === 'DEST') {
                this.selected_dest_ip_list = this.selected_dest_ip_list.filter((ipData) => ipData.id !== ipId);
            }
        },
        addPortToRule(type: TrafficDirectionType) {
            const id = uuidv4();
            this.port_modal_data.id = id;

            if (type === 'SRC') {
                this.selected_src_port_list.push({ ...this.port_modal_data });
            } else if (type === 'DEST') {
                this.selected_dest_port_list.push({ ...this.port_modal_data });
            }
        },
        deletePortFromRule(type: TrafficDirectionType, portId: string) {
            if (type === 'SRC') {
                this.selected_src_port_list = this.selected_src_port_list.filter((portData) => portData.id !== portId);
            } else if (type === 'DEST') {
                this.selected_dest_port_list = this.selected_dest_port_list.filter(
                    (portData) => portData.id !== portId
                );
            }
        },
        async getIPList() {
            const searchData = {
                type_cd: 'IP',
                key: '',
                value: ''
            };
            const { data } = await axios.post('http://localhost:9000/api/variable/list', searchData);
            this.$state.ip_variable_list = data.variables;
            return data.variables;
        },

        async getPortList() {
            const searchData = {
                type_cd: 'PORT',
                key: '',
                value: ''
            };

            const { data } = await axios.post('http://localhost:9000/api/variable/list', searchData);
            this.$state.port_variable_list = data.variables;
            return data.variables;
        },

        /**
         * BasicOption
         */
        initBasicOptionData() {
            this.basic_options = { ...INIT_BASIC_OPTIONS };
        },

        /**
         * Payload
         */
        initPayload() {
            this.payload_data = { ...INIT_PAYLOAD };
            this.content_modifier_flag = false;
            this.content_modifier_type = '';
            ruleStore.payload_flag = false;
        },

        /**
         * content-modifier
         */
        initContentModifier() {
            this.content_modifier_flag = false;
            this.initContentModifierData();
        },

        initContentModifierData() {
            this.content_modifier_type = '';
            this.payload_data.offset = undefined;
            this.payload_data.depth = undefined;
            this.payload_data.distance = undefined;
            this.payload_data.within = undefined;
        },

        /**
         * Non-Payload
         */
        initNonPayload() {
            ruleStore.non_payload_flag = false;
            this.non_payload_data = JSON.parse(JSON.stringify(INIT_NON_PAYLOAD));
        },

        /**
         * Init Post Detection
         */
        initPostDetection() {
            ruleStore.post_detection_flag = false;
            this.initDetectionFilter();
        },

        initDetectionFilter() {
            ruleStore.detection_filter_flag = false;
            this.post_detection_data = { ...INIT_POST_DETECTION_DATA };
        },

        /**
         * Create Rule
         */
        async upsertRule(url: string) {
            const { data } = await axios.post(url, this.ruleDTO);
            return data;
        },

        /**
         * getRuleDetail
         */
        async getRuleDetail() {
            const { data } = await axios.post('http://localhost:9000/api/rule/detail', { id: this.id });
            if (data.data) {
                const ruleDetailData = data.data as IRuleDTO;
                //destructure data
                const {
                    rule_header: headerData,
                    rule_payload: payloadData,
                    rule_non_payload: nonPayloadData,
                    rule_detection_filter: detectionFilterData,
                    ...ruleBase
                } = ruleDetailData;

                this.rule_base.title = ruleBase.title;
                this.rule_base.action = ruleBase.action;

                if (headerData) {
                    this.rule_header_flag = true;
                    setDetailHeaderDataToStore(headerData);
                } else {
                    this.rule_header_flag = false;
                }

                if (ruleBase) {
                    this.basic_option_flag = true;
                    setBasicOptionDataToStore(ruleBase);
                } else {
                    this.basic_option_flag = false;
                }

                if (payloadData) {
                    this.payload_flag = true;
                    setPayloadOptionToStore(payloadData);
                } else {
                    this.payload_flag = false;
                }

                if (nonPayloadData) {
                    this.non_payload_flag = true;
                    setNonPayloadData(nonPayloadData);
                } else {
                    this.non_payload_flag = false;
                }

                if (detectionFilterData) {
                    this.post_detection_flag = true;
                    this.detection_filter_flag = true;
                    setDetectionFilterToStore(detectionFilterData);
                } else {
                    this.post_detection_flag = false;
                    this.detection_filter_flag = false;
                }
            }
        }
    }
});

export const ruleStore = useRuleStore();

/**
 * CheckBox 변화에 따라 관련 데이터 초기화(like watch)
 */
ruleStore.$subscribe(
    async (mutation, state) => {
        const { key, newValue, oldValue } = mutation.events as DebuggerEvent;

        switch (key) {
            /**
             * Rule Header Flag에 따라 초기화
             */
            case 'rule_header_flag':
                //RuleHeader 및 Non-Payload 초기화
                if (!newValue) {
                    await ruleStore.initHeaderData();
                    ruleStore.initNonPayload();
                }
                break;
            case 'is_source_ip_any':
                //any로 세팅하는 경우, Src IP 데이터 초기화
                if (!newValue) {
                    ruleStore.clearSelectedSrcIPList();
                }
                break;
            case 'is_source_port_any':
                //any로 세팅하는 경우, Src IP 데이터 초기화
                if (!newValue) {
                    ruleStore.clearSelectedSrcPortList();
                }
                break;
            case 'is_dest_ip_any':
                if (!newValue) {
                    ruleStore.clearSelectedDestIPList();
                }
                break;
            case 'is_dest_port_any':
                if (!newValue) {
                    ruleStore.clearSelectedDestPortList();
                }
                break;
            //protocol이 변화하는 경우, non-payload 값 초기화
            case 'protocol':
                ruleStore.initNonPayload();
                break;
            /**
             * Basic Option Flag에 따라 초기화
             */
            //BasicOption 초기화
            // case 'basic_option_flag':
            //     if (!newValue) {
            //         ruleStore.initBasicOptionData();
            //     }
            //     break;
            //Payload 초기화
            case 'payload_flag':
                if (!newValue) {
                    ruleStore.initPayload();
                }
                break;

            // Non-Payload 초기화
            case 'non_payload_flag':
                // NonPayload 초기화
                if (!newValue) {
                    ruleStore.initNonPayload();
                }
                break;
            // PostDetection 초기화
            case 'post_detection_flag':
                if (!newValue) {
                    ruleStore.initPostDetection();
                } else {
                    // 새롭게 post_detection 이 열리는 경우 항상 detection_filter도 함꼐 연다.
                    ruleStore.detection_filter_flag = true;
                }
                break;
            case 'detection_filter_flag':
                if (!newValue) {
                    ruleStore.initDetectionFilter();
                }
                break;
        }
    },
    { flush: 'sync' }
);

function setNonPayloadData(nonPayloadDetailData: IRuleNonPayloadDTO) {
    for (const property in nonPayloadDetailData) {
        if (Object.prototype.hasOwnProperty.call(nonPayloadDetailData, property)) {
            const value = nonPayloadDetailData[property as keyof IRuleNonPayloadDTO];
            // Process the value as needed
            const nonPayloadData = ruleStore.non_payload_data;
            if (property === 'rule_id') {
                continue;
            } else if (property === 'id' && value) {
                nonPayloadData[property] = value;
            } else if (value) {
                nonPayloadData[property].flag = true;
                nonPayloadData[property].data = value;
            }
        }
    }
}

/**
 * 조회한 headerDetail 정보를 store에 세팅하는 함수
 * @param headerData
 */
async function setDetailHeaderDataToStore(headerData: IRuleHeaderDTO) {
    const storeHeader = ruleStore.rule_header;
    if (headerData) {
        storeHeader.id = headerData.id;
        storeHeader.protocol = headerData.protocol;
        storeHeader.direction_operator = headerData.direction_operator;
        setAddressDataToStore('SRC', 'IP', headerData.source_address);
        setAddressDataToStore('SRC', 'PORT', headerData.source_port);
        setAddressDataToStore('DEST', 'IP', headerData.dest_address);
        setAddressDataToStore('DEST', 'PORT', headerData.dest_port);
    }
}

async function setAddressDataToStore(directionType: TrafficDirectionType, type: PortOrIPType, addressStr: string) {
    // Src인경우
    const parsedResult = convertAddressStringToList(addressStr);
    let targetList = '' as HeaderSelectedListLabelType;
    let targetFlagLabel = '' as HeaderFlagType;
    if (type === 'IP') {
        if (directionType === 'SRC') {
            targetList = 'selected_src_ip_list';
            targetFlagLabel = 'is_source_ip_any';
        } else if (directionType === 'DEST') {
            targetList = 'selected_dest_ip_list';
            targetFlagLabel = 'is_dest_ip_any';
        }
    } else if (type === 'PORT') {
        if (directionType === 'SRC') {
            targetList = 'selected_src_port_list';
            targetFlagLabel = 'is_source_port_any';
        } else if (directionType === 'DEST') {
            targetList = 'selected_dest_port_list';
            targetFlagLabel = 'is_dest_port_any';
        }
    }
    if (parsedResult.result === 'ANY') {
        //any인 경우,
        ruleStore[targetFlagLabel] = true;
    } else {
        //any가 아닌 경우,
        ruleStore[targetFlagLabel] = false;
        for (const address of parsedResult.address) {
            const obj = {} as AddressModalBaseType;
            obj.id = uuidv4();
            //Rule에 저장된 변수는 $표시로 시작한다.(Snort Rule)
            if (address.startsWith('$')) {
                obj.dataType = HEADER_TYPE.database;
                //Variable에 있는 변수는 $를 제외한 상태로 저장되어 있다. -> $제외하고 검색
                const titleWithoutPrefix = address.slice(1);
                const found = await getVariableDatas(titleWithoutPrefix);
                obj.title = titleWithoutPrefix;
                obj.value = found.variables[0].value;
            } else {
                obj.dataType = HEADER_TYPE.manual;
                obj.value = address;
                obj.title = '';
            }
            ruleStore[targetList].push(obj);
        }
    }
}

function convertAddressStringToList(address: string): {
    result: 'ANY' | 'MULTI' | 'SINGLE';
    address: string | string[];
} {
    // 여러개의 주소로 이루어진 경우
    if (address.toLowerCase() === 'any') {
        return {
            result: 'ANY',
            address: address
        };
    }
    if (isListFormatString(address)) {
        return {
            result: 'MULTI',
            address: convertListStringToList(address)
        };
    } else {
        //단일 주소인 경우
        return {
            result: 'SINGLE',
            address: [address]
        };
    }
}

function isListFormatString(str: string) {
    return str.trim().startsWith('[') && str.trim().endsWith(']');
}

function convertListStringToList(strs: string) {
    const withoutBracketStr = strs.trim().slice(1, strs.length - 1);
    return withoutBracketStr.split(',');
}

function setBasicOptionDataToStore(ruleBaseData: RuleBasicOptionType) {
    const ruleBasicOptions = ruleStore.basic_options;
    ruleBasicOptions.msg = ruleBaseData.msg ?? '';
    ruleBasicOptions.gid = ruleBaseData.gid ?? undefined;
    ruleBasicOptions.rev = ruleBaseData.rev ?? undefined;
    ruleBasicOptions.sid = ruleBaseData.sid ?? undefined;
}

function setPayloadOptionToStore(rulePayloadData: IRulePayloadDTO) {
    const { id, rule_id, ...withoutIds } = rulePayloadData;
    ruleStore.payload_data = { ...withoutIds };
    if (hasContentModifierValue(withoutIds)) {
        //contentModifier값이 일단 있는 경우라면, flag true
        ruleStore.content_modifier_flag = true;
        //CONTENT_MODIFIER_TYPE 설정
        if (hasOffsetValue(withoutIds)) {
            ruleStore.content_modifier_type = CONTENT_MODIFIER_TYPE.offset;
        } else {
            ruleStore.content_modifier_type = CONTENT_MODIFIER_TYPE.distance;
        }
    }
}

function setDetectionFilterToStore(detectionFilterData: IRuleDetectionFilterDTO) {
    const { id, rule_id, ...withoutIds } = detectionFilterData;
    ruleStore.post_detection_data = { ...withoutIds };
}

function hasContentModifierValue(rulePayloadData: IRulePayloadDTO) {
    return hasOffsetValue(rulePayloadData) || hasDistanceValue(rulePayloadData);
}

function hasOffsetValue(rulePayloadData: IRulePayloadDTO) {
    return !isFalsyValue(rulePayloadData.offset) || !isFalsyValue(rulePayloadData.depth);
}
function hasDistanceValue(rulePayloadData: IRulePayloadDTO) {
    return !isFalsyValue(rulePayloadData.distance) || !isFalsyValue(rulePayloadData.within);
}

function isFalsyValue(value: string | number | undefined | null) {
    if (value === 0) {
        return false;
    }
    return !value;
}
async function getVariableDatas(title: string) {
    const { data } = await axios.post('http://localhost:9000/api/variable/detail/key', { key: title });
    return data;
}

/**
 * srcIp, srcPort, destIp, destPort 리스트를 snort Rule에 사용할 수 있는 String으로 변환해주는 함수
 * @param addressList
 */
function addressListToString(addressList: AddressModalBaseType[]) {
    let str = addressList
        .map((addressData) => {
            if (addressData.dataType === 'Database') {
                return `$${addressData.title}`;
            } else {
                return addressData.value;
            }
        })
        .join(',');

    //1개 이상의 address는 square bracket으로 묶어준다.
    if (addressList.length > 1) {
        str = '[' + str + ']';
    }

    return str;
}
