import { ApiProperty } from '@nestjs/swagger';
import * as parser from 'cron-parser';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'isCronExpression', async: false })
export class isCronExpression implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean | Promise<boolean> {
    try {
      if (isEmpty(value)) {
        throw new Error('cron expression is empty');
      }
      parser.parseExpression(value);
      return true;
    } catch {
      return false;
    }
  }
  defaultMessage(args?: ValidationArguments): string {
    return `cron expression '${args}' invalid`;
  }
}

export class CreateTaskDto {
  @ApiProperty({ description: '任务名称' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ description: '调用服务 expression: { classname.method }' })
  @IsString()
  @MinLength(1)
  service: string;

  @ApiProperty({ description: '任务类型: 定时任务 or 间歇任务' })
  @IsIn([0, 1])
  type: number;

  @ApiProperty({ description: '任务状态' })
  @IsIn([0, 1])
  status: number;

  @ApiProperty({ description: '开始时间' })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.startTime))
  startTime: string;

  @ApiProperty({ description: '结束时间' })
  @IsDateString()
  @ValidateIf((o) => !isEmpty(o.endTime))
  endTime: string;

  @ApiProperty({ description: '限制执行次数，负数则无限制' })
  @IsInt()
  @IsOptional()
  readonly limit: number = -1;

  @ApiProperty({ description: 'cron 表达式' })
  @Validate(isCronExpression)
  @ValidateIf((o) => o.type === 0)
  cron: string;

  @ApiProperty({ description: '执行间隔ms' })
  @IsInt()
  @Min(100, { message: '执行间隔不能小于100ms' })
  @ValidateIf((o) => o.type === 1)
  every: number;

  @ApiProperty({ description: '执行参数' })
  @IsOptional()
  @IsString()
  data: string;

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @IsString()
  remark: string;
}

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ description: '需要更新的任务ID' })
  @IsInt()
  @Min(0)
  id: number;
}

export class CheckIdTaskDto {
  @ApiProperty({ description: '任务ID' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  id: number;
}
