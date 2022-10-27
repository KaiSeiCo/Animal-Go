import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isEmpty } from 'lodash';
import { PageResult, Result } from 'src/common/class/result.class';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { OpenApi } from 'src/common/decorator/auth.decorator';
import { ApiException } from 'src/common/exception/api.exception';
import { PageOptionsDto } from 'src/model/dto/page.dto';
import {
  CheckIdTaskDto,
  CreateTaskDto,
  UpdateTaskDto,
} from 'src/model/dto/sys/task.dto';
import Task from 'src/model/entity/sys/task.entity';
import { TaskService } from './task.service';

@ApiTags('任务调度模块')
@ApiBearerAuth()
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOperation({ summary: '任务列表' })
  @OpenApi()
  @Get('')
  async page(@Query() dto: PageOptionsDto): Promise<PageResult<Task>> {
    const [list, count] = await Promise.all([
      this.taskService.page(dto.page - 1, dto.limit),
      this.taskService.count(),
    ]);
    return {
      list,
      pagination: {
        total: count,
        size: dto.limit,
        page: dto.page,
      },
    };
  }

  @ApiOperation({ summary: '添加任务' })
  @Post('')
  async add(@Body() dto: CreateTaskDto): Promise<Result<void>> {
    const serviceCall = dto.service.split('.');
    await this.taskService.checkHasMission(serviceCall[0], serviceCall[1]);
    await this.taskService.addOrUpdate(dto);
    return Result.success();
  }

  @ApiOperation({ summary: '更新任务' })
  @Put('')
  async update(@Body() dto: UpdateTaskDto): Promise<Result<void>> {
    const serviceCall = dto.service.split('.');
    await this.taskService.checkHasMission(serviceCall[0], serviceCall[1]);
    await this.taskService.addOrUpdate(dto);
    return Result.success();
  }

  @ApiOperation({ summary: '任务详情' })
  @Get('info')
  async taskInfo(@Query() dto: CheckIdTaskDto): Promise<Result<Task>> {
    const task = await this.taskService.getTaskDetailById(dto.id);
    return Result.success(task);
  }

  @ApiOperation({ summary: '手动执行一次任务' })
  @Post('once')
  async once(@Body() dto: CheckIdTaskDto): Promise<void> {
    await this.taskService.once(dto.id);
  }

  @ApiOperation({ summary: '停止任务' })
  @Post('stop')
  async stop(@Body() dto: CheckIdTaskDto) {
    const task = await this.taskService.getTaskDetailById(dto.id);
    if (!isEmpty(task)) {
      await this.taskService.stop(task);
    } else {
      throw new ApiException(HttpResponseKeyMap.TASK_NOT_EXISTS);
    }
  }

  @ApiOperation({ summary: '启动任务' })
  @Post('start')
  async start(@Body() dto: CheckIdTaskDto) {
    const task = await this.taskService.getTaskDetailById(dto.id);
    if (!isEmpty(task)) {
      await this.taskService.start(task);
    } else {
      throw new ApiException(HttpResponseKeyMap.TASK_NOT_EXISTS);
    }
  }

  @ApiOperation({ summary: '删除任务' })
  @Delete('delete')
  async delete(@Body() dto: CheckIdTaskDto) {
    await this.taskService.delete(dto.id);
  }
}
