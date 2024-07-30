import { logger } from '@be/common/winston';
import { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
    status: number;
    responseData: any;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class PrismaException extends HttpException {
    code: string;
    meta?: Record<string, unknown>;
    constructor(status: number, message: string, code: string, meta?: Record<string, unknown>) {
        super(status, message);
        this.code = code;
        this.meta = meta;
    }
}

export function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    logger.debug(request.body, next);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    logger.error(message);
    response.status(status).json({ message, result: false });
    next(error);
}

export const HTTP_STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    NOT_FOUND: 404,
    SERVER_ERR: 500
} as const;

export type HTTP_STATUS_CODE = (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];

export const httpMsgs: Map<HTTP_STATUS_CODE, string> = new Map([
    [HTTP_STATUS_CODE.OK, 'SUCCESS'],
    [HTTP_STATUS_CODE.CREATED, 'SUCCESS : created resource'],
    [HTTP_STATUS_CODE.ACCEPTED, 'Accepted but no action can be taken in response to it.'],
    [HTTP_STATUS_CODE.NO_CONTENT, 'No Content'],
    [HTTP_STATUS_CODE.NOT_FOUND, 'The data does not exist.'],
    [HTTP_STATUS_CODE.SERVER_ERR, 'Internal Server Error']
]);

export const DATABASE_STATUS_CODE = {
    OK: 1,
    WARNING: 2,
    NODATA: 3
} as const;

export type DATABASE_STATUS_CODE = (typeof DATABASE_STATUS_CODE)[keyof typeof DATABASE_STATUS_CODE];

export const databaseMsg: Map<DATABASE_STATUS_CODE, string> = new Map([
    [DATABASE_STATUS_CODE.OK, 'SUCCESS'],
    [DATABASE_STATUS_CODE.WARNING, 'WARNING : A constraint was violated..'],
    [DATABASE_STATUS_CODE.NODATA, 'SUCCESS : Not found row items']
]);

export const COMMON_ERROR_CODE = {
    NO_INPUT_PARAMETER: 1001,
    NO_CREATE_FOLDER: 1002
} as const;

export type COMMON_ERROR_CODE = (typeof COMMON_ERROR_CODE)[keyof typeof COMMON_ERROR_CODE];

export const errorMsg: Map<COMMON_ERROR_CODE, string> = new Map([
    [COMMON_ERROR_CODE.NO_INPUT_PARAMETER, 'No Input Parameter'],
    [COMMON_ERROR_CODE.NO_CREATE_FOLDER, 'Failed to Creation Folder']
]);
