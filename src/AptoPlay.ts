import axios from 'axios';
import { Statistic, StatisticVersion } from './types';
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
   * Register with Google account.
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
  public async loginWithGoogleAccount(accessToken: string) {
    const email = await getGoogleProfileByAccessToken(accessToken);

    try {
      const playFabRes = await axios.post(
        `${this.baseUrl}/Client/LoginWithGoogleAccount`,
        {
          TitleId: this.titleId,
          CreateAccount: false,
          AccessToken: accessToken
        }
      );

      return parseObjectPascalToCamel({ ...playFabRes.data.data, email });
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_GOOGLE_SOCIAL_LOGIN_ERROR', err);
    }
  }

  /**
   * Validate and Return user's PlayFabId.
   * @param {string} sessionTicket - The sessionTicket generated by PlayFab when user login or register.
   * @returns {string} Return PlayFabId of user.
   */
  public async validateAndGetPlayFabIdBySessionTicket(sessionTicket: string) {
    const path = '/Server/AuthenticateSessionTicket';
    const params = {
      SessionTicket: sessionTicket
    };

    // Send post request
    let response: any;
    try {
      const { data } = await axios.post(this.baseUrl + path, params, {
        headers: {
          'X-SecretKey': this.xSecretKey
        }
      });

      response = data;
    } catch (err) {
      throw generateErrorObject('PLAYFAB_SESSION_TICKET_VALIDATION_ERROR', err);
    }

    const parsedData = parseObjectPascalToCamel(response.data);

    // Check sessionTicket expiry
    if (parsedData['isSessionTicketExpired']) {
      throw generateErrorObject('PLAYFAB_SESSION_TICKET_EXPIRED', {
        isSessionTicketExpired: parsedData.isSessionTicketExpired
      });
    }

    return parsedData.userInfo.playFabId;
  }

  /**
   * Validate and Return user's PlayFabId.
   * @param {string[]} statisticNames - The statisticNames of game statistic. Data type is string array.
   * @param {string} sessionTicket - The sessionTicket generated by PlayFab when user login or register.
   * @returns {object} Return Game data of user, for NFT Metadata.
   */
  public async getGameStatisticsByStatisticNamesForNFTMetadata(
    sessionTicket: string,
    statisticNames: string[]
  ): Promise<any> {
    const uri = '/Client/GetPlayerStatistics';
    const body = {
      StatisticNames: statisticNames
    };
    try {
      const response = await axios.post(this.baseUrl + uri, body, {
        headers: {
          'X-Authorization': sessionTicket
        }
      });

      const data: Statistic[] = response.data.data['statistics'];
      const returnObject: { [k: string]: any } = {};

      const values = data.values();
      for (const value of values) {
        returnObject[value.statisticName] = {
          value: value.value,
          version: value.version
        };
      }

      return returnObject;
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_GET_GAME_DATA_ERROR', err);
    }
  }

  /**
   * Validate and Return user's PlayFabId.
   * @param {StatisticVersion[]} statisticVersions - The statistic versions of game statistic.
   * @param {string} sessionTicket - The sessionTicket generated by PlayFab when user login or register.
   * @returns {object} Return Game data of user, for NFT Metadata.
   */
  public async getGameStatisticsByStatisticVersionsForNFTMetadata(
    sessionTicket: string,
    statisticVersions: StatisticVersion[]
  ): Promise<any> {
    const uri = '/Client/GetPlayerStatistics';
    const body = {
      statisticVersions: statisticVersions.map((v) => {
        return { StatisticName: v.statisticName, Version: v.version };
      })
    };

    try {
      const response = await axios.post(this.baseUrl + uri, body, {
        headers: {
          'X-Authorization': sessionTicket
        }
      });

      const data: Statistic[] = response.data.data['statistics'];
      const returnObject: { [k: string]: any } = {};

      const values = data.values();
      for (const value of values) {
        returnObject[value.statisticName] = {
          value: value.value,
          version: value.version
        };
      }

      return returnObject;
    } catch (err: any) {
      throw generateErrorObject('PLAYFAB_GET_GAME_DATA_ERROR', err);
    }
  }
}
