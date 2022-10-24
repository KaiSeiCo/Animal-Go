export const HttpCodeMap = {
  20000: 'Success',
  // 400
  40001: 'Unauthorized',
  40002: 'Invalid Parameter',
  40003: 'Perms not allowed',
  41004: 'User not exists',
  41005: 'Wrong password',
  41006: 'User already exists',
  // 500
  50000: 'Internal Server Error',
  50001: 'Bad Operation',
  50002: 'Invalid Parameter Format',
};

export type HttpCodeMapType = keyof typeof HttpCodeMap;

export const CustomHttpCode: Record<
  string,
  { code: HttpCodeMapType; message: string }
> = {
  SUCCESS: {
    code: 20000,
    message: 'Success',
  },
  NOT_LOGIN: {
    code: 40001,
    message: 'Unauthorized',
  },
  PARAMETER_INVALID: {
    code: 40002,
    message: 'Invalid Parameter',
  },
  UNAUTHORIZED: {
    code: 40003,
    message: 'Perms not allowed',
  },
  USER_NOT_EXISTS: {
    code: 41004,
    message: 'User not exists',
  },
  WRONG_PASSWORD: {
    code: 41005,
    message: 'Wrong password',
  },
  USER_ALREADY_EXISTS: {
    code: 41006,
    message: 'User already exists',
  },
  INTERNAL_SERVER_ERROR: {
    code: 50000,
    message: 'Internal Server Error',
  },
  OPERATION_FAILED: {
    code: 50001,
    message: 'Bad Operation',
  },
  INVALID_PARAMETER_FORMAT: {
    code: 50002,
    message: 'Invalid Parameter Format',
  },
};
