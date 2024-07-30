import { Exclude, Expose } from 'class-transformer';
import dayjs from 'dayjs';

type PrismaWhereOperatorType =
    | 'equals'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'ignore';
const searchDomainKeys = ['create_time_from', 'create_time_to', 'paging', 'page_per_data', 'page', 'sort'];

export interface ISearchDomain {
    create_time_from?: Date | string;
    create_time_to?: Date | string;
    paging: string;
    page_per_data: number;
    page: number;
    sort: string;
}

@Exclude()
export class SearchDomain {
    @Expose()
    create_time_from?: Date | string;
    @Expose()
    create_time_to?: Date | string;

    @Expose()
    paging: string;
    @Expose()
    page_per_data: number;
    @Expose()
    page: number;
    @Expose()
    sort: string;

    constructor(
        paging: string,
        page_per_data: number,
        page: number,
        sort: string,
        create_time_from?: Date | string,
        create_time_to?: Date | string
    ) {
        this.create_time_from = create_time_from;
        this.create_time_to = create_time_to;
        this.paging = paging;
        this.page = page;
        this.page_per_data = page_per_data;
        this.sort = sort;
    }

    @Expose()
    getSkipNumber() {
        if (!this.page_per_data || !this.page) {
            return 0;
        }
        return this.page_per_data * (this.page - 1);
    }

    @Expose()
    removeSearchDomainField<T extends SearchDomain>(instance: T) {
        const { create_time_from, create_time_to, paging, page_per_data, page, sort, ...withoutSearchDomain } =
            instance;
        return withoutSearchDomain;
    }

    @Expose()
    getWhereClause<T extends SearchDomain & { [key: string]: any }>(
        instance: T,
        options?: Partial<{ [key in keyof T]: PrismaWhereOperatorType }>
    ) {
        const whereClause: { [key: string]: any } = {};
        //1. instance에서 undefined, null, emptyString 제외한 값들을 where절에 넣는다.
        //   단, options에 전달 받은 field가 있는 경우에는 options에 전달된 값에 따라 설정해준다.
        // { title: { contains: "value" }}

        for (const property of Object.keys(instance) as Array<keyof T>) {
            const value = instance[property];
            if (value === undefined || value === null || value === '') {
                continue;
            }
            //생성시간으로 조회하는 경우,
            if (property === 'create_time_from' || property === 'create_time_to') {
                if (!whereClause.create_time) {
                    whereClause.create_time = {};
                }
                if (property === 'create_time_from') {
                    whereClause.create_time.gte = dayjs(value).utc().toDate();
                }
                if (property === 'create_time_to') {
                    whereClause.create_time.lte = dayjs(value).utc().toDate();
                }
            } else {
                // 생성시간 이외의 필드값 세팅
                if (searchDomainKeys.includes(property as string)) {
                    continue;
                } else if (options && property in options) {
                    // 사용자가 따로 명시한 조건이 있는 경우
                    // 생성시간으로 조회한 경우 범위로 생성
                    const operator = options[property] as PrismaWhereOperatorType;
                    if (operator === 'ignore') continue;
                    else whereClause[property as string] = { [operator]: value };
                } else {
                    //사용자가 따로 조건을 명시하지 않은 경우, equals로 생성
                    whereClause[property as string] = value;
                }
            }
        }
        return whereClause;
    }
}
