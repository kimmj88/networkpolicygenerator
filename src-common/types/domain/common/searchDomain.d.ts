export interface SearchDomain extends Partial<PageDomain> {
    // 검색기간
    create_time_from: Date;
    create_time_to: Date;
}
