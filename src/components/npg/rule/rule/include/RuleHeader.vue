<template>
    <div :class="cardClass" class="p-4">
        <div>
            <ToggleCheckbox
                :label="t('voca.header.default')"
                label-class="font-medium"
                v-model="ruleStore.rule_header_flag"
            >
                <template v-slot:content>
                    <div class="flex flex-col gap-4 ml-2 border-l pl-4">
                        <!-- Protocol -->
                        <div>
                            <MoleSelect
                                :label-class-text="labelClassText"
                                :label-text="t('voca.protocol.default')"
                                :class-text="''"
                                :place-holder="t('msg.error.no_input.default')"
                                :options="commonCode?.cmm201"
                                :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                                :reduce="(option: any) => option?.cd"
                                v-model="rule_header.protocol"
                            />
                        </div>

                        <!-- Src IP -->
                        <div :class="`wrapper`">
                            <span class="font-medium">{{ t('voca.source.ip.default') }}</span>
                            <ToggleCheckbox
                                :label="t('voca.any.ips.default')"
                                v-model="ruleStore.is_source_ip_any"
                                :backward="true"
                            >
                                <template v-slot:commander>
                                    <div>
                                        <AtomButton
                                            :type="'save'"
                                            :button-name="t('btn.add.default')"
                                            @click="openSrcIPCreateModal"
                                        />
                                    </div>
                                </template>
                                <template v-slot:content>
                                    <RuleIPTable :direction-type="'SRC'" />
                                </template>
                            </ToggleCheckbox>
                        </div>

                        <!-- Src Port -->
                        <div :class="`wrapper`">
                            <span class="font-medium">{{ t('voca.source.port.default') }}</span>
                            <ToggleCheckbox
                                :label="t('voca.any.ports.default')"
                                v-model="ruleStore.is_source_port_any"
                                :backward="true"
                            >
                                <template v-slot:commander>
                                    <AtomButton
                                        :type="'save'"
                                        :button-name="t('btn.add.default')"
                                        @click="openSrcPortCreateModal"
                                    />
                                </template>
                                <template v-slot:content>
                                    <RulePortTable :direction-type="'SRC'" />
                                </template>
                            </ToggleCheckbox>
                        </div>

                        <!-- Direction -->
                        <div>
                            <MoleSelect
                                :label-class-text="labelClassText"
                                :label-text="t('voca.direction.default')"
                                :class-text="classText"
                                :place-holder="t('msg.error.no_input.default')"
                                :options="commonCode?.cmm202"
                                :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                                :reduce="(option: any) => option?.cd"
                                v-model="rule_header.direction_operator"
                            />
                        </div>

                        <!-- Dest IP -->
                        <div :class="`wrapper`">
                            <span class="font-medium">{{ t('voca.destination.ip.default') }}</span>
                            <ToggleCheckbox
                                :label="t('voca.any.ips.default')"
                                v-model="ruleStore.is_dest_ip_any"
                                :backward="true"
                            >
                                <template v-slot:commander>
                                    <div>
                                        <AtomButton
                                            :type="'save'"
                                            :button-name="t('btn.add.default')"
                                            @click="openDestIPCreateModal"
                                        />
                                    </div>
                                </template>
                                <template v-slot:content>
                                    <RuleIPTable :direction-type="'DEST'" />
                                </template>
                            </ToggleCheckbox>
                        </div>

                        <!-- Dest Port -->
                        <div :class="`wrapper`">
                            <span class="font-medium">{{ t('voca.destination.port.default') }}</span>
                            <ToggleCheckbox
                                :label="t('voca.any.ports.default')"
                                v-model="ruleStore.is_dest_port_any"
                                :backward="true"
                            >
                                <template v-slot:commander>
                                    <div>
                                        <AtomButton
                                            :type="'save'"
                                            :button-name="t('btn.add.default')"
                                            @click="openDestPortCreateModal"
                                        />
                                    </div>
                                </template>
                                <template v-slot:content>
                                    <RulePortTable :direction-type="'DEST'" />
                                </template>
                            </ToggleCheckbox>
                        </div>
                    </div>
                </template>
            </ToggleCheckbox>
        </div>
        <BasePopup
            class="z-[200]"
            :id="SRC_IP_MODAL_ID"
            :add-class="'max-w-5xl h-fit'"
            :add-body-class="'p-0'"
            @close="
                commonts.hideModal(srcIPDetailModal);
                ruleStore.initIPModalData();
            "
        >
            <template v-slot:title>{{ t('voca.ip.add.default') }}</template>
            <template v-slot:msg>
                <IPModal
                    :direction-type="'SRC'"
                    :commonCode="commonCode"
                    @close="
                        commonts.hideModal(srcIPDetailModal);
                        ruleStore.initIPModalData();
                    "
                />
            </template>
        </BasePopup>
        <BasePopup
            class="z-[200]"
            :id="SRC_PORT_MODAL_ID"
            :add-class="'max-w-5xl h-fit'"
            :add-body-class="'p-0'"
            @close="
                commonts.hideModal(srcPortDetailModal);
                ruleStore.initPortModalData();
            "
        >
            <template v-slot:title>{{ t('voca.port.add.default') }}</template>
            <template v-slot:msg>
                <PortModal
                    :direction-type="'SRC'"
                    :commonCode="commonCode"
                    @close="
                        commonts.hideModal(srcPortDetailModal);
                        ruleStore.initPortModalData();
                    "
                />
            </template>
        </BasePopup>
        <BasePopup
            class="z-[200]"
            :id="DEST_IP_MODAL_ID"
            :add-class="'max-w-5xl h-fit'"
            :add-body-class="'p-0'"
            @close="
                commonts.hideModal(destIPDetailModal);
                ruleStore.initIPModalData();
            "
        >
            <template v-slot:title>{{ t('voca.ip.add.default') }}</template>
            <template v-slot:msg>
                <IPModal
                    :direction-type="'DEST'"
                    :commonCode="commonCode"
                    @close="
                        commonts.hideModal(destIPDetailModal);
                        ruleStore.initIPModalData();
                    "
                />
            </template>
        </BasePopup>
        <BasePopup
            class="z-[200]"
            :id="DEST_PORT_MODAL_ID"
            :add-class="'max-w-5xl h-fit'"
            :add-body-class="'p-0'"
            @close="
                commonts.hideModal(destPortDetailModal);
                ruleStore.initPortModalData();
            "
        >
            <template v-slot:title>{{ t('voca.port.add.default') }}</template>
            <template v-slot:msg>
                <PortModal
                    :direction-type="'DEST'"
                    :commonCode="commonCode"
                    @close="
                        commonts.hideModal(destPortDetailModal);
                        ruleStore.initPortModalData();
                    "
                />
            </template>
        </BasePopup>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 rounded';
