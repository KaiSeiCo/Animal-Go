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
    message: 'Perms not allowed',
  },
  USER_NOT_EXISTS: {
    status: HttpStatusCode.NOT_FOUND,
    code: 40004,
    message: 'User not exists',
  },
  WRONG_PASSWORD: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40005,
    message: 'Wrong password',
  },
  USER_ALREADY_EXISTS: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40006,
    message: 'User already exists',
  },
  TASK_NOT_EXISTS: {
    status: HttpStatusCode.NOT_FOUND,
    code: 40007,
    message: 'Task not exists',
  },
  SERVICE_NOT_MISSION: {
    status: HttpStatusCode.BAD_REQUEST,
    code: 40008,
    message: 'Service has not mission',
  },

  /* 500 */
  INTERNAL_SERVER_ERROR: {
    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
    code: 50000,
    message: 'Internal Server Error',
  },
};
