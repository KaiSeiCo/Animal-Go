import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from 'src/global/logger/logger.service';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { LikePayload } from 'src/module/api/article/article.dto';
import { Repository } from 'typeorm';
import { SubscribeToConsumer } from '../kafka.decorator';
import { ConsumerTopics, KafkaConsumeEvents } from '../topic.constants';

@Injectable()
export class ArticleConsumer {
  constructor(
    @InjectRepository(LikeDetail)
    private readonly likeDetailRepository: Repository<LikeDetail>,
    private logger: LoggerService,
  ) {}

  @SubscribeToConsumer(ConsumerTopics.ARTICLE_TOPIC)
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