const labelClassText = 'text-black w-full text-base font-medium';
const classText = 'text-black w-full text-base';
const SRC_IP_MODAL_ID = 'SRC_IP_CREATE';
const SRC_PORT_MODAL_ID = 'SRC_PORT_CREATE';
const DEST_IP_MODAL_ID = 'DEST_IP_CREATE';
const DEST_PORT_MODAL_ID = 'DEST_PORT_CREATE';

import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { ruleStore } from '@/stores/modules/Rule';
import AtomButton from '@a/Button.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import IPModal from './IPModal.vue';
import PortModal from './PortModal.vue';
import RuleIPTable from './RuleIPTable.vue';
import RulePortTable from './RulePortTable.vue';

const { stores, emitter, gProp, commonts, router, t } = base();
const { svcType, tabIdx, setEmptyMsg, setCodeMsg } = commonVar();

const { rule_header } = storeToRefs(ruleStore);

const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});

const srcIPDetailModal = ref(null as any);
const srcPortDetailModal = ref(null as any);
const destIPDetailModal = ref(null as any);
const destPortDetailModal = ref(null as any);

onMounted(() => {
    srcIPDetailModal.value = commonts.makeModal(SRC_IP_MODAL_ID);
    srcPortDetailModal.value = commonts.makeModal(SRC_PORT_MODAL_ID);
    destIPDetailModal.value = commonts.makeModal(DEST_IP_MODAL_ID);
    destPortDetailModal.value = commonts.makeModal(DEST_PORT_MODAL_ID);
});

async function openSrcIPCreateModal() {
    await ruleStore.initIPModalData();
    commonts.showModal(srcIPDetailModal.value, 200);
}
async function openSrcPortCreateModal() {
    await ruleStore.initIPModalData();
    commonts.showModal(srcPortDetailModal.value, 200);
}
async function openDestIPCreateModal() {
    await ruleStore.initIPModalData();
    commonts.showModal(destIPDetailModal.value, 200);
}
async function openDestPortCreateModal() {
    await ruleStore.initIPModalData();
    commonts.showModal(destPortDetailModal.value, 200);
}
</script>

<style lang="scss" scoped>
.wrapper {
    border: 1px solid rgb(200, 207, 215);
    padding: 1rem 1rem 0.5rem 1rem;
    border-radius: 0.25rem;
}
</style>
HYOUNGTAE LEE
