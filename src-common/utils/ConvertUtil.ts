import { IRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { IRuleDetectionFilterDTO } from '@cm/types/domain/dto/rule/ruleDetectionFilterDTO';
import { IRuleHeaderDTO } from '@cm/types/domain/dto/rule/ruleHeaderDTO';
import { IRuleNonPayloadDTO } from '@cm/types/domain/dto/rule/ruleNonPayloadDTO';
import { IRulePayloadDTO } from '@cm/types/domain/dto/rule/rulePlayloadDTO';

const STRING_FORMAT_LIST = ['msg', 'content', 'pcre'];

export type SnakeToCamel<T> =
    T extends Array<infer U>
        ? Array<SnakeToCamel<U>>
        : T extends object
          ? { [K in keyof T as CamelCase<string & K>]: SnakeToCamel<T[K]> }
          : T;

export type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
    ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
    : S;

export const stringCamelToSnake = (data: any) =>
    data.replace(/([A-Z])/g, (_: Event, letter: string) => '_' + letter.toLowerCase());

export const camelToSnake = <T extends string>(obj: T): CamelCase<T> => {
    // console.log('snakeToCamel ====>', typeof obj, (obj as any) instanceof Date, obj);
    if (Array.isArray(obj)) {
        return obj.map((v) => camelToSnake(v)) as any;
    } else if (obj !== null && typeof obj === 'object' && (obj as any) instanceof Date) {
        return obj as any;
    } else if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const snakeKey = key.replace(/([A-Z])/g, (_, letter) => '_' + letter.toLowerCase()) as keyof T;
            return { ...acc, [snakeKey]: camelToSnake(value as any) } as any;
        }, {}) as any;
    }
    return obj as any;
};

export const stringSnakeToCamel = (data: any) =>
    data.replace(/_([a-z])/g, (_: Event, letter: string) => letter.toUpperCase());

export const snakeToCamel = <T extends string>(obj: T): SnakeToCamel<T> => {
    // console.log('snakeToCamel ====>', typeof obj, (obj as any) instanceof Date, obj);
    if (Array.isArray(obj)) {
        return obj.map((v) => snakeToCamel(v)) as any;
    } else if (obj !== null && typeof obj === 'object' && (obj as any) instanceof Date) {
        return obj as any;
    } else if (obj !== null && typeof obj === 'object') {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const camelKey = stringSnakeToCamel(key) as keyof T;
            return { ...acc, [camelKey]: snakeToCamel(value as any) } as any;
        }, {}) as any;
    }
    return obj as any;
};

