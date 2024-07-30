import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Request } from 'express';
import { axios as _axios } from '@/plugins/ts/axios';

//#region URL
export const host = 'http://localhost';
export const port = '3000';
//#endregion

export interface ResBaseData<T = void> extends Partial<AxiosResponse<T>> {
    result?: boolean;
    errorMessage?: string;
}

export interface ResGetData<T = void> extends ResBaseData<T> {
    rowCount?: number;
}

export interface ReqBody<T = void> extends Request {
    body: T;
}

export interface ResponsePost {
    result: boolean;
    lastID?: number | number[];
    updateID?: number | number[];
    deleteID?: number | number[];
    message: string;
}

const axiosInstance: AxiosInstance = axios.create({
    timeout: 1000,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN-',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: {
        common: {
            'Access-Control-Allow-Origin': '*'
        }
    }
});

export function axiosIntercept() {
    const { getErrorFunc, getFinallyFunc } = _axios();
    axiosInstance.interceptors.response.use(
        (res) => {
            getFinallyFunc();
            return res;
        },
        (e) => {
            getErrorFunc(e);
            return Promise.reject(e);
        }
    );
}

//#region Requst

type PostData = {
    <REQ>(url: string, body?: REQ, config?: AxiosRequestConfig): Promise<AxiosResponse<ResponsePost>>;
    <REQ, RES>(url: string, body?: REQ, config?: AxiosRequestConfig): Promise<AxiosResponse<RES>>;
};

export const axiosPost: PostData = function <REQ, RES>(url: string, body?: REQ, config?: AxiosRequestConfig) {
    return axiosInstance.post<RES>(url, body, config);
};

class RequestManager {
    private actives: { [key: string]: any };
    constructor(option?: any) {
        this.actives = {};
    }
    public call<REQ, RES = void>(url: string, body?: REQ, config?: AxiosRequestConfig) {
        return new Promise<AxiosResponse<RES>>((resolve, reject) => {
            if (this.actives[url]) {
                reject(this.actives[url]);
                return;
            }

            const req = axiosInstance
                .post<RES>(url, body, config)
                .then((res) => {
                    resolve(res);
                })
                .catch((e) => {
                    reject(e);
                })
                .finally(() => {
                    const { [url]: temp, ...rest } = this.actives;
                    this.actives = rest;
                });
            this.actives[url] = req;
        });
    }
}

export const requestManager = new RequestManager();

//#endregion
