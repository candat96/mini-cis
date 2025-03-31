import { Lang } from '@common/classes/response.dto';
import { AppConstants } from '@common/constants/app.constant';
import { ErrorCode, errorMessage } from '@common/constants/error.constant';
import { apiMessage, ApiMessageKey } from '@common/constants/message.constant';
import moment from 'moment-timezone';

export function getCurrentVietnamTimeZone(): Date {
  return moment().tz(AppConstants.VIETNAM_TIMEZONE).toDate();
}

export function toArray(value: any) {
  if (Array.isArray(value)) return value;
  return [value];
}

export function toBoolean(data: string): boolean {
  const value = { true: true, false: false };
  return value[data];
}

export function getApiMessage(key: ApiMessageKey, lang: Lang): string {
  return apiMessage[key][lang];
}

export function getErrorMessage(key: ErrorCode, lang: Lang): string {
  return errorMessage[key][lang];
}
