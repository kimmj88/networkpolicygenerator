import { base } from '@/plugins/ts/base';
import {
    carNumberRegex,
    decimalRegex,
    emailRegex,
    hostname1123Regex,
    ipRegex,
    numberRegex,
    passwordRegex,
    stringRegex,
    textRegex
} from '@/plugins/ts/regex';

const { gProp, commonts, t } = base();

const maxLength = 1024;
const ipv4SpliterCount = 3;
const maxIpv4Length = 12 + ipv4SpliterCount;
// const ipv6SpliterCount = 8;  // nosonar
// eslint-disable-next-line
// const maxIpv6Length = 32 + ipv6SpliterCount;  // nosonar
const maxHostnameLength = 256;
const textLengthMul = 10;
const textareaLengthMul = 10;

const requiredInitClass = 'req-init';
const normalClass = 'complete';
const keyClassName = {
    required: 'required', // 필수 입력값 체크 class
    input: {
        email: 'email', // email 체크 class
        password: 'password', // password 체크 class
        number: 'number', // number 체크 class
        decimal: 'decimal', // decimal 체크 class
        string: 'string', // string 체크 class
        carnumber: 'carnumber', // string 체크 class
        text: 'text', // text (string + 특수기호) 체크 class
        checkbox: {
            // 체크박스
            single: 'single', // 1개 선태 체크 class
            multiple: 'multiple' // 1개 이상 체크 class
        },
        radio: 'radio', // radio
        ip: 'ip', // ip 체크 class
        hostname: 'hostname' // ip 체크 class
    },
    select: {
        single: 'single', // 1개 선태 체크 class
        multiple: 'multiple' // 1개 이상 체크 class
    },
    textarea: 'textarea', // textarea 체크 class,
    file: 'file' //file input 체크 class
};

function setRequiredInitValidIgnoreFlag(target: Element, emptyValueFlag: boolean) {
    target.classList.remove(normalClass);
    target.parentElement?.querySelector('.alert-msg')?.classList.add('hidden');
    target.classList.remove(requiredInitClass);
    if (emptyValueFlag) {
        target.classList.add(requiredInitClass);
    }
}

function setInputTag(target: Element) {
    const inputList = target?.querySelectorAll("input:not([type='checkbox']):not([type='radio'])");
    inputList?.forEach((elem: Element) => {
        const data = elem as HTMLInputElement;
        let func: string | Function = '';
        if (data.classList.contains(keyClassName.input.email)) func = checkEmail;
        else if (data.classList.contains(keyClassName.input.password)) func = checkPassword;
        else if (data.classList.contains(keyClassName.input.number)) func = checkNumber;
        else if (data.classList.contains(keyClassName.input.decimal)) func = checkDecimal;
        else if (data.classList.contains(keyClassName.input.string)) func = checkString;
        else if (data.classList.contains(keyClassName.input.carnumber)) func = checkCarNumber;
        else if (data.classList.contains(keyClassName.input.text)) func = checkText;
        else if (data.classList.contains(keyClassName.input.ip)) func = checkIp;
        else if (data.classList.contains(keyClassName.input.hostname)) func = checkHostname;

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        setRequiredInitValidIgnoreFlag(data, data.value === '');

        if (func instanceof Function) {
            setEvent(data, func);
        }
    });
}

function setInputCheckboxTag(target: Element) {
    const className = "input[type='checkbox']";
    const checkboxList = target.querySelectorAll(className);
    checkboxList?.forEach((data) => {
        let func: string | Function = '';
        let dataObject = {} as any;
        if (data.classList.contains(keyClassName.input.checkbox.single)) {
            func = checkSelectCheckbox;
            dataObject = { className: keyClassName.input.checkbox.single, multiFlag: false };
        } else if (data.classList.contains(keyClassName.input.checkbox.multiple)) {
            func = checkSelectCheckbox;
            dataObject = { className: keyClassName.input.checkbox.multiple, multiFlag: true };
        }

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        const checkedCnt = selectedCheckedCnt(data as HTMLElement, '.' + dataObject?.className);
        setRequiredInitValidIgnoreFlag(data, checkedCnt === 0);

        if (func instanceof Function) {
            setEvent(data as HTMLElement, func, dataObject);
        }
    });
}

