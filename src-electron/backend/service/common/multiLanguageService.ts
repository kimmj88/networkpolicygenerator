import { setMultiLanguageOptions } from '@cm/types/be/service/multilanguage/multiLanguage';

const checkFilter = <T, mlT>(dto: T, mlDto: mlT, filter: { [x: string]: string }) => {
    const filterSize = Object.keys(filter).length;
    if (filterSize > 0) {
        let trueCnt = 0;
        Object.entries(filter).forEach((value: [string, string]) => {
            trueCnt += (dto as any)[value[0]] === (mlDto as any)[value[1]] ? 1 : 0;
        });
        return trueCnt === filterSize;
    } else {
        return false;
    }
};

export function setMlData<T, mlT>(dto: T, mlDtoList: mlT[], options: setMultiLanguageOptions) {
    let mlInfo: mlT[] = [];
    mlDtoList.filter((ml: mlT) => checkFilter(dto, ml, options.filter)).forEach((ml: mlT) => mlInfo.push(ml));

    (dto as any)[options.target] = mlInfo;
    return dto;
}

export function setMlDatas<T, mlT>(dtoList: T[], mlDtoList: mlT[], options: setMultiLanguageOptions) {
    let retList: T[] = [];
    dtoList.forEach((dto: T) => {
        const mlData: T = setMlData(dto, mlDtoList, options);
        retList.push(mlData);
    });
    return retList;
}
