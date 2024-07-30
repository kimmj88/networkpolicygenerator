import { defineStore } from 'pinia';
import axios from 'axios';
import { IRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { IRulesetDTO, IRulesetResDTO } from '@cm/types/domain/dto/ruleset/rulesetDTO';
import { ruleStore } from './Rule';
import { DebuggerEvent } from 'vue';

const INIT_RULESET = {
    id: undefined as number | undefined,
    title: '',
    description: '' as string | undefined,
    rules: [] as IRuleDTO[],
    selectedRuleId: undefined as number | undefined
};

export const useRulesetStore = defineStore('ruleset', {
    state: () => {
        return {
            ...INIT_RULESET
        };
    },
    getters: {
        rulesetDTO() {
            const dto = {
                id: this.id,
                title: this.title,
                description: this.description,
                rules: this.rules
            } as IRulesetDTO;
            return dto;
        }
    },
    actions: {
        async selectRuleRow(ruleId: number) {
            rulesetStore.selectedRuleId = ruleId;
            await ruleStore.initAll();
            ruleStore.id = ruleId;
            await ruleStore.getRuleDetail();
        },
        async importRules(selectedRules: IRuleDTO[]) {
            //기존에 추가되지 않은 Rule만 추가한다.
            selectedRules.forEach((rule) => {
                if (this.rules) {
                    const foundIndex = this.rules.findIndex((existingRule) => rule.id === existingRule.id);
                    if (foundIndex === -1) {
                        this.rules.push(rule);
                    } else {
                        //이미 있는 Rule은 새로 import한 Rule로 대체
                        this.rules[foundIndex] = rule;
                    }
                }
            });
            await this.initRuleDetail();
        },

        async deleteRuleFromRuleset(ruleId: number) {
            if (this.rules) {
                this.rules = this.rules.filter((rule) => rule.id !== ruleId);
            }
            await this.initRuleDetail();
        },

        setRulesetDataToStore(rulesetData: IRulesetResDTO) {
            rulesetStore.id = rulesetData.id;
            rulesetStore.title = rulesetData.title as string;
            rulesetStore.description = rulesetData.description;
            rulesetStore.rules = rulesetData.rules?.map((ruleOnRuleset) => ruleOnRuleset.rule as IRuleDTO) ?? [];
        },

        /**
         * INIT
         */
        async initAll() {
            await this.initRuleDetail();
            this.id = INIT_RULESET.id;
            this.title = INIT_RULESET.title;
            this.description = INIT_RULESET.description;
            this.rules = [...INIT_RULESET.rules];
            this.selectedRuleId = INIT_RULESET.selectedRuleId;
        },

        /**
         * SideEffect Functions
         */
        async getDetail() {
            const { data } = await axios.post('http://localhost:9000/api/ruleset/detail', { id: this.id });
            if (data.result) {
                rulesetStore.setRulesetDataToStore(data.data as IRulesetResDTO);
            }
            return data.result;
        },

        async upsertRuleset(targetUrl: string) {
            const { data } = await axios.post(targetUrl, this.rulesetDTO);

            return data;
        },

        async initRuleDetail() {
            rulesetStore.selectedRuleId = undefined;
            await ruleStore.initAll();
        }
    }
});

export const rulesetStore = useRulesetStore();

rulesetStore.$subscribe((mutation) => {
    const { key, newValue, oldValue } = mutation.events as DebuggerEvent;
});
