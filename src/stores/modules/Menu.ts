import type { MenuInfo } from '@/stores/interface';
import { menuInfo } from '@/stores/model';
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        rootMenuId: '',
        menuInfo: menuInfo,
        menuList: [] as any
    }),
    actions: {
        async getRootMenuInfo() {
            // async getRootMenuInfo(obj: any) {
            // await obj.gProp?.axios
            // 	.post(obj.url, obj.body, obj.options)
            // 	.then((response: any) => {
            // 		this.setRootMenuId(response.data);
            // 	})
            // 	.catch((error: any) => {
            // 		console.log(error);
            // 	});
            this.setRootMenuId('000000');
        },
        setRootMenuId(rootMenuId: string) {
            this.rootMenuId = rootMenuId;
            localStorage.setItem('rootMenuId', rootMenuId);
        },
        setMenuInfo(menuInfoData: MenuInfo) {
            this.menuInfo.menuId = menuInfoData.menuId;
            this.menuInfo.menuNm = menuInfoData.menuNm;
            this.menuInfo.menuUrl = menuInfoData.menuUrl;
            this.menuInfo.menuTypeFlag = menuInfoData.menuTypeFlag;
            this.menuInfo.menuType = menuInfoData.menuType;
            this.menuInfo.menuAuth = menuInfoData.menuAuth;
            this.menuInfo.menuList = menuInfoData.menuList;

            localStorage.setItem('menuInfo', JSON.stringify(this.menuInfo));
        },
        setMenuList(menuListData: Array<MenuInfo>) {
            if (menuListData !== undefined && menuListData !== null && menuListData.length > 0) {
                this.menuList = [] as any;
                menuListData.forEach((e) => this.menuList.push(e));

                localStorage.setItem('menuList', JSON.stringify(this.menuList));
            }
        },
        clearMenuInfo() {
            this.menuInfo = menuInfo;

            localStorage.removeItem('menuInfo');
            localStorage.removeItem('menuList');
        }
    }
});
