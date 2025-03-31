import { AppConstants } from '@common/constants/app.constant';
import { Config } from '@config/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface IAccessTokenAuth {
  id: string;
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
  id: string;
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

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const { user }: IAccessTokenPayload = await this.jwtService.verifyAsync(
        token,
        {
          secret: Config.JWT_SECRET,
        },
      );

      if (!user?.id || !user?.role) {
        throw new UnauthorizedException('Invalid access token');
      }

      request['auth'] = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers?.[AppConstants.AUTH_HEADERS_KEY]?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
