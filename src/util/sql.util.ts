import { isNotEmpty } from 'class-validator';
import { isArray, isEmpty, omit } from 'lodash';
import { BaseEntity } from 'src/model/entity/base.entity';
import { SelectQueryBuilder } from 'typeorm';

/**
 * 构建动态 where 语句
 * @param queryBase
 * @param dynamicFields
 * @returns
 */
export function buildDynamicSqlAppendWhere<T>(
  queryBase: SelectQueryBuilder<T>,
  dynamicFields: {
    field: string;
    condition: 'LIKE' | '=' | 'in';
    value: string | string[] | number | number[] | boolean;
  }[],
): SelectQueryBuilder<T> {
  dynamicFields
    .filter((e) => isNotEmpty(e.value))
    .forEach((e) => {
      const { field, condition } = e;
      let { value } = e;
      const assignExp: {
        [key: string]: any;
      } = {};
      // transform boolean
      if (value == 'true' || value == 'false') {
        value = value == 'true' ? 1 : 0;
      }
      // component assign expression
      assignExp[`${field}`] = condition === 'LIKE' ? `%${value}%` : value;

      if (condition === 'in') {
        queryBase.andWhere(`${field} ${condition} (:${field})`, assignExp);
      } else {
        queryBase.andWhere(`${field} ${condition} :${field}`, assignExp);
      }
    });

  return queryBase;
}

/**
 * 去除结果集无用和敏感字段
 * @param result
 * @param fields
 * @returns
 */
export function omitSqlResult<T extends BaseEntity>(
  result: T | Array<T>,
  ...fields: string[]
): Partial<T> | Partial<T>[] | undefined {
  if (isEmpty(result)) {
    return undefined;
  }
  if (isArray(result)) {
    return result.map((r) => omit<T>(r, ['createdAt', 'updatedAt', ...fields]));
  }
  return omit<T>(result, ['createdAt', 'updatedAt', ...fields]);
}
