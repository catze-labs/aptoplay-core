import axios from 'axios';
import { AptoPlayError } from './types';

export function generateErrorObject(
  errorName: string,
  errorObject?: any
): AptoPlayError {
  const error: AptoPlayError = new AptoPlayError();

  error.name = errorName;
  error.message = errorObject?.message || '';

  if (errorObject) {
    error.rawError = errorObject;
  }

  if (axios.isAxiosError(errorObject)) {
    error.rawError['code'] = errorObject.code;
    error.rawError['response'] = errorObject.response;
    error.rawError['message'] = errorObject.message;
  }

  return error;
}

export function parseObjectPascalToCamel(object: { [k: string]: any }): {
  [k: string]: any;
} {
  const newObject: any = {};

  const keys = Object.keys(object);
  for (let key of keys) {
    const value = object.hasOwnProperty(key) ? object[key] : undefined;

    if (typeof value === 'object') {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObject[newKey] = parseObjectPascalToCamel(value);
    } else {
      const newKey = key.charAt(0).toLowerCase() + key.slice(1);
      newObject[newKey] = value;
    }
  }

  return newObject;
}

export async function getGoogleProfileByAccessToken(
  accessToken: string
): Promise<string> {
  try {
    const userInfoRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        params: {
          access_token: accessToken
        }
      }
    );

    return userInfoRes.data.email;
  } catch (err: any) {
    throw generateErrorObject('GOOGLE_GET_PROFILE_ERROR', err);
  }
}

export function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0;
}
