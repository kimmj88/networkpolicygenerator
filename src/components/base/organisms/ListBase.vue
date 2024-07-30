<template>
    <div class="list__body__wrapper h-full">
        <div class="list__columns" :class="sortStr">
            <template v-for="(value, key) in computedHeader">
                <div :key="key" v-if="value.show ?? true" class="flex justify-center items-center min-h-[2.5rem]">
                    <span
                        :data-id="snakeToCamel(key as string)"
                        class="w-full h-full text-center text-base font-bold list__ellipsis"
                        :class="checkKey(key)"
                        :title="t(value.msg)"
                    >
                        <em class="sort"></em>
                        {{ t(value.msg) }}
                    </span>
                </div>
            </template>
        </div>
        <div class="list__body__wrapper h-[calc(100%-3rem)] overflow-auto">
            <template v-if="dataList?.length > 0 && authRead">
                <div
                    class="list__item border-b py-1.5 hover:bg-gray-100 min-h-[3rem]"
                    v-for="item in dataList"
                    :key="item.id"
                    :class="item.verify_status === 'true' ? verifySuccessClass : verifyFailClass"
                >
                    <template v-for="(value, key, idx) in computedHeader">
                        <div
                            :key="key"
                            v-if="value.show ?? true"
                            class="flex items-center px-2"
                            :class="value?.textClass ? value?.textClass : ' justify-center'"
                            :title="getListContent(item, key)"
                        >
                            <template v-if="emitMapper && emitMapper[key]">
                                <!-- {{ item.status }} {{ checkBtnDisabled((emitData as EmitMapperTypeDetail)?.btn_disabled, item) }} -->
                                <template v-if="Array.isArray(emitMapper[key])">
                                    <template v-for="(emitData, emitIdx) in emitMapper[key]" :key="emitData">
                                        <!-- {{ checkBtnDisabled((emitData as EmitMapperTypeDetail)?.btn_disabled, item) }} -->
                                        <!-- 버튼 타입 -->
                                        <AtomButton
                                            v-if="
                                                (emitData as EmitMapperTypeDetail)?.type === 'btn' &&
                                                validateItemShow(key, item, emitIdx)
                                            "
                                            :button-name="
                                                emitMapper
                                                    ? (emitData as EmitMapperTypeDetail).label
                                                    : getListContent(item, key)
                                            "
                                            :class="item.id"
                                            :class-text="
                                                (emitData as EmitMapperTypeDetail).btn_icon_class
                                                    ? `${(emitData as EmitMapperTypeDetail).btn_icon_class} ${btnBasicClass} responsvie_btn`
                                                    : btnBasicNoIconClass
                                            "
                                            @click="emitMapper && clickObject(getKeyName(emitData, key), item)"
                                            :tabindex="tabIdx.lstIn + idx"
                                            :disabled="
                                                checkBtnDisabled(
                                                    (emitData as EmitMapperTypeDetail)?.btn_disabled,
                                                    item
                                                ) && (emitMapper[key] as EmitMapperTypeDetail)?.btn_disabled?.visible
                                            "
                                        />
                                        <!-- 텍스트 + clickable -->
                                        <span
                                            v-else-if="
                                                emitMapper &&
                                                (emitData as EmitMapperTypeDetail)?.type === 'text' &&
                                                validateItemShow(key, item, emitIdx)
                                            "
                                            class="list__ellipsis text-black text-m hover:cursor-pointer"
                                            @click="emitMapper && clickObject(getKeyName(emitData, key), item)"
                                            :tabindex="tabIdx.lstIn + idx"
                                        >
                                            {{ getListContent(item, key) }}
                                        </span>
                                    </template>
                                </template>
                                <template v-else-if="validateItemShow(key, item)">
                                    <!-- 버튼 타입 -->
                                    <span
                                        v-if="
                                            (emitMapper[key] as EmitMapperTypeDetail)?.type === 'btn' &&
                                            checkBtnDisabled(
                                                (emitMapper[key] as EmitMapperTypeDetail)?.btn_disabled,
                                                item
                                            ) === true &&
                                            (emitMapper[key] as EmitMapperTypeDetail)?.btn_disabled?.visible === false
                                        "
                                    >
                                        -
                                    </span>
                                    <AtomButton
                                        v-else-if="(emitMapper[key] as EmitMapperTypeDetail)?.type === 'btn'"
                                        :button-name="
                                            emitMapper
                                                ? (emitMapper[key] as EmitMapperTypeDetail).label
                                                : getListContent(item, key)
                                        "
                                        :class="item.id"
                                        :class-text="
                                            (emitMapper[key] as EmitMapperTypeDetail).btn_icon_class
                                                ? `${(emitMapper[key] as EmitMapperTypeDetail).btn_icon_class} ${btnBasicClass} responsvie_btn`
                                                : btnBasicNoIconClass
                                        "
                                        @click="emitMapper && clickObject(getKeyName(emitMapper[key], key), item)"
                                        :tabindex="tabIdx.lstIn + idx"
                                        :disabled="
                                            checkBtnDisabled(
                                                (emitMapper[key] as EmitMapperTypeDetail)?.btn_disabled,
                                                item
                                            ) && (emitMapper[key] as EmitMapperTypeDetail)?.btn_disabled?.visible
                                        "
                                    />
                                    <!-- 텍스트 + clickable -->
                                    <span
                                        v-else-if="
                                            emitMapper && (emitMapper[key] as EmitMapperTypeDetail)?.type === 'text'
                                        "
                                        class="list__ellipsis text-black text-m hover:cursor-pointer"
                                        @click="emitMapper && clickObject(getKeyName(emitMapper[key], key), item)"
                                        :tabindex="tabIdx.lstIn + idx"
                                    >
                                        {{ getListContent(item, key) }}
                                    </span>
                                </template>
                                <template v-else>
                                    <!-- 안보여야 하는 부분 - 으로 표시 -->
                                    <span
                                        v-if="!validateItemShow(key, item)"
                                        class="list__ellipsis text-black text-m"
                                        :tabindex="tabIdx.lstIn + idx"
                                    >
                                        -
                                    </span>
                                </template>
                            </template>
                            <!-- 일반 텍스트 -->
                            <span v-else class="list__ellipsis" :class="value.code && getCommonCodeColor(item, key)">
                                {{ getListContent(item, key) }}
                            </span>
                        </div>
                    </template>
                </div>
            </template>
            <div v-else>
                <div class="no-data flex flex-wrap justify-center content-center pl-2 min-h-[3rem]">
                    <span :title="t('msg.error.info.data.not_exist.default')">{{
                        t('msg.error.info.data.not_exist.default')
                    }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { auth } from '@/plugins/ts/auth';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import type { BtnDisabledType, EmitMapperTypeDetail, HeaderConfig, ListBaseProps, ListItemType } from '@/types/types';
import AtomButton from '@a/Button.vue';
import { computed, toRefs, type ComputedRef } from 'vue';

const { gProp, t, commonts, stores } = base();
const { authRead } = auth();
const { svcType, getDateFormat, tabIdx } = commonVar();

const props = withDefaults(defineProps<ListBaseProps>(), {
    sortFlag: true,
    verifySignature: false
});
const { headers, dataList, emitMapper, commonCode, sortFlag, verifySignature } = toRefs(props);

const btnBasicClass =
    'text-white text-sm bg-primary_btn rounded-md px-2.5 py-1 min-h-8 max-h-12 focus:outline-none hover:brightness-75 min-w-16 max-w-20';
const btnBasicNoIconClass =
    'text-white text-sm bg-primary_btn rounded-md px-2.5 py-2 min-h-8 max-h-12 focus:outline-none hover:brightness-75 min-w-16 max-w-[6.5rem]';

const currentLang = computed(() => stores.common.currentLang);

const sortStr = computed(() => (sortFlag.value ? 'table-sort' : ''));

const verifySuccessClass = computed(() => (verifySignature.value ? 'bg-green-100' : ''));
const verifyFailClass = computed(() => (verifySignature.value ? 'bg-red-100' : ''));

const computedHeader: ComputedRef<HeaderConfig> = computed(() => {
    return headers.value;
});

const computedGridRatio = computed(() => {
    let ratio = '';
    for (const [key, value] of Object.entries(headers.value)) {
        ratio += ratio.length > 0 ? ' ' : '';
        if (typeof value.size === 'object') {
            ratio += getSizeValue(value);
        } else {
            ratio += value.size;
        }
    }
    return ratio;
});

const emit = defineEmits(['click:object']);

function snakeToCamel(str: string) {
    return str.toLowerCase().replace(/[-_][a-z0-9]/g, (group) => group.slice(-1).toUpperCase());
}

function getListContent<T>(item: T, header: keyof T) {
    const targetCmcode = computedHeader.value[header as string].code;
    let ret = item[header] as string;
    // console.log(targetCmcode, commonCode?.value, targetCmcode && (commonCode?.value as any)[targetCmcode]);
    if ((header as string).endsWith('time')) {
        ret =
            item[header] === undefined || item[header] === null || item[header] === ''
                ? '-'
                : getDateFormat(item[header] as string);
    } else if (targetCmcode && commonCode?.value && (commonCode?.value as any)[targetCmcode]) {
        const targetCmCodeInfo = getTargetCommonCodeInfo(targetCmcode, item[header] as string);
        if (targetCmCodeInfo) {
            ret = targetCmCodeInfo.locale_cd_nm ?? targetCmCodeInfo.grp_cd_nm;
        }
        // 특수 코드 메세지 처리
        if (targetCmcode.toLowerCase() === 'cmm902') {
            ret = t('voca.use.' + (item[header] as string)?.toLowerCase() + '.default');
        }
    }
    return ret;
}

function getCommonCodeColor(item: ListItemType, headerKey: keyof ListItemType) {
    let result = '';
    const targetCmCode = computedHeader.value[headerKey].code;
    if (targetCmCode) {
        const targetCmCodeInfo = getTargetCommonCodeInfo(targetCmCode, item[headerKey]);
        result = targetCmCodeInfo?.item1 ? targetCmCodeInfo?.item1 : '';
    }
    return result;
}

function getTargetCommonCodeInfo(code: string, cd: string) {
    const commonCodeInfo =
        commonCode.value && commonCode.value[code]?.find((codeInfo: { [key: string]: any }) => codeInfo.cd === cd);
    if (commonCodeInfo) {
        let localeCmCdNm;
        commonCodeInfo.ml_info.length > 0 &&
            commonCodeInfo.ml_info.forEach((mlInfo: { [key: string]: any }) => {
                //대소문자 동일하게 만든 후 비교
                if (mlInfo.lang_cd.toUpperCase() === currentLang.value.toUpperCase()) {
                    localeCmCdNm = mlInfo.name;
                }
            });
        //ml_info에 일치하는 언어가 없다면, 원래 공통코드 name으로 설정
        if (!localeCmCdNm) {
            localeCmCdNm = commonCodeInfo.cd_nm;
        }
        commonCodeInfo.locale_cd_nm = localeCmCdNm;
    }

    return commonCodeInfo;
}

function checkKey(key: string | number) {
    return typeof key === 'string' && key.startsWith('no_search_key') ? '' : 'header cursor-pointer';
}

function getSizeValue(value: any) {
    let ratio = '';
    if (value.size[svcType.value === 'ALL' ? 1 : 0] !== '0%') {
        ratio = value.size[svcType.value === 'ALL' ? 1 : 0];
    }
    return ratio;
}

function validateItemShow(key: string | number, item: any, emitIdx?: number) {
    if (emitMapper?.value?.[key]) {
        const arrayIdx = emitIdx ?? 0;
        const conditionFunc = Array.isArray(emitMapper.value[key])
            ? (emitMapper.value[key] as EmitMapperTypeDetail[])[arrayIdx]?.show_condition
            : (emitMapper.value[key] as EmitMapperTypeDetail).show_condition;
        if (conditionFunc) {
            return conditionFunc(item);
        }
        return true;
    } else {
        return true;
    }
}

function checkBtnDisabled(infos: BtnDisabledType | undefined, item: any) {
    // disable 조건이 맞으면 true, 틀리면 false
    if (infos?.condition) {
        const conditionFunc = infos.condition;
        if (conditionFunc) {
            return conditionFunc(item);
        }
    }
    return false;
}

function getKeyName(emitData: any, key: string | number) {
    let retKey = '';

    if (emitData?.key_name?.prefix) {
        retKey += emitData?.key_name?.prefix;
    }
    retKey += key;

    if (emitData?.key_name?.postfix) {
        retKey += emitData?.key_name?.postfix;
    }
    return retKey;
}

function clickObject(key: string | number, data: string | object) {
    commonts.debugLog(gProp, ['click event -> ' + key, data]);
    emit('click:object', key, data);
}
</script>

<style lang="scss" scoped>
.list__body__wrapper {
    .list__columns {
        display: grid;
        grid-template-columns: v-bind(computedGridRatio);
        align-items: center;
        padding: 0.2rem 0;
        background-color: #f5f6f7;
    }

    .list__item {
        display: grid;
        grid-template-columns: v-bind(computedGridRatio);
        text-align: center;
    }
}

.list__ellipsis {
    word-break: break-all;
    white-space: nowrap;
    vertical-align: middle;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>
