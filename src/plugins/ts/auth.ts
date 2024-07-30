// import { base } from "@/plugins/ts/base";
// import { computed } from "vue";
import { ref } from 'vue';

export function auth() {
    // const { gProp, commonts } = base();
    // 권한 처리
    // const authRead = computed(() => commonts.getMenuAuth(gProp, "r", false) === "Y");
    // const authCreate = computed(() => commonts.getMenuAuth(gProp, "c", false) === "Y");
    // const authUpdate = computed(() => commonts.getMenuAuth(gProp, "u", false) === "Y");
    // const authDelete = computed(() => commonts.getMenuAuth(gProp, "d", false) === "Y");
    // const authExcel = computed(() => commonts.getMenuAuth(gProp, "e", false) === "Y");
    // const authCreateUpdate = computed(() => commonts.getMenuAuth(gProp, "c,u", false) === "Y");
    // const authUpdateDelete = computed(() => commonts.getMenuAuth(gProp, "u,d", false) === "Y");
    const authRead = ref(true);
    const authCreate = ref(true);
    const authUpdate = ref(true);
    const authDelete = ref(true);
    const authExcel = ref(false);
    const authCreateUpdate = ref(true);
    const authUpdateDelete = ref(true);

    return {
        authRead,
        authCreate,
        authUpdate,
        authDelete,
        authExcel,
        authCreateUpdate,
        authUpdateDelete
    };
}
