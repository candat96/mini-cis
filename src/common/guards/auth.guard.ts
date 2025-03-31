import { Lang } from '@common/classes/response.dto';
import { AppConstants } from '@common/constants/app.constant';
import { ErrorCode } from '@common/constants/error.constant';
import { getErrorMessage } from '@common/utils/utils';
import { Config } from '@config/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface IAccessTokenAuth {
  _id: string;
  name: string;
  avatar: string;
  role: any; // Todo: Replace any with role enum if it exists
}

export interface IAccessTokenPayload {
  user: IAccessTokenAuth;
  iat: number;
  exp: number;
}

export interface IRefreshTokenAuth {
  _id: string;
}

export interface IRefreshTokenPayload {
  user: IRefreshTokenAuth;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const headersLang = request.headers?.[AppConstants.LANG_HEADERS_KEY];
    const lang = Lang[headersLang] || Lang.EN;

    if (!token) {
      throw new UnauthorizedException(getErrorMessage(ErrorCode.UNAUTHORIZED, lang));
    }

    try {
      const { user }: IAccessTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: Config.JWT_SECRET,
        },
      );

      if (!user?._id || !user?.role) {
        throw new UnauthorizedException(
          getErrorMessage(ErrorCode.INVALID_ACCESS_TOKEN, lang),
        );
      }

      request['auth'] = user;

      return true;
    } catch {
      throw new UnauthorizedException(
        getErrorMessage(ErrorCode.INVALID_ACCESS_TOKEN, lang),
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers?.[AppConstants.AUTH_HEADERS_KEY]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
