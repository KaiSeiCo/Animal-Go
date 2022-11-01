import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/global/redis/redis.service';
import { doNothing } from 'src/main';
import {
  ArticleListSqlResult,
  ArticlePublishDto,
  ArticleQueryDto,
} from 'src/module/api/article/article.dto';
import { Article } from 'src/model/entity/app/article.entity';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Forum } from 'src/model/entity/app/forum.entity';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleListVo } from 'src/model/vo/article.vo';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleTag)
    private readonly articleTagRepository: Repository<Tag>,
    private readonly redisService: RedisService,
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

    // build article vo list
    const articleEntries: Record<number, ArticleListVo> = {};
    result
      .filter((row) => !!row)
      .forEach((row) => {
        const relevantEntry = articleEntries[row.article_id];
        if (relevantEntry) {
          row.tag_id
            ? articleEntries[row.article_id].article_tags.push({
                tag_id: row.tag_id,
                tag_name: row.tag_name,
              })
            : doNothing;
        } else {
          articleEntries[row.article_id] = {
            article_id: row.article_id,
            article_title: row.article_title,
            article_desc: row.article_desc,
            article_tags: [
              {
                tag_id: row.tag_id,
                tag_name: row.tag_name,
              },
            ],
            article_forum: {
              forum_id: row.forum_id,
              forum_name: row.forum_name,
            },
            pinned: row.pinned,
            deleted: row.deleted,
            view_count: 0,
            like_count: 0,
            comment_count: 0,
            publish_at: row.publish_at,
            edit_at: row.edit_at,
          };
        }
      });

    const res = Object.values(articleEntries).map((v) => {
      return v;
    });
    return res;
  }

  async queryArticle(dto: ArticleQueryDto) {
    this.articleRepository.createQueryBuilder('article').select();
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
  async likeOrUnlike(user_id: number, article_id: number) {}
}
