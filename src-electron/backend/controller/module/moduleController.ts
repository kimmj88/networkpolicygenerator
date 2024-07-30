import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { ReqBody, ResBaseData } from '@cm/types/domain/apis/common';
import { NextFunction, Response, Router } from 'express';

import * as moduleDTO from '@cm/types/domain/dto/module/moduleDTO';
import * as moduleAPI from '@cm/types/domain/apis/module/module';
import * as moduleService from '@be/service/module/moduleService';
import * as moduleValueService from '@be/service/module/moduleValueService';

export class ModuleController extends BaseRouter {
    constructor() {
        super(`/${moduleAPI.API_MODULE}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
        this.router.post(`${this.path}/cnt`, this.count);
        this.router.post(`${this.path}/list`, this.list);
        this.router.post(`${this.path}/detail`, this.detail);
    }

    insertData = async (req: ReqBody<moduleAPI.ReqCreateModule>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            req.body.data;
            const result = await moduleService.insertData({
                type_cd: req.body.data.type_cd,
                title: req.body.data.title,
                module_value_list: req.body.data.module_value_list
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

    updateData = async (req: ReqBody<moduleAPI.ReqUpdateModule>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            // 전체 항목 조회
            const moduleValues = await moduleValueService.list({
                module_id: req.body.data.id
            });

            const allIds = req.body.data.module_value_list?.map((item) => item.id);

            // 삭제 목록
            const deleteIds = moduleValues
                .filter((item) => {
                    return !allIds?.includes(item.id);
                })
                .map((item) => item.id);

            // 삭제
            await moduleValueService.deleteManyData({
                ids: deleteIds
            });

            const result = await moduleService.updateData({
                id: req.body.data.id,
                title: req.body.data.title,
                module_value_list: req.body.data.module_value_list
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

    deleteData = async (req: ReqBody<moduleAPI.ReqDeleteModule>, res: Response<ResBaseData>, next: NextFunction) => {
        try {
            const result = await moduleService.deleteData({
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

    listAll = async (req: ReqBody, res: Response<moduleAPI.ResGetAllModules>, next: NextFunction) => {
        try {
            const modules = await moduleService.listAll();
            res.status(HTTP_STATUS_CODE.OK).json({
                modules: modules as moduleDTO.ModuleDTO[]
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    count = async (req: ReqBody<moduleAPI.ReqCountModule>, res: Response<moduleAPI.ResCountModule>, next: NextFunction) => {
        try {
            const count = await moduleService.count({
                type_cd: req.body.data.type_cd,
                title: req.body.data.title,
                create_time_from: req.body.data.create_time_from,
                create_time_to: req.body.data.create_time_to,
                page: req.body.data.page,
                page_per_data: req.body.data.page_per_data
            });
            res.status(HTTP_STATUS_CODE.OK).json({
                count: count
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    list = async (req: ReqBody<moduleAPI.ReqSearchModule>, res: Response<moduleAPI.ResSearchModule>, next: NextFunction) => {
        try {
            const datas = await moduleService.list({
                type_cd: req.body.data.type_cd,
                title: req.body.data.title,
                create_time_from: req.body.data.create_time_from,
                create_time_to: req.body.data.create_time_to,
                sort: req.body.data.sort,
                page: req.body.data.page,
                page_per_data: req.body.data.page_per_data
            });
            res.status(HTTP_STATUS_CODE.OK).json({
                modules: datas
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    detail = async (req: ReqBody<moduleAPI.ReqDetailModule>, res: Response<moduleAPI.ResDetailModule>, next: NextFunction) => {
        try {
            const data = await moduleService.detail({
                id: req.body.data.id
            });
            res.status(HTTP_STATUS_CODE.OK).json({
                module: data || undefined
            });
            return;
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
}
