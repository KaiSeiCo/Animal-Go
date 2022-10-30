import { HttpException } from '@nestjs/common';
import { HttpResponse } from '../constant/http/http-res-map.constants';

export class ApiException extends HttpException {
  private errorCode: number;

  constructor(status: string) {
    const response = HttpResponse[status];
    super(response.message, response.status);
    this.errorCode = response.code;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