function setInputRadioTag(target: Element) {
    const className = "input[type='radio']";
    const radioList = target.querySelectorAll(className);
    radioList?.forEach((data) => {
        let func: string | Function = '';
        if (data.classList.contains(keyClassName.input.radio)) func = checkSelectRadio;

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        const checkedRadioCnt = selectedCheckedCnt(data as HTMLElement, className);
        setRequiredInitValidIgnoreFlag(data, checkedRadioCnt === 0);

        if (func instanceof Function) {
            setEvent(data as HTMLElement, func);
        }
    });
}

function setSelectTag(target: Element) {
    const selectList = target?.querySelectorAll('select');
    selectList?.forEach((data) => {
        let func: string | Function = '';
        let dataObject = {};
        if (data.classList.contains(keyClassName.select.single)) {
            func = checkSelect;
            dataObject = { className: keyClassName.select.single, multiFlag: false };
        } else if (data.classList.contains(keyClassName.select.multiple)) {
            func = checkSelect;
            dataObject = { className: keyClassName.select.multiple, multiFlag: true };
        }

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        setRequiredInitValidIgnoreFlag(data, data.value === '');

        if (func instanceof Function) {
            setEvent(data as HTMLElement, func, dataObject);
        }
    });
}

function setVueSelectTag(target: Element) {
    const selectList = target?.querySelectorAll('div.v-select');
    selectList?.forEach((data) => {
        const inputTag = data.querySelector('input') as HTMLInputElement;
        let func: string | Function = '';
        let dataObject = {} as any;
        if (inputTag.classList.contains(keyClassName.select.single)) {
            func = checkVueSelect;
            dataObject = { className: keyClassName.select.single, multiFlag: false };
        } else if (inputTag.classList.contains(keyClassName.select.multiple)) {
            func = checkVueSelect;
            dataObject = { className: keyClassName.select.multiple, multiFlag: true };
        }

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        setRequiredInitValidIgnoreFlag(data, inputTag.value === '');

        if (func instanceof Function) {
            func(inputTag as HTMLElement, dataObject);
        }
    });
}

function setTextareaTag(target: Element) {
    const textareaList = target?.querySelectorAll('textarea');
    textareaList?.forEach((data) => {
        let func: string | Function = '';
        if (data.classList.contains(keyClassName.textarea)) func = checkTextarea;

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        setRequiredInitValidIgnoreFlag(data, data.value === '');

        if (func instanceof Function) {
            setEvent(data as HTMLElement, func);
        }
    });
}

function setFileInputTag(target: Element) {
    const fileInputList = target?.querySelectorAll('input[type=file]');
    fileInputList.forEach((data) => {
        let func: string | Function = '';
        if (data.classList.contains(keyClassName.file)) func = checkFileInput;

        // data 없는 초기인 경우 상태 required 표시 안보이도록
        const target = data as HTMLInputElement;
        setRequiredInitValidIgnoreFlag(data, target.files != null && target.files.length === 0);

        if (func instanceof Function) {
            setEvent(data as HTMLElement, func);
        }
    });
}

