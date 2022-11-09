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

  /**
   * article list
   * @param dto
   * @returns
   */
  async listArticles(dto: ArticleQueryDto) {
    // find articles
    const result = await this.articleRepository.getArticleListSqlResult(dto);

    // build article vo list
    const articleEntries: Record<number, ArticleListVo> = {};
    result
      .filter((row) => !!row)
      .forEach(async (row) => {
        const key = row.article_id;
        const relevantEntry = articleEntries[key];
        if (relevantEntry) {
          row.tag_id
            ? articleEntries[key].article_tags.push({
                tag_id: row.tag_id,
                tag_name: row.tag_name,
              })
            : doNothing;
        } else {
          // make entries
          articleEntries[key] = {
            article_id: row.article_id,
            article_title: row.article_title,
            article_desc: row.article_desc,
            article_tags: row.tag_id
              ? [
                  {
                    tag_id: row.tag_id,
                    tag_name: row.tag_name,
                  },
                ]
              : [],
            article_forum: {
              forum_id: row.forum_id,
              forum_name: row.forum_name,
            },
            pinned: row.pinned,
            deleted: row.deleted,
            view_count: 0,
            like_count: 0,
            favor_count: 0,
            comment_count: 0,
            publish_at: row.publish_at,
            edit_at: row.edit_at,
          };
        }
      });

    const article_key = getPostLikeKey(PostType.ARTICLE);
    const res = await Promise.all(
      Object.values(articleEntries).map(async (v) => {
        // get like count
        const likeCnt =
          (await this.redisService
            .getRedis()
            .hget(article_key, v.article_id.toString())) ??
          (await this.likeDetailRepository.countBy({
            article_id: v.article_id,
            deleted: false,
          }));
        v.like_count = toNumber(likeCnt);
        return v;
      }),
    );
    return res;
  }

  /**
   * publish article
   * @param dto
   */
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

  /**
   * delete by id
   * @param id
   */
  async delete(id: number): Promise<void> {
    await this.articleRepository.delete({
      id,
    });
  }
}
