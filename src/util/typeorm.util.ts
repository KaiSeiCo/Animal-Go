import { isNotEmpty } from 'class-validator';
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
    condition: 'LIKE' | '=';
    value: any;
    fuzzy?: boolean;
  }[],
) {
  queryBase.where('1=1');
  dynamicFields
    .filter((e) => isNotEmpty(e.value))
    .forEach((e) => {
      const { field, condition, value, fuzzy } = e;
      const assignExp: {
        [key: string]: any;
      } = {};
      assignExp[`${field}`] = fuzzy ? `%${value}%` : value;
      queryBase.andWhere(`${field} ${condition} :${field}`, assignExp);
    });

  return queryBase;
}
