<template>
    <nav>
        <div class="titleDiv">
            <span class="title center cursor-pointer" @click="goAuthFirstMenu(true)">
                <img
                    v-if="ci === 'kl'"
                    src="@/assets/img/BI_AutoCryptKeyLink_white.png"
                    :alt="t('voca.name.system.' + commonts.getCompName(gProp) + '.default')"
                />
                <span v-else>
                    {{ t('voca.name.system.' + commonts.getCompName(gProp) + '.default') }}
                </span>
            </span>
            <span class="version">
                {{ t('voca.version.argv.default', [uiVersion]) }}
                <span v-if="gProp?.$devMode" :style="getDevStyle"><br />[{{ userInfo.svcType }}] </span>
            </span>
        </div>
        <div class="menuDiv">
            <ul>
                <template v-for="(menu, idx) in menuList" :key="menu.menu_id + idx">
                    <li
                        class="cp"
                        :id="menu.menu_id"
                        v-if="menu.up_menu_id === rootMenuId && menu.menu_id !== rootMenuId"
                    >
                        <span
                            class="ulText"
                            :class="menu.menu_url === 'lock' ? 'subdir' : ''"
                            v-if="menu.menu_url === 'lock' && menu.up_menu_id === rootMenuId"
                            title="To Be Updated"
                        >
                            <div :id="'menu' + menu.menu_id" :tabindex="tabIdx.header + idx * 100">
                                {{ getMLMenuName(menu) }}
                            </div>
                            <div class="ic_lock" />
                        </span>
                        <span
                            class="ulText"
                            :class="checkMenuUrl(menu?.menu_url)"
                            :title="menu.menu_nm"
                            v-if="menu.up_menu_id === rootMenuId && menu.menu_id !== rootMenuId"
                            @click.prevent="
                                (e) =>
                                    viewAndGo(e, {
                                        url: menu.menu_url,
                                        menuId: menu.menu_id,
                                        menuTypeFlag: false,
                                        menuType: ''
                                    })
                            "
                        >
                            <div :id="'menu' + menu.menu_id" :tabindex="tabIdx.header + idx * 100">
                                {{ getMLMenuName(menu) }}
                            </div>
                            <div class="ic_arrow rotate-180 hidden" />
                        </span>
                        <ul>
                            <template v-for="(menuSub1, idxSub1) in menuList" :key="'sub1' + menuSub1.menu_id">
                                <li
                                    class="cp"
                                    :id="'sub1' + menuSub1.menu_id"
                                    v-if="menuSub1.up_menu_id === menu.menu_id"
                                >
                                    <span
                                        :class="checkMenuUrl(menuSub1?.menu_url)"
                                        @click.prevent="
                                            (e) =>
                                                viewAndGo(e, {
                                                    url: menuSub1.menu_url,
                                                    menuId: menuSub1.menu_id,
                                                    menuTypeFlag: false,
                                                    menuType: ''
                                                })
                                        "
                                        :title="getMLMenuName(menuSub1)"
                                    >
                                        <div
                                            :id="'menuSub1' + menuSub1.menu_id"
                                            :tabindex="tabIdx.header + idxSub1 * 10 + idxSub1"
                                        >
                                            {{ getMLMenuName(menuSub1) }}
                                        </div>
                                        <div class="ic_arrow rotate-180 hidden" />
                                    </span>
                                    <ul>
                                        <template
                                            v-for="(menuSub2, idxSub2) in menuList"
                                            :key="'sub2' + menuSub2.menu_id"
                                        >
                                            <li
                                                class="cp"
                                                :id="'sub2' + menuSub2.menu_id"
                                                v-if="menuSub2.up_menu_id === menuSub1.menu_id"
                                            >
                                                <span
                                                    :class="checkMenuUrl(menuSub2?.menu_url)"
                                                    @click.prevent="
                                                        (e) =>
                                                            viewAndGo(e, {
                                                                url: menuSub2.menu_url,
                                                                menuId: menuSub2.menu_id,
                                                                menuTypeFlag: false,
                                                                menuType: ''
                                                            })
                                                    "
                                                    :title="getMLMenuName(menuSub2)"
                                                >
                                                    <div
                                                        :id="'menuSub2' + menuSub2.menu_id"
                                                        :tabindex="tabIdx.header + idxSub2 * 10 + idxSub2"
                                                    >
                                                        {{ getMLMenuName(menuSub2) }}
                                                    </div>
                                                </span>
                                            </li>
                                        </template>
                                    </ul>
                                </li>
                            </template>
                        </ul>
                    </li>
                </template>
            </ul>
        </div>
        <div class="infoDiv">
            <ul>
                <li>
                    <span class="inline-flex justify-around items-center">
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
                    </span>
                </li>
                <li class="user">
                    <span @click.prevent="dropdownShow" class="inline-flex justify-between items-center">
                        <div class="inline-flex justify-left items-center">
                            <div class="ic_account"></div>
                            <div class="name ml-2">
                                {{ userInfo.name }}
                            </div>
                        </div>
                        <div class="ic_arrow rotate-180" />
                    </span>
                    <ul class="dropdown position">
                        <div>
                            <li v-if="multi_language">
                                <span @click.prevent="dropdownShow">
                                    <div class="inline-flex items-center">
                                        {{ t('voca.language.default') }}&nbsp;:&nbsp;
                                        <country-flag
                                            class="border-1"
                                            style="margin: 0px"
                                            :country="currentLang.flag"
                                        />
                                        {{ t('voca.language.' + currentLang.flag + '.default') }}
                                    </div>
                                    <div class="ic_arrow rotate-180 ml-4" />
                                </span>
                                <ul class="dropdown position-sub language">
                                    <div v-for="(entry, idx) in languages" :key="entry.language">
                                        <li><hr class="dropdown-divider" v-if="idx >= 1" /></li>
                                        <li @click="changeLocale(entry.language)">
                                            <a class="dropdown-item">
                                                <em
                                                    class="lang-icon bx bxs-flag-alt text-2xl"
                                                    :style="{
                                                        visibility:
                                                            entry.flag === currentLang.flag ? 'visible' : 'hidden'
                                                    }"
                                                ></em>
                                                <country-flag
                                                    :class="'border-1'"
                                                    style="margin: 0px"
                                                    :country="entry.flag"
                                                />
                                                <strong style="vertical-align: super">
                                                    {{ t('voca.language.support.list.default[' + entry.index + ']') }}
                                                </strong>
                                            </a>
                                        </li>
                                    </div>
                                </ul>
                            </li>
                            <!-- <li><hr class="dropdown-divider" /></li>
                            <li @click="account">
                                <span>
                                    <div>
                                        {{ t('btn.account.my.default') }}
                                    </div>
                                    <div>
                                        <em class="bxc bxc-user-account"></em>
                                    </div>
                                </span>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li @click="logout">
                                <span>
                                    <div>
                                        {{ t('btn.logout.default') }}
                                    </div>
                                    <div>
                                        <em class="bxc bxc-logout"></em>
                                    </div>
                                </span>
                            </li> -->
                        </div>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import Timer from '@/plugins/ts/timer?worker&inline';
