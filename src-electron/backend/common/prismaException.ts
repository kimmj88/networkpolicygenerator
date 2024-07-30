import { PrismaErrorCode } from '@cm/enum/errorCode';
import { HttpException } from './httpException';
import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export class PrismaException extends HttpException {
    code: string;
    meta?: Record<string, unknown>;
    constructor(status: number, message: string, code: string, meta?: Record<string, unknown>) {
        super(status, message);
        this.code = code;
        this.meta = meta;
    }
}

export function prismaErrorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === PrismaErrorCode.UniqueConstraintFailed) {
            return response
                .status(209)
                .json({ message: 'DUPLICATED_KEY', result: false, code: error.code, meta: error.meta });
        } else if (error.code === PrismaErrorCode.FKConstraintFailed) {
            return response
                .status(209)
                .json({ message: 'FK_CONSTRAINT_FAILED', result: false, code: error.code, meta: error.meta });
        } else if (error.code === PrismaErrorCode.NotFound) {
            return response
                .status(209)
                .json({ message: 'NOT_FOUND', result: false, code: error.code, meta: error.meta });
        }
    }

    next(error);
}
