import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeDetail } from 'src/model/entity/app/like_detail.entity';
import { LikePayload } from 'src/module/api/article/article.dto';
import { Repository } from 'typeorm';
import { SubscribeTo } from '../kafka.decorator';
import { KafkaPayload } from '../kafka.interface';
import { ARTICLE_PRODUCER_TOPIC } from '../topic.constants';

@Injectable()
export class ArticleConsumer {
  constructor(
    @InjectRepository(LikeDetail)
    private readonly likeDetailRepository: Repository<LikeDetail>,
  ) {}

  @SubscribeTo(ARTICLE_PRODUCER_TOPIC)
  async saveLike(payload: KafkaPayload<LikePayload>) {
    const { body } = payload;
    const { article_id, user_id } = body;

    this.likeDetailRepository.save({});
  }
}