// deepCopy
function copyObj<T>(obj: T) {
    const result = {} as any;
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            result[key] = copyObj(obj[key]);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

export const dataCopy = <T extends object>(target: T, source: any, exclude?: string[]) => {
    let retData = copyObj(target);
    Object.keys(retData).map((key) => (retData[key] = source[key] ? source[key] : retData[key]));
    if (exclude) {
        exclude.forEach((key) => delete retData[key]);
    }

    // console.log('copy data ====>', retData);
    return retData;
};

/**
 * DB에서 찾은 RuleDTO 객체를 실제 SnortRule(String format)으로 변환하는 함수
 * @param ruleDTO
 * @returns
 */
export function convertRuleObjectToSnortRule(ruleDTO: IRuleDTO) {
    const header = getRuleHeaderText(ruleDTO.rule_header);
    const bodyText = getRuleBodyText(ruleDTO);

    return `${ruleDTO.action} ${header} ${bodyText}`;
}

function getRuleHeaderText(ruleHeader?: IRuleHeaderDTO) {
    if (!ruleHeader) return '';
    return `${ruleHeader.protocol} ${ruleHeader.source_address} ${ruleHeader.source_port} ${ruleHeader.direction_operator} ${ruleHeader.dest_address} ${ruleHeader.dest_port}`;
}
export function getRuleBodyText(ruleDTO: IRuleDTO) {
    let result = '(';
    const basicOption = getRuleBasicOptionText(ruleDTO);
    result += basicOption;
    if (ruleDTO.rule_payload) {
        const payload = getPayloadText(ruleDTO.rule_payload);
        if (payload.length > 0) {
            result += ` ${payload}`;
        }
    }
    if (ruleDTO.rule_non_payload) {
        const nonPayload = getNonPayloadText(ruleDTO.rule_non_payload);
        if (nonPayload.length > 0) {
            result += ` ${nonPayload}`;
        }
    }
    if (ruleDTO.rule_detection_filter) {
        const detectionFilter = getDetectionFilterText(ruleDTO.rule_detection_filter);
        if (detectionFilter.length > 0) {
            result += ` ${detectionFilter}`;
        }
    }
    // return
    return (result += ')');
}

function getRuleBasicOptionText(ruleDto: IRuleDTO) {
    const msg = ruleDto.msg ? `msg:\"${ruleDto.msg}\";` : '';
    const gid = ruleDto.gid ? `gid:${ruleDto.gid};` : '';
    const sid = ruleDto.sid ? `sid:${ruleDto.sid};` : '';
    const rev = ruleDto.rev ? `rev:${ruleDto.rev};` : '';

    return `${msg} ${gid} ${sid} ${rev}`;
}

export function getPayloadText(payload: IRulePayloadDTO) {
    let str = '';
    if (payload.content) {
        const fastPatterStr = payload.fast_pattern ? ',fast_pattern' : '';
        const negationStr = payload.negation ? '!' : '';
        const contentStr = `content:${negationStr}\"${payload.content}\"${fastPatterStr}`;

        let offsetStr = payload.offset ? `offset ${payload.offset}` : '';
        let depthStr = payload.depth ? `depth ${payload.depth}` : '';
        let distanceStr = payload.distance ? `distance ${payload.distance}` : '';
        let withinStr = payload.within ? `within ${payload.within}` : '';

        let modifierStr = contentStr;
        if (contentStr.length === 0) return '';
        else {
            if (offsetStr) {
                modifierStr += ', ' + offsetStr;
            }
            if (depthStr) {
                modifierStr += ', ' + depthStr;
            }
            if (distanceStr) {
                modifierStr += ', ' + distanceStr;
            }
            if (withinStr) {
                modifierStr += ', ' + withinStr;
            }
        }
        modifierStr += ';';
        str = modifierStr;
    }
    if (payload.pcre) {
        const space = str.length > 0 ? ' ' : '';
        str += `${space}pcre:\"${payload.pcre}\";`;
    }

    return str;
}

export function getNonPayloadText(nonPayload: IRuleNonPayloadDTO) {
    let result = objToBasicSnortRule(nonPayload);
    return result;
}

export function getDetectionFilterText(detectionFilter: IRuleDetectionFilterDTO) {
    if (!detectionFilter.track.length || detectionFilter.track.length === 0) return '';
    return `detection_filter:track ${detectionFilter.track}, count ${detectionFilter.count}, seconds ${detectionFilter.seconds};`;
}

/**
 * Object를 Snort Rule format(String)으로 만드는 함수
 * @param snortObj
 * @returns
 */
export function objToBasicSnortRule(snortObj: { [key: string]: any }) {
    let str = '';
    for (const property in snortObj) {
        const value = snortObj[property];
        if (value && value.length > 0) {
            const isStringFormat = STRING_FORMAT_LIST.includes(property);
            const doublequote = isStringFormat ? '"' : '';
            if (str.length > 0) str += ' ';

            str += `${property}:${doublequote}${value}${doublequote}`;

            str += ';';
        }
    }
    return str;
}

/**
 * String Type의 Dotnotation을 이용하여 object에서 값을 찾아내는 함수.
 * @param obj key가 string타입의 Object
 * @param path Sting Type의 dotnoation. e.g. "key1.key2.etc"
 * @returns Object[key1][key2][etc]
 */
export function getValueWithStringDotnotation(obj: { [key: string]: any }, path: string): any {
    try {
        return path.split('.').reduce((acc, cur) => acc[cur], obj);
    } catch (error) {
        return undefined;
    }
}
