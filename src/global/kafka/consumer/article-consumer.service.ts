import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoggerService } from 'src/global/logger/logger.service';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';
import { LikePayload } from 'src/module/api/article/article.dto';
import { Subscribe } from '../kafka.decorator';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class ArticleConsumer {
  constructor(
    private readonly likeDetailRepository: LikeDetailRepository,
    private logger: LoggerService,
  ) {}

  /**
   * save like info to db
   * @param payload
   */
  @Subscribe(ConsumerTopics.ARTICLE_TOPIC)
  @OnEvent(KafkaConsumeEvents.ARTICLE_LIKE)
  async saveLike(payload: LikePayload) {
    this.logger.log('[Consumer-Event] start to save like detail');
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
}
