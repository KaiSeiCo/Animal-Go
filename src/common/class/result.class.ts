export class Result<T> {
  readonly data: T;
  readonly message: string;
  readonly code: number;

  constructor(data?: T, message?: string, code?: number) {
    this.data = data;
    this.message = message;
    this.code = code;
  }

  static success<T>(data?: T | null) {
    return new Result<T>(data, 'success', 200);
  }
}

export class Pagination {
  total: number;
  page: number;
  size: number;
}

export class PageResult<T> {
  data?: Array<T>;
  pagination: Pagination;
}
