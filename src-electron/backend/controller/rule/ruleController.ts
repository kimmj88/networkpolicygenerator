import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { ReqBody, ResponsePost } from '@cm/types/domain/apis/common';
import { plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response, Router } from 'express';

import * as ruleService from '@be/service/rule/ruleService';
import * as ruleDTO from '@cm/types/domain/dto/rule/ruleDTO';

export const API_RULE = 'api/rule';

export class RuleController extends BaseRouter {
    constructor() {
        super(`/${API_RULE}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/cnt`, this.count);
        this.router.post(`${this.path}/list`, this.list);
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
        this.router.post(`${this.path}/detail`, this.detail);
    }
    count = async (req: ReqBody<ruleDTO.ISearchRuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const searchDTO = plainToInstance(ruleDTO.SearchRuleDTO, req.body, {
                excludeExtraneousValues: true
            });

            // const searchDTO = req.body;

            const cnt = await ruleService.count(searchDTO);
            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: cnt });
        } catch (error) {
            console.log('error is ', error);
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    list = async (req: ReqBody<ruleDTO.SearchRuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const searchDTO = plainToInstance(ruleDTO.SearchRuleDTO, req.body, {
                excludeExtraneousValues: true
            });
            const list = await ruleService.list(searchDTO);

            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: list });
        } catch (error) {
            console.log('error is ', error);
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    insertData = async (req: ReqBody<ruleDTO.CreateRuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            // const ruleDTO = req.body as CreateRuleDTO;
            //excludeExtraneousValues: true인 경우, DTO Class에 @Expose 혹은 @Exclude 가 있는 필드만 포함하고 아닌 필드는 exclude
            const ruleDto = plainToInstance(ruleDTO.CreateRuleDTO, req.body, {
                excludeExtraneousValues: true
            });
            const insertedRule = await ruleService.insertData(ruleDto);

            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: insertedRule });
        } catch (error) {
            next(error);
        }
    };

    updateData = async (req: ReqBody<ruleDTO.UpdateRuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const ruleDto = plainToInstance(ruleDTO.UpdateRuleDTO, req.body, {
                excludeExtraneousValues: true
            });
            const updateResult = await ruleService.updateData(ruleDto);
            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: updateResult });
        } catch (error) {
            console.log('error is ', error);
            next(error);
        }
    };

    deleteData = async (req: ReqBody<ruleDTO.DeleteRuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const ruleDto = plainToInstance(ruleDTO.DeleteRuleDTO, req.body, { excludeExtraneousValues: true });
            if (ruleDto.id) {
                const deleteResult = await ruleService.deleteData(ruleDto.id);
                const result: ResponsePost = {
                    message: 'success',
                    result: true
                };
                return res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: deleteResult });
            }
            return next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, 'id is required.'));
        } catch (error) {
            console.log('error is ', error);
            next(error);
        }
    };

    listAll = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rules = await ruleService.listAll();
            res.status(HTTP_STATUS_CODE.OK).json(rules);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    detail = async (req: ReqBody<ruleDTO.RuleDTO>, res: Response<any>, next: NextFunction) => {
        try {
            const ruleDto = plainToInstance(ruleDTO.RuleDTO, req.body, {
                excludeExtraneousValues: true
            });
            if (!ruleDto.id) {
                throw new HttpException(209, 'Id is required field.');
            }

            const found = await ruleService.detail(ruleDto.id);

            res.status(HTTP_STATUS_CODE.OK).json({
                result: true,
                data: found
            });
        } catch (error) {
            console.log('error is ', error);
            next(error);
        }
    };
}
