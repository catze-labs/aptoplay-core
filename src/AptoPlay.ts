import axios from 'axios';
import {
  generateErrorObject,
  getGoogleProfileByAccessToken,
  parseObjectPascalToCamel
} from './utils';

export class AptoPlay {
  private titleId: string;
  private xSecretKey: string;
  private baseUrl: string;

  constructor(titleId: string, xSecretKey: string) {
    this.titleId = titleId;
    this.xSecretKey = xSecretKey;
    this.baseUrl = `https://${titleId}.playfabapi.com`;
  }

  public getTitleId(): string {
    return this.titleId;
  }

  public getXSecretKey(): string {
    return this.xSecretKey;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async registerUser(email: string, password: string) {
    try {
      const res = await axios.post(
        this.baseUrl + '/Client/RegisterPlayFabUser',
        {
          TitleId: this.titleId,
          Email: email,
          Password: password,
          Username: new Date().getTime().toString() // Username: PlayFab username for the account (3-20 characters)
        }
      );

      const data = parseObjectPascalToCamel(res.data);

      return parseObjectPascalToCamel(data);
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_REGISTER_WITH_EMAIL_ERROR', err);
    }
  }

  public async login(email: string, password: string) {
    try {
      const res = await axios.post(
        this.baseUrl + '/Client/LoginWithEmailAddress',
        {
          TitleId: this.titleId,
          Email: email,
          Password: password
        }
      );

      const data = parseObjectPascalToCamel(res.data);

      return parseObjectPascalToCamel(data);
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_LOGIN_WITH_EMAIL_ERROR', err);
    }
  }

  public async registerWithGoogleAccount(accessToken: string) {
    const email = await getGoogleProfileByAccessToken(accessToken);

    try {
      const playFabRes = await axios.post(
        `${this.baseUrl}/Client/LoginWithGoogleAccount`,
        {
          TitleId: this.titleId,
          CreateAccount: true,
          AccessToken: accessToken
        }
      );

      return parseObjectPascalToCamel({ ...playFabRes, email });
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_GOOGLE_SOCIAL_REGISER_ERROR', err);
    }
  }
}
