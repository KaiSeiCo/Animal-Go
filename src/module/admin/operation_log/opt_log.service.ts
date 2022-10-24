import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptLogSave } from 'src/model/dto/sys/opt_log.dto';
import { OperationLog } from 'src/model/entity/sys/opt_log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OperationLogService {
  constructor(
    @InjectRepository(OperationLog)
    private readonly operationLogRepo: Repository<OperationLog>,
  ) {}

  /**
   * 保存日志
   * @param optLog
   */
  async saveLog(optLog: OptLogSave) {
    await this.operationLogRepo.save({
      ...optLog,
    });
  }

  /**
   * 请求日志列表
   */
  async list() {
    const logs = await this.operationLogRepo.find();
    return logs;
  }

  async deleteLog(id: number) {
    await this.operationLogRepo.delete({
      id,
    });
  }
}
