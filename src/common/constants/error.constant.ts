import { ApiMessageLanguage } from '@common/constants/message.constant';

export enum ErrorCode {
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

/**
 * Support multilanguage
 */

export const errorMessage: Record<ErrorCode, ApiMessageLanguage> = {
  [ErrorCode.INVALID_ACCESS_TOKEN]: {
    vi: 'Access token không hợp lệ.',
    en: 'Invalid access token.',
  },
  [ErrorCode.UNAUTHORIZED]: {
    vi: 'Không được phép truy cập tài nguyên này.',
    en: 'Unauthorized.',
  },
};
