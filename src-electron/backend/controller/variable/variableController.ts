import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { NextFunction, Response, Router, Request } from 'express';
import { ReqBody } from '@cm/types/domain/apis/common';

import * as variableDAO from '@cm/types/domain/dao/variable/variableDAO';
import * as variableDTO from '@cm/types/domain/dto/variable/variableDTO';
import * as variableService from '@be/service/variable/variableService';
import * as variableAPI from '@cm/types/domain/apis/variable/variable';

export class VariableController extends BaseRouter {
    constructor() {
        super(`/${variableAPI.API_VARIABLE}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/cnt`, this.count);
        this.router.post(`${this.path}/list`, this.list);
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/detail`, this.detail);
        this.router.post(`${this.path}/detail/key`, this.detailByKey);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
    }

    count = async (req: ReqBody<variableDTO.VariableSearchDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const variables = await variableService.countVariable(req.body);
            res.status(HTTP_STATUS_CODE.OK).json(variables);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    list = async (
        req: ReqBody<variableDTO.VariableSearchDTO>,
        res: Response<variableAPI.ResponseLoadVariable>,
        next: NextFunction
    ) => {
        try {
            const rows = await variableService.listVariable(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({
                variables: rows as variableDTO.VariableDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    listAll = async (req: ReqBody, res: Response<variableAPI.ResponseLoadVariable>, next: NextFunction) => {
        try {
            const rows = await variableService.allVariable();
            res.status(HTTP_STATUS_CODE.OK).json({
                variables: rows as variableDTO.VariableDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    detail = async (
        req: ReqBody<variableDTO.VariableSearchDTO>,
        res: Response<variableAPI.ResponseLoadVariable>,
        next: NextFunction
    ) => {
        try {
            const rows = await variableService.detailVariable(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({
                variables: rows as variableDTO.VariableDTO[],
                message: '',
                result: true
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    insertData = async (
        req: ReqBody<variableDAO.VariableInsertDAO>,
        res: Response<variableAPI.ResponseVariable>,
        next: NextFunction
    ) => {
        try {
            const newVariable = await variableService.insertVariable(req.body);
            res.status(201).json({ message: '', result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    updateData = async (
        req: ReqBody<variableDAO.VariableUpdateDAO>,
        res: Response<variableAPI.ResponseVariable>,
        next: NextFunction
    ) => {
        try {
            const updateVariables = await variableService.updateVariable(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({ message: '', result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    deleteData = async (
        req: ReqBody<variableDTO.VariableDTO>,
        res: Response<variableAPI.ResponseVariable>,
        next: NextFunction
    ) => {
        try {
            const deleteVariables = await variableService.deleteVariable(req.body);
            res.status(HTTP_STATUS_CODE.OK).json({ message: '', result: true });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    detailByKey = async (req: Request, res: Response<variableAPI.ResponseLoadVariable>, next: NextFunction) => {
        try {
            const body = req.body;
            const found = await variableService.detailByKey(body.key);
            if (!found) {
                res.status(HTTP_STATUS_CODE.OK).json({ message: 'No variable found.', result: true, variables: [] });
            } else {
                res.status(HTTP_STATUS_CODE.OK).json({
                    message: '',
                    result: true,
                    variables: [found] as variableDTO.VariableDTO[]
                });
            }
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
}
