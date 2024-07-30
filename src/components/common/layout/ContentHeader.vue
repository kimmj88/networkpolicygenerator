<template>
    <div id="contentHeader" class="content-header">
        <div class="item">
            <span class="m-0 p-2" :title="getMLMenuName(menuInfo)">
                {{ getMLMenuName(menuInfo) }}
                <a v-if="stores.menu.menuInfo.menuTypeFlag">
                    {{ t('msg.' + stores.menu.menuInfo.menuType) }}
                </a>
            </span>
        </div>
        <div class="item">
            <ol>
                <li class="" v-for="(menu, idx) in heirarchy" :key="idx">
                    <div
                        v-if="menu.menu_url === '/' && menu.menu_id === 'root'"
                        @click="setRouterMenuInfo(menu.menu_url, menu.menu_id, false, '')"
                    >
                        <div class="cursor-pointer icon ic_home"></div>
                    </div>
                    <div
                        v-else-if="menu.menu_url !== 'subdir'"
                        @click="setRouterMenuInfo(menu.menu_url, menu.menu_id, false, '')"
                    >
                        <div class="icon ic_right a"></div>
                        <span class="cursor-pointer menu-target" :title="getMLMenuName(menu)">{{
                            getMLMenuName(menu)
                        }}</span>
                    </div>
                    <div v-else>
                        <div class="icon ic_right"></div>
                        <span :title="getMLMenuName(menu)">{{ getMLMenuName(menu) }}</span>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const { stores, gProp, commonts, t, route } = base();
const { currentLang } = commonVar();

const menuList = computed(() => stores.menu.menuList);
const menuInfo: { [x: string]: any } = ref({});

const heirarchy: Array<{ [x: string]: any }> = reactive([]);

function setRouterMenuInfo(url: string, menuId: string, menuTypeFlag: boolean, menuType: string) {
    commonts.setRouterInfo(gProp, url, menuId, menuTypeFlag, menuType, stores.menu.menuList);
}

watch(
    () => menuList.value,
    () => setInit(route?.path)
);

function setInit(url?: string) {
    menuList?.value.forEach((m: any) => {
        if (m?.menu_url === url) {
            menuInfo.value = m;
            if (heirarchy.length === 0) {
                setRouterMenuInfo(m?.menu_url, m?.menu_id, m?.menu_type_flag, m?.menu_type);
                commonts.getHeirarchyData(gProp, heirarchy, menuList.value, m?.menu_id);
            }
        }
    });
}

function getMLMenuName(menuInfo: any) {
    return commonts.getMLMenuName(menuInfo, currentLang?.value.language);
}

onMounted(() => {
    setInit(route?.path);
});
</script>

<style lang="scss" scoped>
.content-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;

    .item:first-child span {
        font-size: 1.8rem;
        font-weight: 700;
        display: inherit;
        overflow: hidden;
        white-space: nowrap;
    }

    .item ol {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 0 0 0.3rem 0;
        font-size: 1rem;
        li {
            .icon {
                width: 1.4rem;
                height: 1.4rem;
            }

            > div {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin: 0 0 0.3rem 0;
                font-size: 1rem;

                span {
                    display: inline;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    max-width: 10rem;
                }
            }
        }
        li:last-child {
            div span {
                color: var(--text-blue);
            }
        }
    }
}
</style>
