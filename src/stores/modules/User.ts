import { useCommonStore } from '@/stores/index';
import type { UserState } from '@/stores/interface';
import { userInfo } from '@/stores/model';
import { useMenuStore } from '@/stores/modules/Menu';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        accessToken: '',
        refreshToken: '',
        user: userInfo
    }),
    actions: {
        async userInfo() {
            // async userInfo(obj: StoreObject) {
            // await obj.gProp?.axios
            // 	.post(obj.url, obj.body, obj.options)
            // 	.then((response: any) => {
            // 		if (response?.data?.errorCode !== undefined) {
            // 			console.log(response?.data?.errorCode);
            // 			obj.gProp?.stores.common.emitter.emit("logout");
            // 		} else {
            // 			console.log(response, response.headers["Set-Cookie"]);
            // 			this.setUser(response.data);
            // 			this.user.email = response.data.user_id;
            // 			this.user.name = response.data.user_nm;
            // 			this.user.company = "";
            // 			this.user.svcType = response.data.svc_type;

            // 			const menuStore = useMenuStore();
            // 			menuStore.setMenuList(response.data.menu_info);

            // 			// 권한 메뉴 리스트가 조회되고 home URL 이면 권한있는 최초의 메뉴 화면 이동
            // 			if (obj.gProp?.$route?.path === "/") {
            // 				obj.gProp?.stores.common.emitter.emit("goAuthFirstMenu");
            // 			}
            // 		}
            // 	})
            // 	.catch((error: any) => {
            // 		console.log(error);
            // 		console.log(error.response);
            // 		obj.gProp?.stores.common.emitter.emit("logout");
            // 	});
            const channel = 'mng_menu_all_list';
            window.ipcRenderer.send(channel, { curr_lang_cd: useCommonStore().currentLang });
            window.ipcRenderer.on([channel, 'return'].join('_'), (_evt, ret) => {
                const menuStore = useMenuStore();
                menuStore.setMenuList(ret);
            });
        },
        setUser(payload: { user_id: string; user_nm: string; company: string; svc_type: string }) {
            this.user.email = payload.user_id;
            this.user.name = payload.user_nm;
            this.user.company = '';
            this.user.svcType = payload.svc_type;

            localStorage.setItem('user', JSON.stringify(this.user));
        },
        clearUser() {
            this.$reset();

            localStorage.setItem('user', JSON.stringify(this.user));
        }
    }
});
