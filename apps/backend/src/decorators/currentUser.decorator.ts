import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '@repo/shared-types';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: AuthRequest = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    if (data && user[data] !== undefined) return user[data];

    const userPayload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
      iat: user.iat,
      exp: user.exp,
    };
    return userPayload;
  },
);
