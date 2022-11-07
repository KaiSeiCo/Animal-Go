import { Injectable } from '@nestjs/common';
import { OptLogSave } from 'src/module/admin/system/log/opt_log.dto';
import { OperationLogRepository } from 'src/model/repository/sys/log.repository';

@Injectable()
export class OperationLogService {
  constructor(private readonly operationLogRepo: OperationLogRepository) {}

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
