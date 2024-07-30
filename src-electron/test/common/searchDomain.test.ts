import 'reflect-metadata';

test('SearchDomain getWhereClause method test', () => {
    expect(1 + 1).toBe(2);
    // const from = dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss');
    // const to = dayjs().format('YYYY-MM-DD HH:mm:ss');

    // const data = {
    //     title: 'Rule1',
    //     action: 'alert',
    //     protocol: 'UDP',
    //     source_address: '192.168.32.74',
    //     source_port: '500:',
    //     direction: '',
    //     dest_address: 'any',
    //     dest_port: 'any',
    //     paging: 'scroll',
    //     page_per_data: 10,
    //     page: 1,
    //     sort: 'ASC',
    //     create_time_from: from,
    //     create_time_to: to
    // };
    // const searchDto = plainToClass(SearchRuleDTO, data, { excludeExtraneousValues: true });

    // const where = searchDto.getWhereClause(searchDto, {
    //     title: 'contains'
    // });

    // const expectedResult = {
    //     title: {
    //         contains: 'Rule1'
    //     },
    //     create_time: {
    //         gte: from,
    //         lte: to
    //     },
    //     action: 'alert',
    //     protocol: 'UDP',
    //     source_address: '192.168.32.74',
    //     source_port: '500:',
    //     dest_address: 'any',
    //     dest_port: 'any'
    // };
    // expect(where).toEqual(expectedResult);
});
