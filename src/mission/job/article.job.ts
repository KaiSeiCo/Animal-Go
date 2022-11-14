import { Injectable } from '@nestjs/common';
import { Mission } from 'src/common/decorator/mission.decorator';
import {
  getPostFavorKey,
  getPostLikeKey,
  PostType,
} from 'src/global/redis/redis.key';
import { RedisService } from 'src/global/redis/redis.service';
import { FavorDetailRepository } from 'src/model/repository/app/favor_detail.repository';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';

type ArticleCounts = {
  article_id: number;
  count: number;
};

type PhotoCounts = {
  photo_id: number;
  count: number;
};

@Mission()
@Injectable()
export class ArticleCronJob {
  constructor(
    private redisService: RedisService,
    private likeDetailRepository: LikeDetailRepository,
    private favorDetailRepository: FavorDetailRepository,
  ) {}

  /**
   * @name sync_count
   * @service ArticleCronJob.syncCountToRedis
   * @cron 0 0 0 ^|3 ^ ? every 3 days
   * @type 0
   * @limit -1
   */
  async syncCountToRedis() {
    const [articleLikeCounts, articleFavorCounts]: ArticleCounts[][] =
      await Promise.all([
        this.likeDetailRepository
          .createQueryBuilder('like_detail')
          .select(
            `
              like_detail.article_id as article_id,
              count(*) as count
            `,
          )
          .where('like_detail.deleted = 0')
          .groupBy('like_detail.article_id')
          .getRawMany(),
        this.favorDetailRepository
          .createQueryBuilder('favor_detail')
          .select(
            `
              favor_detail.article_id as article_id,
              count(*) as count
            `,
          )
          .where('favor_detail.deleted = 0')
          .groupBy('favor_detail.article_id')
          .getRawMany(),
      ]);
    const articleLikeCountObj = {},
      articleFavorCountObj = {};
    articleLikeCounts.forEach((e) => {
      articleLikeCountObj[e.article_id.toString()] = e.count;
    });
    articleFavorCounts.forEach((e) => {
      articleFavorCountObj[e.article_id.toString()] = e.count;
    });

    await this.redisService
      .getRedis()
      .pipeline()
      .hset(getPostLikeKey(PostType.ARTICLE), articleLikeCountObj)
      .hset(getPostFavorKey(PostType.ARTICLE))
      .exec();
  }
}
