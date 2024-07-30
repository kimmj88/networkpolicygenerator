import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { NextFunction, Response, Router } from 'express';
import { ReqBody } from '@cm/types/domain/apis/common';

import * as policyService from '@be/service/policy/policyService';
import * as policyModuleService from '@be/service/policy/policyModuleService';
import * as policyAPI from '@cm/types/domain/apis/policy/policy';
import * as policyUtil from '@be/service/policy/policyUtil';

import * as policyDAO from '@cm/types/domain/dao/policy/policyDAO';
import * as policyModuleDAO from '@cm/types/domain/dao/policy/policyModuleDAO';
import * as policyDTO from '@cm/types/domain/dto/policy/policyDTO';

export class PolicyController extends BaseRouter {
    constructor() {
        super(`/${policyAPI.API_POLICY}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/cnt`, this.count);
        this.router.post(`${this.path}/list`, this.list);
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/detail`, this.detail);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
        this.router.post(`${this.path}/export`, this.export);
        this.router.post(`${this.path}/preview`, this.preview);
    }

    count = async (
        req: ReqBody<policyDTO.PolicySearchDTO>,
        res: Response<policyAPI.ResponseCountPolicy>,
        next: NextFunction
    ) => {
        try {
            const result = await policyService.countPolicy(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({ cnt: result, result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    list = async (
        req: ReqBody<policyDTO.PolicySearchDTO>,
        res: Response<policyAPI.ResponseLoadPolicy>,
        next: NextFunction
    ) => {
        try {
            const rows = await policyService.listPolicy(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({
                policies: rows as policyDTO.PolicyDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    listAll = async (req: ReqBody, res: Response<policyAPI.ResponseLoadPolicy>, next: NextFunction) => {
        try {
            const rows = await policyService.allPolicy();
            res.status(HTTP_STATUS_CODE.OK).json({
                policies: rows as policyDTO.PolicyDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    detail = async (
        req: ReqBody<policyDTO.PolicySearchDTO>,
        res: Response<policyAPI.ResponseLoadPolicy>,
        next: NextFunction
    ) => {
        try {
            const rows = await policyService.detailPolicy(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({
                policies: rows as policyDTO.PolicyDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    insertData = async (
        req: ReqBody<policyDAO.PolicyModulesInsertDAO>,
        res: Response<policyAPI.ResponsePolicy>,
        next: NextFunction
    ) => {
        try {
            const policyDAO: policyDAO.PolicyModulesInsertDAO = req.body;
            const policy = await policyService.createPolicy({
                title: policyDAO.title
            } as policyDAO.PolicyInsertDAO);

            if (policy) {
                for (const module of policyDAO.modules) {
                    if (module != null) {
                        const policyModule: policyModuleDAO.PolicyModuleInsertDAO = {
                            policy_id: policy.id,
                            module_id: module.id as number
                        };
                        await policyModuleService.insertPolicyModule(policyModule);
                    }
                }
            }

            res.status(201).json({ result: true, message: '' });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    updateData = async (
        req: ReqBody<policyDAO.PolicyUpdateDAO>,
        res: Response<policyAPI.ResponsePolicy>,
        next: NextFunction
    ) => {
        try {
            await policyService.updatePolicy(req.body);

            res.status(HTTP_STATUS_CODE.OK).json({ message: '', result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    deleteData = async (
        req: ReqBody<policyDTO.PolicyDTO>,
        res: Response<policyAPI.ResponsePolicy>,
        next: NextFunction
    ) => {
        try {
            const policyDao: policyDTO.PolicyDTO = { id: req.body.id, title: req.body.title };
            const return_value = await policyService.deletePolicy(policyDao);
            res.status(HTTP_STATUS_CODE.OK).json({ message: '', result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    preview = async (
        req: ReqBody<policyDTO.PolicyDTO>,
        res: Response<policyAPI.ResponsePolicyPreview>,
        next: NextFunction
    ) => {
        try {
            const result: policyDTO.PolicyExportDTO = await policyUtil.getPreview(req.body.modules!);
            const variablePreview: string = result.variablePreview.length > 0 ? result.variablePreview + '\n\n' : '';
            let modulesPreview: string = '';

            for (const [key, value] of result.modulePrevObj!) {
                modulesPreview += `${value} `;
            }

            res.status(HTTP_STATUS_CODE.OK).json({
                text: `${variablePreview}${modulesPreview}`,
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    export = async (
        req: ReqBody<policyDTO.PolicyExportDTO>,
        res: Response<policyAPI.ResponsePolicy>,
        next: NextFunction
    ) => {
        try {
            const reqPolicyExportDTO: policyDTO.PolicyExportDTO = req.body;
            let resPolicyModuleDTO: policyDTO.PolicyExportDTO = await policyUtil.getPreview(
                reqPolicyExportDTO.modules!
            );

            resPolicyModuleDTO.policyTitle = reqPolicyExportDTO.policyTitle;
            resPolicyModuleDTO.selectedFolderPath = reqPolicyExportDTO.selectedFolderPath;

            const resultData: boolean = await policyUtil.doExport(resPolicyModuleDTO);

            res.status(HTTP_STATUS_CODE.OK).json({ message: '', result: resultData });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
}
