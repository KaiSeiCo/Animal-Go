import { HttpException } from '@nestjs/common';
import { toString } from 'lodash';
import { HttpResponse } from '../constant/http/http-res-map.constants';

export class ApiException extends HttpException {
  private errorCode: number;
  private errorMsg: string;

  constructor(status: string) {
    const response = HttpResponse[status];
    super(toString(response.code), response.status);
    this.errorCode = response.code;
    this.errorMsg = response.message;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMsg;
  }
}
