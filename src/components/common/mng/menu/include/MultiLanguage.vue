<template>
    <div id="multiLanguage">
        <template v-for="entry in commonCode.cmm901" :key="entry.cd">
            <template v-for="(mData, mIdx) in mlInfo">
                <div
                    :key="mData"
                    class="inline-flex flex-row items-center justify-around w-full px-3 mb-2"
                    v-if="entry.cd === mData.lang_cd"
                >
                    <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="''"></AtomLabel>
                    <div class="basis-2/3 mr-2 inline-flex justify-start">
                        <template v-for="(lang, lIdx) in languages">
                            <label
                                :for="mData.lang_cd"
                                :key="lIdx"
                                class="ml-1 basis-1/6 text-center"
                                v-if="lang.language === mData.lang_cd?.toLowerCase()"
                            >
                                <country-flag :class="'border-1'" :country="lang.flag" />
                                {{ lang.language.toUpperCase() }}
                            </label>
                        </template>
                        <AtomInput
                            :name="mData.lang_cd"
                            :input-type="'text'"
                            class="ml-3 basis-5/6"
                            :class-text="classText + ' required text'"
                            v-model="mData.name"
                            :tabindex="tabIdx.detIn + 3 + mIdx"
                        ></AtomInput>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import validate from '@/plugins/ts/validate';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import { onUpdated, toRefs } from 'vue';

// library setting
const { t } = base();
// const { svcType, setEmptyMsg, setCodeMsg } = commonVar();
const { tabIdx, languages } = commonVar();

// props setting
const props = defineProps({
    commonCode: {
        type: Object as any,
        required: true
    },
    mlInfo: {
        type: Object as any
    }
});

// classText setting
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const classText = 'text-black w-full h-10 text-base';

// variable setting
const { commonCode, mlInfo } = toRefs(props);

const emit = defineEmits(['click:search']);

onUpdated(() => {
    validate('multiLanguage');
});
</script>
