<template>
    <div class="grid__table">
        <div class="table__headers">
            <div v-if="multiCheck" class="multiCheckBox">
                <Checkbox
                    :model-value="checkboxAllChecked"
                    @update:model-value="(value: boolean) => updateAllCheckedValue(value)"
                />
            </div>
            <div v-for="(header, index) in headers" class="header__item">
                <div>{{ header.title }}</div>
            </div>
        </div>
        <div class="table__bodies">
            <div
                v-if="itemsWithUuid && itemsWithUuid.length > 0"
                v-for="(item, idx) in itemsWithUuid"
                :class="`body__row ${hoverEffect ? 'hoverEffect' : ''}`"
                @click="emits('click:row', item)"
            >
                <div v-if="multiCheck" class="multiCheckBox">
                    <Checkbox
                        :model-value="checkboxMap[item.list_uuid]"
                        @update:model-value="(value: boolean) => updateSelectedValue(value, item.list_uuid)"
                    />
                </div>
                <div
                    v-for="(header, h_idx) in headers"
                    :class="`body__item ${header.textAlign ? header.textAlign : ''}`"
                >
                    <div class="item__text" :title="getValueWithStringDotnotation(item, header.value)">
                        {{
                            getValueWithStringDotnotation(item, header.value) ||
                            (getValueWithStringDotnotation(item, header.value) &&
                                getValueWithStringDotnotation(item, header.value).length !== 0)
                                ? getValueWithStringDotnotation(item, header.value)
                                : '-'
                        }}
                    </div>
                    <div
                        v-if="useDelete"
                        class="delete__icon"
                        @click.stop.prevent="
                            () => (deleteCallback ? deleteCallback(item) : defaultOnDelete(item.list_uuid))
                        "
                    >
                        <i class="bx bxs-trash text-xl"></i>
                    </div>
                </div>
            </div>
            <div v-else class="body__row empty">{{ emptyMsg ?? t('msg.info.no_data.default') }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
type ListItemType = {
    [key: string]: any;
}[];

import { computed, PropType, reactive, Ref, ref, toRefs, watch, watchEffect } from 'vue';
import { base } from '@/plugins/ts/base';
import { v4 as uuidv4 } from 'uuid';
import Checkbox from '@/components/base/atoms/Checkbox.vue';
import { getValueWithStringDotnotation } from '@cm/utils/ConvertUtil';
import { ListHeaderType } from '@/types/types';

const { t } = base();

const emits = defineEmits(['update:selectedItem', 'click:row']);

const props = defineProps({
    headers: {
        type: Object as PropType<ListHeaderType>,
        required: true
    },
    items: {
        type: Object as PropType<ListItemType>,
        required: true
    },
    emptyMsg: {
        type: String
    },
    useDelete: {
        type: Boolean,
        default: false
    },
    deleteCallback: {
        type: Function
    },
    maxHeight: {
        type: String,
        default: '12.5rem'
    },
    multiCheck: {
        type: Boolean,
        default: false
    },
    hoverEffect: {
        type: Boolean,
        default: false
    },
    headerClass: {
        type: String,
        default: ''
    }
});

const { items } = toRefs(props);

const itemsWithUuid = computed(
    () =>
        items.value.map((item) => {
            return { list_uuid: uuidv4(), ...item };
        }) as { [key: string]: any }[]
);

const checkboxMap: Ref<{ [key: string]: boolean }> = ref({});

const checkboxAllChecked = computed(() => {
    if (Object.keys(checkboxMap.value).length === 0) return false;
    for (const property in checkboxMap.value) {
        if (!checkboxMap.value[property]) return false;
    }
    return true;
});

const columnNumbers = props.headers.length;

const gridTemplateColumn = computed(() => {
    let hasSpecificRatio = true;
    let concatedRatio = '';
    for (const header of props.headers) {
        if (!header.ratio) {
            hasSpecificRatio = false;
            break;
        }
        concatedRatio += ` ${header.ratio}`;
    }
    if (hasSpecificRatio) {
        return concatedRatio;
    } else {
        return `repeat(${columnNumbers}, 1fr)`;
    }
});

watch(
    () => itemsWithUuid.value,
    (_new, _old) => {
        if (_new.length > 0) {
            initCheckBoxMap();
        }
    }
);

watchEffect(() => {
    if (props.multiCheck) {
        for (const property in checkboxMap.value) {
            const value = checkboxMap.value[property];
            const item = itemsWithUuid.value.find((uuidItem) => uuidItem.list_uuid === property);
            if (item) {
                emits('update:selectedItem', item, value);
            }
        }
    }
});

function initCheckBoxMap() {
    let obj = {} as { [key: string]: boolean };
    for (const item of itemsWithUuid.value) {
        obj[item.list_uuid] = false;
    }
    checkboxMap.value = { ...obj };
}

function updateSelectedValue(value: boolean, list_uuid: string) {
    checkboxMap.value[list_uuid] = value;
}

function updateAllCheckedValue(value: boolean) {
    for (const property in checkboxMap.value) {
        checkboxMap.value[property] = value;
    }
}

/**
 * Still Working on....
 */
function defaultOnDelete(list_uuid: string) {
    console.log('deleted list_uuid is ', list_uuid);
}
</script>

<style lang="scss" scoped>
$header-row-height: 3rem;
$body-row-height: 3rem;
$header-row-vertical-center: -0.3rem;
$body-row-vertical-center: -0.3rem;
$padding-delete: 2rem;
.grid__table {
    border: 1px solid rgb(200, 207, 215);
    max-height: v-bind('maxHeight');
    padding-right: 0.15rem;
    overflow-y: scroll;
    .table__headers {
        display: grid;
        align-items: center;
        grid-template-columns: v-bind('gridTemplateColumn');
        background-color: #f5f6f7;
        min-height: $header-row-height;

        box-sizing: border-box;
        font-weight: bold;

        position: sticky;
        top: 0;
        z-index: 1;

        padding-right: $padding-delete;

        .multiCheckBox {
            position: absolute;
            display: flex;
            align-items: center;
            top: $body-row-vertical-center;
            left: 1rem;
            cursor: pointer;

            & + .header__item {
                padding-left: 3.25rem;
            }
        }
        .header__item {
            display: flex;
            height: 100%;
            width: 100%;
            justify-content: center;
            align-items: center;
        }
    }
    .table__bodies {
        .body__row {
            display: grid;
            text-align: center;
            grid-template-columns: v-bind('gridTemplateColumn');

            box-sizing: border-box;
            min-height: $body-row-height;

            position: relative;

            border-bottom: 1px solid rgb(200, 207, 215);
            padding-right: $padding-delete;

            &.hoverEffect {
                cursor: pointer;

                &:hover {
                    background-color: #f7fafc;
                }
            }

            .multiCheckBox {
                position: absolute;
                display: flex;
                align-items: center;
                top: $header-row-vertical-center;
                left: 1rem;

                cursor: pointer;

                & + .body__item {
                    padding-left: 3.25rem;
                }
            }

            .delete__icon {
                position: absolute;
                right: 0.75rem;
                top: 0.85rem;

                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                    color: red;
                }
            }

            .body__item {
                display: flex;
                align-items: center;
                padding: 0 0.5rem 0 0.5rem;
                justify-content: center;

                .item__text {
                    word-break: break-all;
                    white-space: nowrap;
                    vertical-align: middle;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                &.left {
                    justify-content: flex-start;
                }
                &.right {
                    justify-content: flex-end;
                }
            }

            &.empty {
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>
