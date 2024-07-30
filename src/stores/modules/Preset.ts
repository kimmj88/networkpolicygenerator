// import type { StoreObject, PresetState } from "@/stores/interface";
import type { PresetState } from '@/stores/interface';
import type { BpCodeType } from '@/types/types';
import { defineStore } from 'pinia';

export const usePresetStore = defineStore('preset', {
    state: (): PresetState => ({
        fullJsonKeyList: [],
        selectedJsonKeyList: []
    }),
    getters: {
        selectableJsonKeyList(): BpCodeType[] {
            if (this.fullJsonKeyList.length === 0) return [];
            // if (this.selectableJsonKeyList?.length === 0) return this.fullJsonKeyList;

            //전체 리스트에서 selectedJsonKeyList가 아닌 값들만 리턴

            return this.fullJsonKeyList.filter((jsonKey) => {
                if (!jsonKey.bp_code) return false;
                return !this.selectedJsonKeyList.includes(jsonKey.bp_code);
            });
        }
    },
    actions: {
        addSeletedJsonKey(jsonKeyCode: string) {
            this.selectedJsonKeyList.push(jsonKeyCode);
        },
        setFullJsonKeyList(jsonKeyList: BpCodeType[]) {
            this.fullJsonKeyList = jsonKeyList;
        },
        deleteSelectedJsonKeys(jsonKeyCode: string) {
            this.selectedJsonKeyList = this.selectedJsonKeyList.filter((selected) => selected !== jsonKeyCode);
        },
        clearSelectedJsonKeys() {
            this.selectedJsonKeyList = [];
        },
        clearFullJsonKeys() {
            this.fullJsonKeyList = [];
        },
        clearJsonKeys() {
            this.clearFullJsonKeys();
            this.clearSelectedJsonKeys();
        }
    }
});