function setEventBlur(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    const blueEvt = () => {
        data !== undefined ? checkFunc(target, data) : checkFunc(target);
        if (target.classList.contains(requiredInitClass)) {
            target.classList.remove(requiredInitClass);
        }
    };

    target.removeEventListener('blur', blueEvt);
    // 포커스가 떠났을때 이벤트
    target.addEventListener('blur', blueEvt);
}
function setEventKeyDown(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    const keydownEvt = (ev: KeyboardEvent) => {
        if (ev.key !== undefined) {
            commonts?.debugLog(gProp, ['validate setEvent', ev.key]);
        }

        if (ev.key === 'Enter' || ev.key === 'Tab') {
            data !== undefined ? checkFunc(target, data) : checkFunc(target);
        }

        if (target.classList.contains(requiredInitClass)) {
            target.classList.remove(requiredInitClass);
        }
    };
    target.removeEventListener('keydown', keydownEvt);
    // 엔터키로 입력 완료 처리 했을 경우
    target.addEventListener('keydown', keydownEvt);
}
function setEventKeyUp(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    const keyupEvt = () => {
        data !== undefined ? checkFunc(target, data) : checkFunc(target);
        if (target.classList.contains(requiredInitClass)) {
            target.classList.remove(requiredInitClass);
        }
    };
    target.removeEventListener('keyup', keyupEvt);
    // 입력 글자별로 체크하여 결과 반영
    target.addEventListener('keyup', keyupEvt);
}

function setEventChange(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    const changeEvt = () => {
        data !== undefined ? checkFunc(target, data) : checkFunc(target);
        if (target.classList.contains(requiredInitClass)) {
            target.classList.remove(requiredInitClass);
        }
    };
    target.removeEventListener('change', changeEvt);
    target.addEventListener('change', changeEvt);
}
function setEventdrop(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    const dropEvt = () => {
        data !== undefined ? checkFunc(target, data) : checkFunc(target);
        if (target.classList.contains(requiredInitClass)) {
            target.classList.remove(requiredInitClass);
        }
    };
    target.removeEventListener('drop', dropEvt);
    target.addEventListener('drop', dropEvt);
}
function setEventAdditional(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    // radio 버튼 / Select change 이벤트 처리
    if (target.classList.contains('radio') || target.classList.contains('select')) {
        setEventChange(target, checkFunc, data);
    }

    // fileInput DragEvent 추가
    if (target.classList.contains('file__input')) {
        const dragTarget = target.closest('span');
        if (dragTarget) {
            setEventdrop(dragTarget, checkFunc, data);
        }
    }
}

// 이벤트 세팅
function setEvent(target: HTMLElement, checkFunc: Function, data?: { [x: string]: any }) {
    // Blur Event 처리
    data !== undefined ? setEventBlur(target, checkFunc, data) : setEventBlur(target, checkFunc);

    // KeyDown Event 처리
    data !== undefined ? setEventKeyDown(target, checkFunc, data) : setEventKeyDown(target, checkFunc);

    // KeyUp Event 처리
    data !== undefined ? setEventKeyUp(target, checkFunc, data) : setEventKeyUp(target, checkFunc);

    // 추가 Event 처리
    data !== undefined ? setEventAdditional(target, checkFunc, data) : setEventAdditional(target, checkFunc);

    // // 최초에 데이터값 initial
    // if (!target.classList.contains(requiredInitClass)) {
    //     data !== undefined ? checkFunc(target, data) : checkFunc(target);
    // }
    data !== undefined ? checkFunc(target, data) : checkFunc(target);
}

// 안내 메세지 삭제
export function clearMsgElement(target: HTMLElement) {
    // dataset isExist(키 그룹 존재 데이터 존재여부 체크 상태)가 true 면  validate 가 정상이어도 alert message 표시
    if (target?.dataset?.isExist !== 'true') {
        target.classList.add(normalClass);

        const alertMessageTag = target?.parentElement?.querySelector('.alert-msg') as HTMLElement;
        alertMessageTag?.classList.add('hidden');
    }
}

