import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Job } from 'bull';
import { Queue } from 'bull';
import {
  SYSTEM_TASK_QUEUE_NAME,
  SYSTEM_TASK_QUEUE_PREFIX,
} from 'src/common/constant/system.constant';
import Task from 'src/model/entity/sys/task.entity';
import { LoggerService } from 'src/share/logger/logger.service';
import { RedisService } from 'src/share/service/redis.service';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService implements OnModuleInit {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectQueue(SYSTEM_TASK_QUEUE_NAME)
    private queue: Queue,
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
    let repeat: any;
    // if type === 1, repeat every millis
    if (task.type === 1) {
      repeat: {
        cron: task.every;
      }
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

    //
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
}
