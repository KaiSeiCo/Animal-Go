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
  COMMENT_NOT_EXISTS: 'COMMENT_NOT_EXISTS',
  CAMP_NOT_EXISTS: 'CAMP_NOT_EXISTS',
  MESSAGE_NOT_EXISTS: 'MESSAGE_NOT_EXISTS',
  ALREADY_JOINED: 'ALREADY_JOINED',
  /* 500 */
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

export type HttpResponseKey = keyof typeof HttpResponseKeyMap;

export type HttpResMap = Record<
  HttpResponseKey,
  { code: number; message: string }
>;

export const HttpResponse: HttpResMap = {
  /* 200 */
  SUCCESS: {
    code: 20000,
    message: 'Success',
  },

  /* 400 */
  NOT_LOGIN: {
    code: 40001,
    message: 'Unauthorized',
  },
  PARAMETER_INVALID: {
    code: 40002,
    message: 'Invalid Parameter',
  },
  PERMS_NOT_ALLOWED: {
    code: 40003,
    message: 'Perms Not Allowed',
  },
  USER_NOT_EXISTS: {
    code: 40004,
    message: 'User Not Exists',
  },
  WRONG_PASSWORD: {
    code: 40005,
    message: 'Wrong Password',
  },
  USER_ALREADY_EXISTS: {
    code: 40006,
    message: 'User Already Exists',
  },
  TASK_NOT_EXISTS: {
    code: 40007,
    message: 'Task Not Exists',
  },
  SERVICE_NOT_MISSION: {
    code: 40008,
    message: 'Service Has Not Mission',
  },
  INVALID_TOKEN: {
    code: 40009,
    message: 'Invalid Token',
  },
  OPERATION_FAILED: {
    code: 40010,
    message: 'Operation Failed',
  },
  ARTICLE_NOT_EXISTS: {
    code: 40401,
    message: 'Article Not Exists',
  },
  COMMENT_NOT_EXISTS: {
    code: 40402,
    message: 'Comment Not Exists',
  },
  CAMP_NOT_EXISTS: {
    code: 40403,
    message: 'Camp Not Exists',
  },
  MESSAGE_NOT_EXISTS: {
    code: 40404,
    message: 'Message Not Exists',
  },
  ALREADY_JOINED: {
    code: 41001,
    message: 'User Already Joined Camp',
  },
  /* 500 */
  INTERNAL_SERVER_ERROR: {
    code: 50000,
    message: 'Internal Server Error',
  },
};