// 안내 메세지 세팅
export function setMsgElement(target: HTMLElement, msg: string) {
    if (target?.classList?.contains(normalClass)) {
        target?.classList?.remove(normalClass);
    }

    const msgElement = target?.parentElement?.querySelector('.alert-msg') as HTMLElement;

    if (msgElement?.classList?.contains('hidden') && !target.classList.contains(requiredInitClass)) {
        msgElement?.classList?.remove('hidden');
    }
    const t = msgElement?.parentElement?.querySelector('.tooltip-msg-' + msgElement.id) as HTMLDivElement;
    if (t.innerHTML !== null && t.innerHTML !== undefined) t.innerHTML = msg;
}

function selectedTargetDiv(target: HTMLElement) {
    return target?.parentElement?.parentElement as HTMLDivElement;
}

function selectedCheckedCnt(target: HTMLElement, className: string) {
    const parentDiv = selectedTargetDiv(target);
    const targets = parentDiv.querySelectorAll(className);
    let checkedCount = 0;
    targets?.forEach((data: any) => {
        if ((data as HTMLInputElement).checked) {
            checkedCount++;
        }
    });
    return checkedCount;
}

// checkbox 체크여부 같은 tag 내에 있는 테그 기준으로 1 or 1이상 값을 체크한다.
function checkSelectCheckbox(target: HTMLElement, data: { className: string; multiFlag: boolean }) {
    const checkedCount = selectedCheckedCnt(target, '.' + data.className);

    if ((data?.multiFlag === true && checkedCount > 0) || (data?.multiFlag === false && checkedCount === 1)) {
        clearMsgElement(target);
        return true;
    }
    setMsgElement(target, t('msg.error.no_input.select.default'));
    return false;
}

// radio 체크여부 같은 tag 내에 있는 테그 기준으로 1 or 1이상 값을 체크한다.
function checkSelectRadio(target: HTMLElement) {
    const className = "input[type='radio']";
    const parentDiv = selectedTargetDiv(target);
    const targets = parentDiv.querySelectorAll(className);
    const checkedCount = selectedCheckedCnt(target, className);

    const idx = targets.length - 1;
    const lastItem = targets[idx] as HTMLElement;

    if (checkedCount === 1) {
        targets?.forEach((radio) => {
            clearMsgElement(radio as HTMLElement);
        });
        return true;
    }
    setMsgElement(lastItem, t('msg.error.no_input.select.default'));
    return false;
}

function checkSelect(target: HTMLSelectElement, data: { className: string; multiFlag: boolean }) {
    const selectedOpts = target.selectedOptions;
    let selectedCount = 0;
    Array.from(selectedOpts).forEach((item) => {
        if (item.value !== '' && item?.selected === true) selectedCount++;
    });

    if ((data?.multiFlag === true && selectedCount > 0) || (data?.multiFlag === false && selectedCount === 1)) {
        clearMsgElement(target);
        return true;
    }

    if (!target.getAttribute('disabled') && target.classList.contains(keyClassName.required)) {
        setMsgElement(target, t('msg.error.no_input.select.default'));
    }
    return false;
}

function checkVueSelect(target: HTMLElement, data: { className: string; multiFlag: boolean }) {
    const value = target?.closest('div.v-select')?.getAttribute('value');

    if (
        value !== null &&
        value !== undefined &&
        ((data?.multiFlag === true && value?.split(',')?.length > 0) || (data?.multiFlag === false && value !== ''))
    ) {
        clearMsgElement(target);
        return true;
    }

    if (!target.getAttribute('disabled')) {
        setMsgElement(target, t('msg.error.no_input.select.default'));
    }
    return false;
}

// textarea 값 체크
function checkTextarea(target: HTMLTextAreaElement) {
    let retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength * textLengthMul * textareaLengthMul) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    textRegex.lastIndex = 0;
    if (retVal.search(textRegex) !== -1) {
        const escapeVal = RegExp(textRegex).exec(retVal);
        retVal = retVal.replace(textRegex, '');
        target.value = retVal;
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [escapeVal]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkFileInput(target: HTMLInputElement) {
    const value = target.value;
    //필수인 경우,
    //Fileinput을 display: none으로 설정하고, drop이벤트로 파일을 추가한 경우, input.value에 직접적으로 값을 세팅하는 것이 불가능하기에, class로 판단.
    const isCompleted = target.classList.contains(normalClass);

    if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
        //값 세팅이 안되어 있다면
        if (!isCompleted && (!value || (value && value.length <= 0))) {
            setMsgElement(target, t('msg.error.no_input.select.file.defafult'));
            return false;
        }
    } else {
        clearMsgElement(target);
    }
    return true;
}

