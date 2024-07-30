import * as convertUtil from '@cm/utils/ConvertUtil';
import dayjs from '@cm/utils/time/dayjs';

export const SEARCH_KEY = 'create_time';
export const SEARCH_FROM_TIME_KEY = 'create_time_from';
export const SEARCH_TO_TIME_KEY = 'create_time_to';
export const SORT_KEY = 'sort';

export const baseExclude: string[] = ['paging', 'page_per_data', 'page', 'sort', 'svc_type', 'curr_lang_cd'];

export type PrismaWhereOperatorType = 'equals' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'startsWith' | 'endsWith';
export type OrderBy = 'asc' | 'desc';

export type whereClauseOptions<T> = {
    operator?: Partial<{ [key in keyof T]: PrismaWhereOperatorType }>;
    include?: { [x: string]: any };
    exclude?: Array<string>;
    paging?: boolean;
};

export function makeDbClause<T extends { [key: string]: any }>(
    searchData: T,
    options?: whereClauseOptions<T>,
    optionsDefault?: whereClauseOptions<T>
) {
    let whereClauseOptions = { ...(options ?? optionsDefault ?? ({} as any)) };
    if (options && optionsDefault) {
        whereClauseOptions =
            Object.keys(options).length > 0 ? convertUtil.dataCopy(optionsDefault, options) : { ...optionsDefault };
    }

    let retClause = {} as any;

    if (Object.keys(searchData).length > 0) {
        const whereClause: { [key: string]: any } = makeWhereClause(searchData, whereClauseOptions);
        const orderByClause: { [x: string]: OrderBy }[] = makeOrderBy(searchData[SORT_KEY]);

        if (options?.paging === true) {
            const paging = makePagingInfo(searchData);
            retClause = {
                ...paging
            } as any;
        }
        if (Object.keys(whereClause).length > 0) {
            retClause.where = whereClause;
        }
        if (orderByClause.length > 0) {
            retClause.orderBy = orderByClause;
        }
    }

    if (whereClauseOptions?.include) {
        retClause.include = whereClauseOptions.include;
    }

    return retClause;
}

function setSearchTime(property: string, value: string | Date) {
    const condition = property === SEARCH_FROM_TIME_KEY ? 'gte' : 'lte';
    const checkValue = dayjs.utc(value);
    return { cond: condition, value: checkValue };
}

function makeWhereClause<T extends { [key: string]: any }>(searchData: T, options?: whereClauseOptions<T>) {
    const whereClause: { [key: string]: any } = {};
    for (const property of Object.keys(searchData) as Array<keyof T>) {
        const excludeArr = options?.exclude ? baseExclude.concat(options?.exclude) : baseExclude;
        const value = searchData[property];
        if (excludeArr.includes(property as string) || value === undefined || value === null || value === '') {
            continue;
        }

        //생성시간으로 조회하는 경우,
        if (property === SEARCH_FROM_TIME_KEY || property === SEARCH_TO_TIME_KEY) {
            if (!whereClause[SEARCH_KEY]) {
                whereClause[SEARCH_KEY] = {} as any;
            }
            const data = setSearchTime(property, value);
            whereClause[SEARCH_KEY][data.cond] = data.value;
            continue;
        }

        // 생성시간 이외의 필드값 세팅
        // 사용자가 따로 명시한 조건이 있는 경우
        if (options?.operator && property in options.operator) {
            // 생성시간으로 조회한 경우 범위로 생성
            const operator = options?.operator[property] as PrismaWhereOperatorType;
            whereClause[property as string] = { [operator]: value };
            continue;
        }

        //사용자가 따로 조건을 명시하지 않은 경우, equals로 생성
        whereClause[property as string] = value;
    }
    return whereClause;
}

export function makePagingInfo<T extends { [key: string]: any }>(data: T) {
    let paging = {
        skip: data?.page_per_data && data?.page ? data.page_per_data * (data.page - 1) : 0,
        take: data?.page_per_data ?? 10
    };
    return paging;
}

export function makeOrderBy(data: string) {
    let orderByArr: { [x: string]: OrderBy }[] = [];
    const sortArr = data ? convertUtil.stringCamelToSnake(data)?.split(',') : [];
    sortArr?.forEach((orderStr: string) => {
        let order: { [x: string]: OrderBy } = {};
        const orderStrs = orderStr.trim().split(' ');
        if (orderStrs.length === 2) {
            order[orderStrs[0]] = orderStrs[1].toLowerCase() as OrderBy;
            orderByArr.push(order);
        }
    });
    return orderByArr;
}
