import axios from 'axios';
import { parseObjectPascalToCamel } from './utils';

export class AptoPlay {
  private titleId: string;
  private xSecretKey: string;
  private baseUrl: string;

  constructor(titleId: string, xSecretKey: string) {
    this.titleId = titleId;
    this.xSecretKey = xSecretKey;
    this.baseUrl = `https://${this.titleId}.playfabapi.com`;
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

  public async registerUser(
    email: string,
    password: string,
    callback?: (data: any) => any
  ) {
    const res = await axios.post(this.baseUrl + '/Client/RegisterPlayFabUser', {
      TitleId: this.titleId,
      Email: email,
      Password: password,
      Username: new Date().getTime().toString() // Username: PlayFab username for the account (3-20 characters)
    });

    const data = parseObjectPascalToCamel(res.data);

    if (callback) {
      callback(data);
    }

    return parseObjectPascalToCamel(data);
  }

  public async login(
    email: string,
    password: string,
    callback?: (data: any) => any
  ) {
    const res = await axios.post(
      this.baseUrl + '/Client/LoginWithEmailAddress',
      {
        TitleId: this.titleId,
        Email: email,
        Password: password
      }
    );

    const data = parseObjectPascalToCamel(res.data);

    if (callback) {
      callback(data);
    }

    return parseObjectPascalToCamel(data);
  }
}
