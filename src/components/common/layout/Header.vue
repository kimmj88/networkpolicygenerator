<template>
    <div id="headerView">
        <nav>
            <div class="navbar">
                <em class="menu-icon bx bx-menu bx-burst-hover" @click="menuVisible(true)"></em>
                <div class="logo">
                    <a @click="goAuthFirstMenu()" class="flex cursor-pointer">
                        <img
                            v-if="ci === 'autocrypt'"
                            src="@/assets/img/autocrypt_ci.png"
                            style="margin: -12px 0px -8px 0px; height: 2rem"
                            alt="autocrypt"
                        />
                        <span v-else class="title">
                            {{ t('voca.name.system.' + commonts.getCompName(gProp) + '.default') }}
                        </span>
                        <span class="version hidden">
                            {{ t('voca.version.argv.default', [uiVersion]) }}
                        </span>
                    </a>
                </div>
                <div ref="divMenuInfo" id="divMenuInfo" class="nav-links">
                    <div class="sidebar-logo">
                        <span class="logo">
                            <a @click="goAuthFirstMenu()" class="flex cursor-pointer">
                                <img
                                    v-if="ci === 'autocrypt'"
                                    src="@/assets/img/autocrypt_ci.png"
                                    style="margin: -12px 0px -8px 0px; height: 2rem"
                                    alt="autocrypt"
                                />
                                <span v-else>
                                    {{ t('voca.name.system.' + commonts.getCompName(gProp) + '.default') }}
                                </span>
                            </a>
                        </span>
                        <em class="bx bx-x bx-tada-hover" @click="menuVisible(false)"></em>
                    </div>
                    <ul class="links">
                        <li
                            v-for="(menu, idx) in menuList"
                            :key="menu.menu_id"
                            :style="menuDisplayStyle(menu, '')"
                            class="head-li-width"
                        >
                            <span
                                @click="toggleSidebar('menu' + menu.menu_id)"
                                class="d-inline-flex"
                                :title="menu.menu_nm"
                            >
                                <em class="menu-icon bx" :class="menu.menu_icon_class"></em>
                                <a
                                    :id="'menu' + menu.menu_id"
                                    v-if="menu.menu_url === 'subdir' && menu.up_menu_id === rootMenuId"
                                    :tabindex="tabIdx.header + idx * 100"
                                    class="ellipsis text-none"
                                >
                                    {{ getMLMenuName(menu) }}
                                </a>
                                <em class="bx bxs-chevron-down arrow root-arrow" v-if="subMenuFlag(menu.menu_id)"></em>
                            </span>
                            <ul class="root-sub-menu sub-menu">
                                <li
                                    v-for="(menuSub1, idxSub1) in menuList"
                                    :key="'sub1' + menuSub1.menu_id"
                                    :style="menuDisplayStyle(menuSub1, menu)"
                                    class="more"
                                >
                                    <span
                                        @click="
                                            () => {
                                                toggleSidebar('menuSub1' + menuSub1.menu_id);
                                                setRouterMenuInfo(menuSub1.menu_url, menuSub1.menu_id, false, '');
                                            }
                                        "
                                    >
                                        <a
                                            :id="'menuSub1' + menuSub1.menu_id"
                                            v-if="menuSub1.up_menu_id === menu.menu_id"
                                            :tabindex="tabIdx.header + idxSub1 * 10 + idxSub1"
                                        >
                                            {{ getMLMenuName(menuSub1) }}
                                        </a>
                                        <em
                                            class="bx bxs-chevron-right arrow more-arrow"
                                            v-if="subMenuFlag(menuSub1.menu_id)"
                                        ></em>
                                    </span>
                                    <ul class="more-sub-menu sub-menu" v-if="subMenuFlag(menuSub1.menu_id)">
                                        <li
                                            v-for="(menuSub2, idxSub2) in menuList"
                                            :key="'sub2' + menuSub2.menu_id"
                                            :style="menuDisplayStyle(menuSub2, menuSub1)"
                                        >
                                            <span
                                                @click="
                                                    setRouterMenuInfo(menuSub2.menu_url, menuSub2.menu_id, false, '')
                                                "
                                            >
                                                <a
                                                    :id="'menuSub2' + menuSub2.menu_id"
                                                    v-if="menuSub2.up_menu_id === menuSub1.menu_id"
                                                    :tabindex="tabIdx.header + idxSub2 * 10 + idxSub2"
                                                >
                                                    {{ getMLMenuName(menuSub2) }}
                                                </a>
                                            </span>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div id="divUserInfo" class="user">
                    <div class="network-info flex justify-around items-center" v-if="kmsFlag === true">
                        <div
                            class="network inline-flex items-center cursor-pointer"
                            @click="!commonts.getDevMode() ? checkKmsNetwork : changeNetworkStatus"
                        >
                            <p class="text-sm bxc bxc-wifi" :class="networkStatusClass"></p>
                            <a :class="networkColorClass">{{ t('voca.network.default') }}</a>
                        </div>
                        <!-- 비상대책 모드 보이지 않도록 처리 -->
                        <div
                            v-if="false"
                            class="emergency mx-3 inline-flex items-center cursor-pointer"
                            @click="emergencyProcess"
                        >
                            <p class="text-sm bxc bxc-run" :class="emergencyStatusClass"></p>
                            <a :class="emergencyColorClass">{{ t('voca.emergency.default') }}</a>
                        </div>
                    </div>
                    <div class="system-info">
                        <div class="clock cursor-pointer" @click="getTokenInfo(true)">
                            <p></p>
                        </div>
                    </div>
                    <div class="inline-flex items-center hover:cursor-pointer" v-if="multi_language">
                        <country-flag
                            class="border-1"
                            style="margin: 0px"
                            :country="currentLang.flag"
                            data-dropdown-toggle="languageSelector"
                        />
                        <div id="languageSelector" class="hidden">
                            <ul class="bg-black mt-4 w-[8rem] cursor-pointer rounded-b-md">
                                <div v-for="(entry, idx) in languages" :key="entry.language">
                                    <li><hr class="dropdown-divider" v-if="idx >= 1" /></li>
                                    <li @click="changeLocale(entry.language)">
                                        <a class="dropdown-item">
                                            <em
                                                class="lang-icon bx bxs-flag-alt text-2xl"
                                                :style="{
                                                    visibility: entry.flag === currentLang.flag ? 'visible' : 'hidden'
                                                }"
                                            ></em>
                                            <country-flag :class="'border-1'" :country="entry.flag" />
                                            <strong class="pl-2" style="vertical-align: super">
                                                {{ t('voca.language.support.list.default[' + entry.index + ']') }}
                                            </strong>
                                        </a>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </div>
                    <div class="user-info">
                        <em class="user-icon bx bx-user"></em>
                        <div class="card hidden">
                            <div class="nav-bg-color rounded-md">
                                <div class="flex items-center justify-center pt-3 mt-0.5">
                                    <img
                                        src="@/assets/img/blank-avatar.png"
                                        class="img-thumbnail rounded-pill"
                                        style="width: 140px"
                                        alt="User Image"
                                    />
                                </div>
                                <div class="nav-text-color text-center mt-3">
                                    {{ userInfo.name }}({{ userInfo.email }})
                                </div>
                                <div class="w-full flex justify-around">
                                    <AtomButton
                                        :class="btnClass"
                                        :class-text="btnClassText + ' bxc bxc-user-account'"
                                        :button-name="'btn.account.my.default'"
                                        :type="'save'"
                                        @click="account"
                                    />
                                    <AtomButton
                                        :class="btnClass"
                                        :class-text="btnClassText + ' bxc bxc-logout'"
                                        :button-name="'btn.logout.default'"
                                        :type="'delete'"
                                        @click="logout"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dev-box">
                <a v-if="gProp?.$devMode" :style="getDevStyle"> [{{ userInfo.svcType }}] </a>
            </div>
        </nav>
    </div>
