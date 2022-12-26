import { HttpException, HttpStatus } from '@nestjs/common';
import {
  HttpResponse,
  HttpResponseKeyMap,
} from '../constant/http-res-map.constants';

export class ApiException extends HttpException {
  private errorCode: number;

  constructor(status: string = HttpResponseKeyMap.OPERATION_FAILED) {
    const response = HttpResponse[status];
    super(response.message, HttpStatus.OK);
    this.errorCode = response.code;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}
