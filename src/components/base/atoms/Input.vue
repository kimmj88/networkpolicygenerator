<template>
    <div class="atom inline-flex align-middle">
        <!-- <AtomLabel v-if="readonly" :id="id" :class-text="'w-full ml-2 text-black'" :label-text="modelValue.toString()"/> -->
        <input
            v-if="customBind !== undefined || customOn !== undefined"
            :id="id"
            :name="name"
            :input-type="inputType"
            :type="inputType"
            :class="classText"
            :placeholder="placeholder"
            :value="modelValue"
            @input="updateValue"
            @keyup.enter="pressEnter"
            @keydown.tab="pressTab"
            @focus="focusHandler"
            :tabindex="tabindex"
            :autoComplete="autoComplete"
            :readonly="readonly"
            :min="min"
            :max="max"
            :maxlength="maxlength"
            v-bind="customBind"
            v-on="customOn"
            @click="updateStatus"
            ref="inputRef"
        />
        <input
            v-else
            :id="id"
            :name="name"
            :input-type="inputType"
            :type="inputType"
            :class="classText"
            :placeholder="placeholder"
            :value="modelValue"
            @input="updateValue"
            @keyup.enter="pressEnter"
            @keydown.tab="pressTab"
            @focus="focusHandler"
            :tabindex="tabindex"
            :autoComplete="autoComplete"
            :readonly="readonly"
            :min="min"
            :max="max"
            :maxlength="maxlength"
            @click="updateStatus"
            ref="inputRef"
        />

        <i
            v-if="alertShow"
            :id="triggerId"
            class="alert-msg bx bx-message-alt-x hidden"
            :class="'text-red-600'"
            @click="tooltip.show()"
        ></i>
        <i
            v-if="passwordShow"
            class="show-btn bx"
            :class="(showToggle ? 'bx-show' : 'bx-hide') + ' ' + iconColor"
            @click="inputPasswordToggle"
        ></i>
        <i v-if="clearShow" class="init-btn bx bx-x" :class="iconColor" @click="clearData"></i>
        <AtomLabel v-if="labelFlag" :id="id" :class-text="labelClassText" :label-text="labelText"></AtomLabel>
        <i
            v-if="!alertShow"
            :id="triggerId"
            class="alert-msg bx bx-message-alt-x hidden"
            :class="'text-red-600'"
            @click="tooltip.show()"
        ></i>
        <!-- tooltip - required class 포함시 validate.ts setMsgElement 에서 내용 수정 -->
        <div
            :id="targetId"
            role="tooltip"
            class="absolute z-[210] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
            <div :class="'tooltip-msg-' + triggerId">
                {{ t('msg.error.no_input.contents.default') }}
            </div>
            <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import
import { base } from '@/plugins/ts/base';
import type { IInput } from '@/types/types';
import AtomLabel from '@a/Label.vue';
import { Tooltip } from 'flowbite';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, onUpdated, ref, toRefs } from 'vue';

// props
const props = defineProps({
    id: {
        type: String,
        default: undefined
    },
    name: {
        type: String,
        default: undefined
    },
    modelValue: {
        type: [String, Number, Boolean],
        default: ''
    },
    inputType: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String
    },
    classText: {
        type: String,
        default: ''
    },
    labelClassText: {
        type: String,
        default: 'text-white w-full ml-2'
    },
    labelText: {
        type: String,
        default: ''
    },
    tabindex: {
        type: Number,
        default: 0
    },
    readonly: {
        type: Boolean,
        default: false
    },
    min: {
        type: Number,
        default: undefined
    },
    max: {
        type: Number,
        default: undefined
    },
    customBind: {
        type: Object,
        default: undefined
    },
    customOn: {
        type: Object,
        default: undefined
    },
    trueValue: {
        type: [String, Number, Boolean],
        default: true
    },
    falseValue: {
        type: [String, Number, Boolean],
        default: false
    },
    maxlength: {
        type: Number,
        default: undefined
    }
});

// props to variable
const {
    modelValue,
    inputType,
    classText,
    labelClassText,
    labelText,
    tabindex,
    readonly,
    min,
    max,
    customBind,
    customOn,
    trueValue,
    falseValue
} = toRefs(props);

