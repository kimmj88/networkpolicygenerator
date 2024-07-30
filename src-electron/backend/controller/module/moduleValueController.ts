import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { ReqBody, ResBaseData } from '@cm/types/domain/apis/common';
import { NextFunction, Response, Router } from 'express';

import * as moduleValueService from '@be/service/module/moduleValueService';
import * as modulevalueAPI from '@cm/types/domain/apis/module/moduleValue';
import * as moduleValueDTO from '@cm/types/domain/dto/module/moduleValueDTO';

export class ModuleValueController extends BaseRouter {
    constructor() {
        super(`/${modulevalueAPI.API_MODULE_VALUE}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
    }

    insertData = async (req: ReqBody<modulevalueAPI.ReqInsertModuleValue>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            req.body.data;
            const result = await moduleValueService.insertData({
                module_id: req.body.data.module_id,
                type_cd: req.body.data.type_cd,
                value: req.body.data.value
            });
            if (result) {
                res.status(HTTP_STATUS_CODE.OK).json({
                    result: true
                });
                return;
            }
            res.status(HTTP_STATUS_CODE.SERVER_ERR);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    updateData = async (req: ReqBody<modulevalueAPI.ReqUpdateModuleValue>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            const result = await moduleValueService.updateData({
                id: req.body.data.id,
                module_id: req.body.data.module_id,
                value: req.body.data.value
            });
            if (result) {
                res.status(HTTP_STATUS_CODE.OK).json({
                    result: true
                });
                return;
            }
            res.status(HTTP_STATUS_CODE.SERVER_ERR);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    deleteData = async (req: ReqBody<modulevalueAPI.ReqDeleteModuleValue>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            const result = await moduleValueService.deleteData({
                id: req.body.data.id
            });
            if (result) {
                res.status(HTTP_STATUS_CODE.OK).json({
                    result: true
                });
                return;
            }
            res.status(HTTP_STATUS_CODE.SERVER_ERR);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    listAll = async (req: ReqBody, res: Response<modulevalueAPI.ResListModuleValues>, next: NextFunction) => {
        try {
            const moduleValues = await moduleValueService.listAll();
            res.status(HTTP_STATUS_CODE.OK).json({
                moduleValues: moduleValues as moduleValueDTO.ModuleValueDTO[]
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
}
