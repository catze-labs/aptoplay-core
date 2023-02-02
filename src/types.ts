export class AptoPlayError extends Error {
  code?: number;
  response?: any;
  rawError?: any;
}

export interface StatisticVersion {
  statisticName: string;
  version: number;
}

export interface Statistic {
  statisticName: string;
  value: number;
  version: number;
}

export interface AliasSmartContractInfo {
  contractAddress: string;
  contractModuleName: string;
  contractFunctionName: string;
}

type HexEncodedBytes = string;
export interface AptosAccountObject {
  address?: HexEncodedBytes;
  publicKeyHex?: HexEncodedBytes;
  privateKeyHex: HexEncodedBytes;
}
