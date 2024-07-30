import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { saveAs } from 'file-saver';
import { ref } from 'vue';

export function fileUpDown() {
    const { gProp, emitter, commonts, t } = base();
    const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();

    const targetUrl = ref('');
    const retFunc = ref(new Function());

    const doDownload = async (url: string, bodyData: { [x: string]: any }, fileExt: string) => {
        targetUrl.value = url;
        if (!isAxiosFlag.value && !commonts.isEmpty(targetUrl.value)) {
            isAxiosFlag.value = true;
            await gProp?.axios
                .post(commonts.getUrl(gProp, targetUrl.value), bodyData, getAxiosOptions('FILE'))
                .then(function (response: any) {
                    const blob = new Blob([response.data], {
                        type: 'multipart/form-data'
                    });
                    const fileName = commonts.getFilenameWithHeader(
                        gProp,
                        response.headers['content-disposition'],
                        fileExt,
                        { flag: true, format: 'YYYYMMDDHHmmss' }
                    );
                    saveAs(blob, fileName);
                })
                .catch(getErrorFunc)
                .finally(getFinallyFunc);
        }
    };

    const doExcelExport = async (url: string, bodyData: { [x: string]: any }) => {
        targetUrl.value = url;
        if (!isAxiosFlag.value && !commonts.isEmpty(targetUrl.value)) {
            isAxiosFlag.value = true;
            await gProp?.axios
                .post(commonts.getUrl(gProp, targetUrl.value), bodyData, getAxiosOptions('FILE'))
                .then(function (response: any) {
                    const blob = new Blob([response.data], {
                        type: 'application/vnd.ms-excel'
                    });
                    const fileName = commonts.getFilenameWithHeader(
                        gProp,
                        response.headers['content-disposition'],
                        '.xlsx'
                    );
                    saveAs(blob, fileName);
                })
                .catch(getErrorFunc)
                .finally(getFinallyFunc);
        }
    };

    const goUpload = (url: string, uploadType: string, callbackFunc?: Function, data?: { [x: string]: any }) => {
        targetUrl.value = url;
        retFunc.value =
            callbackFunc ??
            (() => {
                commonts.hideModal();
            });
        emitter.emit('uploadFileModal', {
            uploadType: uploadType,
            noticeFlag: false,
            title: '',
            dataInfo: data
        });
    };

    const uploadAxios = async (formData: any, targetUrl: string) => {
        await gProp?.axios
            .post(commonts.getUrl(gProp, targetUrl), formData, getAxiosOptions('FILE'))
            .then(() => {
                commonts.notificationShow(gProp, 'success', t('msg.info.registration.default'));
                // 정상처리시 업로드 데이터 초기화
                emitter.emit('initPopupData');
                commonts.hideModal();
                retFunc.value();
            })
            .catch((error: any) => {
                console.log(error);
                if (error.response.data === 'sheetname' || error.response.data === 'headerkey') {
                    commonts.notificationShow(gProp, 'error', t('error.type.upload.excel.' + error.response.data), -1);
                } else {
                    commonts.notificationShow(gProp, 'error', t('msg.error.create.registration.default'));
                }
                return false;
            })
            .finally(getFinallyFunc);
    };

    const doUpload = async (file: File, notice?: string) => {
        // form data create
        const formData = new FormData();
        formData.append('file', file);
        if (notice !== undefined) formData.append('notice', notice);

        // validate
        if (gProp === undefined || !doValidate(gProp, formData)) {
            return false;
        }

        if (!isAxiosFlag.value && !commonts.isEmpty(targetUrl.value)) {
            isAxiosFlag.value = true;
            await uploadAxios(formData, targetUrl.value);
        }
    };

    const doValidate = (gProp: Record<string, any>, formData: FormData) => {
        let retVal = true;
        formData.forEach((value, key) => {
            if (key === 'file') {
                const fileInfo: File | string | null = value;
                if (fileInfo === null || typeof fileInfo === 'string' || fileInfo.size <= 0) {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.file.check.default'));
                    retVal = false;
                    return retVal;
                }
            }
        });
        return retVal;
    };

    const doExcelImport = async (file: File, notice?: string) => {
        // form data create
        const formData = new FormData();
        formData.append('file', file);
        if (notice !== undefined) formData.append('notice', notice);

        // validate
        if (gProp === undefined || !doValidateExcel(gProp, formData)) {
            return false;
        }

        if (!isAxiosFlag.value && !commonts.isEmpty(targetUrl.value)) {
            isAxiosFlag.value = true;
            await uploadAxios(formData, targetUrl.value);
        }
    };

    const doValidateExcel = (gProp: Record<string, any>, formData: FormData) => {
        let retVal = true;
        formData.forEach((value, key) => {
            if (key === 'file') {
                const fileInfo: File | string | null = value;
                if (fileInfo === null || typeof fileInfo === 'string') {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.file.check.default'));
                    retVal = false;
                    return retVal;
                }
                if (!fileInfo.name.toLowerCase().endsWith('.xls') && !fileInfo.name.toLowerCase().endsWith('.xlsx')) {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.file.extension.check.default'));
                    retVal = false;
                    return retVal;
                }
                if (fileInfo.size <= 0) {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.file.check.default'));
                    retVal = false;
                    return retVal;
                }
            }
        });
        return retVal;
    };

    // doUpload(file , notice , docNo , ctlType , pkiCode)
    const setUploadData = (data: { uploadType: string; file: File; notice?: string }) => {
        if (data?.uploadType === 'EXCEL_FILE_UPLOAD') {
            data?.notice !== undefined ? doExcelImport(data?.file, data?.notice) : doExcelImport(data?.file);
        } else {
            data?.notice !== undefined ? doUpload(data?.file, data?.notice) : doUpload(data?.file);
        }
    };

    emitter.off('fileUpDown-file-upload');
    emitter.on('fileUpDown-file-upload', setUploadData);

    return { doExcelExport, doDownload, goUpload };
}
