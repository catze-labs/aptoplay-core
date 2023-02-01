export class AptoPlayError extends Error {
  code?: number;
  response?: any;
  rawError: any;
}
