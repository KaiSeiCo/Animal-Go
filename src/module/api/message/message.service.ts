import { Injectable } from '@nestjs/common';
import { MessageProducer } from 'src/global/kafka/producer/message-producer.service';
import { Message } from 'src/model/entity/app/message.entity';
import { MessageRepository } from 'src/model/repository/app/message.repository';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import {
  CampMessageListVo,
  CampMessageVo,
  MessageVo,
} from 'src/model/vo/message.vo';
import { UserInfoVo } from 'src/model/vo/user.vo';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { MessagePageQueryDto, MessagePayload } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly messageProducer: MessageProducer,
  ) {}

  async test(msg: string) {
    const payload: MessagePayload = {
      event: 'tests',
      data: {
        message: msg
      },
    }
    this.messageProducer.sendMessage(payload)
  }

  /**
   * query all
   * @returns messages
   */
  async list(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  /**
   * page query
   * @param camp_id
   * @param dto
   * @returns
   */
  async page(
    camp_id: string,
    dto: MessagePageQueryDto,
  ): Promise<CampMessageListVo> {
    const { limit, page, message_content } = dto;

    // message query
    const basicSql = buildDynamicSqlAppendWhere(
      this.messageRepository.createQueryBuilder('message').select(
        `
          message.id as message_id,
          message.user_id as user_id,
          message.camp_id as camp_id,
          message.message_content as message_content,
          message.reply_to as reply_to,
          message.deleted as deleted
        `,
      ),
      [
        {
          field: 'camp_id',
          condition: '=',
          value: camp_id,
        },
        {
          field: 'message_content',
          condition: 'LIKE',
          value: message_content,
        },
      ],
    );
    basicSql.andWhere({ deleted: false });
    basicSql.orderBy({ id: 'DESC' });

    const result: MessageVo[] = await basicSql
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const user_ids: string[] = [];
    // query reply message and build messages vo
    const messages: CampMessageVo[] = await Promise.all(
      result
        .filter((m) => !!m)
        .map(async (m) => {
          if (!m.reply_to) {
            user_ids.push(m.user_id);
            return {
              message_id: m.message_id,
              camp_id: m.camp_id,
              message_content: m.message_content,
              reply_to_message: null,
            };
          }

          const message = await this.messageRepository.findOneBy({
            id: m.reply_to,
          });
          user_ids.push(message.user_id, m.user_id);
          return {
            message_id: m.message_id,
            camp_id: m.camp_id,
            message_content: m.message_content,
            reply_to_message: {
              message_id: message.id,
              user_id: message.user_id,
              camp_id: message.camp_id,
              message_content: message.message_content,
              reply_to: message.reply_to,
            },
          };
        }),
    );

    // build users info in query messages
    const users: Record<string, UserInfoVo> = {};
    await Promise.all(
      user_ids
        .filter((u) => !!u)
        .map(async (id) => {
          const user = await this.userRepository.findOneBy({ id });
          users[id] = {
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
      messages,
      users,
    };
  }

  async sendMessage() {
    return;
  }
}