// id, name props 로 값이 안넘어 오는 경우 crypto.randomUUID() 로 초기값 세팅하면 같은 값으로만 들어가서
// 로드 후에 값이 없으면 넣도록 수정
const id = computed(() => props.id ?? uuidv4());
const name = computed(() => props.name ?? uuidv4());
const autoComplete = computed(() => {
    return inputType?.value.toLowerCase() === 'password' ? 'current-password' : 'off';
});
const iconColor = computed(() => {
    let retClass = '';
    classText.value.split(' ').forEach((data) => {
        if (data.startsWith('text-')) {
            retClass += data;
        }
    });
    return retClass;
});

const targetId = ref(uuidv4());
const triggerId = ref(uuidv4());
const inputRef = ref<HTMLInputElement | null>(null);
const tooltip = ref(null as any);

const placeholder = computed(() => {
    if (readonly.value) {
        return props.placeholder || '';
    } else {
        return props.placeholder || t('msg.info.input.default');
    }
});

// library
const { t, commonts, gProp } = base();

// function
const showToggle = ref(false);
const labelFlag = computed(() => labelText?.value.length !== 0);
const alertShow = computed(
    () => inputType?.value.toLowerCase() !== 'checkbox' && inputType?.value.toLowerCase() !== 'radio'
);
const passwordShow = computed(() => inputType?.value.toLowerCase() === 'password');
const clearShow = computed(() => {
    return (
        inputType?.value.toLowerCase() !== 'checkbox' &&
        inputType?.value.toLowerCase() !== 'radio' &&
        modelValue.value !== '' &&
        modelValue.value !== null &&
        modelValue.value !== undefined &&
        readonly.value !== true
    );
});
const requiredInitClass = 'req-init';

const checkAllClassVar = 'checkAll';

const emit = defineEmits(['update:modelValue', 'keyup.enter', 'keydown.tab', 'focus']);

function updateValue(e: Event) {
    let target = e.target as HTMLInputElement;
    if (inputType.value.toLowerCase() === 'checkbox') {
        const checkValue = target.checked ? trueValue.value : falseValue.value;
        emit('update:modelValue', checkValue);
    } else {
        emit('update:modelValue', target.value);
    }
}

function focusHandler() {
    emit('focus');
}

function pressEnter() {
    commonts.debugLog(gProp, 'pressEnter');
    emit('keyup.enter');
}
function pressTab() {
    commonts.debugLog(gProp, 'pressTab');
    emit('keydown.tab');
}

