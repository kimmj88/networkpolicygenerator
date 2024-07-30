import { defineStore } from 'pinia';
// Modules
import type { AuthObject, RootState, StoreObject } from '@/stores/interface';
import { useMenuStore } from '@/stores/modules/Menu';
import { useUserStore } from '@/stores/modules/User';
import axios from 'axios';
import mitt from 'mitt';

export const useCommonStore = defineStore('@/common', {
    state: (): RootState => ({
        emitter: mitt(),
        currentLang: '',
        currentRegion: '',
        isAuthenticated: false,
        expireTime: new Date(),
        languages: [
            { flag: 'kr', language: 'ko', datepicker_language: 'ko-KR', title: 'Korean', index: 0 },
            {
                flag: 'us',
                language: 'en',
                datepicker_language: 'en-US',
                title: 'English',
                index: 1
            },
            { flag: 'cn', language: 'cn', datepicker_language: 'zh-CN', title: 'China', index: 2 }
        ],
        // languages: [
        //     { flag: "us", language: "en", datepicker_language: "en-US", title: "English", index: 0 },
        // ],
        regions: [
            { id: 'all', name: 'All', add_class: '', path: [], index: 999 },
            { id: 'europe', name: 'Europe', add_class: 'legend-1', path: [], index: 0 },
            { id: 'northamerica', name: 'NorthAmerica', add_class: 'legend-2', path: [], index: 1 },
            { id: 'china', name: 'China', add_class: 'legend-3', path: [], index: 2 }
        ],
        searchData: {},
        detailInfo: {},
        error: {},
        auditInfo: []
    }),
    getters: {},
    actions: {
        async login(obj: StoreObject) {
            await axios
                .post(obj.url, obj.body, obj.options)
                .then((response: any) => {
                    console.log(response);
                    if (response?.data?.status === 200) {
                        const auth = {
                            flag: true
                            // expireTime: new Date(response.data.user.expireTime),
                        };
                        this.setAuth(auth);
                        this.setAuditInfo([]);
                    } else {
                        obj.signInError.flag = true;
                        if (response?.headers['lock-remind']) {
                            obj.signInError.lock_remind_cnt = response?.headers['lock-remind'];
                        }
                        // lock 계정
                        if (response?.status === 782) {
                            console.log('ID Lock');
                            obj.signInError.lock_msg_key = 'msg.error.info.login.account.lock.default';
                        }

                        if (response?.data?.limit_date) {
                            obj.signInError.limit_date = response.data.limit_date;
                        }
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                    obj.signInError.flag = true;
                    if (error?.response?.headers['lock-remind']) {
                        obj.signInError.lock_remind_cnt = error?.response?.headers['lock-remind'];
                    }
                    // lock 계정
                    if (error?.response?.status === 782) {
                        console.log('ID Lock');
                        obj.signInError.lock_msg_key = 'msg.error.info.login.account.lock.default';
                    }

                    if (error?.response?.limit_date) {
                        obj.signInError.limit_date = error?.response?.data?.limit_date;
                    }
                    console.log(obj.signInError);
                });
        },
        async logout(obj: StoreObject) {
            this.clearAuth();
            this.clearAuditInfo();
            useMenuStore().clearMenuInfo();
            useUserStore().clearUser();

            localStorage.removeItem('req-id');

            this.emitter.emit('view-flag', {
                header: this.isAuthenticated,
                footer: this.isAuthenticated
            });

            obj.gProp?.$router?.push('/');
            // await axios
            // 	.post(obj.url, obj.body, obj.options)
            // 	.then(() => {
            // 		obj.gProp?.$router?.push("/login");
            // 	})
            // 	.catch((error: any) => {
            // 		console.log(error);
            // 		console.log(error.response);
            // 	});
        },
        setCurrentLang(currLang: string) {
            this.currentLang = currLang;
            localStorage.setItem('currentLang', currLang);
        },
        setCurrentRegion(currRegion: string) {
            this.currentRegion = currRegion;
            localStorage.setItem('currentRegion', currRegion);
        },
        setAuth(auth: AuthObject) {
            this.isAuthenticated = !!(auth?.flag?.toString() === 'true' || auth?.flag === true);

            localStorage.setItem('isAuthenticated', this.isAuthenticated.toString());
        },
        clearAuth() {
            this.isAuthenticated = false;
            this.expireTime = new Date();

            localStorage.setItem('isAuthenticated', this.isAuthenticated.toString());
        },
        getSearchData(docName: string) {
            const stringJson = localStorage.getItem('searchData');
            if (stringJson) {
                const searchData = JSON.parse(stringJson);
                return searchData[docName];
            }
            return stringJson;
        },
        setSearchData(data: { [x: string]: any }) {
            if (data?.key) {
                this.searchData[data.key] = data.searchData;
            } else {
                this.searchData = {};
            }
            localStorage.setItem('searchData', JSON.stringify(this.searchData));
        },
        getSearchDataLS(key: string) {
            const searchDataLs = localStorage.getItem('searchData');
            if (searchDataLs != null) {
                return JSON.parse(searchDataLs)[key];
            }
            return {};
        },
        clearSearchData() {
            this.searchData = {};
            localStorage.removeItem('searchData');
        },
        setDetailInfo(detailInfo: { [x: string]: any }) {
            this.detailInfo = detailInfo;
            localStorage.setItem('detailInfo', JSON.stringify(this.detailInfo));
        },
        clearDetailInfo() {
            this.detailInfo = {};
            localStorage.removeItem('detailInfo');
        },
        setAuditInfo(auditInfo: Array<{ [x: string]: any }>) {
            this.auditInfo = auditInfo;

            localStorage.setItem('auditInfo', JSON.stringify(this.auditInfo));
        },
        clearAuditInfo() {
            this.auditInfo = [];

            localStorage.removeItem('auditInfo');
        }
    }
});
