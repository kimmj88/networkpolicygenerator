import type { BpCodeType } from '@/types/types';

export interface RootState {
    emitter: any;
    isAuthenticated: boolean;
    expireTime: Date;
    currentLang: string;
    languages: Array<{ [x: string]: any }>;
    searchData: { [x: string]: any };
    detailInfo: { [x: string]: any };
    error: { [x: string]: any };
    auditInfo: Array<{ [x: string]: any }>;
    currentRegion: string;
    regions: Array<{ [x: string]: any }>;
}

export interface AuthObject {
    flag: boolean;
    expireTime?: Date;
}

export interface StoreObject {
    url: string;
    body: {};
    options: {};
    gProp?: Record<string, any>;
    signInError: { [x: string]: any };
}

export interface MenuInfo {
    menuId: Array<string>;
    menuNm: string;
    menuTypeFlag: boolean;
    menuType: string;
    menuUrl: string;
    menuAuth: {
        c: string;
        r: string;
        u: string;
        d: string;
        e: string;
    };
    menuList: Array<{ [x: string]: any }>;
}

export interface UserInfo {
    email: string;
    name: string;
    company: string;
    svcType: string;
}

export interface UserState {
    accessToken: string;
    refreshToken: string;
    user: UserInfo;
}

export interface NetworkState {
    isActive: boolean;
    emergencyStatus: boolean;
    forceToStopEmergency: boolean;
}

export interface PresetState {
    fullJsonKeyList: BpCodeType[];
    selectedJsonKeyList: string[];
}
