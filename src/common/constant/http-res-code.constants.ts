export const CustomHttpCode: Record<
  string,
  { code: number; message: string }
> = {
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

  /* 500 */
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
