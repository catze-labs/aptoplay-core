import axios from 'axios';
import { AliasSmartContractInfo, Statistic, StatisticVersion } from './types';
import {
  generateErrorObject,
  getGoogleProfileByAccessToken,
  isEmptyObject,
  parseObjectPascalToCamel
} from './utils';

import {
  AptosClient,
  FaucetClient,
  CoinClient,
  AptosAccount,
  AptosAccountObject,
  TxnBuilderTypes,
  BCS,
  TokenClient,
  getAddressFromAccountOrAddress
} from 'aptos';

export class AptoPlay {
  private titleId: string;
  private xSecretKey: string;
  private baseUrl: string;

  private aptosNodeUrl: string;
  private aptosClient: AptosClient;

  private faucetUrl: string;
  private faucetClient: FaucetClient;

  private aliasSmartContractInfoObject: { [k: string]: AliasSmartContractInfo };

  private systemAccountObject: AptosAccountObject | null;

  /**
   * Represents a book.
   * @constructor
   * @param {string} titleId - The title ID of your PlayFab Title.
   * @param {string} xSecretKey - The X-SECRET-KEY of your PlayFab Title.
   * @param {string} aptosNodeUrl - The Aptos Node URL.
   * @param {string} faucetUrl - The Aptos Faucet URL.
   * @param {object} aliasSmartContractInfoObject - The smart contract list object. {'alias': 'contract address'}
   * @param {AptosAccountObject} systemAccountObject - The system Aptos Account object.
   */
  constructor(
    titleId: string,
    xSecretKey: string,
    aptosNodeUrl: string = 'https://fullnode.devnet.aptoslabs.com',
    faucetUrl: string = 'https://faucet.devnet.aptoslabs.com',
    aliasSmartContractInfoObject?: { [k: string]: AliasSmartContractInfo },
    systemAccountObject?: AptosAccountObject
  ) {
    this.titleId = titleId;
    this.xSecretKey = xSecretKey;
    this.baseUrl = `https://${titleId}.playfabapi.com`;
    this.aptosNodeUrl = aptosNodeUrl;
    this.aptosClient = new AptosClient(aptosNodeUrl);

    this.faucetUrl = faucetUrl;
    this.faucetClient = new FaucetClient(aptosNodeUrl, faucetUrl);

    this.aliasSmartContractInfoObject = aliasSmartContractInfoObject
      ? aliasSmartContractInfoObject
      : {};

    this.systemAccountObject = systemAccountObject ? systemAccountObject : null;
  }

  /**
   *
   * @param {string} aptosNodeUrl - The Aptos Node URL.
   * @param {string} faucetUrl - The Aptos Faucet URL.
   * @param {object} aliasSmartContractInfoObject - The smart contract list object. {'alias': 'contract address'}
   * @param {AptosAccountObject} systemAccountObject - The system Aptos Account object.
   */
  public setAptosInformation(
    aptosNodeUrl: string = 'https://fullnode.devnet.aptoslabs.com',
    faucetUrl: string = 'https://faucet.devnet.aptoslabs.com',
    aliasSmartContractInfoObject: { [k: string]: AliasSmartContractInfo },
    systemAccountObject: AptosAccountObject
  ) {}

  /**
   * @param {string} aptosNodeUrl - The Aptos Node URL.
   * @param {string} faucetUrl - The Aptos Faucet URL.
   */
  public setAptosNodeAndFaucetUrl(aptosNodeUrl: string, faucetUrl: string) {
    this.aptosNodeUrl = aptosNodeUrl;
    this.aptosClient = new AptosClient(aptosNodeUrl);
    this.faucetUrl = faucetUrl;
    this.faucetClient = new FaucetClient(aptosNodeUrl, faucetUrl);
  }

  /**
   * @param {object} aliasSmartContractInfoObject - The smart contract list object. {'alias': 'contract address'}
   */
  public setAliasSmartContractInfoObject(aliasSmartContractInfoObject: {
    [k: string]: AliasSmartContractInfo;
  }) {
    this.aliasSmartContractInfoObject = aliasSmartContractInfoObject;
  }

