import { Injectable } from '@nestjs/common';
import { isEmpty, uniq } from 'lodash';
import { HttpResponseKeyMap } from 'src/common/constant/http-res-map.constants';
import { ApiException } from 'src/common/exception/api.exception';
import { UserContext } from 'src/global/context/user.context';
import { MessageProducer } from 'src/global/kafka/producer/message-producer.service';
import { Message } from 'src/model/entity/app/message.entity';
import { CampRepository } from 'src/model/repository/app/camp.repository';
import { MessageRepository } from 'src/model/repository/app/message.repository';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import {
  CampMessageListVo,
  CampMessageVo,
  MessageVo,
} from 'src/model/vo/message.vo';
import { UserInfoVo } from 'src/model/vo/user.vo';
import SocketEvents from 'src/module/socket/event.constants';
import {
  MessageHistoryDto,
  MessageRecallDto,
  MessageSendDto,
  WsPayload,
} from './message.dto';
import { omitSqlResult } from 'src/util/sql.util';
import { CampUserRepository } from 'src/model/repository/app/camp_user.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly campRepository: CampRepository,
    private readonly campUserRepository: CampUserRepository,
    private readonly messageProducer: MessageProducer,
  ) {}

  async test(msg: string) {
    const payload: WsPayload = {
      event: 'tests',
      data: {
        message: msg,
      },
    };
    this.messageProducer.sendWsEvent(payload);
  }

  /**
   * 发送消息
   * @param user_id
   * @param dto
   */
  async sendMessageToCamp(user_id: string, dto: MessageSendDto) {
    const { camp_id, message_content, reply_to } = dto;

    const [camp, reply_to_message, joined] = await Promise.all([
      this.campRepository.findOneBy({ id: camp_id }),
      reply_to ? this.messageRepository.findOneBy({ id: reply_to }) : undefined,
      this.campUserRepository.findOneBy({ user_id, camp_id, deleted: false }),
    ]);
    if (isEmpty(camp)) {
      throw new ApiException(HttpResponseKeyMap.CAMP_NOT_EXISTS);
    }
    if (!!reply_to && isEmpty(reply_to_message)) {
      throw new ApiException(HttpResponseKeyMap.MESSAGE_NOT_EXISTS);
    }
    if (!joined) {
      throw new ApiException(HttpResponseKeyMap.PERMS_NOT_ALLOWED);
    }

    // filter content
    // contentFilter(message_content)

    const [message, user, reply_message] = await Promise.all([
      this.messageRepository.save({
        message_content,
        user_id,
        camp_id,
        reply_to,
      }),
      this.userRepository.findOneBy({ id: user_id }),
      reply_to ? this.messageRepository.findOneBy({ id: reply_to }) : undefined,
    ]);

    // ws event
    this.messageProducer.sendWsEvent({
      event: SocketEvents.MessagePublish,
      data: {
        message: omitSqlResult(message),
        user: omitSqlResult(user, 'password'),
        reply_message: omitSqlResult(reply_message),
      },
      room: camp_id,
    });
  }

  /**
   * 撤回消息
   * @param dto
   */
  async recallMessage(user_id: string, message_id: string) {
    const message = await this.messageRepository.findOneBy({
      id: message_id,
    });
    if (!message || message.user_id !== user_id) {
      throw new ApiException(HttpResponseKeyMap.OPERATION_FAILED);
    }
    await this.messageRepository.remove(message);

    this.messageProducer.sendWsEvent({
      event: SocketEvents.MessageDelete,
      data: omitSqlResult(message),
      room: message.camp_id,
    });
  }

  /**
   * 消息历史
   * @param camp_id
   * @param dto
   * @returns
   */
  async getHistoryMessage(
    camp_id: string,
    dto: MessageHistoryDto,
  ): Promise<CampMessageListVo> {
    const { prev, limit } = dto;
    const basicQuery = this.messageRepository
      .createQueryBuilder('m')
      .select(
        `
          m.id as message_id,
          m.user_id as user_id,
          m.camp_id as camp_id,
          m.message_content as message_content,
          m.reply_to as reply_to
        `,
      )
      .where('camp_id = :camp_id', { camp_id });

    if (!!prev) {
      basicQuery.andWhere('m.id < :prev', { prev });
    }

    const messages: MessageVo[] = await basicQuery
      .orderBy({ id: 'DESC' })
      .limit(limit)
      .getRawMany();

    const user_ids: string[] = [];
    const campMessage: CampMessageVo[] = await Promise.all(
      messages.map(async (m) => {
        if (isEmpty(m.reply_to)) {
          user_ids.push(m.user_id);
          return {
            message_id: m.message_id,
            camp_id: m.camp_id,
            message_content: m.message_content,
            reply_to_message: null,
          };
        }

        const reply = await this.messageRepository.findOneBy({
          id: m.reply_to,
        });
        user_ids.push(m.user_id, reply.user_id);
        return {
          message_id: m.message_id,
          camp_id: m.camp_id,
          message_content: m.message_content,
          reply_to_message: {
            message_id: reply.id,
            user_id: reply.user_id,
            camp_id: reply.camp_id,
            message_content: reply.message_content,
            reply_to: reply.reply_to,
          },
        };
      }),
    );

    const users: Record<string, UserInfoVo> = {};
    await Promise.all(
      uniq(user_ids).map(async (uid) => {
        const user = await this.userRepository.findOneBy({ id: uid });
        users[uid] = {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          avatar: user.avatar,
          intro: user.intro,
          status: user.status,
        };
      }),
    );

    return {
      messages: campMessage.reverse(),
      users,
    };
  }
}