import { initDropdowns } from 'flowbite';
import {
    computed,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    onUpdated,
    reactive,
    ref
} from 'vue';

const { stores, emitter, gProp, commonts, t, route } = base();
const { ci, uiVersion, tabIdx, languages, currentLang, multi_language } = commonVar();
const { getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();

const userInfo = computed(() => stores.user.user);
const rootMenuId = computed(() => stores.menu.rootMenuId);
const menuList = computed(() => stores.menu.menuList);
const networkStatus = computed(() => stores.network.isActive);
const emergencyStatus = computed(() => stores.network.emergencyStatus);

const kmsFlag = gProp?.$kmsflag;
const goAuthFirstMenuFlag = ref(false);


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

function setViewClosestNode(target: Element) {
    const closestNode = target.closest('li.cp');
    const parentUl = closestNode?.closest('ul');
    // 선택된 부모 li.cp 에 view 추가
    if (closestNode && closestNode.id !== rootMenuId.value && !closestNode.classList.contains('view')) {
        closestNode.classList.add('view');
    }
    // 상위 메뉴가 더 있는 경우 다시 처리
    if (parentUl && (parentUl?.parentNode as Element)?.tagName.toLowerCase() === 'li') {
        setViewClosestNode(parentUl);
    } else if (!parentUl?.classList.contains('view')) {
        parentUl?.classList.add('view');
    }
}

function checkMenuUrl(menuUrl: string) {
    let className = '';
    if (menuUrl === 'subdir') {
        className += ' dir';
    } else if (menuUrl === route?.path) {
        className += ' clicked';
    }

    nextTick().then(() => {
        const target = document.querySelector('span.clicked');
        if (target != null) {
            setViewClosestNode(target as HTMLElement);
            const location = (target as HTMLElement)?.offsetTop;
            document.querySelector('.menuDiv')?.scrollTo({ top: location, behavior: 'smooth' });
        }
    });
    return className;
}

const getDevStyle = computed(() => {
    let styleStr = 'margin-right: 0.5rem;';
    styleStr += 'color: yellow';
    return styleStr;
});

function viewAndGoSet(
    target: HTMLElement,
    routeInfo: { url: string; menuId: string; menuTypeFlag: boolean; menuType: string }
) {
    removeClass(target?.closest('ul') as HTMLElement, '.clicked', 'clicked');
    if (target?.closest('span:not(.dir)')?.classList.contains('clicked')) {
        target?.closest('span:not(.dir)')?.classList.remove('clicked');
    } else {
        target?.closest('span:not(.dir)')?.classList.add('clicked');
    }
    subMenuShow(target);
    setRouterMenuInfo(routeInfo.url, routeInfo.menuId, routeInfo.menuTypeFlag, routeInfo.menuType);
}

function viewAndGo(e: Event, routeInfo: { url: string; menuId: string; menuTypeFlag: boolean; menuType: string }) {
    let target = e?.target as HTMLElement;
    viewAndGoSet(target, routeInfo);
}

function removeClass(target: HTMLElement, selectClassName: string, removeClassName: string) {
    let viewList = target?.querySelectorAll(selectClassName);
    viewList?.forEach((element) => {
        if (element.classList.contains(removeClassName)) {
            element.classList.remove(removeClassName);
        }
    });
}

function removeShowClass(targetDivClassName: string) {
    let t = document.querySelector('.' + targetDivClassName) as HTMLElement;
    if (t !== null) {
        removeClass(t, 'li.view', 'view');
        removeClass(t, '.dropdown.view', 'view');
    }
}

function subMenuShow(target: HTMLElement) {
    let menu = target?.closest('li');
    // 이미 선택한 항목을 재선택한 경우
    if (menu?.classList.contains('view')) {
        menu?.classList.remove('view');
    } else {
        // view class 가진 모든 li 항목을 제거
        removeClass(target?.closest('ul') as HTMLElement, 'li.view', 'view');
        removeShowClass('infoDiv');
        menu?.classList.toggle('view');
    }
}

function dropdownShow(e: Event) {
    let target = e?.target as HTMLElement;
    const rotateClass = 'rotate-90';

    // target 선택시 화살표 회전 처리를 한다.
    target?.closest('span')?.childNodes.forEach((item) => {
        let t = item as HTMLElement;
        if (t.classList.contains('ic_arrow')) {
            t.classList.toggle(rotateClass);
        }
    });

    // dropdown 메뉴를 선택한다.
    let menu = target?.closest('span')?.nextSibling as HTMLElement;
    // dropdown 메뉴가 이미 선택되어 있는 경우
    if (menu?.classList.contains('view')) {
        menu?.classList.remove('view');
        // view class 가진 모든 li 항목을 제거 - 현재 target 하위에 모든 view 상태 제거
        removeClass(target?.closest('ul') as HTMLElement, '.dropdown.view', 'view');
        // 하위에 열린 모든 dropdown 닫음
        removeClass(target?.closest('ul') as HTMLElement, '.ic_arrow.' + rotateClass, rotateClass);
    } else {
        menu?.classList.add('view');
    }
}

function setRouterMenuInfo(url: string, menuId: string, menuTypeFlag: boolean, menuType: string) {
    if (url !== 'subdir' && url !== 'lock') {
        commonts.debugLog(gProp, ['setRouterMenuInfo', url]);
        commonts.setRouterInfo(gProp, url, menuId, menuTypeFlag, menuType, stores.menu.menuList);
    }
}

function goAuthFirstMenu(moveFlag: boolean) {
    if (moveFlag) {
        let mList: Array<{ [x: string]: any }> = menuList.value;
        if (mList && mList.length > 0) {
            let upMenuId = mList[0].up_menu_id;
            const depth = ['', 'sub1', 'sub2'];
            let depthIdx = 0;
            for (let i = 0; i < mList.length; i++) {
                let m = mList[i];
                if (m.up_menu_id === upMenuId) {
                    // gnb 메뉴 선택된 것 처럼 보이도록 수정
                    let target = document.getElementById(depth[depthIdx] + m.menu_id);
                    let liSpan = target?.querySelector('span');
                    if (liSpan) {
                        subMenuShow(liSpan);
                    }

                    if (m.menu_url !== 'subdir' && m.menu_url !== 'lock') {
                        if (liSpan) liSpan.classList.add('clicked');
                        setRouterMenuInfo(m.menu_url, m.menu_id, m.menu_type_flag, m.menu_type);
                        break;
                    } else {
                        upMenuId = m.menu_id;
                        depthIdx++;
                    }
                }
            }
        } else {
            commonts.routerLink(gProp, '/');
        }
    }
}

function getMLMenuName(menuInfo: any) {
    return commonts.getMLMenuName(menuInfo, currentLang.value.language);
}

function account() {
    commonts.showModal(accountModal.value, 200);
}

function logout() {
    commonts.debugLog(gProp, 'header logout');
    emitter.emit('logout');
}

function changeLocale(locale: string) {
    commonts.changeLocale(gProp, locale);
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
    if (timer.remainTime != 0 && timer.remainTime < limitTime) {
        clock.classList.add('text-red-600');
    }
    target?.appendChild(clock);
}

function showClock() {
    timer.remainTime = timer.remainTime - 1000;
    timer.mm = timer.remainTime > 0 ? Math.floor(timer.remainTime / 1000 / 60) : 0;
    timer.ss = timer.remainTime > 0 ? Math.floor((timer.remainTime / 1000) % 60) : 0;

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
    // 화면 랜더링 다 된 후에 처리되어야 함으로 flag 값 세팅 후 onUpdated 에서 실행
    goAuthFirstMenuFlag.value = true;
});

onBeforeMount(() => {
    initWorker();
});

onMounted(() => {
    initDropdowns();
    emitter.emit('getUserInfo');
    if (kmsFlag) checkKmsNetwork();
});

onUpdated(() => {
    goAuthFirstMenu(goAuthFirstMenuFlag.value);
    goAuthFirstMenuFlag.value = false;
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
