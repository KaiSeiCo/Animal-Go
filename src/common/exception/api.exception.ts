import { HttpException } from '@nestjs/common';
import {
  HttpCodeMap,
  HttpCodeMapType,
} from '../constant/http-res-code.constants';

export class ApiException extends HttpException {
  private errorCode: HttpCodeMapType;

  constructor(code: HttpCodeMapType) {
    super(HttpCodeMap[code], 200);
    this.errorCode = code;
  }

  getErrorCode(): HttpCodeMapType {
    return this.errorCode;
  }
}
