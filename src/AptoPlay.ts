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

  /**
   * Represents a book.
   * @constructor
   * @param {string} titleId - The title ID of your PlayFab Title.
   * @param {string} xSecretKey - The X-SECRET-KEY of your PlayFab Title.
   */
  constructor(titleId: string, xSecretKey: string) {
    this.titleId = titleId;
    this.xSecretKey = xSecretKey;
    this.baseUrl = `https://${titleId}.playfabapi.com`;
  }

  /**
   * Get title ID of your PlayFab Title.
   * @returns {string} Return title ID of your PlayFab Title.
   */
  public getTitleId(): string {
    return this.titleId;
  }

  /**
   * Get X-SECRET_KEY of your PlayFab Title.
   * @returns {string} Return X-SECRET_KEY of your PlayFab Title.
   */
  public getXSecretKey(): string {
    return this.xSecretKey;
  }

  /**
   * Get API Endpoint of your PlayFab Title.
   * @returns {string} Return API Endpoint of your PlayFab Title.
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Register a PlayFab User.
   * @param {string} email - The email of user.
   * @param {string} password - The password of user.
   * @param {string} username - The username of user.
   * @returns {object} Return PlayFab register user result data.
   */
  public async registerUser(
    email: string,
    password: string,
    username?: string
  ) {
    try {
      const res = await axios.post(
        this.baseUrl + '/Client/RegisterPlayFabUser',
        {
          TitleId: this.titleId,
          Email: email,
          Password: password,
          // Username: PlayFab username for the account (3-20 characters)
          Username: username ? username : new Date().getTime().toString()
        }
      );

      return parseObjectPascalToCamel(res.data.data);
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_REGISTER_WITH_EMAIL_ERROR', err);
    }
  }

  /**
   * Login with email and password.
   * @param {string} email - The email of user.
   * @param {string} password - The password of user.
   * @returns {object} Return PlayFab user data.
   */
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

      return parseObjectPascalToCamel(res.data.data);
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_LOGIN_WITH_EMAIL_ERROR', err);
    }
  }

  /**
   * Login with Google account.
   * @param {string} accessToken - The access token of Google account.
   * @returns {object} Return PlayFab register user result data.
   */
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

      return parseObjectPascalToCamel({ ...playFabRes.data.data, email });
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_GOOGLE_SOCIAL_REGISER_ERROR', err);
    }
  }
}
