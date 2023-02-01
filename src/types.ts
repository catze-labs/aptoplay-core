export interface CustomError {
  errorTitle: string;
  code?: number;
  response?: any;
  message?: string;
  errorObject: any;
}
