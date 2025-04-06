import {
    Catch,
    HttpStatus,
    HttpException,
    ArgumentsHost,
    ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const statusCode = exception.getStatus
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorMessage = exception.message || 'Something went wrong, retry later!';
        const exceptionResponse = exception.getResponse() as { error_code?: string, message?: string | unknown }
        const validatorsErrors = exceptionResponse?.message && typeof exceptionResponse.message !== "string" ? exceptionResponse.message : undefined
        const errorCode = exceptionResponse?.error_code

        response.status(statusCode).json({
            status: statusCode,
            error_code: errorCode,
            message: errorMessage,
            errors: validatorsErrors,
            meta: {
                path: request.url,
                timestamp: new Date().toISOString(),
            }
        });
    }
}
