import { Injectable } from '@nestjs/common';
import { Mission } from 'src/common/decorator/mission.decorator';
import { getPostLikeKey, PostType } from 'src/global/redis/redis.key';
import { RedisService } from 'src/global/redis/redis.service';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';

type ArticleCounts = {
  article_id: number;
  count: number;
};

@Mission()
@Injectable()
export class ArticleCronJob {
  constructor(
    private redisService: RedisService,
    private likeDetailRepository: LikeDetailRepository,
  ) {}

  /**
   * @name sync_count
   * @service ArticleCronJob.syncCountToRedis
   * @cron 0 0 0 ^|3 ^ ? every 3 days
   * @type 0
   * @limit -1
   */
  async syncCountToRedis() {
    const articleCounts: ArticleCounts[] = await this.likeDetailRepository
      .createQueryBuilder('like_detail')
      .select(
        `
          like_detail.article_id as article_id,
          count(*) as count
        `,
      )
      .where('like_detail.deleted = 0')
      .groupBy('like_detail.article_id')
      .getRawMany();
    const articleCountObj = {};
    articleCounts.forEach((e) => {
      articleCountObj[e.article_id.toString()] = e.count;
    });

    await this.redisService
      .getRedis()
      .hset(getPostLikeKey(PostType.ARTICLE), articleCountObj);
  }
}
