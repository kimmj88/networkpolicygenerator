// src/router.ts
import App from '@/App.vue';
import { createPinia } from 'pinia';
// createApp
import { createApp } from 'vue';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
// frontend config
import ConfigTS from '@/config';
import CommonTS from '@/plugins/common';
import { useCommonStore } from '@/stores';
import routes_npg from './routes/npg';

const app = createApp(App);
app.use(createPinia());

app.use(ConfigTS);
app.use(CommonTS);

const gProp = app.config.globalProperties;
const configts = gProp.$configts;
const commonts = gProp.$commonts;

const stores = {
    common: useCommonStore()
};

console.log(configts.getMode());

const requiresAuthFlag = true;

const routes_base = [
    {
        path: '/',
        name: 'Home',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/common/login/Login.vue')
    },
    // {
    //     path: "/log/access/list",
    //     name: "logAccessList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/access/AccessView.vue"),
    // },
    // {
    //     path: "/log/menu/list",
    //     name: "logMenuList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/menu/MenuView.vue"),
    // },
    // {
    //     path: "/log/data/list",
    //     name: "logDataList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/data/DataView.vue"),
    // },
    // {
    //     path: "/log/file/list",
    //     name: "logFileList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/file/FileView.vue"),
    // },
    // {
    //     path: "/log/account/list",
    //     name: "logAccountList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/account/AccountView.vue"),
    // },
    // {
    //     path: "/log/audit/list",
    //     name: "logAuditList",
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import("@/views/common/log/audit/AuditView.vue"),
    // },
    {
        path: '/mng/grpcode/list',
        name: 'grpcodeList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/common/mng/code/GrpCodeView.vue')
    },
    {
        path: '/mng/code/list',
        name: 'codeList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/common/mng/code/CodeView.vue')
    },
    {
        path: '/mng/menu/list',
        name: 'menuList',
        meta: { requiresAuth: requiresAuthFlag },
        component: () => import('@/views/common/mng/menu/MenuView.vue')
    },
    // {
    //     path: '/user/list',
    //     name: 'userList',
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import('@/views/common/mng/user/UserView.vue')
    // },
    // {
    //     path: '/auth/list',
    //     name: 'authList',
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import('@/views/common/mng/auth/AuthView.vue')
    // },
    // {
    //     path: '/auth/menu/list',
    //     name: 'authMenuList',
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import('@/views/common/mng/auth/menu/AuthMenuView.vue')
    // },
    // {
    //     path: '/auth/user/list',
    //     name: 'authUserList',
    //     meta: { requiresAuth: requiresAuthFlag },
    //     component: () => import('@/views/common/mng/auth/user/AuthUserView.vue')
    // },
    {
        // not found handler
        path: '/:pathMatch(.*)*',
        name: 'notFound404',
        component: () => import('@/components/common/error/404.vue')
    }
];

function getRoutes() {
    return routes_base.concat(routes_npg());
}

const routes = getRoutes();

const router = createRouter({
    history: configts.getElectronFlag() ? createMemoryHistory() : createWebHistory(),
    routes
});

router?.beforeEach((to: any, from: any, next: any) => {
    if (localStorage.getItem('isAuthenticated') !== 'undefined') {
        stores.common.setAuth({
            flag: Boolean(localStorage.getItem('isAuthenticated'))
            // expireTime: new Date(localStorage.getItem("expireTime")),
        });
    }
    // if (to.path !== from.path && document?.querySelector("[modal-backdrop]")) {
    //     document?.querySelector("[modal-backdrop]")?.remove();
    // }
    commonts.hideLoading();
    /*  인증체크를 위한 로직 현재 미사용
     *  if (to.matched.some((routeInfo: any) => routeInfo.meta.requiresAuth) && !isAuthenticated) {
     *     next("/login");
     * } else {
     */
    // commonts.showLoading()

    // refresh 처리시 저장된 기존 URL 이 있으면 그 쪽으로 route 되도록 처리
    if (from.path === '/' && to.path === '/' && localStorage.getItem('prevUrl')) {
        next(localStorage.getItem('prevUrl'));
    } else {
        next();
    }
    // next();
    // }
});

router.replace('/');

export default router;
