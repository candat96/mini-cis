import { Lang } from '@common/classes/response.dto';
import { AppConstants } from '@common/constants/app.constant';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Language = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request?.headers[AppConstants.LANG_HEADERS_KEY] || Lang.VI;
  },
);
