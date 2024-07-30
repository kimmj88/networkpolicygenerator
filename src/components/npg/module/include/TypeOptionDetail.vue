<template>
    <div v-for="option in options">
        <!-- 동적으로 component 생성 -->
        <component :key="option.cd_nm" :is="onIsComponent(option)" :common-code="commonCode" :label="t(option.item2)"
            v-model="modelValue[option.cd_nm]" :type-cd="option.cd_nm" :option-code="option.cd"
            :module-type="moduleType" :code-data="option" />
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { commonCodeType } from '@/types/types';
import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import { ModuleValueDTO } from '@cm/types/domain/dto/module/moduleValueDTO';
import { PropType, onMounted, toRefs, watch } from 'vue';
import * as moduleOptions from '@/components/base/molecules';


interface OptionData {
    [key: string]: ModuleValueDTO;
}

interface OptionComponent {
    [key: string]: any;
}

const props = defineProps({
    options: {
        type: Array<commonCodeType>,
        default: []
    },
    commonCode: {
        type: Object as PropType<commonCodeType>,
        required: true
    },
    modelValue: {
        type: Object as PropType<OptionData>,
        default: {}
    },
    moduleType: {
        type: String,
        default: ''
    },
    moduleId: {
        type: Number
    },
    moduleData: {
        type: Object as PropType<ModuleDTO>
    }
});
const { t } = base();

const { options, commonCode, moduleType, modelValue, moduleData } = toRefs(props);

const optionComponents: OptionComponent = {};

onMounted(() => {
    Object.values(moduleOptions).forEach((item: any) => {
        if (item.default.type == 'TypeModel') {
            if (item && item.default && item.default.name) {
                optionComponents[item.default.name] = item;
            }
        }
    });
});

watch(
    () => moduleType.value,
    () => {
        initModel();
        if (props.moduleId) {
            moduleData?.value?.module_value_list?.forEach((item) => {
                modelValue.value[item.type_cd] = {
                    id: item.id,
                    type_cd: item.type_cd,
                    module_id: item.module_id,
                    value: item.value
                };
            });
        }
    }
);

function initModel() {
    options.value.forEach((option) => {
        modelValue.value[option.cd_nm] = {
            type_cd: '',
            value: ''
        };
    });
}

function onIsComponent(option: commonCodeType) {
    return optionComponents[`${option.item1}TypeModel`]?.default;
}
</script>