function inputPasswordToggle(e: MouseEvent) {
    showToggle.value = !showToggle.value;
    let input = (e?.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
    if (showToggle.value) {
        input.setAttribute('type', 'text');
        input.setAttribute('autoComplete', 'off');
    } else {
        input.setAttribute('type', 'password');
        input.setAttribute('autoComplete', 'current-password');
    }
}

function updateStatus(e: Event) {
    /**
     * 체크 박스 그룹 처리시 check-root class 아래에 있는 동일 name attribute 체크박스들을 체크하여,
     * name과 동일한 id를 가진 전체 선택 체크박스를 체크한다.
     */
    if (inputType.value.toLowerCase() === 'checkbox') {
        let checkClassVar = 'check';
        let target = e.target as HTMLInputElement;
        let targetRoot = target?.closest('.check-root');
        let targetRowArr = targetRoot?.querySelectorAll('.body input[name="' + target?.name + '"]');
        let cbCnt = 0;
        let cbCheckedCnt = 0;

        targetRowArr?.forEach((checkRow) => {
            let t = checkRow as HTMLInputElement;
            if (t.classList.contains(checkClassVar)) cbCnt++;
            if (t.checked) cbCheckedCnt++;
        });

        // querySelector "#" + id 검색시 css3 에서는 숫자로 시작하는 것은 찾지 못함 해서 getElementById 로 찾아야함
        if (
            targetRoot !== undefined &&
            targetRoot !== null &&
            (document.getElementById(target?.name) as HTMLInputElement) !== undefined &&
            (document.getElementById(target?.name) as HTMLInputElement) !== null
        ) {
            (document.getElementById(target?.name) as HTMLInputElement).checked = !!(
                cbCnt > 0 &&
                cbCheckedCnt > 0 &&
                cbCnt === cbCheckedCnt
            );
        }
    }
}

function clearData(e: Event) {
    // 정상 완료 complete class 제거 로직
    let target = e.target as HTMLElement;
    let inputTag = target?.parentElement?.querySelector('input') as HTMLInputElement;
    inputTag.classList.add(requiredInitClass);
    // 기존 값 삭제(emit update:modelValue는 비동기로 작동하여 validate 제대로 되지 않음)
    // setTimeout 0를 활용하여 emit이 완료된 이후에 initForm 실행 되도록 만듦
    emit('update:modelValue', '');
    setTimeout(() => {
        initForm(inputTag);
    }, 0);
}

function initForm(target: HTMLInputElement) {
    if (target?.classList.contains('complete')) {
        target?.classList.remove('complete');
    }

    let alertMessageTag = target?.parentElement?.querySelector('.alert-msg') as HTMLElement;
    if (inputType.value.toLowerCase() === 'radio') {
        // radioGroup 마지막에만 표시
        let targetGroup = document.getElementsByName(target.name);
        alertMessageTag = targetGroup[targetGroup.length > 0 ? targetGroup.length - 1 : 0];
    }

    if (
        target?.classList.contains('required') &&
        !target?.classList.contains(requiredInitClass) &&
        alertMessageTag?.classList.contains('hidden')
    ) {
        alertMessageTag?.classList.remove('hidden');
    }

    target?.dispatchEvent(new Event('blur'));
}

// checkbox group 선택 있는 경우 처리 - 전체선택 checkbox 에는 checkAllClassVar 변수값을 class 로 추가, 그외 checkbox 에는 checkClassVar 변수값을 class 로 추가
/**
 * checkbox group 선택(전체선택) 세팅방법
 * 1. 전체 선택이 포함되는 checkbox 전체를 포함하는 tag 에 class name "check-root" 를 넣음
 * 2. checkbox name attribute 는 체크박스 전체가 동일하게 세팅한다.
 * 3. 전체선택 checkbox class 에 checkAllClassVar 변수값을 세팅한다.
 * 4. 전체선택 checkbox id attribute 와 checkbox name 값은 같게 한다.
 */

function checkboxAllCheck(e: Event) {
    const data = e.target as HTMLElement;
    const targetRowArr = data?.closest('.check-root')?.querySelectorAll('input[name="' + data?.id + '"]');
    targetRowArr?.forEach((checkRow) => {
        const r = checkRow as HTMLInputElement;
        if (!r.disabled) {
            r.checked = (data as HTMLInputElement)?.checked;
            r.dispatchEvent(new Event('input'));
        }
    });
}

function checkboxCheck(targetElem: HTMLInputElement) {
    const targetRowArr = targetElem.closest('.check-root')?.querySelectorAll('input[name="' + targetElem?.id + '"]');
    let cbCnt = targetRowArr?.length ?? 0;
    let cbCheckedCnt = 0;
    targetRowArr?.forEach((checkRow) => {
        const t = checkRow as HTMLInputElement;
        if (t.checked) cbCheckedCnt++;
    });

    // 데이터가 있는 경우
    targetElem.checked = cbCnt > 0 ? !!(cbCnt > 0 && cbCheckedCnt > 0 && cbCnt === cbCheckedCnt) : false;
}

function initArrCheckBox(targetId?: string) {
    const target = targetId !== undefined ? document.querySelector('#' + targetId) : document;

    // 전체 선택 체크박스 이벤트 처리
    const checkAllList = target?.querySelectorAll('.' + checkAllClassVar);
    checkAllList?.forEach((cbAll: Element) => {
        cbAll.removeEventListener('change', checkboxAllCheck);
        cbAll.addEventListener('change', checkboxAllCheck);

        // 개별 선택 상태에 따라 전체선택 체크박스 처리
        const checkList = target?.querySelectorAll('input[name="' + cbAll?.id + '"]');
        checkList?.forEach((cb: Element) => {
            cb.removeEventListener('change', () => {
                checkboxCheck(cbAll as HTMLInputElement);
            });
            cb.addEventListener('change', () => {
                checkboxCheck(cbAll as HTMLInputElement);
            });
        });

        // 초기화시 개별 항목이 전체 선택되어 있으면 전체선택 체크박스로 체크 처리
        checkboxCheck(cbAll as HTMLInputElement);
    });
}

const initValue = () => {
    if (inputType.value.toLowerCase() === 'checkbox') {
        let target = document.getElementById(id.value) as HTMLInputElement;
        if (target != null) {
            target.checked = !!(modelValue.value === 'Y' || modelValue.value === true);
        }
        initArrCheckBox();
    } else if (inputType.value.toLowerCase() === 'radio') {
        // 처리로직 추가 필요
    }

    // if (!readonly.value) {
    //     let target = (document.getElementById(id.value) as HTMLInputElement);
    //     initForm(target);
    // }

    // tooltip 초기화
    const tooltipTarget = document.getElementById(targetId.value);
    const tooltipTrigger = document.getElementById(triggerId.value);
    if (tooltipTarget !== null && tooltipTarget !== undefined) {
        tooltip.value = new Tooltip(tooltipTarget, tooltipTrigger);
    }
};

onMounted(() => {
    // 초기값 세팅
    initValue();
});

onUpdated(() => {
    // 초기값 세팅
    initValue();
});

defineExpose<IInput>({
    focusInputRef() {
        inputRef.value?.focus();
    }
});
</script>

<style lang="scss" scoped>
div.atom {
    width: inherit;
    display: flex;
    align-items: center;
    border-radius: 4px;
}
div.atom:has(input[input-type='text']),
div.atom:has(input[input-type='password']) {
    border: solid 1px var(--input-border);
    background-color: var(--content-bg-white-20);
}
div.atom input {
    width: 100%;
    border: solid 0px var(--input-border) !important;
    font-size: 1rem;
    background-color: unset;
    /* tailwindcss focus 테두리 안보이도록 */
    --tw-ring-shadow: user-select: none;
}
div.atom input:read-only {
    cursor: not-allowed;
}

div.atom input:focus:not(:read-only) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -2px;
    outline-color: transparent;
    --tw-ring-shadow: none !important;
}
div.atom:has(input[input-type='text']:focus:not(:read-only)),
div.atom:has(input[input-type='password']:focus:not(:read-only)) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: var(--input-outline);
}
div.atom input.required,
div.atom input.required:focus {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -2px;
    outline-color: transparent;
    --tw-ring-shadow: none !important;
}