function checkEmail(target: HTMLInputElement) {
    const retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    emailRegex.lastIndex = 0;
    if (RegExp(emailRegex).exec(retVal) === null || RegExp(emailRegex).exec(retVal)?.length === 0) {
        setMsgElement(target, t('msg.error.info.email.confirm.default'));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkPassword(target: HTMLInputElement) {
    const retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    passwordRegex.lastIndex = 0;
    if (RegExp(passwordRegex).exec(retVal) === null) {
        setMsgElement(target, t('msg.error.wrong_input.password.rule.default'));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkText(target: HTMLInputElement) {
    let retVal = target.value;
    const min = target.getAttribute('min');
    const max = target.getAttribute('max');
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength * textLengthMul) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    textRegex.lastIndex = 0;
    if (retVal.search(textRegex) !== -1) {
        const splitter = ', ';
        let escapeVal = [...new Set(RegExp(textRegex).exec(retVal))].join(splitter);
        if (escapeVal?.endsWith(splitter)) {
            escapeVal = escapeVal.substring(escapeVal.length - splitter.length, escapeVal.length);
        }
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [escapeVal]));
        retVal = retVal.replace(textRegex, '');
        target.value = retVal;
        return false;
    }
    // min attribute 생성시 체크
    if (min !== undefined && min !== null && retVal.length < parseInt(min)) {
        setMsgElement(target, t('msg.error.wrong_input.min.argv.input.length.default', [retVal, parseInt(min)]));
        return false;
    }

    // max attribute 생성시 체크
    if (max !== undefined && max !== null && retVal.length > parseInt(max)) {
        setMsgElement(target, t('msg.error.wrong_input.max.argv.input.length.default', [retVal, parseInt(max)]));
    }
    clearMsgElement(target);
    return true;
}

function checkString(target: HTMLInputElement) {
    let retVal = target.value;
    const min = target.getAttribute('min');
    const max = target.getAttribute('max');
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    stringRegex.lastIndex = 0;
    if (retVal.search(stringRegex) !== -1) {
        const splitter = ', ';
        let escapeVal = [...new Set(RegExp(stringRegex).exec(retVal))].join(splitter);
        if (escapeVal?.endsWith(splitter)) {
            escapeVal = escapeVal.substring(escapeVal.length - splitter.length, escapeVal.length);
        }
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [escapeVal]));
        retVal = retVal.replace(stringRegex, '');
        target.value = retVal;
        return false;
    }
    // min attribute 생성시 체크
    if (min !== undefined && min !== null && retVal.length < parseInt(min)) {
        setMsgElement(target, t('msg.error.wrong_input.min.argv.input.length.default', [retVal, parseInt(min)]));
        return false;
    }

    // max attribute 생성시 체크
    if (max !== undefined && max !== null && retVal.length > parseInt(max)) {
        setMsgElement(target, t('msg.error.wrong_input.max.argv.input.length.default', [retVal, parseInt(max)]));
        return false;
    }

    clearMsgElement(target);
    return true;
}

