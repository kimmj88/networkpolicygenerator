import { SearchDomain } from '@cm/types/domain/common/searchDomain';
import dayjs from '@cm/utils/time/dayjs';
import { pageDomain } from './pageDomain';

const currentTime = dayjs().utc();

export const searchDomain: SearchDomain = {
    ...pageDomain,

    // 검색기간
    create_time_from: currentTime.subtract(1, 'M').toDate(),
    create_time_to: currentTime.toDate()
};
