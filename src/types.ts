export class AptoPlayError extends Error {
  code?: number;
  response?: any;
  rawError: any;
}

export interface StatisticVersion {
  statisticName: string;
  version: number;
}