</template>

<script setup lang="ts">
import Account from '@/components/common/user/Account.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import Timer from '@/plugins/ts/timer?worker&inline';
import AtomButton from '@a/Button.vue';
import { initDropdowns } from 'flowbite';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, ref } from 'vue';

const { stores, emitter, gProp, commonts, t, route } = base();
const { uiVersion, tabIdx, ci, multi_language, languages, currentLang } = commonVar();
const { getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();

const btnClass = 'min-w-[7rem] mb-5 inline-flex justify-center items-center';
const btnClassText = 'w-full h-12 text-base rounded-md px-2.5 focus:outline-none hover:brightness-75';

const userInfo = computed(() => stores.user.user);
const rootMenuId = computed(() => stores.menu.rootMenuId);
const menuList = computed(() => stores.menu.menuList);
const networkStatus = computed(() => stores.network.isActive);
const emergencyStatus = computed(() => stores.network.emergencyStatus);

const divMenuInfo = ref(null);

const kmsFlag = gProp?.$kmsflag;

const accountModal = ref(null as any);

const networkColorClass = computed(() => {
    let retClass = 'text-green-400';
    if (networkStatus.value === false) {
        retClass = 'text-red-400';
    }
    return retClass;
});
const networkStatusClass = computed(() => {
    let retClass = 'bxc-wifi';
    if (networkStatus.value === false) {
        retClass = 'bxc-wifi-off bxc-ani-tada';
    }
    return retClass + ' ' + networkColorClass.value;
});

function changeNetworkStatus() {
    stores.network.isActive = !stores.network.isActive;
    if (networkStatus.value === false && emergencyStatus.value === false) {
        emergencyConfirm(true);
    } else if (networkStatus.value === true && emergencyStatus.value === true) {
        changeEmergencyProcess(false);
    }
}

const emergencyColorClass = computed(() => {
    let retClass = 'text-gray-400';
    if (emergencyStatus.value === true) {
        retClass = 'text-green-400';
    }
    return retClass;
});
const emergencyStatusClass = computed(() => {
    let retClass = '';
    if (emergencyStatus.value === true) {
        retClass = 'bxc-ani-bx-slide-right emergency';
    }
    return retClass + ' ' + emergencyColorClass.value;
});

function emergencyProcess(e: MouseEvent) {
    let target = e.target as HTMLElement;
    let emergencyFlag = target.classList.contains('emergency');
    emergencyConfirm(emergencyFlag);
}

function emergencyConfirm(bool: boolean) {
    if (networkStatus.value) {
        commonts.notificationShow(gProp, 'information', t('msg.info.network.success.emergency.default'), -1);
    } else {
        let status = ['stop', 'go'];
        emitter.emit('openConfirm', {
            title: t('voca.confirm.default'),
            msg: t('msg.confirm.emergency.change.' + status[bool ? 1 : 0] + '.default'),
            method: 'YN',
            cbFunc: changeEmergencyProcess,
            ableText: '진행',
            disableText: '정지'
        });
    }
}

function changeEmergencyProcess(retVal: boolean) {
    stores.network.setEmergencyStatus(retVal);
    if (retVal === false) {
        //비상대책모드 중지한 경우
        stores.network.setEmergencyStatus(retVal);
        stores.network.setForceToStopEmergency(true);
    }
    return false;
}

const getDevStyle = computed(() => {
    let styleStr = 'margin-right: 0.5rem;';
    if (gProp?.$configts.getComponentName().toLowerCase() === 'kl') {
        styleStr += 'color: red';
    } else {
        styleStr += 'color: aqua';
    }
    return styleStr;
});

function menuDisplayStyle(menu: any, parentMenu: any) {
    let styleStr = '';
    if (parentMenu === undefined || parentMenu === '') {
        styleStr += menu?.menu_url === 'subdir' && menu?.up_menu_id === rootMenuId.value ? '' : 'display: none';
    } else {
        styleStr += menu?.up_menu_id === parentMenu?.menu_id ? '' : 'display: none';
    }
    return styleStr;
}

function subMenuFlag(menu_id: string) {
    let retVal: boolean = false;
    menuList?.value?.some((menu: { [x: string]: any }) => {
        if (menu.up_menu_id === menu_id) {
            retVal = true;
            return true; // some 반복문 탈출
        }
    });
    return retVal;
}

function goAuthFirstMenu() {
    let mList: Array<{ [x: string]: any }> = menuList.value;
    if (mList && mList.length > 0) {
        mList.some((m: { [x: string]: any }) => {
            if (
                m.menu_url !== 'subdir' &&
                m.menu_url !== 'lock' &&
                (m.up_menu_id !== rootMenuId.value ||
                    (m.up_menu_id === rootMenuId.value && m.menu_id === mList[0].menu_id))
            ) {
                commonts.debugLog(gProp, m.menu_url);
                commonts.setRouterInfo(gProp, m.menu_url, m.menu_id, m.menu_type_flag, m.menu_type, mList);
                return true;
            }
        });
    } else {
        commonts.routerLink(gProp, '/');
    }
}

function getMLMenuName(menuInfo: any) {
    return commonts.getMLMenuName(menuInfo, currentLang.value.language);
}

function account() {
    commonts.debugLog(gProp, 'header account');
    console.log(userInfo.value);
    commonts.showModal(accountModal.value, 200);
}

function logout() {
    commonts.debugLog(gProp, 'header logout');
    emitter.emit('logout');
}

function changeLocale(locale: string) {
    return gProp?.$commonts.changeLocale(gProp, locale);
}

function menuVisible(flag: boolean) {
    let target: HTMLElement = divMenuInfo.value ?? new HTMLElement();
    target.querySelectorAll('li.show').forEach((data) => data.classList.remove('show'));
    target.style.left = flag ? '0' : '-100%';
}

function toggleSidebar(showMenuId: string) {
    let target: HTMLElement = divMenuInfo.value ?? new HTMLElement();
    target
        ?.querySelector('#' + showMenuId)
        ?.closest('li')
        ?.classList.contains('show')
        ? target
              ?.querySelector('#' + showMenuId)
              ?.closest('li')
              ?.classList.remove('show')
        : target
              ?.querySelector('#' + showMenuId)
              ?.closest('li')
              ?.classList.add('show');
}

function setRouterMenuInfo(url: string, menuId: string, menuTypeFlag: boolean, menuType: string) {
    if (url !== 'subdir') {
        commonts.debugLog(gProp, ['setRouterMenuInfo', url]);
        commonts.setRouterInfo(gProp, url, menuId, menuTypeFlag, menuType, stores.menu.menuList);
    }
}

let worker = {} as any;
function initWorker() {
    for (let key in worker) {
        worker[key].terminate();
    }
}
function setWorker(target: string, delay: number, func: Function) {
    if (window.Worker) {
        if (worker[target]) {
            worker[target].terminate();
        }
        worker[target] = new Timer();
        worker[target].postMessage(delay);
        worker[target].onmessage = () => {
            func();
        };
    }
}

let checkInterval = 60000;
function checkKmsNetwork() {
    const path = route?.path;
    if (path !== '/login') {
        const headers = {} as any;
        headers['X-XSRF-TOKEN'] = commonts.getXsrfToken(gProp);
        headers['Content-Type'] = 'application/json; charset=UTF-8';
        headers['Cache-Control'] = 'no-cache';

        stores.network.checkKmsNetwork({
            url: commonts.getUrl(gProp, '/kms/check'),
            body: {},
            options: {
                withCredentials: true,
                headers: { ...headers }
            },
            gProp: gProp
        });

        setWorker('network', checkInterval, checkKmsNetwork);
    }
}

let timeInterval = 1000;
const timer = reactive({
    remainTime: 0,
    mm: 0,
    ss: 0
});
// 1분 30초가 남은 경우 => 90초
let limitTime = 90000; // millisecond 로 입력 - timeout / 2 보다 큰값 입력시 계속 confirm 창 나옴
let confirmBool = true;

function getTokenInfo(showFlag?: boolean) {
    const path = route?.path;
    if (path !== '/login') {
        if (showFlag !== undefined && showFlag) {
            let target = document.querySelector('.clock');
            if (target?.classList.contains('stop')) {
                target.classList.remove('stop');
            }
        }
        gProp?.axios
            .post(commonts.getUrl(gProp, '/authorize/validtoken'), { refresh: true }, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                // 정상 응답이지만 errorCode 를 지니고 있는 경우
                if (response?.data?.errorCode !== undefined) {
                    commonts.debugLog(gProp, [response?.data?.errorCode]);
                    emitter.emit('logout');
                } else {
                    timer.remainTime = response?.data?.expire_time - response?.data?.server_time;

                    showClock();
                    setWorker('clock', timeInterval, showClock);
                    confirmBool = true;
                }
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function clockAlert(timer: any, limitTime: number) {
    if (timer.remainTime > 0 && timer.remainTime < limitTime && confirmBool) {
        confirmBool = false;
        emitter.emit('openConfirm', {
            title: t('voca.confirm.default'),
            msg: t('msg.confirm.expire.auth.argv.time.default', [limitTime / 1000]),
            method: 'YN',
            cbFunc: doRefreshProcess
        });
        const target = document.querySelector('.clock') as HTMLElement;
        target?.classList.add('text-red');
    }

    // if (timer.remainTime < 1000 && route?.path !== "/login") {
    // 	emitter.emit("closeConfirm");
    // 	logout();
    // }
}

function setClock(timer: any, text: string) {
    let target = document.querySelector('.clock');
    while (target?.firstChild) {
        target.removeChild(target.firstChild);
    }
    let clock = document.createElement('P');
    clock.innerText = text;
    if (timer.remainTime < limitTime) {
        clock.classList.add('text-red-600');
    }
    target?.appendChild(clock);
}

function showClock() {
    timer.remainTime = timer.remainTime - 1000;
    timer.mm = timer.remainTime > 1000 ? Math.floor(timer.remainTime / 1000 / 60) : 0;
    timer.ss = timer.remainTime > 1000 ? Math.floor((timer.remainTime / 1000) % 60) : 0;

    let target = document.querySelector('.clock');

    if (target?.classList.contains('stop')) {
        // console.log(timer.remainTime, limitTime)
        if (timer.remainTime <= limitTime) {
            commonts.debugLog(gProp, ['autoRefresh', timer, limitTime]);
            getTokenInfo();
        }
    } else {
        setClock(timer, (timer.mm < 10 ? '0' : '') + timer.mm + ':' + (timer.ss < 10 ? '0' : '') + timer.ss);
        clockAlert(timer, limitTime);
    }
}

function doRefreshProcess(retVal: boolean) {
    if (retVal) {
        getTokenInfo();
    }
    return false;
}

emitter.on('clockStop', () => {
    commonts.debugLog(gProp, 'emitter clockStop');
    let target = document.querySelector('.clock');
    if (!target?.classList.contains('stop')) {
        target?.classList.add('stop');
    }
    let rcStopTarget = document.querySelector('.end-process');
    if (rcStopTarget?.classList.contains('hidden')) {
        rcStopTarget?.classList.remove('hidden');
    }
});

emitter.on('clockStart', () => {
    commonts.debugLog(gProp, 'emitter clockStart');
    getTokenInfo(true);
});

emitter.on('goAuthFirstMenu', () => {
    commonts.debugLog(gProp, 'GNB goAuthFirstMenu');
    goAuthFirstMenu();
});

onBeforeMount(() => {
    initWorker();
});

onMounted(() => {
    if (confirmBool) getTokenInfo();
    initDropdowns();
    emitter.emit('getUserInfo');
    if (kmsFlag) checkKmsNetwork();
});

onBeforeUnmount(() => {
    initWorker();
    // 열려있는 confirm 이 있는 경우 닫고 페이지를 unmount 진행
    emitter.emit('closeConfirm');
});

onUnmounted(() => {
    emitter.off('goAuthFirstMenu');
    emitter.off('clockStart');
    emitter.off('clockStop');
});
</script>
