import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReqUser } from '../../types/current-user.type.js';

export const CurrentUser = createParamDecorator(
    (data: keyof ReqUser, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        return data ? request.user?.[data] : request.user;
    },
);