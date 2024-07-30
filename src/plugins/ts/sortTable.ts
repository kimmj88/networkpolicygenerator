import { base } from '@/plugins/ts/base';

export function sortTable(searchData?: { [x: string]: any }, searchFunc?: Function) {
    const { gProp, commonts } = base();

    const ascNm = 'asc';
    const descNm = 'desc';
    const seqClsNm = 'sort-seq-';

    function setTargetClass(
        target: HTMLElement,
        addClassNm: string | Array<string>,
        removeClassNm: string | Array<string>
    ) {
        // console.log(target, addClassNm, removeClassNm);
        if (!commonts.isEmpty(removeClassNm)) {
            if (Array.isArray(removeClassNm)) {
                removeClassNm.forEach((value: any) => {
                    target.classList.remove(value);
                });
            } else {
                target.classList.remove(removeClassNm);
            }
        }

        if (!commonts.isEmpty(addClassNm)) {
            if (Array.isArray(addClassNm)) {
                addClassNm.forEach((value: any) => {
                    target.classList.add(value);
                });
            } else {
                target.classList.add(addClassNm);
            }
        }
    }

    function setSortMessage(target: HTMLElement, retArr: Array<string>) {
        commonts.debugLog(gProp, ['setSortMessage', retArr]);

        console.log('setSortMessage');
        if (target?.dataset?.id !== undefined && !target?.dataset?.id?.includes('noSearchKey')) {
            console.log('setSortMessage');

            target
                ?.closest('.table-sort')
                ?.querySelectorAll('span.header')
                .forEach((tItem) => {
                    if (tItem !== null && tItem instanceof HTMLElement) {
                        let ret = '';

                        // 각 컬럼 sort 조건 조회
                        let sortRet = '';
                        if (tItem?.classList.contains(ascNm)) {
                            sortRet = tItem?.dataset?.id + ' ' + ascNm;
                        } else if (tItem?.classList.contains(descNm)) {
                            sortRet = tItem?.dataset?.id + ' ' + descNm;
                        }

                        // console.log(sortRet);
                        let notExistFlag = true;
                        // 기존 Sort 에 포함 여부 체크하여 있는 경우 변경, 없으면 기존 조건 retArr 순서대로 저장
                        retArr.forEach((value: any) => {
                            const data = value.trim();
                            if (data.split(' ')[0] === tItem.dataset.id) {
                                if (sortRet !== '') {
                                    ret += (ret !== '' ? ',' : '') + sortRet;
                                    notExistFlag = false;
                                }
                            } else {
                                ret += (ret !== '' ? ',' : '') + data;
                            }
                        });

                        if (notExistFlag && sortRet !== '') {
                            ret += (ret !== '' ? ',' : '') + sortRet;
                        }
                        retArr = ret.split(',');
                    }
                });
        }
        return retArr;
    }

    function setSeqClass(target: HTMLElement, retArr: Array<string>) {
        const removeSeqClass = new Array();

        // 지울 class 목록 array 작성
        const len = retArr.length * 2;
        for (let t = 0; t < len; t++) {
            removeSeqClass.push(seqClsNm + (Number(t) + 1));
        }

        if (target?.dataset?.id !== undefined && !target?.dataset?.id?.includes('noSearchKey')) {
            target
                ?.closest('.table-sort')
                ?.querySelectorAll('span.header')
                ?.forEach((targetItem) => {
                    if (targetItem !== null && targetItem instanceof HTMLElement) {
                        // sort 제외 중 순번 있는 부분 제거
                        setTargetClass(targetItem, '', removeSeqClass);
                        retArr.forEach((value, idx) => {
                            const data = value.trim();
                            // console.log(data.split(" ")[0], removeSeqClass);
                            if (data.split(' ')[0] === targetItem?.dataset?.id) {
                                // sort 대상 순번 처리
                                setTargetClass(targetItem as HTMLElement, seqClsNm + (Number(idx) + 1), removeSeqClass);
                            }
                        });
                    }
                });
        }
    }

    function setEllipsisClass(item: HTMLElement) {
        // 46 자 이상의 테이블 제목은 ellipsis 정렬이미지 안보임
        const orderFixClsNm = 'order-fix-';

        item.classList.add(orderFixClsNm + 'fixed');

        if (item.offsetWidth < item.scrollWidth) {
            // order-fix 있으면 제거
            for (let i = 0; i <= 20; i++) {
                if (item.classList.contains(orderFixClsNm + i)) {
                    item.classList.remove(orderFixClsNm + i);
                }
            }

            const classIdx = (item.scrollWidth - item.offsetWidth) / 22;
            const idx = classIdx > 1.5 ? Math.ceil(classIdx) : 1;

            if (classIdx >= 0) {
                if (item.classList.contains(orderFixClsNm + 'fixed')) {
                    item.classList.remove(orderFixClsNm + 'fixed');
                }

                item.classList.add(orderFixClsNm + idx);
            }
        }
    }

    function click(e: Event) {
        let target: HTMLElement;
        // target 은 span 으로 잡힘
        if (e?.currentTarget instanceof HTMLElement) {
            // 하위 엘리먼트 이벤트 처리 되는 것을 막기 위해 target 대신 currentTarget 사용
            target = e?.currentTarget;

            // target id 값이 없는 경우, id에 "noSearchKey" 문자열 포함시 정렬 처리 안함
            // console.log(target, target.dataset.id);
            if (target?.dataset?.id !== undefined && !target?.dataset?.id?.includes('noSearchKey')) {
                // 현재 Sort 방식 세팅
                console.log(target, target.classList);
                if (target.classList.contains(ascNm)) {
                    setTargetClass(target, descNm, ascNm);
                } else if (target.classList.contains(descNm)) {
                    setTargetClass(target, '', descNm);
                } else {
                    setTargetClass(target, ascNm, '');
                }

                // 사용중인 Sort Message 조회
                let retArr = searchData?.sort.split(',');

                // Sort Message 작성
                retArr = setSortMessage(target, retArr);

                // Sort 순번 붙이기
                setSeqClass(target, retArr);

                if (searchFunc !== undefined) searchFunc({ sort: retArr.join(','), page: 1 });
            }
        }
    }

    function setTableSort(item: Element) {
        // 마우스 포인터 처리
        item.classList.add('cp');

        setEllipsisClass(item as HTMLElement);

        // console.log(item, searchData?.sort);
        // 현재 사용중인 Sort Message 조회
        if (!commonts.isEmpty(searchData?.sort)) {
            const currRetArr = searchData?.sort?.split(',');

            // div class table
            const itemId = (item as HTMLElement)?.dataset?.id;
            currRetArr.forEach((value: string, idx: number) => {
                const data = value.trim();
                if (data.split(' ')[0] === itemId) {
                    if (item instanceof HTMLElement) {
                        // sort 대상 순번 처리
                        setTargetClass(item, [data.split(' ')[1], seqClsNm + (Number(idx) + 1)], '');
                    }
                }
            });
        }

        item.removeEventListener('click', click);
        item.addEventListener('click', click);
    }
    function initTableSort() {
        // sort msg 처리하는 class가 있는 경우
        // div class table
        const sortElement = document.querySelectorAll('.table-sort span.header');
        if (sortElement.length > 0) {
            sortElement.forEach((item) => {
                setTableSort(item);
            });
        }
    }

    initTableSort();
}

export default sortTable;