function checkCarNumber(target: HTMLInputElement) {
    const retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    if (retVal.search(carNumberRegex) === -1) {
        setMsgElement(target, t('msg.error.wrong_input.item.argv.default', [retVal]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkNumber(target: HTMLInputElement) {
    let retVal = target.value;
    const min = target.getAttribute('min');
    const max = target.getAttribute('max');
    // 입력값 체크
    if (retVal === null || retVal === undefined || retVal === '') {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }

    if (retVal.search(numberRegex) > -1) {
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [retVal]));
        retVal = retVal.replace(numberRegex, '');
        target.value = retVal;
        return false;
    }

    // min attribute 생성시 체크
    if (min !== undefined && min !== null && parseInt(retVal) < parseInt(min)) {
        setMsgElement(target, t('msg.error.wrong_input.min.argv.input.default', [parseInt(retVal), parseInt(min)]));
        return false;
    }

    // max attribute 생성시 체크
    if (max !== undefined && max !== null && parseInt(retVal) > parseInt(max)) {
        setMsgElement(target, t('msg.error.wrong_input.max.argv.input.default', [parseInt(retVal), parseInt(max)]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkDecimal(target: HTMLInputElement) {
    const retVal = target.value;
    const min = target.getAttribute('min');
    const max = target.getAttribute('max');
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxLength || retVal.search(decimalRegex) !== -1) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }

    // min attribute 생성시 체크
    if (min !== undefined && min !== null && parseFloat(retVal) < parseFloat(min)) {
        setMsgElement(target, t('msg.error.wrong_input.min.argv.input.default', [parseFloat(retVal), parseFloat(min)]));
        return false;
    }

    // max attribute 생성시 체크
    if (max !== undefined && max !== null && parseFloat(retVal) > parseFloat(max)) {
        setMsgElement(target, t('msg.error.wrong_input.max.argv.input.default', [parseFloat(retVal), parseFloat(max)]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkIp(target: HTMLInputElement) {
    const retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxIpv4Length) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    if (retVal.search(ipRegex) === -1) {
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [retVal]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

function checkHostname(target: HTMLInputElement) {
    const retVal = target.value;
    // 입력값 체크
    if (retVal.trim() === '' || retVal.length > maxHostnameLength) {
        if (!target.getAttribute('readonly') && target.classList.contains(keyClassName.required)) {
            setMsgElement(target, t('msg.error.no_input.contents.default'));
        }
        return false;
    }
    if (retVal.search(hostname1123Regex) === -1) {
        setMsgElement(target, t('msg.error.wrong_input.not_allowed.delete.argv.auto.default', [retVal]));
        return false;
    }
    clearMsgElement(target);
    return true;
}

export function validate(docName?: string, checkRequiredInitValue?: boolean) {
    function initValidate(targetId?: string) {
        const target =
            targetId === undefined ? document.querySelector('#contents') : document.querySelector('#' + targetId);

        if (target !== null) {
            // input tag
            setInputTag(target);
            // checkbox
            setInputCheckboxTag(target);
            // radio
            setInputRadioTag(target);
            // select tag
            setSelectTag(target);
            // vue-select tag
            setVueSelectTag(target);
            // textArea tag
            setTextareaTag(target);
            // fileInput tag
            setFileInputTag(target);

            if (checkRequiredInitValue) {
                // complete class 초기화
                target.querySelectorAll('.' + normalClass).forEach((elem) => {
                    elem.classList.remove(normalClass);
                    const elemAlertMsg = elem.parentElement?.querySelector('.alert-msg');
                    if (elemAlertMsg?.classList.contains('hidden')) {
                        elemAlertMsg?.classList.remove('hidden');
                    }
                });

                target.querySelectorAll('.' + requiredInitClass).forEach((elem) => {
                    const data = elem as HTMLElement;
                    data.classList.remove(requiredInitClass);
                    data.classList.remove(normalClass);
                    if (
                        data.classList.contains(keyClassName.required) &&
                        data.parentElement?.querySelector('.alert-msg')?.classList.contains('hidden')
                    ) {
                        data.parentElement?.querySelector('.alert-msg')?.classList.remove('hidden');
                    }
                });
            }
        }
    }

    docName !== undefined ? initValidate(docName) : initValidate();
}

export default validate;
