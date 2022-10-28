import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SYSTEM_TASK_QUEUE_NAME } from 'src/common/constant/system.constant';
import { TaskService } from './task.service';

export interface ExecuteData {
  id: number;
  args?: string | null;
  service: string;
}

@Processor(SYSTEM_TASK_QUEUE_NAME)
export class TaskConsumer {
  constructor(private taskService: TaskService) {}

  @Process()
  async handle(job: Job<ExecuteData>) {
    // const startTime = Date.now()
    const { data } = job;
    try {
      // task done
      await this.taskService.callService(data.service, data.args);
      // [TODO] save task log
    } catch (e) {
      // task failed
      // [TODO] save task log
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job<ExecuteData>) {
    this.taskService.updateTaskCompleteStatus(job.data.id);
  }
}
