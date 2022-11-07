import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import type { CronRepeatOptions, EveryRepeatOptions, Job } from 'bull';
import { Queue } from 'bull';
import {
  SYSTEM_MISSION_KEY,
  SYSTEM_TASK_QUEUE_NAME,
  SYSTEM_TASK_QUEUE_PREFIX,
} from 'src/common/constant/system.constant';
import { UnknownElementException } from '@nestjs/core/errors/exceptions/unknown-element.exception';
import { ApiException } from 'src/common/exception/api.exception';
import {
  CreateTaskDto,
  UpdateTaskDto,
} from 'src/module/admin/system/task/task.dto';
import Task from 'src/model/entity/sys/task.entity';
import { LoggerService } from 'src/global/logger/logger.service';
import { RedisService } from 'src/global/redis/redis.service';
import { toString, isEmpty } from 'lodash';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { TaskRepository } from 'src/model/repository/sys/task.repository';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    private taskRepository: TaskRepository,
    @InjectQueue(SYSTEM_TASK_QUEUE_NAME)
    private queue: Queue,
    private moduleRef: ModuleRef,
    private reflector: Reflector,
    private redisService: RedisService,
    private logger: LoggerService,
  ) {}

  /**
   * @Override module init exec
   */
  async onModuleInit() {
    await this.initTask();
  }

  /**
   * init task
   * @returns
   */
  async initTask(): Promise<void> {
    const initKey = `${SYSTEM_TASK_QUEUE_PREFIX}:initialize`;
    // lock
    const result = await this.redisService
      .getRedis()
      .multi()
      .setnx(initKey, new Date().getTime())
      .expire(initKey, 60 * 30)
      .exec();

    // locked, skip initialize process
    if (result[0][1] === 0) {
      this.logger.log('[Bull] init task resource is locked', TaskService.name);
      return;
    }

    const jobs = await this.getAllStatusOfTasks();

    // remove tasks that already exists
    for (let i = 0; i < jobs.length; i++) {
      await jobs[i].remove();
    }

    // find tasks need to running
    const tasks = await this.taskRepository.find({
      where: { status: 1 },
    });
    if (tasks && tasks.length > 0) {
      for (const t of tasks) {
        await this.start(t);
      }
    }
    this.logger.log(`[Bull] initialize task done.`);
  }

  /**
   * stop task
   * @param task
   * @returns
   */
  async stop(task: Task): Promise<void> {
    if (!task) {
      throw new Error('[Bull] Task is Empty');
    }
    const exist = await this.existJob(task.id.toString());
    if (!exist) {
      // update task status in db
      await this.taskRepository.update(task.id, { status: 0 });
      return;
    }
    const jobs: Job<any>[] = await this.getAllStatusOfTasks();
    // remove task in queue
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].data.id === task.id) {
        await jobs[i].remove();
      }
    }
    // update task status in db
    await this.taskRepository.update(task.id, { status: 0 });
  }

  /**
   * start task
   * @param task
   */
  async start(task: Task): Promise<void> {
    if (!task) {
      throw new Error('[Bull] Task is Empty');
    }
    // stop tasks that already exists
    await this.stop(task);
    let repeat: CronRepeatOptions | EveryRepeatOptions;
    // if type === 1, repeat every millis
    if (task.type === 1) {
      repeat = {
        every: task.every,
      };
    }
    // else, repeat by cron expression
    else {
      repeat = {
        cron: task.cron,
      };
      if (task.startTime) {
        repeat.startDate = task.startTime;
      }
      if (task.endTime) {
        repeat.endDate = task.endTime;
      }
    }
    if (task.limit > 0) {
      repeat.limit = task.limit;
    }
    // add task to queue
    const job = await this.queue.add(
      { id: task.id, service: task.service, args: task.data },
      { jobId: task.id, removeOnComplete: true, removeOnFail: true, repeat },
    );

    if (job && job.opts) {
      // save job option and set job status = 1
      await this.taskRepository.update(task.id, {
        jobOpts: JSON.stringify(job.opts.repeat),
        status: 1,
      });
    } else {
      // start fail, set task status to 0
      job && (await job.remove());
      await this.taskRepository.update(task.id, { status: 0 });
      throw new Error('[Bull] Task start failed');
    }
  }

  /**
   * check job exists in task queue
   * @param jobId
   */
  async existJob(jobId: string): Promise<boolean> {
    // find repeatable jobs
    const jobs = await this.queue.getRepeatableJobs();
    const job_ids = jobs.map((e) => {
      return e.id;
    });
    return job_ids.includes(jobId);
  }

  /**
   * get all status tasks in queue
   * @returns
   */
  async getAllStatusOfTasks(): Promise<Job<any>[]> {
    return await this.queue.getJobs([
      'active',
      'delayed',
      'failed',
      'paused',
      'waiting',
      'completed',
    ]);
  }

  /**
   * page query
   * @param page
   * @param count
   */
  async page(page: number, count: number): Promise<Task[]> {
    const result = await this.taskRepository.find({
      order: {
        id: 'ASC',
      },
      take: count,
      skip: page * count,
    });
    return result;
  }

  /**
   * task count
   * @returns
   */
  async count() {
    return await this.taskRepository.count();
  }

  /**
   * task detail
   * @param id
   * @returns
   */
  async getTaskDetailById(id: number): Promise<Task> {
    return await this.taskRepository.findOne({
      where: { id },
    });
  }

  /**
   * delete task
   * @param task
   */
  async delete(id: number): Promise<void> {
    const task = await this.getTaskDetailById(id);
    if (!task) {
      throw new Error('Task is empty');
    }
    await this.stop(task);
    await this.taskRepository.delete(task.id);
  }

  /**
   * run once
   * @param task
   */
  async once(id: number): Promise<void | never> {
    const task = await this.getTaskDetailById(id);
    if (task) {
      await this.queue.add(
        { id: task.id, service: task.service, args: task.data },
        { jobId: task.id, removeOnComplete: true, removeOnFail: true },
      );
    } else {
      throw new Error('Task is empty');
    }
  }

  /**
   * add task, start or stop according to task status
   * @param param
   */
  async addOrUpdate(param: CreateTaskDto | UpdateTaskDto): Promise<void> {
    const result = await this.taskRepository.save(param);
    const task = await this.getTaskDetailById(result.id);
    if (result.status === 0) {
      await this.stop(task);
    } else if (result.status === 1) {
      await this.start(task);
    }
  }

  /**
   * queue task done, stop and remove task
   * @param task_id
   */
  async updateTaskCompleteStatus(task_id: number): Promise<void> {
    const jobs = await this.queue.getRepeatableJobs();
    const task = await this.taskRepository.findOne({
      where: { id: task_id },
    });
    for (const job of jobs) {
      const currentTime = new Date().getTime();
      if (job.id === toString(task_id) && job.next < currentTime) {
        await this.stop(task);
        break;
      }
    }
  }

  /**
   * check service has @Misson
   * @param nameOrInstance
   * @param exec
   */
  async checkHasMission(
    nameOrInstance: string | unknown,
    exec: string,
  ): Promise<void | never> {
    try {
      let service: any;
      if (typeof nameOrInstance === 'string') {
        service = await this.moduleRef.get(nameOrInstance, { strict: false });
      } else {
        service = nameOrInstance;
      }
      // task not exists
      if (!service || !(exec in service)) {
        throw new ApiException(HttpResponseKeyMap.TASK_NOT_EXISTS);
      }
      // check @Mission
      const hasMission = this.reflector.get<boolean>(
        SYSTEM_MISSION_KEY,
        service.constructor,
      );
      if (!hasMission) {
        throw new ApiException(HttpResponseKeyMap.SERVICE_NOT_MISSION);
      }
    } catch (e) {
      // task not exist
      if (e instanceof UnknownElementException) {
        throw new ApiException(HttpResponseKeyMap.SERVICE_NOT_MISSION);
      } else {
        throw e;
      }
    }
  }

  /**
   * 根据 serviceName 调用 service
   * @param serviceName
   * @param args
   */
  async callService(serviceName: string, args: string) {
    if (serviceName) {
      const arr = serviceName.split('.');
      if (arr.length < 1) {
        throw new Error('serviceName define error');
      }
      const methodName = arr[1];
      const service = await this.moduleRef.get(arr[0], { strict: false });
      // security save
      await this.checkHasMission(service, methodName);
      if (isEmpty(args)) {
        await service[methodName]();
      } else {
        // args parse to json
        const parseArgs = this.safeParse(args);
        // method callback
        if (Array.isArray(parseArgs)) {
          await service[methodName](...parseArgs);
        } else {
          await service[methodName](parseArgs);
        }
      }
    }
  }

  /**
   * parse to JSON
   * @param args
   * @returns
   */
  safeParse(args: string): unknown | string {
    try {
      return JSON.parse(args);
    } catch (e) {
      return args;
    }
  }
}
