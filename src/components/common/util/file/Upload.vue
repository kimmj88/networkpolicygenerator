<template>
    <div :id="docName" tabindex="-1" aria-hidden="true">
        <div class="">
            <div class="card-header inline-flex items-center" v-if="headerShow">
                <h3 class="card-title align-middle">
                    {{ t('voca.file.default') }}
                </h3>
                <AtomButton
                    :type="'custom'"
                    :class-text="'text-gray-400 bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white mr-2'"
                    @click="close"
                >
                    <template v-slot:msg>
                        <em class="bx bx-x text-2xl"></em>
                        <span class="sr-only">Close Modal</span>
                    </template>
                </AtomButton>
            </div>
            <!-- /info btn -->
            <div class="p-0">
                <div class="popup-grid-container" style="grid-template-columns: 6rem auto">
                    <div class="item ellipsis">
                        <span :title="t('voca.file.default')">
                            {{ t('voca.file.default') }}
                        </span>
                    </div>
                    <div class="item">
                        <!--
                        <div id="inputFileTag">
                            <input type="file" class="hidden p-2" id="inputFile" ref="inputFile" @change="fileSelect" />
                        </div> -->
                        <div class="flex items-center justify-center w-full">
                            <label
                                for="dropzone-file"
                                class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div class="fixed flex flex-col items-center justify-center pb-6">
                                    <svg
                                        class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">MAX. 500mb</p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    class="w-full h-64 z-10"
                                    @change="fileSelect"
                                    multiple
                                />
                            </label>
                        </div>
                        <!-- <label class="btn btn-success" for="inputFile">
                            {{ t("btn.file.select.default") }}
                        </label>
                        <span id="inputFileSelect" class="ml-1" v-html="inputFileSelect"></span> -->
                    </div>
                    <div class="item ellipsis" v-if="noticeShow">
                        <span :title="t('voca.notice.reason.default')">
                            {{ t('voca.notice.reason.default') }}
                        </span>
                    </div>
                    <div class="item" v-if="noticeShow">
                        <textarea
                            class="form-control border-1 ta-no-resize"
                            rows="3"
                            :placeholder="t('msg.info.input.default')"
                            v-model.trim.lazy="notice"
                        >
                        </textarea>
                    </div>
                    <div class="item w-full inline-flex justify-around items-center p-3">
                        <AtomButton
                            v-if="authCreateUpdate"
                            :type="'create'"
                            :class="btnClass"
                            :class-text="classText + ' bxc bxc-check'"
                            :button-name="'btn.confirm.default'"
                            @click="doSave"
                        />
                        <AtomButton
                            :type="'delete'"
                            :class="btnClass"
                            :class-text="classText"
                            :button-name="'btn.cancel.default'"
                            @click="close"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { auth } from '@/plugins/ts/auth';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import { computed, onBeforeMount, onMounted, onUnmounted, onUpdated, ref } from 'vue';

const props = defineProps({
    headerShow: {
        type: Boolean,
        default: true
    },
    flag: Boolean,
    type: String,
    dataInfo: {
        type: String,
        default: JSON.stringify({
            parentDocNo: '',
            childDocNo: ''
        })
    },
    fileSize: {
        type: Number,
        required: false,
        default: 10
    }
});

const classText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const docName = 'Upload';

const { gProp, emitter, commonts, t } = base();
// 권한 처리
const { authCreateUpdate } = auth();
const { commonCode } = commonVar();

const headerShow = computed(() => props.headerShow);
const file = ref('' as any);
const noticeShow = computed(() => props.flag);
const uploadType = computed(() => props.type);
const dataInfo = computed(() => (props.dataInfo !== undefined ? JSON.parse(props.dataInfo) : ''));
const fileSize = computed(() => props.fileSize);

const notice = ref('');

const fileLimitSize = computed(() => fileSize.value * 1024 * 1024);

const inputFileSelect = ref(t('msg.info.file.select.default'));

const fileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (files !== null && files.length > 0) {
        Array.from(files).forEach((f: File) => (file.value = f));
        inputFileSelect.value = file?.value?.name;
    }
};

const checkFileSize = () => {
    commonts.debugLog(gProp, [file.value.size, fileLimitSize.value, file.value.size > fileLimitSize.value]);
    return file.value.size < fileLimitSize.value;
};

const doSave = () => {
    // fileLimitSize 체크
    commonts.debugLog(gProp, checkFileSize());
    if (!checkFileSize()) {
        gProp?.$commonts.notificationShow(
            gProp,
            'error',
            gProp?.$t('msg.error.info.file.upload.size.limit.argv.base.default', [
                fileSize.value,
                file.value.size === undefined ? 0 : Math.round((file.value.size / 1024 / 1024) * 100) / 100
            ]),
            -1
        );

        close();
        return false;
    }

    commonts.debugLog(gProp, ['Upload doSave', file.value, dataInfo, uploadType?.value]);
    emitter.emit('fileUpDown-file-upload', {
        uploadType: uploadType.value,
        file: file.value,
        notice: notice.value
    });
};

const dataInit = () => {
    const inputElement = document.querySelector('#dropzone-file') as HTMLInputElement;
    inputElement.value = '';
    file.value = '';
    // data 초기화
    // popup 처리로 input File tag 에 기존 정보가 있어서
    // 동일 파일 선택시 change 이벤즈 발생 안함 동적으로 html 재생성 하여 초기화 함
    // let ift = document.getElementById("inputFileTag");
    // if (ift !== null) {
    //     ift.innerHTML = '<input type="file" class="hidden p-2" id="inputFile" ref="inputFile" @change="fileSelect" />';
    //     document?.getElementById("inputFile")?.addEventListener('change', fileSelect);
    // }
    // file.value = "";
    // inputFileSelect.value = t("msg.info.file.select.default");
};

const emit = defineEmits(['close']);

const close = () => {
    dataInit();
    emit('close');
};

const cmmCds = computed(() => {
    let retCmmCds = [] as any;
    return retCmmCds;
});

const getCommonCode = () => {
    if (cmmCds.value.length > 0) {
        gProp?.axios.all([commonts.getCmCds(gProp, cmmCds.value, '')]).then(
            gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
                Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]));
            })
        );
    }
};

onBeforeMount(() => {
    emitter.on('initPopupData', dataInit);
});

onMounted(() => {
    if (Object.keys(commonCode).length == 0) {
        getCommonCode();
    }
    dataInit();
});

onUpdated(() => {
    if (Object.keys(commonCode).length == 0) {
        getCommonCode();
    }
});

onUnmounted(() => {
    emitter.off('initPopupData');
});

defineExpose({ close });
</script>

<style scoped>
.popup-grid-container {
    width: 100%;
    display: inline-grid;
    padding: 0.5em;
    grid-template-columns: 1fr 3fr;
    align-items: center;
}

.popup-grid-container > .item {
    margin: 0.25em;
}

.popup-grid-container > .item:nth-last-child(1) {
    grid-column: 1/3;
    text-align: center;
    margin-top: 0.5em;
}

input[type='file']::file-selector-button {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}

input[type='file' i] {
    padding: 1rem 0 0 1rem;
}
</style>