  /**
   * @param {AptosAccountObject} systemAccountObject - The system Aptos Account object.
   */
  public setAptosSystemAccountObject(systemAccountObject: AptosAccountObject) {
    this.systemAccountObject = systemAccountObject;
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
   * Get Aptos Node URL.
   * @returns {string} Return Aptos Node Url when you initialized AptoPlay Object.
   */
  public getAptosNodeUrl(): string {
    return this.aptosNodeUrl ? this.aptosNodeUrl : '';
  }

  /**
   * Get Aptos Faucet URL.
   * @returns {string} Return Aptos Faucet Url when you initialized AptoPlay Object.
   */
  public getFaucetUrl(): string {
    return this.faucetUrl ? this.faucetUrl : '';
  }

  /**
   * Get Smart Contract Alias-Address Object.
   * @returns {object | null} Return Smart Contract Alias-Address object when you initialized AptoPlay Object. If not initialized, return null.
   */
  public getAliasSmartContractInfoObject(): {
    [k: string]: AliasSmartContractInfo;
  } | null {
    return this.aliasSmartContractInfoObject
      ? this.aliasSmartContractInfoObject
      : null;
  }

  /**
   * Get System Account Object.
   * @returns {object | null} Return System Account object when you initialized AptoPlay Object. If not initialized, return null.
   */
  public getSystemAccountObject(): AptosAccountObject | null {
    return this.systemAccountObject ? this.systemAccountObject : null;
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
      throw generateErrorObject('PLAYFAB_GOOGLE_SOCIAL_REGISTER_ERROR', err);
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
   * Get User's Game Statistics by Statistic Names.
   * @param {string} sessionTicket - The sessionTicket generated by PlayFab when user login or register.
   * @param {string[]} statisticNames - The statisticNames of game statistic. Data type is string array.
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

      const parsedData = parseObjectPascalToCamel(response.data.data);
      const data = parsedData['statistics'];
      const returnObject: { [k: string]: any } = {};

      const keys = Object.keys(data);
      for (const k of keys) {
        const value = data[k];
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
   * Get User's Game Statistics by Statistic Versions.
   * @param {string} sessionTicket - The sessionTicket generated by PlayFab when user login or register.
   * @param {StatisticVersion[]} statisticVersions - The statistic versions of game statistic.
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

      const parsedData = parseObjectPascalToCamel(response.data.data);
      const data = parsedData['statistics'];
      const returnObject: { [k: string]: any } = {};

      const keys = Object.keys(data);
      for (const k of keys) {
        const value = data[k];
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

  async mintToSystemWallet(smartContractAlias: string): Promise<string> {
    // Validate smart contract alias
    if (
      !this.aliasSmartContractInfoObject ||
      isEmptyObject(this.aliasSmartContractInfoObject)
    ) {
      throw generateErrorObject('SMART_CONTRACT_ALIAS_ADDRESS_NOT_FOUND', {
        message: 'Smart contract alias address not found.'
      });
    }

    // Validate system account
    if (!this.systemAccountObject || isEmptyObject(this.systemAccountObject)) {
      throw generateErrorObject('SYSTEM_ACCOUNT_NOT_FOUND', {
        message: 'System account not found.'
      });
    }

    const contractInfo = this.aliasSmartContractInfoObject[smartContractAlias];
    const systemAccount = AptosAccount.fromAptosAccountObject(
      this.systemAccountObject
    );

    // Make Payload
    const entryFunctionPayload =
      new TxnBuilderTypes.TransactionPayloadEntryFunction(
        new TxnBuilderTypes.EntryFunction(
          // Fully qualified module name, `AccountAddress::ModuleName`
          TxnBuilderTypes.ModuleId.fromStr(
            `0x${contractInfo.contractAddress}::${contractInfo.contractModuleName}`
          ),
          // Module function
          new TxnBuilderTypes.Identifier(
            `${contractInfo.contractFunctionName}`
          ),
          [],
          []
        )
      );

    try {
      // Get Sequence Number and Chain ID
      const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
        this.aptosClient.getAccount(systemAccount.address()),
        this.aptosClient.getChainId()
      ]);

      // Make Raw Tx
      const rawTransaction = new TxnBuilderTypes.RawTransaction(
        // Transaction sender account address
        TxnBuilderTypes.AccountAddress.fromHex(systemAccount.address()),
        BigInt(sequenceNumber),
        entryFunctionPayload,
        // Max gas unit to spend
        BigInt(200_000),
        // Gas price per unit
        BigInt(100),
        // Expiration timestamp. Transaction is discarded if it is not executed within 10 seconds from now.
        BigInt(Math.floor(Date.now() / 1000) + 10),
        new TxnBuilderTypes.ChainId(chainId)
      );

      // Serialize Raw Tx
      const bcsTxn = AptosClient.generateBCSTransaction(
        systemAccount,
        rawTransaction
      );

      // Send transaction
      const txRes = await this.aptosClient.submitSignedBCSTransaction(bcsTxn);

      // Wait for transaction to be executed
      const transaction = await this.aptosClient.waitForTransactionWithResult(
        txRes.hash
      );
      return transaction.hash;
    } catch (err) {
      throw generateErrorObject('APTOS_MINT_TO_SYSTEM_WALLET_ERROR', err);
    }
  }
}
