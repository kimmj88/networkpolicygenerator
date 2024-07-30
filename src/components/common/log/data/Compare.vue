<template>
    <div :id="docName">
        <div class="container p-0">
            <div class="card">
                <h3 class="m-0 w-36"></h3>
                <div>
                    <button
                        v-if="authRead && !popupFlag"
                        class="btn btn-info bxc bxc-list-ul btn-min-w-100 ml-3"
                        @click="goList"
                        :tabindex="tabIdx.detBtn"
                    >
                        <a>{{ getDocListBtnName() }}</a>
                    </button>
                </div>
                <div class="p-0">
                    <table class="table table-bordered">
                        <caption style="display: none"></caption>
                        <colgroup>
                            <col style="width: 50%" />
                            <col style="width: 50%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" class="text-center ellipsis border-none">
                                    <span :title="t('voca.data.change.previous.default')"
                                        >>{{ t('voca.data.change.previous.default') }}</span
                                    >
                                </th>
                                <th scope="col" class="text-center ellipsis border-none">
                                    <span :title="t('voca.data.change.later.default')">{{
                                        t('voca.data.change.later.default')
                                    }}</span>
                                </th>
                                <em
                                    class="bx bx-right-arrow-alt"
                                    style="
                                        position: absolute;
                                        left: calc(50% - 0.75em);
                                        line-height: 1.4em;
                                        font-size: 1.5em;
                                        border: 0;
                                    "
                                ></em>
                            </tr>
                        </thead>
                        <tbody v-if="authRead">
                            <tr>
                                <td>
                                    <textarea v-model.trim="prev_data" disabled />
                                </td>
                                <td>
                                    <textarea v-model.trim="curr_data" disabled />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { auth } from '@/plugins/ts/auth';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { computed, onMounted, onUpdated, ref, toRef } from 'vue';

const props = defineProps({
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function,
    detailInfo: Object
});

const { gProp, commonts, router, t } = base();
const { authRead } = auth();
const { tabIdx } = commonVar();

const docName = 'DataCompare';

const popupFlag = ref(props.popupFlag);
const detailInfo = toRef(props, 'detailInfo');
const prev = computed(() => detailInfo?.value?.prev_data ?? '');
const curr = computed(() => detailInfo?.value?.curr_data ?? '');
const curr_data = ref('');
const prev_data = ref('');

const emit = defineEmits(['close']);

function goList() {
    commonts.debugLog(gProp, 'goList');
    if (!popupFlag.value) {
        router?.replace({ path: '/log/data/list' });
    } else {
        commonts.debugLog(gProp, props.popupCloseFunc);
        if (props.popupCloseFunc !== undefined) {
            props.popupCloseFunc(1);
        }
        emit('close');
    }
}

function setData(data: string) {
    let retVal = '';
    if (data !== '') {
        if (!String(data).startsWith('[') && !String(data).startsWith('{') && typeof data == 'string') {
            retVal = parser(JSON.stringify(data));
        } else {
            retVal = JSON.stringify(parser(JSON.stringify(data)), null, 4);
        }
    }
    return retVal;
}

function changeData() {
    curr_data.value = setData(curr.value);
    prev_data.value = setData(prev.value);
}

function parser(data: string) {
    let retVal;
    let obj1 = JSON.parse(data);
    if ((String(obj1).startsWith('[') || String(obj1).startsWith('{')) && typeof obj1 != 'object') {
        obj1 = JSON.parse(obj1);
    }
    if (typeof obj1 == 'string') {
        return obj1;
    }
    let key = Object.keys(obj1);
    let value = Object.values(obj1);
    for (let i in value) {
        if (String(value[i]).startsWith('[') || String(value[i]).startsWith('{')) {
            obj1[key[i]] = parser(JSON.stringify(value[i]));
            commonts.debugLog(gProp, key[i]);
        }
    }
    retVal = obj1;
    return retVal;
}

function getDocListBtnName() {
    return popupFlag.value ? 'btn.close.default' : 'btn.list.default';
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName });
    changeData();
});
</script>

<style>
textarea {
    background-color: transparent;
    border-color: transparent;
    min-width: 400px;
    max-width: 500px;
    min-height: 300px;
    max-height: 600px;
    overflow-y: auto;
    resize: none;
    color: inherit;
}

textarea::-webkit-scrollbar {
    width: 5px;
}
textarea::-webkit-scrollbar-track {
    background-color: transparent;
}
textarea::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: gray;
}
textarea::-webkit-scrollbar-button {
    display: none;
}
</style>
