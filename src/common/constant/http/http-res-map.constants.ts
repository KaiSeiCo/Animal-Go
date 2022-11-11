import HttpStatusCode from './http-res-status.constants';

export const HttpResponseKeyMap = {
  /* 200 */
  SUCCESS: 'SUCCESS',
  /* 400 */
  NOT_LOGIN: 'NOT_LOGIN',
  PARAMETER_INVALID: 'PARAMETER_INVALID',
  PERMS_NOT_ALLOWED: 'PERMS_NOT_ALLOWED',
  USER_NOT_EXISTS: 'USER_NOT_EXISTS',
  TASK_NOT_EXISTS: 'TASK_NOT_EXISTS',
  WRONG_PASSWORD: 'WRONG_PASSWORD',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  SERVICE_NOT_MISSION: 'SERVICE_NOT_MISSION',
  INVALID_TOKEN: 'INVALID_TOKEN',
  OPERATION_FAILED: 'OPERATION_FAILED',

  ARTICLE_NOT_EXISTS: 'ARTICLE_NOT_EXISTS',
  /* 500 */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export type HttpResponseKey = keyof typeof HttpResponseKeyMap;

export type HttpResMap = Record<
HttpResponseKey,
  { status: number; code: number; message: string }
>;

export const HttpResponse: HttpResMap = {
  /* 200 */
  SUCCESS: {
    status: HttpStatusCode.OK,
    code: 20000,
    message: 'Success',
  },

  /* 400 */
  NOT_LOGIN: {
    status: HttpStatusCode.UNAUTHORIZED,
    code: 40001,
    message: 'Unauthorized',
  },
  PARAMETER_INVALID: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40002,
    message: 'Invalid Parameter',
  },
  PERMS_NOT_ALLOWED: {
    status: HttpStatusCode.FORBIDDEN,
    code: 40003,
    message: 'Perms Not Allowed',
  },
  USER_NOT_EXISTS: {
    status: HttpStatusCode.NOT_FOUND,
    code: 40004,
    message: 'User Not Exists',
  },
  WRONG_PASSWORD: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40005,
    message: 'Wrong Password',
  },
  USER_ALREADY_EXISTS: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40006,
    message: 'User Already Exists',
  },
  TASK_NOT_EXISTS: {
    status: HttpStatusCode.NOT_FOUND,
    code: 40007,
    message: 'Task Not Exists',
  },
  SERVICE_NOT_MISSION: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40008,
    message: 'Service Has Not Mission',
  },
  INVALID_TOKEN: {
    status: HttpStatusCode.FORBIDDEN,
    code: 40009,
    message: 'Invalid Token',
  },
  OPERATION_FAILED: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40010,
    message: 'Operation Failed'
  },
  ARTICLE_NOT_EXISTS: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 41000,
    message: 'Article Not Exists'
  },
  /* 500 */
  INTERNAL_SERVER_ERROR: {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    code: 50000,
    message: 'Internal Server Error',
  },
};
