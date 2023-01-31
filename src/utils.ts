import axios from 'axios';

export function generateErrorObject(
  errorTitle: string,
  errorObject: any
): CustomError {
  const error: CustomError = {
    errorTitle,
    errorObject: {}
  };

  if (axios.isAxiosError(errorObject)) {
    error.errorObject['code'] = errorObject.code;
    error.errorObject['response'] = errorObject.response;
    error.errorObject['message'] = errorObject.message;
  } else {
    error.errorObject = errorObject;
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
    const newKey = key.charAt(0).toLowerCase() + key.slice(1);
    newObject[newKey] = value;
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
