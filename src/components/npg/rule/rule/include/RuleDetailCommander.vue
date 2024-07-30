<template>
    <div class="flex items-center justify-between p-3">
        <div class="flex items-end justify-items-end gap-2" ref="btnWrapperRef">
            <AtomButton
                v-if="isRulesetDetailPage"
                :type="'list'"
                :button-name="t('btn.clear.default')"
                @click.prevent.stop="() => ruleStore.initAll()"
            />
            <AtomButton
                :type="'create'"
                :button-name="t('btn.save.default')"
                @click.prevent.stop="
                    async () => {
                        const { result } = await upsertRule(false);
                        if (result) {
                            !isRulesetDetailPage && backToList();
                        }
                    }
                "
            />
            <AtomButton
                v-if="isRulesetDetailPage"
                :type="'create'"
                :button-name="t('btn.save.as.default')"
                @click.prevent.stop="() => doSaveAsConfirm(true)"
            />
            <AtomButton
                v-if="ruleStore.id && !isRulesetDetailPage"
                :type="'create'"
                :button-name="t('btn.save.as.default')"
                @click.prevent.stop="() => doSaveAsConfirm(false)"
            />
            <AtomButton
                v-if="ruleStore.id && !isRulesetDetailPage"
                :type="'delete'"
                :button-name="t('btn.delete.default')"
                @click.prevent.stop="doDeleteConfirm"
            />
            <AtomButton
                v-if="!isRulesetDetailPage"
                :type="'list'"
                :button-name="t('btn.list.default')"
                @click.prevent.stop="backToList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ruleStore } from '@/stores/modules/Rule';
import { base } from '@/plugins/ts/base';
import { axios } from '@/plugins/ts/axios';
const { stores, emitter, gProp, commonts, router, t } = base();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
import AtomButton from '@/components/base/atoms/Button.vue';
import { useRoute } from 'vue-router';
import { computed, Ref, ref } from 'vue';
import { rulesetStore } from '@/stores/modules/Ruleset';
import { IRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { PrismaErrorCode } from '@cm/enum/errorCode';

const route = useRoute();

const btnWrapperRef: Ref<HTMLDivElement | null> = ref(null);

const isRulesetDetailPage = computed(() => {
    const path = route.path;
    if (path === '/npg/rule/ruleset/detail') {
        return true;
    }
    return false;
});

function doDeleteConfirm() {
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.delete.default'),
        method: 'YN',
        cbFunc: doDeleteProcess
    });
}

async function doDeleteProcess(retVal: boolean) {
    if (retVal) {
        await deleteRule();
    }
    return false;
}

async function deleteRule() {
    const searchData = {
        id: ruleStore.id
    };
    gProp?.axios
        .post(commonts.getUrl(gProp, '/rule/delete'), searchData, getAxiosOptions('DATA', {}))
        .then(({ data }: any) => {
            if (data.result) {
                commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
                backToList();
            } else {
                if (data.code === PrismaErrorCode.FKConstraintFailed) {
                    commonts.notificationShow(
                        gProp,
                        'error',
                        t('msg.error.delete.not_allow.in_use.args.default', [t('voca.rule.default')])
                    );
                    return;
                }
            }
            return data;
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
}

function doSaveAsConfirm(addToRuleset: boolean = false) {
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.create.name.args.default', [t('voca.rule.default'), ruleStore.rule_base.title]),
        method: 'YN',
        cbFunc: (value: boolean) => doSaveAsProcess(value, addToRuleset)
    });
}

async function doSaveAsProcess(retVal: boolean, addToRuleset: boolean) {
    if (retVal) {
        const { result, data } = await upsertRule(true);
        if (result) {
            if (addToRuleset && isRulesetDetailPage.value) {
                //RuleSet디테일 페이지면서, Ruleset에 바로 추가하는 버튼을 클릭한 경우,
                await rulesetStore.importRules([data as IRuleDTO]);
                //SaveAs한 이후, RuleDetail 초기화필요...?
                // 필요한 경우 아래 주석제거
                // await rulesetStore.initRuleDetail();
            } else {
                //RuleDetail 페이지에서 만든 경우에만, 목록으로 이동
                backToList();
            }
        }
        return;
    }
    return false;
}

async function upsertRule(saveAs: boolean = false) {
    const targetUrl = !ruleStore.id || (ruleStore.id && saveAs) ? '/rule/insert' : '/rule/update';
    const validateResult = validateRule();
    if (!validateResult) return;
    return gProp?.axios
        .post(commonts.getUrl(gProp, targetUrl), ruleStore.ruleDTO, getAxiosOptions('DATA', {}))
        .then(({ data }: any) => {
            const { result, code, meta } = data;
            if (result) {
                const infoMsg = !isRulesetDetailPage.value
                    ? t('msg.info.create.successfully.args.default', [t('voca.rule.default')])
                    : t('msg.info.update.args.default', [t('voca.rule.default')]);
                ruleStore.initAll();

                commonts.notificationShow(gProp, 'success', infoMsg, -1);
                //RulesetDetail화면에서 Rule을 업데이트하거나 새롭게 생성한 경우,
                //즉시 import하여 RulesTable에 수정된 사항 업데이트
                if (isRulesetDetailPage.value) {
                    rulesetStore.importRules([data.data]);
                }
            } else {
                if (code === PrismaErrorCode.UniqueConstraintFailed) {
                    const duplicatedField = meta.target;
                    if (duplicatedField) {
                        commonts.notificationShow(
                            gProp,
                            'error',
                            t('msg.error.wrong_input.duplicate.args.default', [duplicatedField]),
                            -1
                        );
                    } else {
                        commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.duplicate.default'), -1);
                    }
                } else {
                    commonts.notificationShow(
                        gProp,
                        'error',
                        t('msg.error.fail.create.args.default', [t('voca.rule.default')]),
                        -1
                    );
                }
            }
            return data;
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
}

async function backToList() {
    await ruleStore.initAll();
    router?.push('/npg/rule/rule/list');
}

function validateRule() {
    let msg = '';
    if (!ruleStore.rule_base.title) {
        msg = t('msg.error.required.args.default', [t('voca.title.default')]);
    } else if (!ruleStore.rule_base.action) {
        msg = t('msg.error.required.args.default', [t('voca.action.default')]);
    } else if (!ruleStore.basic_options.msg) {
        msg = t('msg.error.required.args.default', [t('voca.msg.default')]);
    } else if (ruleStore.basic_options.sid !== 0 && !ruleStore.basic_options.sid) {
        msg = t('msg.error.required.args.default', [t('voca.sid.default')]);
    } else if (ruleStore.basic_options.rev !== 0 && !ruleStore.basic_options.rev) {
        msg = t('msg.error.required.args.default', [t('voca.rev.default')]);
    }

    if (msg) {
        commonts.notificationShow(gProp, 'error', msg, -1);
        return false;
    }
    return true;
}
</script>

<style lang="scss" scoped></style>
