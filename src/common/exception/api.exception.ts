import { HttpException } from '@nestjs/common';
import { toString } from 'lodash';

export class ApiException extends HttpException {
  private errorCode: number;

  constructor(code: number) {
    super(toString(code), 200);
    this.errorCode = code;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