div.atom:has(input.required:not(.radio):not(.req-init)) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: var(--input-outline-required);
}

div.atom:has(input.required.complete:not(.radio)) {
    outline-color: var(--input-outline-complete);
}

div.atom:has(input[input-type='password']) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
div.atom input[input-type='password'] {
    width: calc(100% - 3.5rem);
}
div.atom i {
    font-size: 1.4rem;
    cursor: pointer;
    margin-right: 0.5rem;
}
div.atom.vs__search i.alert-msg {
    margin-right: -4px;
}
div.atom i.alert-msg.hidden {
    display: none;
}

div.atom input[input-type='checkbox'],
div.atom input[input-type='radio'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 1.2rem;
    height: 1.2rem;
    background-color: var(--input-bg) !important;
    border: solid 1px var(--input-border-blue) !important;
    cursor: pointer;
    outline: 0;
}
div.atom input[input-type='radio'].required:not(.req-init) {
    border: solid 1px var(--input-outline-required) !important;
}
div.atom input[input-type='radio'].required.complete {
    border: solid 1px var(--input-outline-complete) !important;
}
div.atom input[input-type='checkbox'] {
    background-color: var(--alert);
    border-radius: 4px;
}
div.atom input[input-type='radio'] {
    border-radius: 1rem;
}
div.atom input[input-type='checkbox']:after,
div.atom input[input-type='radio']:after {
    display: none;
    border: solid var(--input-border-black);
    border-width: 0 2px 2px 0;
    content: '';
    height: 50%;
    left: 40%;
    position: relative;
    top: 20%;
    transform: rotate(45deg);
    width: 25%;
}
div.atom input[type='checkbox']:checked,
div.atom input[input-type='radio']:checked {
    color: var(--input-bg);
    background-color: var(--input-bg);
}
div.atom input[type='checkbox']:checked::after,
div.atom input[input-type='radio']:checked::after {
    display: block;
}
div.atom label {
    color: var(--text);
    font-size: 1rem;
    margin-left: 0.5rem;
}
</style>
