import type { NetworkState } from '@/stores/interface';
import { defineStore } from 'pinia';

export const useNetworkStore = defineStore('network', {
    state: (): NetworkState => ({
        isActive: true,
        emergencyStatus: false,
        forceToStopEmergency: false
    }),
    actions: {
        async checkKmsNetwork(obj: any) {
            await obj.gProp?.axios
                .post(obj.url, {}, obj.options)
                .then((response: any) => {
                    this.setResponseData(response?.data);
                })
                .catch(() => {
                    this.setResponseData(false);
                });
        },
        setResponseData(data: any) {
            if (data?.errorCode === undefined && data === true) {
                this.setNetwork(true);
                this.setEmergencyStatus(false);
            } else {
                this.setNetwork(false);
                //이전에 emergency를 중지 하지 않은 경우만 emergency On
                if (!this.forceToStopEmergency) {
                    this.setEmergencyStatus(true);
                }
            }
        },
        setNetwork(isActive: boolean) {
            this.isActive = isActive;
            localStorage.setItem('networkIsActive', isActive.toString());
        },
        setEmergencyStatus(isActive: boolean) {
            this.emergencyStatus = isActive;
        },
        setForceToStopEmergency(bool: boolean) {
            this.forceToStopEmergency = bool;
        }
    }
});
