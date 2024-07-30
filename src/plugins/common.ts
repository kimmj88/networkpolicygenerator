import { axios } from '@/plugins/ts/axios';
import { commonVar } from '@/plugins/ts/commonVar';
import { sortTable } from '@/plugins/ts/sortTable';
import { validate } from '@/plugins/ts/validate';
import type { IInput } from '@/types/types';
import type { ModalInterface, ModalOptions } from 'flowbite';
import { Modal } from 'flowbite';

export default {
    install: (app: any) => {
        app.config.globalProperties.$commonts = {
            getXsrfToken(gProp: Record<string, any>) {
                let target = gProp.$cookies.get('XSRF-TOKEN-' + this.getCompName(gProp).toUpperCase());
                if (target === undefined) {
                    target = gProp.$cookies.get('XSRF-TOKEN-ALL');
                }
                return target;
            },
            async getComponentVersion(gProp: Record<string, any>) {
                const { getAxiosOptions, getErrorFunc, isAxiosFlag } = axios();
                const self = this;

                if (!isAxiosFlag.value) {
                    isAxiosFlag.value = true;
                    const res = await gProp?.axios
                        .post(self.getUrl(gProp, '/api/webui/version'), {}, getAxiosOptions('DATA', {}))
                        .then(function (response: any) {
                            isAxiosFlag.value = false;
                            return response.data;
                        })
                        .catch(getErrorFunc);
                    return res;
                }
            },
            async getCmGrpCd(gProp: Record<string, any>, grpCd: string) {
                console.log(gProp);
                /**
                // const { svcType } = commonVar();
                // const { getAxiosOptions, isAxiosFlag, getFinallyFunc } = axios();
                // const self = this;

                // self.showLoading();

                // const body = {
                // 	grp_cd: grpCd,
                // 	grp_cd_nm: "",
                // 	use_yn: "Y",
                // 	sort: "grpCd asc", // 기본 정렬 기준
                // 	all_data_flag: true,
                // 	page_per_data: 99999, // 공통코드 조회시에는 전체 개수가 보여야 하므로 최대값 설정
                // 	svc_type: svcType.value,
                // };

                // // eslint-disable-next-line
                // if (!isAxiosFlag.value) {
                // 	isAxiosFlag.value = true;
                // 	const res = await gProp?.axios
                // 		.post(self.getUrl(gProp, "/management/code/grpcode/list"), body, getAxiosOptions("DATA", {}))
                // 		.then(function (response: any) {
                // 			isAxiosFlag.value = false;
                // 			return response.data;
                // 		})
                // 		.catch(function (error: any) {
                // 			if (error?.response) {
                // 				if (
                // 					(error?.response?.status === 401 &&
                // 						error?.response?.statusText === "UNAUTHORIZED") ||
                // 					error?.response?.status === 405
                // 				) {
                // 					self.notificationShow(
                // 						gProp,
                // 						"error",
                // 						gProp.$t("msg.error.info.unauthorized.default")
                // 					);
                // 					gProp.stores.common.emitter.emit("logout");
                // 				} else {
                // 					self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 				}
                // 			} else {
                // 				self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 			}
                // 			return "";
                // 		})
                // 		.finally(getFinallyFunc);
                // 	return res;
                // }
                 */
                window.ipcRenderer.send('mng_grp_code_list', { grp_cd: grpCd });
                window.ipcRenderer.once('mng_grp_code_list_return', (_evt, ret) => ret);
            },
            async getCmCds(gProp: Record<string, any>, grpCd: Array<string>, setData: Function) {
                console.log(gProp);
                // // grpCd 는 배열로 전달한다.
                // const { svcType } = commonVar();
                // const { getAxiosOptions, isAxiosFlag, getFinallyFunc } = axios();
                // const self = this;

                // self.showLoading();

                // const body = {
                // 	grp_cd: grpCd.join(","),
                // 	use_yn: "Y",
                // 	sort: "sortOrder asc", // 기본 정렬 기준
                // 	all_data_flag: true,
                // 	page_per_data: 99999, // 공통코드 조회시에는 전체 개수가 보여야 하므로 최대값 설정
                // 	language_code: gProp.stores.common.currentLang,
                // 	svc_type: svcType.value,
                // };

                // if (!isAxiosFlag.value) {
                // 	// eslint-disable-next-line
                // 	isAxiosFlag.value = true;
                // 	const res = await gProp?.axios
                // 		.post(self.getUrl(gProp, "/management/code/code/lists"), body, getAxiosOptions("DATA", {}))
                // 		.then(function (response: { data: any }) {
                // 			isAxiosFlag.value = false;
                // 			return response?.data;
                // 		})
                // 		.catch(function (error: { response: { status: number; statusText: string } }) {
                // 			if (error?.response) {
                // 				if (
                // 					(error?.response?.status === 401 &&
                // 						error?.response?.statusText === "UNAUTHORIZED") ||
                // 					error?.response?.status === 405
                // 				) {
                // 					self.notificationShow(
                // 						gProp,
                // 						"error",
                // 						gProp.$t("msg.error.info.unauthorized.default")
                // 					);
                // 					gProp.stores.common.emitter.emit("logout");
                // 				} else {
                // 					self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 				}
                // 			} else {
                // 				self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 			}
                // 			return "";
                // 		})
                // 		.finally(getFinallyFunc);
                // 	return res;
                // }

                window.ipcRenderer.send('mng_code_lists', {
                    grp_cd: grpCd.join(','),
                    use_yn: 'Y',
                    sort: 'sort_order asc'
                });
                return window.ipcRenderer.once('mng_code_lists_return', (_evt, ret) => setData(ret));
                // window.ipcRenderer.send('mng_code_lists', {
                //     grp_cd: grpCd.join(','),
                //     use_yn: 'Y',
                //     sort: 'sort_order asc'
                // });
                // window.ipcRenderer.once('mng_code_lists_return', (_evt, ret) => ret);
            },
            async getCmCd(gProp: Record<string, any>, grpCd: string, cd: string) {
                console.log(gProp);
                // const { svcType } = commonVar();
                // const { getAxiosOptions, isAxiosFlag, getFinallyFunc } = axios();
                // const self = this;

                // self.showLoading();

                // const body = {
                // 	grp_cd: grpCd,
                // 	cd: cd,
                // 	cd_nm: "",
                // 	use_yn: "Y",
                // 	sort: "sortOrder asc", // 기본 정렬 기준
                // 	all_data_flag: true,
                // 	page_per_data: 99999, // 공통코드 조회시에는 전체 개수가 보여야 하므로 최대값 설정
                // 	language_code: gProp.stores.common.currentLang,
                // 	svc_type: svcType.value,
                // };

                // // eslint-disable-next-line
                // if (!isAxiosFlag.value) {
                // 	isAxiosFlag.value = true;
                // 	const res = await gProp?.axios
                // 		.post(self.getUrl(gProp, "/management/code/code/list"), body, getAxiosOptions("DATA", {}))
                // 		.then(function (response: any) {
                // 			isAxiosFlag.value = false;
                // 			return response.data;
                // 		})
                // 		.catch(function (error: any) {
                // 			if (error?.response) {
                // 				if (
                // 					(error?.response?.status === 401 &&
                // 						error?.response?.statusText === "UNAUTHORIZED") ||
                // 					error?.response?.status === 405
                // 				) {
                // 					self.notificationShow(
                // 						gProp,
                // 						"error",
                // 						gProp.$t("msg.error.info.unauthorized.default")
                // 					);
                // 					gProp.stores.common.emitter.emit("logout");
                // 				} else {
                // 					self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 				}
                // 			} else {
                // 				self.notificationShow(gProp, "error", gProp.$t("msg.error.info.request.default"));
                // 			}
                // 			return "";
                // 		})
                // 		.finally(getFinallyFunc);
                // 	return res;
                // }

                window.ipcRenderer.send('mng_code_list', {
                    grp_cd: grpCd,
                    cd: cd,
                    use_yn: 'Y',
                    sort: 'sort_order asc'
                });
                window.ipcRenderer.once('mng_code_list_return', (_evt, ret) => ret);
            },
            addCmCd(
                gProp: Record<string, any>,
                cd: Array<{ [x: string]: any }>,
                data?: { [x: string]: any },
                setStart?: boolean
            ) {
                let retCmCd = JSON.parse(JSON.stringify(cd));
                if (data === undefined) {
                    data = {
                        cd: 'null',
                        cd_nm: gProp.$t('voca.user.define.default')
                    };
                }

                if (data !== undefined && !retCmCd.includes(data)) {
                    if (setStart !== undefined && setStart === true) {
                        retCmCd = [data, ...retCmCd];
                    } else {
                        retCmCd.push(data);
                    }
                }

                return retCmCd;
            },
            removeCmCd(cd: Array<{ [x: string]: any }>, removeKey?: Array<string>) {
                const retCmCd = JSON.parse(JSON.stringify(cd));
                if (removeKey === undefined) {
                    return retCmCd;
                }

                removeKey.forEach((key: string) => {
                    retCmCd.forEach((data: { [x: string]: any }, idx: number) => {
                        if (data.cd === key) {
                            retCmCd.splice(idx, 1);
                        }
                    });
                });

                return retCmCd;
            },
            async getAuthList(gProp: Record<string, any>) {
                const { svcType } = commonVar();
                const { getAxiosOptions, isAxiosFlag, getFinallyFunc } = axios();
                const self = this;

                self.showLoading();

                const body = {
                    auth_id: '',
                    auth_nm: '',
                    svc_type: svcType.value
                };

                // eslint-disable-next-line
                if (!isAxiosFlag.value) {
                    isAxiosFlag.value = true;
                    const res = await gProp?.axios
                        .post(self.getUrl(gProp, '/management/auth/list'), body, getAxiosOptions('DATA', {}))
                        .then(function (response: { data: any }) {
                            isAxiosFlag.value = false;
                            return response.data;
                        })
                        .catch(function (error: { response: { status: number; statusText: string } }) {
                            if (error?.response) {
                                if (
                                    (error?.response?.status === 401 &&
                                        error?.response?.statusText === 'UNAUTHORIZED') ||
                                    error?.response?.status === 405
                                ) {
                                    self.notificationShow(
                                        gProp,
                                        'error',
                                        gProp.$t('msg.error.info.unauthorized.default')
                                    );
                                    gProp.stores.common.emitter.emit('logout');
                                } else {
                                    self.notificationShow(gProp, 'error', gProp.$t('msg.error.info.request.default'));
                                }
                            } else {
                                self.notificationShow(gProp, 'error', gProp.$t('msg.error.info.request.default'));
                            }
                            return '';
                        })
                        .finally(getFinallyFunc);
                    return res;
                }
            },
            async getKmsKeyList(gProp: Record<string, any>) {
                console.log('getKmsKeyList');
                const { getAxiosOptions, getFinallyFunc, getErrorFunc } = axios();
                const self = this;
                const res = await gProp?.axios
                    .post(self.getUrl(gProp, '/kms/keys'), {}, getAxiosOptions('DATA', {}))
                    .then(function (response: any) {
                        // 정상 응답으로 errorCode 가 오는 경우 처리
                        return response?.data?.errorCode === undefined && response?.data ? response?.data : [];
                    })
                    .catch(getErrorFunc)
                    .finally(getFinallyFunc);
                return res;
            },
            async getProfileList(gProp: Record<string, any>) {
                const { getAxiosOptions, getFinallyFunc, getErrorFunc } = axios();
                const self = this;
                const result = await gProp?.axios
                    .post(
                        self.getUrl(gProp, '/si/stla/bp/grp_code/list/profile'),
                        { bp_grp_code_type: 'PROFILE' },
                        getAxiosOptions('DATA', {})
                    )
                    .then((res: { [key: string]: any }) => res.data)
                    .catch(getErrorFunc)
                    .finally(getFinallyFunc);
                return result;
            },
            async getBpGrpList(gProp: Record<string, any>) {
                const { getAxiosOptions, getFinallyFunc, getErrorFunc } = axios();
                const self = this;
                const result = await gProp?.axios
                    .post(self.getUrl(gProp, '/si/stla/bp/grp_code/list/profile'), {}, getAxiosOptions('DATA', {}))
                    .then((res: { [key: string]: any }) => res.data)
                    .catch(getErrorFunc)
                    .finally(getFinallyFunc);
                return result;
            },
            initPage(
                data: {
                    searchData?: { [x: string]: any };
                    docNameId?: string;
                    checkRequiredInitValue?: boolean;
                },
                searchFunc?: Function,
                initFunc?: Function
            ) {
                // table thead sort 처리 초기화
                if (data?.searchData !== undefined) sortTable(data.searchData, searchFunc);

                if (initFunc !== undefined) initFunc();

                // input, select tag 에 선택값 없는 경우 입력받도록 처리
                // (data?.checkRequiredInitValue !== undefined) ? validate(data?.docNameId, data?.checkRequiredInitValue) : validate(data?.docNameId);
                validate(data?.docNameId, data?.checkRequiredInitValue ?? false);
                // validate(data?.docNameId)
            },
            validator(gProp: Record<string, any>, targetId?: string) {
                const self = this;
                const target = (
                    targetId !== undefined ? document.querySelector('#' + targetId) : document
                ) as HTMLElement;
                const alertMsg = target?.querySelectorAll('.alert-msg:not(.hidden)');
                if (alertMsg !== undefined && alertMsg.length > 0) {
                    // input tag 앞에 span 값이 있으면 항목명 span 값으로 사용
                    const base = alertMsg[0]?.closest('div.v-select')
                        ? alertMsg[0]?.closest('div.v-select')?.parentElement
                        : alertMsg[0]?.parentElement;
                    const targetItem =
                        base?.parentElement?.previousElementSibling?.querySelector('span')?.innerHTML ??
                        // fileInput 예외처리
                        base?.closest('div > label')?.parentElement?.previousElementSibling?.querySelector('span')
                            ?.innerHTML;
                    const msgArgv = targetItem ?? '';
                    self.notificationShow(
                        gProp,
                        'error',
                        gProp.$t('msg.error.wrong_input.item.argv.default', [msgArgv])
                    );
                    return false;
                } else {
                    return true;
                }
            },
            addClass(target: string | HTMLElement, classNm: string) {
                const t = typeof target === 'string' ? document.getElementById(target) : target;
                if (!t?.classList.contains(classNm)) {
                    t?.classList.add(classNm);
                }
            },
            removeClass(target: string | HTMLElement, classNm: string) {
                const t = typeof target === 'string' ? document.getElementById(target) : target;
                if (t?.classList.contains(classNm)) {
                    t?.classList.remove(classNm);
                }
            },
            hasClass(target: Element, classNm: string) {
                let retVal = false;
                if (target?.classList?.contains(classNm)) {
                    retVal = true;
                }
                return retVal;
            },
            getRootMenuId(gProp: Record<string, any>) {
                const self = this;
                if (gProp?.stores.menu?.rootMenuId === undefined || gProp?.stores.menu?.rootMenuId === '') {
                    const url = self.getUrl(gProp, '/authorize/rootmenuid');
                    const body = {};
                    const options = {
                        withCredentials: true,
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Content-Type': 'application/json; charset=UTF-8',
                            'X-XSRF-TOKEN': self.getXsrfToken(gProp)
                        }
                    };

                    gProp?.stores.menu.getRootMenuInfo({
                        url: url,
                        body: body,
                        options: options,
                        gProp: gProp,
                        signInError: {}
                    });
                }
                return gProp?.stores.menu.rootMenuId;
            },
            getInitTabIdx(type: string) {
                let idx = 0;
                if (type.toUpperCase() === 'POP_IN') {
                    idx = idx + 1000;
                } else if (type.toUpperCase() === 'POP_BTN') {
                    idx = idx + 2000;
                } else if (type.toUpperCase() === 'DET_IN') {
                    idx = idx + 3000;
                } else if (type.toUpperCase() === 'DET_BTN') {
                    idx = idx + 4000;
                } else if (type.toUpperCase() === 'LST_IN') {
                    idx = idx + 5000;
                } else if (type.toUpperCase() === 'LST_BTN') {
                    idx = idx + 6000;
                } else if (type.toUpperCase() === 'PAGING') {
                    idx = idx + 7000;
                } else if (type.toUpperCase() === 'HEADER') {
                    idx = idx + 9000;
                } else if (type.toUpperCase() === 'FOOTER') {
                    idx = idx + 9990;
                }
                return idx;
            },
            getDevMode(gProp: Record<string, any>) {
                return gProp?.$configts.getMode()?.toUpperCase() === 'DEV';
            },
            getCompName(gProp: Record<string, any>) {
                return gProp.$component_type.toLowerCase().split('_')[1] === undefined
                    ? gProp.$component_type.toLowerCase().split('_')[0]
                    : gProp.$component_type.toLowerCase().split('_')[1];
            },
            isNull(obj: object) {
                return obj == null;
            },
            isEmpty(obj: object) {
                if (obj === null) {
                    return true;
                }

                if (typeof obj === 'undefined') {
                    return true;
                }
                if (typeof obj === 'number' && obj < 0) {
                    return true;
                }
                if (typeof obj === 'string' && obj === '') {
                    return true;
                }
                if (Array.isArray(obj) && obj.length < 1) {
                    return true;
                }
                if (
                    typeof obj === 'object' &&
                    obj.constructor.name === 'Object' &&
                    Object.keys(obj).length < 1
                    // && Object.getOwnPropertyNames(obj) < 1
                ) {
                    return true;
                }
                if (typeof obj === 'object' && obj.constructor.name === 'String' && Object.keys(obj).length < 1) {
                    return true; // new String() return false
                }

                return false;
            },
            getCurrentDate(gProp: Record<string, any>, val?: string, type?: string) {
                if (val === '' || val === null || val === undefined) {
                    return type === 'utc' ? gProp.dayjs().utc() : gProp.dayjs();
                } else {
                    return type === 'utc' ? gProp.dayjs.utc(val) : gProp.dayjs(val);
                }
            },
            convertDate(gProp: Record<string, any>, val: string, format: string, type: string) {
                let data = this.getCurrentDate(gProp, val, type);

                if (format === null || format === undefined) {
                    data = data.local();
                } else if (format === '') {
                    format = gProp.$t('plugins.datepicker.format_dt');
                    data = data.local().format(format);
                } else {
                    data = data.local().format(format);
                }
                // 날짜를 문자로 돌려줌
                return data;
            },
            convertDateStartOf(gProp: Record<string, any>, val: string, unit: string, type: string) {
                // 선택날자의 시간단위를 시작(00시)
                const data = this.getCurrentDate(gProp, val, type);
                return data.local().startOf(unit);
            },
            convertDateEndOf(gProp: Record<string, any>, val: string, unit: string, type: string) {
                // 선택날자의 시간단위를 시작(23시)
                const data = this.getCurrentDate(gProp, val, type);
                return data.local().endOf(unit);
            },
            convertDateSubtract(gProp: Record<string, any>, val: string, period: number, unit: string, type: string) {
                // 시간 빼기
                const data = this.getCurrentDate(gProp, val, type);
                return data.local().subtract(period, unit);
            },
            convertDateToUtc(gProp: Record<string, any>, val: string, format?: string) {
                let data = gProp.dayjs(val).utc().tz();

                if (format === '' || format === undefined) {
                    format = gProp.$t('plugins.datepicker.format_dt');
                    data = data.format(format);
                } else if (format !== null || format !== undefined) {
                    data = data.format(format);
                }
                return data;
            },
            getZeroFormat(data: string, size: number) {
                let zero = '';
                const dataStr = data.toString();

                if (dataStr.length < size) {
                    for (let i = 0; i < 2 - dataStr.length; i++) {
                        zero += '0';
                    }
                    zero += dataStr;
                } else {
                    zero = dataStr;
                }

                return zero;
            },
            changeLocale(gProp: Record<string, any>, locale: string) {
                gProp.$i18n.locale = locale;
                gProp.stores.common.setCurrentLang(locale);
                gProp.$cookies.set('current_language', locale);
            },
            changeRegion(gProp: Record<string, any>, region: string) {
                gProp.stores.common.setCurrentRegion(region);
                gProp.$cookies.set('current_region', region);
            },
            getNotificationTitle(gProp: Record<string, any>, type: string) {
                return type?.toLowerCase() === 'success' ||
                    type?.toLowerCase() === 'information' ||
                    type?.toLowerCase() === 'error'
                    ? gProp.$t('voca.' + type + '.default')
                    : '';
            },
            checkDuplicateNotification(gProp: Record<string, any>, type: string, msg: string) {
                // 중복 notification 체크
                let flag = true;
                gProp.$msgQueue.map((data: { key: string; value: string }) => {
                    if (data?.key === type && data?.value === msg) {
                        flag = false;
                    }
                });
                return flag;
            },
            notificationShow(gProp: Record<string, any>, type: string, msg: string, duration?: number) {
                const group: string = type?.toLowerCase() === 'error' ? 'bottom' : 'top';
                const title: string = this.getNotificationTitle(gProp, type);

                if (this.checkDuplicateNotification(gProp, type, msg)) {
                    gProp.$msgQueue.push({ key: type, value: msg });

                    const showTime = duration === undefined || duration < 1000 ? 5000 : duration;
                    gProp.$notify(
                        {
                            group: group?.toLowerCase() === 'bottom' ? 'bottom' : 'top',
                            type: type,
                            title: title,
                            text: msg
                        },
                        showTime
                    );
                    setTimeout(() => {
                        const msgQueue: any = [];
                        gProp.$msgQueue.map((data: { key: string; value: string }) => {
                            if (data.key === type && data.value === msg) {
                                return false;
                            } else {
                                msgQueue.push(data);
                            }
                        });
                        gProp.$msgQueue = msgQueue;
                    }, showTime);
                }
            },
            getMenuAuth(gProp: Record<string, any>, auth: string, flag: boolean) {
                // auth 가 멀티인 경우 flag == true 이면 전체가 'Y' 인 경우, false 이면 선택자 중에 하나만이라도 'Y' 인경우
                const authList: string[] = auth.split(',');
                let cnt: number = 0;

                let menuInfo: { [x: string]: any } = gProp?.stores.menu.menuInfo;
                const mi = gProp.$commonts.getLocalStorage('menuInfo');
                if (menuInfo.menuUrl === '' && mi !== null) {
                    menuInfo = mi;
                }

                authList.forEach((data) => {
                    if (
                        menuInfo?.menuAuth !== undefined &&
                        menuInfo?.menuAuth[data.toLowerCase()] !== undefined &&
                        menuInfo?.menuAuth[data.toLowerCase()] === 'Y'
                    ) {
                        cnt++;
                    }
                });
                return (flag && authList.length === cnt) || (!flag && cnt > 0) ? 'Y' : 'N';
            },
            getPageNavi(props: { [x: string]: any }) {
                if (props.listCnt > 0 && props.searchData !== undefined) {
                    return (
                        Math.floor(props.listCnt / props.searchData?.page_per_data) +
                        (props.listCnt % props.searchData?.page_per_data > 0 ? 1 : 0)
                    );
                } else {
                    return 1;
                }
            },
            getPagePerNavi(gProp: Record<string, any>, pageNavi: number) {
                let retVal = gProp.$pageInfo.qbar_view_cnt;
                if (pageNavi < gProp.$pageInfo.qbar_view_cnt * gProp.$pageInfo.qbar_view_curr_idx) {
                    retVal = pageNavi % gProp.$pageInfo.qbar_view_cnt;
                }
                return retVal;
            },
            setPageInfoNumber(gProp: Record<string, any>, pageNavi: number, page: number | string) {
                // 마지막 페이지 처리
                if (page === pageNavi) {
                    gProp.$pageInfo.qbar_view_curr_idx = Math.floor(pageNavi / gProp.$pageInfo.qbar_view_cnt);
                    if (pageNavi % gProp.$pageInfo.qbar_view_cnt > 0) {
                        gProp.$pageInfo.qbar_view_curr_idx++;
                    }
                    gProp.$pageInfo.page = pageNavi;
                } else if (page === 1) {
                    gProp.$pageInfo.qbar_view_curr_idx = 1;
                    gProp.$pageInfo.page = 1;
                } else {
                    gProp.$pageInfo.page = page;
                }
            },
            setPAgeInfoString(gProp: Record<string, any>, pageNavi: number, page: number | string) {
                if (page === 'l') {
                    gProp.$pageInfo.qbar_view_curr_idx =
                        gProp.$pageInfo.qbar_view_curr_idx > 1 ? gProp.$pageInfo.qbar_view_curr_idx-- : 1;

                    const pageVal =
                        gProp.$pageInfo.page - gProp.$pageInfo.qbar_view_cnt < 0
                            ? gProp.$pageInfo.page
                            : gProp.$pageInfo.page - gProp.$pageInfo.qbar_view_cnt;

                    gProp.$pageInfo.page = gProp.$pageInfo.page > gProp.$pageInfo.qbar_view_cnt ? pageVal : 1;
                } else if (page === 'r') {
                    if ((gProp.$pageInfo.qbar_view_curr_idx + 1) * gProp.$pageInfo.qbar_view_cnt <= pageNavi) {
                        gProp.$pageInfo.qbar_view_curr_idx++;
                        gProp.$pageInfo.page += gProp.$pageInfo.qbar_view_cnt;
                    } else {
                        gProp.$pageInfo.page = pageNavi;
                    }
                }
            },
            setPageInfo(gProp: Record<string, any>, pageNavi: number, page: number | string) {
                if (typeof page === 'number') {
                    this.setPageInfoNumber(gProp, pageNavi, page);
                } else if (typeof page === 'string') {
                    this.setPageInfoString(gProp, pageNavi, page);
                }
            },
            goToPage(
                gProp: Record<string, any>,
                pageNavi: number,
                page: number | string,
                goFunc: Function | undefined
            ) {
                this.setPageInfo(gProp, pageNavi, page);
                this.setPageSelect(gProp.$pageInfo.page);

                if (goFunc !== undefined) goFunc(page);
            },
            setPageSelect(page: number) {
                Array.from(document.getElementsByClassName('pageGroup')).forEach((e) => {
                    if (e.classList.contains('selectPage')) {
                        e.classList.remove('selectPage');
                    }
                });
                document.getElementById('page_' + page)?.classList.add('selectPage');
            },
            printJSONString(data: string) {
                return JSON.stringify(JSON.parse(data), null, 4);
            },
            getHeirarchyData(
                gProp: Record<string, any>,
                heirarchy: Array<{ [x: string]: any }>,
                menuList: Array<{ [x: string]: any }>,
                menuId: string
            ) {
                const rootMenuId = this.getRootMenuId(gProp);
                menuList.some((menu: { [x: string]: any }) => {
                    if (menu.menu_id === menuId) {
                        heirarchy.push(menu);
                        if (menuId !== rootMenuId) {
                            this.getHeirarchyData(gProp, heirarchy, menuList, menu.up_menu_id);
                        }
                    } else if (menuId === rootMenuId || menuId === '000000') {
                        const menu_init = {
                            menu_url: '/',
                            menu_id: 'root',
                            menu_nm: gProp.$t('voca.home.default'),
                            up_menu_id: 'root'
                        };
                        heirarchy.push(menu_init);
                        heirarchy = heirarchy.reverse();
                        return true;
                    }
                });
                return heirarchy;
            },
            setMenuLog(
                gProp: Record<string, any>,
                url: string,
                menuId: string,
                menuNm: string,
                menuList: [{ [x: string]: any }],
                userInfo: { [x: string]: any }
            ) {
                const self = this;
                const heirarchyData: Array<{ [x: string]: any }> = [];
                self.getHeirarchyData(gProp, heirarchyData, menuList, menuId);
                const logMenuInfo = {
                    svc_type: userInfo.svcType,
                    user_id: userInfo.email,
                    menu_id1: self.getRootMenuId(gProp),
                    menu_id2: heirarchyData.length >= 2 ? heirarchyData[1].menu_id : '',
                    menu_id3: heirarchyData.length >= 3 ? heirarchyData[2].menu_id : '',
                    menu_id4: heirarchyData.length >= 4 ? heirarchyData[3].menu_id : '',
                    menu_id5: heirarchyData.length >= 5 ? heirarchyData[4].menu_id : '',
                    menu_nm: menuNm,
                    menu_url: url.toLowerCase()
                };
                if (!self.isEmpty(logMenuInfo.user_id)) {
                    self.setMenuLogToGW(gProp, logMenuInfo);
                }
            },
            async setMenuLogToGW(gProp: Record<string, any>, logMenuInfo: { [x: string]: any }) {
                const self = this;
                const url = self.getUrl(gProp, '/log/menu/insert');

                const body = logMenuInfo;
                const options = {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'X-XSRF-TOKEN': self.getXsrfToken(gProp)
                    }
                };
                await gProp?.axios.post(url, body, options).catch(function (error: any) {
                    if (error.response.status === 503) {
                        console.log('check LOG_SERVICE !!!!');
                    } else {
                        console.log(error, gProp.$t('msg.error.info.request.default'));
                    }
                    return false;
                });
            },
            setMenuInfo(
                gProp: Record<string, any>,
                menuId: string,
                menuTypeFlag: boolean,
                menuType: string,
                url: string,
                menuList: Array<{ [x: string]: any }>
            ) {
                gProp.$menuInfo.menuId = menuId;
                gProp.$menuInfo.menuTypeFlag = menuTypeFlag;
                gProp.$menuInfo.menuType = menuType;
                gProp.$menuInfo.menuUrl = url;
                gProp.$menuInfo.menuList = menuList;
                menuList.some((menu: { [x: string]: any }) => {
                    if (menu.menu_id === menuId) {
                        gProp.$menuInfo.menuAuth = {
                            c: menu.create_yn,
                            r: menu.read_yn,
                            u: menu.update_yn,
                            d: menu.delete_yn,
                            e: menu.excel_yn
                        };
                        gProp.$menuInfo.menuNm = menu.menu_nm;
                        return true;
                    }
                });
            },
            setRouterInfo(
                gProp: Record<string, any>,
                url: string,
                menuId: string,
                menuTypeFlag: boolean,
                menuType: string,
                menuList: Array<{ [x: string]: any }>,
                moveFunc?: Function
            ) {
                const self = this;
                // 페이지로 이동시 검색조건 초기화
                if (gProp.stores.menu.menuInfo.menuUrl !== url) {
                    gProp.stores.common.clearSearchData();
                }

                localStorage.setItem('prevUrl', url);
                self.setMenuInfo(gProp, menuId, menuTypeFlag, menuType, url, menuList);
                gProp.stores.menu.setMenuInfo(gProp.$menuInfo);

                self.setMenuLog(gProp, url, menuId, gProp.$menuInfo.menuNm, menuList, gProp.stores.user.user);

                if (moveFunc !== undefined) {
                    moveFunc(url);
                } else {
                    self.routerLink(gProp, url);
                }
            },
            routerLink(gProp: Record<string, any>, url: string) {
                if (gProp?.$route.path.toLowerCase() !== url.toLowerCase()) {
                    gProp?.$router?.push(url);
                }
            },
            setDetailInfo(stores: any, detailInfo: { [x: string]: any }) {
                stores.common.setDetailInfo(detailInfo);
            },
            setInitDetailInfo(stores: any) {
                stores.common.clearDetailInfo();
            },
            setSearchData(stores: any, searchData: { [x: string]: any }, docName: string) {
                const data = {
                    key: docName,
                    searchData: searchData
                };
                stores.common.setSearchData(data);
            },
            setInitSearchData(stores: any) {
                stores.common.clearSearchData();
            },
            getUrl(gProp: Record<string, any>, url: string, prefix?: string, protocol?: string) {
                let modPrefix = prefix ? prefix : '/api';
                let prefixUrl = modPrefix.length > 0 && !modPrefix?.startsWith('/') ? '/' + modPrefix : modPrefix;
                let modUrl = prefixUrl + (!url.startsWith('/') ? '/' + url : url);
                if (gProp?.$gwport === 0) {
                    return (protocol ?? gProp?.$gwprotocol) + '://' + gProp?.$gwip + modUrl;
                } else {
                    return (protocol ?? gProp?.$gwprotocol) + '://' + gProp?.$gwip + ':' + gProp?.$gwport + modUrl;
                }
            },
            getLocalStorage(key: string) {
                let backupData = localStorage.getItem(key);
                if (backupData !== null) {
                    backupData = JSON.parse(backupData);
                }
                return backupData;
            },
            getFileNameByContentDisposition(contentDisposition: string) {
                let regex = /filename[^;=\n]*=(UTF-8(['"]*))?(.*)?;(.*)/; // nosonar
                let matches = regex.exec(contentDisposition);
                let filename = '';

                const checkFirst = matches !== null ? matches[3] : undefined;
                if (checkFirst) {
                    filename = checkFirst.replace(/['"]/g, '');
                } else {
                    regex = /filename[^;=\n]*=((['"]).*?[^;\n]*)?(.*)/;
                    matches = regex.exec(contentDisposition);
                    const checkSecond = matches !== null ? matches[1] : undefined;
                    if (checkSecond) {
                        filename = checkSecond.replace(/['"]/g, '');
                    }
                }

                return decodeURI(filename);
            },
            makeModal(targetId: string, options?: ModalOptions) {
                const target = document.getElementById(targetId) as HTMLElement;

                const modalOptions: ModalOptions = {
                    backdrop: 'static',
                    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
                    closable: false,
                    onHide: () => {},
                    onShow: () => {},
                    onToggle: () => {}
                };

                return target !== null && target !== undefined ? new Modal(target, options ?? modalOptions) : null;
            },
            showModal(target: ModalInterface, zIndex?: number) {
                // console.log(target);
                // // target.classList.add("activeModal");
                // let modal = new Modal(target);
                // modal?.show();
                // let modal = Modal.getInstance(target);
                // if (modal === null) {
                //     modal = new Modal(target, {
                //         backdrop: false,
                //         keyboard: false,
                //     });
                // }
                // modal?.show();
                target?.show();
                this.showModalBg(zIndex);
            },
            hideModal(target: ModalInterface, zIndex?: number) {
                this.hideModalBg(zIndex);
                target?.hide();
            },
            // hideModal(target?: HTMLElement) {
            //     if (target === undefined) {
            //         let data: null | HTMLElement = document.querySelector(".activeModal");
            //         if (data !== null) target = data;
            //     }
            //     if (target !== undefined) {
            //         // let modal = Modal.getInstance(target);
            //         target?.classList?.remove("activeModal");
            //         // modal?.hide();
            //     }
            // },
            getCurrPage(dataCnt: number, searchData: { [x: string]: any }) {
                return (
                    Math.floor(dataCnt / searchData.page_per_data) + (dataCnt % searchData.page_per_data > 0 ? 1 : 0)
                );
            },
            checkSearchData(paging: string, searchData: { [x: string]: any }, reqList: Array<{ [x: string]: any }>) {
                // scroll 인 경우 list 데이터가 없는데 searchData 는 1페이지가 아닌경우 페이지는 1로 하여 처음부터 조회토록 함
                if (paging === 'scroll' && reqList.length === 0 && searchData.page !== 1) {
                    searchData.page = 1;
                }
                return searchData;
            },
            setEmptyMsg(data?: object) {
                const self = this;
                return self.isEmpty(data) ? null : data;
            },
            sortList(obj: Array<{ [x: string]: any }>, key: string, direction?: string) {
                obj.sort(function (a, b) {
                    if (direction === 'DESC') {
                        return b[key] - a[key]; // 내림차순
                    } else {
                        return a[key] - b[key]; // 오름차순
                    }
                });
            },
            getMLMenuName(menuInfo: { [x: string]: any }, currentLang: string) {
                let retMenuName = menuInfo?.menu_nm;
                if (menuInfo.ml_info !== null && menuInfo.ml_info !== undefined) {
                    menuInfo.ml_info.some((data: { [x: string]: any }) => {
                        if (currentLang === data.lang_cd.toLowerCase()) {
                            retMenuName = data.name;
                            return true;
                        }
                    });
                }

                return retMenuName;
            },
            showLoading() {
                if (
                    document?.getElementById('loadingBg')?.classList === undefined ||
                    document?.getElementById('loadingBg')?.classList.contains('is-visible') === false
                ) {
                    document?.getElementById('loadingBg')?.classList.add('is-visible');
                }
            },
            hideLoading() {
                if (
                    document?.getElementById('loadingBg')?.classList === undefined ||
                    document?.getElementById('loadingBg')?.classList.contains('is-visible') === true
                ) {
                    document?.getElementById('loadingBg')?.classList.remove('is-visible');
                }
            },
            showModalBg(zIndex?: number) {
                const zIdx = zIndex !== undefined ? zIndex - 1 : 9999;
                const popup = document?.getElementById('popupBg') as HTMLElement;
                if (popup.classList.contains('hidden')) {
                    popup.classList.remove('hidden');
                }
                if (!popup.classList.contains('block')) {
                    popup.classList.add('block');
                }
                popup.style.zIndex = zIdx.toString();
            },
            hideModalBg() {
                const popup = document?.getElementById('popupBg') as HTMLElement;
                if (popup.classList.contains('block')) {
                    popup.classList.remove('block');
                }
                if (!popup.classList.contains('hidden')) {
                    popup.classList.add('hidden');
                }
                popup.style.zIndex = '-1';
            },
            toggleLoading() {
                document?.getElementById('loadingBg')?.classList.toggle('is-visible');
            },
            debugLog(gProp: Record<string, any>, msg: string | number | object | Array<string | number | object>) {
                const self = this;
                if (self.getDevMode(gProp)) {
                    if (gProp?.$route?.fullPath !== '/') {
                        console.trace(gProp.$route?.path);
                    }

                    let idx = 1;
                    if (Array.isArray(msg)) {
                        Array.from(msg).forEach((m: string | number | object) => console.log(idx++, m));
                    } else {
                        console.log(msg);
                    }
                }
            },
            getFilenameWithHeader(
                gProp: Record<string, any>,
                data: string,
                defaultExt?: string,
                createTime?: { flag: boolean; format?: string }
            ) {
                const self = this;
                const fileExt = self.isEmpty(defaultExt) ? '' : '.' + defaultExt;
                const createDate = self.convertDate(gProp, '', createTime?.format ?? 'YYYYMMDDHHmmss', 'utc');
                let retFileName = createDate + fileExt;
                if (data != null && data != undefined) {
                    retFileName = self.getFileNameByContentDisposition(data);
                    const splitIdx = retFileName.lastIndexOf('.');
                    const tempName = retFileName.substring(0, splitIdx);
                    const tempExt = retFileName.substring(splitIdx);
                    self.debugLog(gProp, [data, retFileName, tempName, tempExt]);
                    if (createTime?.flag === true) {
                        retFileName = tempName + '_' + createDate + tempExt;
                    }
                }
                return retFileName;
            },
            focusInputElement(input: IInput | null) {
                if (input) {
                    //v-show 때문에 렌더링 되기전에 focus함수가 실행되는 경우를 막기 위해 setTimeout 0으로 함수 실행
                    setTimeout(() => {
                        input.focusInputRef();
                    }, 0);
                }
            }
        };
    }
};
