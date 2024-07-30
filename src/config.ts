export default {
    install: (app: any) => {
        app.config.globalProperties.$configts = {
            getMode() {
                return 'prod';
            },
            getUIVersion() {
                return '0.1.0';
            },
            getProtocol() {
                // return "https";
                return 'http';
            },
            getGatewayIp() {
                return 'localhost';
            },
            getGatewayPort() {
                return 9000;
            },
            getComponentName() {
                return 'PG';
            },
            getPaging() {
                // scroll, page
                return 'scroll';
            },
            getDefaultLanguage() {
                // ko, en, cn
                return 'ko';
            },
            getMultiLanguage() {
                return true;
            },
            getCIInfo() {
                // itsk, penta, ex, autocrypt, panqi
                return 'autocrypt';
            },
            getGNBPosition() {
                // true : left, false : top
                return true;
            },
            getKMSFlag() {
                return false;
            },
            getMfaFlag() {
                return false;
            },
            getElectronFlag() {
                return true;
            }
        };
    }
};
