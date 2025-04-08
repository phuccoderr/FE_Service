export type ApiResponseType<T> = {
  statusCode: number;
  message: string;
  data: T;
  error: string[];
};
