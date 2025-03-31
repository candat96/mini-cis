/**
 * Support multilanguage
 */

export interface ApiMessageLanguage {
  vi: string;
  en: string;
}

export enum ApiMessageKey {
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  REFRESH_TOKEN_SUCCESS = 'REFRESH_TOKEN_SUCCESS',
}

export const apiMessage: Record<ApiMessageKey, ApiMessageLanguage> = {
  [ApiMessageKey.REGISTER_SUCCESS]: {
    vi: 'Đăng ký tài khoản thành công.',
    en: 'Registration successful.',
  },
  [ApiMessageKey.LOGIN_SUCCESS]: {
    vi: 'Đăng nhập thành công.',
    en: 'Logged in successfully.',
  },
  [ApiMessageKey.REFRESH_TOKEN_SUCCESS]: {
    vi: 'Refresh token thành công.',
    en: 'Refresh token successfully.',
  },
};
