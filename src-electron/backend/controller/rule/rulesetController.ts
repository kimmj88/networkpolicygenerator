import { BaseRouter } from '@be/common/baseRouter';
import { HTTP_STATUS_CODE, HttpException } from '@be/common/httpException';
import { plainToInstance } from 'class-transformer';
import { NextFunction, Request, Response, Router } from 'express';
import { ResponsePost } from '@cm/types/domain/apis/common';

import * as rulesetService from '@be/service/rule/rulesetService';
import * as rulesetDTO from '@cm/types/domain/dto/ruleset/rulesetDTO';

export const API_RULESET = 'api/ruleset';

export class RulesetController extends BaseRouter {
    constructor() {
        super(`/${API_RULESET}`, Router());
        this.initalizeRoutes();
    }

    public initalizeRoutes() {
        this.router.post(`${this.path}/cnt`, this.count);
        this.router.post(`${this.path}/list`, this.list);
        this.router.post(`${this.path}/insert`, this.insertData);
        this.router.post(`${this.path}/update`, this.updateData);
        this.router.post(`${this.path}/delete`, this.deleteData);
        this.router.post(`${this.path}/all`, this.listAll);
        this.router.post(`${this.path}/detail`, this.detail);
        this.router.post(`${this.path}/ruletext`, this.ruleText);
    }

    count = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const searchDTO = plainToInstance(rulesetDTO.SearchRulesetDTO, req.body as rulesetDTO.SearchRulesetDTO, {
                excludeExtraneousValues: true
            });

            const cnt = await rulesetService.count(searchDTO);
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

    list = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const searchDTO = plainToInstance(rulesetDTO.SearchRulesetDTO, req.body as rulesetDTO.SearchRulesetDTO, {
                excludeExtraneousValues: true
            });
            const list = await rulesetService.list(searchDTO);

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

    insertData = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            // const ruleDTO = req.body as CreateRuleDTO;
            //excludeExtraneousValues: true인 경우, DTO Class에 @Expose 혹은 @Exclude 가 있는 필드만 포함하고 아닌 필드는 exclude
            const rulesetDto = plainToInstance(rulesetDTO.CreateRulesetDTO, req.body as rulesetDTO.CreateRulesetDTO, {
                excludeExtraneousValues: true
            });
            const insertedRuleset = await rulesetService.insertData(rulesetDto);

            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: insertedRuleset });
        } catch (error) {
            console.log('error is ', error);
            next(error);
        }
    };

    updateData = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rulesetDto = plainToInstance(rulesetDTO.UpdateRulesetDTO, req.body as rulesetDTO.UpdateRulesetDTO, {
                excludeExtraneousValues: true
            });
            const updateResult = await rulesetService.updateData(rulesetDto);
            const result: ResponsePost = {
                message: 'success',
                result: true
            };

            res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: updateResult });
        } catch (error) {
            console.log('error is ', error);
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    deleteData = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rulesetDto = plainToInstance(rulesetDTO.DeleteRulesetDTO, req.body, {
                excludeExtraneousValues: true
            });
            if (rulesetDto.id) {
                const deleteResult = await rulesetService.deleteData(rulesetDto.id);
                const result: ResponsePost = {
                    message: 'success',
                    result: true
                };
                return res.status(HTTP_STATUS_CODE.OK).json({ ...result, data: deleteResult });
            }
            return next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, 'id is required.'));
        } catch (error) {
            console.log('error is ', error);
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    listAll = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rules = await rulesetService.listAll();
            res.status(HTTP_STATUS_CODE.OK).json(rules);
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
    detail = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rulesetDto = plainToInstance(rulesetDTO.RulesetDTO, req.body as rulesetDTO.RulesetDTO, {
                excludeExtraneousValues: true
            });
            if (!rulesetDto.id) {
                throw new HttpException(209, 'Id is required field.');
            }
            const found = await rulesetService.detail(rulesetDto.id);
            res.status(HTTP_STATUS_CODE.OK).json({
                result: true,
                data: found
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };

    ruleText = async (req: Request, res: Response<any>, next: NextFunction) => {
        try {
            const rulesetDto = plainToInstance(rulesetDTO.RulesetDTO, req.body as rulesetDTO.RulesetDTO, {
                excludeExtraneousValues: true
            });
            if (!rulesetDto.id) {
                throw new HttpException(209, 'Id is required field.');
            }
            const found = await rulesetService.detailAsText(rulesetDto.id);
            res.status(HTTP_STATUS_CODE.OK).json({
                result: true,
                data: found
            });
        } catch (error) {
            next(new HttpException(HTTP_STATUS_CODE.SERVER_ERR, error as string));
        }
    };
}
