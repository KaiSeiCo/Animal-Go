import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from 'src/global/logger/logger.service';
import { FavorDetailRepository } from 'src/model/repository/app/favor_detail.repository';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';
import { FavorPayload, LikePayload } from 'src/module/api/article/article.dto';
import { Subscribe } from '../kafka.decorator';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class ArticleConsumer {
  constructor(
    private readonly likeDetailRepository: LikeDetailRepository,
    private readonly favorDetailRepository: FavorDetailRepository,
    private logger: LoggerService,
  ) {}

  /**
   * save like info to db
   * @param payload
   */
  @Subscribe(ConsumerTopics.ARTICLE_TOPIC)
  @OnEvent(KafkaConsumeEvents.ARTICLE_LIKE)
  async dumpLikeToDb(payload: LikePayload) {
    this.logger.log('[🚥 Consumer-Event] start dump like detail to db');
    const { article_id, user_id, deleted } = payload;

    const likeDetail = await this.likeDetailRepository.findOneBy({
      article_id,
      user_id,
    });

    await this.likeDetailRepository.save({
      id: likeDetail?.id ?? undefined,
      article_id,
      user_id,
      deleted,
    });
  }

  /**
   * dump favor to db
   * @param payload
   */
  @Subscribe(ConsumerTopics.ARTICLE_TOPIC)
  @OnEvent(KafkaConsumeEvents.ARTICLE_FAVOR)
  async dumpFavorToDb(payload: FavorPayload) {
    this.logger.log('[🚥 Consumer-Event] start dump like detail to db');

    const { article_id, user_id, deleted } = payload;
    const favorDetail = await this.favorDetailRepository.findOneBy({
      article_id,
      user_id,
    });

    await this.favorDetailRepository.save({
      id: favorDetail?.id ?? undefined,
      article_id,
      user_id,
      deleted,
    });
  }
}
