import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/global/redis/redis.service';
import { doNothing } from 'src/main';
import {
  ArticleListSqlResult,
  ArticlePublishDto,
  ArticleQueryDto,
} from 'src/module/api/article/article.dto';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Forum } from 'src/model/entity/app/forum.entity';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleListVo } from 'src/model/vo/article.vo';
import {
  getPostLikeKey,
  getUserLikeKey,
  PostType,
} from 'src/global/redis/redis.key';
import { ArticleProducer } from 'src/global/kafka/producer/article-producer.service';
import { toNumber } from 'lodash';
import { ArticleRepository } from 'src/model/repository/app/article.repository';
import { TagRepository } from 'src/model/repository/app/tag.repository';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleTagRepository: TagRepository,
    private readonly likeDetailRepository: LikeDetailRepository,
    private readonly redisService: RedisService,
    private readonly articleProducer: ArticleProducer,
  ) {}

  async listArticles(dto: ArticleQueryDto) {
    // find article
    const result: ArticleListSqlResult[] = await this.articleRepository
      .createQueryBuilder('a')
      .select(
        `
        a.id as article_id,
        a.article_title as article_title,
        a.article_desc as article_desc,
        a.created_at as publish_at,
        a.updated_at as edit_at,
        a.pinned as pinned,
        a.deleted as deleted,
        t.id as tag_id,
        t.tag_name as tag_name,
        f.id as forum_id,
        f.forum_name as forum_name
      `,
      )
      .leftJoin(Forum, 'f', 'f.id = a.forum_id')
      .leftJoin(ArticleTag, 'at', 'at.article_id = a.id')
      .leftJoin(Tag, 't', 't.id = at.tag_id')
      .getRawMany();

    const article_key = getPostLikeKey(PostType.ARTICLE);
    // build article vo list
    const articleEntries: Record<number, ArticleListVo> = {};
    await Promise.all(
      result
        .filter((row) => !!row)
        .map(async (row) => {
          const relevantEntry = articleEntries[row.article_id];
          if (relevantEntry) {
            row.tag_id
              ? articleEntries[row.article_id].article_tags.push({
                  tag_id: row.tag_id,
                  tag_name: row.tag_name,
                })
              : doNothing;
          } else {
            // get like count
            const likeCnt =
              (await this.redisService
                .getRedis()
                .hget(article_key, row.article_id.toString())) ??
              (await this.likeDetailRepository.countBy({
                article_id: row.article_id,
                deleted: false,
              }));

            // make entries
            articleEntries[row.article_id] = {
              article_id: row.article_id,
              article_title: row.article_title,
              article_desc: row.article_desc,
              article_tags: row.tag_id ? [
                {
                  tag_id: row.tag_id,
                  tag_name: row.tag_name
                }
              ] : [],
              article_forum: {
                forum_id: row.forum_id,
                forum_name: row.forum_name,
              },
              pinned: row.pinned,
              deleted: row.deleted,
              view_count: 0,
              like_count: toNumber(likeCnt),
              favor_count: 0,
              comment_count: 0,
              publish_at: row.publish_at,
              edit_at: row.edit_at,
            };
          }
        }),
    );

    const res = Object.values(articleEntries).map((v) => {
      return v;
    });
    return res;
  }

  async publishArticle(dto: ArticlePublishDto) {
    const {
      article_content,
      article_cover,
      article_title,
      article_desc,
      pinned,
      status,
      forum_id,
      tag_ids,
    } = dto;
    const desc = article_desc ?? article_content.substring(0, 30) + '...';
    // save article
    const result = await this.articleRepository.insert({
      article_content,
      article_cover,
      article_title,
      article_desc: desc,
      pinned,
      status,
      forum_id,
    });
    const id = result.generatedMaps[0]['id'] as number;
    // save relavant tags
    const articleTag = tag_ids
      .filter((t) => !!t)
      .map((t) => {
        return {
          article_id: id,
          tag_id: t,
        } as Partial<Tag>;
      });
    await this.articleTagRepository.insert(articleTag);
  }

  /**
   * like or unlike
   * @param user_id
   * @param article_id
   */
  async likeOrUnlike(user_id: number, article_id: number): Promise<void> {
    // get key
    const user_key = getUserLikeKey(user_id, PostType.ARTICLE);
    const article_key = getPostLikeKey(PostType.ARTICLE);
    const article_hash_key = article_id.toString();
    const redis = this.redisService.getRedis();

    // check liked
    const isLiked = await redis.hget(user_key, article_hash_key);
    if (!isLiked) {
      await Promise.all([
        redis.hset(user_key, {
          [article_hash_key]: new Date().getTime(),
        }),
        // post count + 1
        this.redisService.getRedis().hincrby(article_key, article_hash_key, 1),
      ]);
    }
    // unlike
    else {
      await Promise.all([
        redis.hdel(user_key, article_hash_key),
        redis.hincrby(article_key, article_hash_key, -1),
      ]);
    }

    // persistence
    this.articleProducer.saveLike({
      article_id,
      user_id,
      deleted: isLiked ? true : false,
    });
  }
}
