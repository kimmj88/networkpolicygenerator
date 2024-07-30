import { commonCodeType } from '@/types/types';
import { defineStore } from 'pinia';

interface CodeData {
    [key: string]: commonCodeType[];
}

const REQ_CODE = 'mng_code_lists';
const RES_CODE = 'mng_code_lists_return';

export const useCodeStore = defineStore('codeStore', {
    state: (): {
        codeDatas: CodeData;
    } => ({
        codeDatas: {}
    }),
    getters: {},
    actions: {
        all() {
            return this.codeDatas;
        },
        get(option: { codeKeys: string[] }): Promise<CodeData> {
            return new Promise((resolve, reject) => {
                if (option?.codeKeys.length <= 0) {
                    return reject();
                }
                const codeKeys = Object.keys(this.codeDatas);
                const differences = option.codeKeys.filter((codeKey) => !codeKeys.includes(codeKey.toLowerCase()));
                if (differences.length === 0) {
                    resolve(this.pick(option.codeKeys));
                } else {
                    this.requestCode(option.codeKeys, () => {
                        resolve(this.pick(option.codeKeys));
                    });
                }
            });
        },
        set(option: { code: CodeData }) {
            if (option?.code == undefined) {
                return;
            }
            this.codeDatas = Object.assign({}, this.codeDatas, option.code);
        },
        clear() {
            this.codeDatas = {};
        },
        requestCode(codeKes: string[], callback: () => void) {
            window.ipcRenderer.send(REQ_CODE, {
                grp_cd: codeKes.join(','),
                use_yn: 'Y',
                sort: 'sortOrder asc'
            });
            window.ipcRenderer.once(RES_CODE, (e, res) => {
                this.set({
                    code: res
                });
                callback();
            });
        },
        pick(codeKeys: string[]) {
            return codeKeys.reduce((res: CodeData, key: string) => {
                const _key = key.toLowerCase();
                res[_key] = this.codeDatas[_key];
                return res;
            }, {});
        }
    }
});
