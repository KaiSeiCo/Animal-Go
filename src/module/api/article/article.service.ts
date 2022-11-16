import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/global/redis/redis.service';
import { doNothing } from 'src/main';
import {
  ArticleListSqlResult,
  ArticlePublishDto,
  ArticleQueryDto,
  ArticleUpdateDto,
} from 'src/module/api/article/article.dto';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleDetailVo, ArticleListVo, TagVo } from 'src/model/vo/article.vo';
import {
  getArticleCommentCountKey,
  getPostFavorKey,
  getPostLikeKey,
  getUserFavorKey,
  getUserLikeKey,
  PostType,
} from 'src/global/redis/redis.key';
import { ArticleProducer } from 'src/global/kafka/producer/article-producer.service';
import { difference, filter, includes, toNumber } from 'lodash';
import { ArticleRepository } from 'src/model/repository/app/article.repository';
import { LikeDetailRepository } from 'src/model/repository/app/like_detail.repository';
import { ApiException } from 'src/common/exception/api.exception';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { ArticleTagRepository } from 'src/model/repository/app/article_tag.repository';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import { FavorDetailRepository } from 'src/model/repository/app/favor_detail.repository';
import { CommentRepository } from 'src/model/repository/app/comment.repository';
import { Article } from 'src/model/entity/app/article.entity';
import { TagRepository } from 'src/model/repository/app/tag.repository';
import { ForumRepository } from 'src/model/repository/app/forum.repository';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleTagRepository: ArticleTagRepository,
    private readonly likeDetailRepository: LikeDetailRepository,
    private readonly favorDetailRepository: FavorDetailRepository,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly tagRepository: TagRepository,
    private readonly forumRepository: ForumRepository,
    private readonly redisService: RedisService,
    private readonly articleProducer: ArticleProducer,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  /**
   * article list
   * @param dto
   * @returns
   */
  async listArticles(dto: ArticleQueryDto): Promise<ArticleListVo[]> {
    // find articles
    const articles = await this.articleRepository.getArticleListSqlResult(dto);
    // build article vo list
    const result = await this.buildAricleListVo(articles);
    return result;
  }

  async getArticleDetail(id: number): Promise<ArticleDetailVo> {
    const article: Article = await this.articleRepository.findOneBy({
      id,
      deleted: false,
    });

    if (!article) {
      throw new ApiException(HttpResponseKeyMap.ARTICLE_NOT_EXISTS);
    }

    const [
      { like_count, favor_count, comment_count, view_count },
      author,
      articleTags,
    ] = await Promise.all([
      this.getAllCount(article.id),
      this.userRepository.findOneBy({
        id: article.user_id,
      }),
      this.articleTagRepository.findBy({
        article_id: article.id,
      }),
    ]);

    const [tags, forum] = await Promise.all([
      this.tagRepository
        .createQueryBuilder('tag')
        .select(
          `
          tag.id as tag_id,
          tag.name as tag_name,
          `,
        )
        .whereInIds(articleTags.map((at) => at.tag_id))
        .getRawMany() as Promise<TagVo[]>,
      this.forumRepository.findOneBy({
        id: article.forum_id,
      }),
    ]);

    return {
      article_id: article.id,
      article_title: article.article_title,
      article_content: article.article_content,
      view_count: view_count,
      comment_count: comment_count,
      like_count: like_count,
      favor_count: favor_count,
      article_tags: {
        ...tags,
      },
      article_forum: {
        forum_id: forum.id,
        forum_name: forum.forum_name,
        forum_type: forum.forum_type,
      },
      created_at: article.createdAt,
      updated_at: article.updatedAt,
      author: {
        author_id: author.id,
        author_username: author.username,
        author_nickname: author.nickname,
        author_avatar: author.avatar,
      },
    };
  }

  /**
   * publish article
   * @param dto
   */
  async publishArticle(user_id: number, dto: ArticlePublishDto) {
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
      user_id,
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
   * list article by self
   * @param user_id
   */
  async listArticleBySelf(user_id: number, dto: ArticleQueryDto) {
    dto.user_id = user_id;
    const articles = await this.articleRepository.getArticleListSqlResult(dto);
    const result = await this.buildAricleListVo(articles, true);
    return result;
  }

  /**
   * edit article by self
   * @param user_id
   * @param dto
   */
  async editArticleBySelf(
    user_id: number,
    dto: ArticleUpdateDto,
  ): Promise<void> {
    const article = await this.articleRepository.findOneBy({
      id: dto.id,
      deleted: false,
    });

    if (!article) {
      throw new ApiException(HttpResponseKeyMap.ARTICLE_NOT_EXISTS);
    }

    if (article.user_id !== user_id) {
      throw new ApiException(HttpResponseKeyMap.PERMS_NOT_ALLOWED);
    }

    // update article table
    const [_, originArticleTag] = await Promise.all([
      this.articleRepository.update(article.id, {
        article_title: dto.article_title ?? article.article_title,
        article_content: dto.article_content ?? article.article_content,
        article_cover: dto.article_cover ?? article.article_cover,
        status: dto.status ?? article.status,
        forum_id: dto.forum_id ?? article.forum_id,
        pinned: dto.pinned ?? article.pinned,
      }),
      await this.articleTagRepository.find({
        where: {
          article_id: article.id,
        },
      }),
    ]);

    // update article_tag
    const { tag_ids } = dto;
    if (tag_ids?.length > 0) {
      const originArticleTagIds = originArticleTag.map((e) => e.tag_id);
      const insertArticleTags = difference(tag_ids, originArticleTagIds)
        .filter((tag_id) => !!tag_id)
        .map((tag_id) => {
          return {
            article_id: article.id,
            tag_id: tag_id,
          };
        });
      const deleteTagIds = difference(originArticleTagIds, tag_ids);
      const deleteArticleTagFieldIds = filter(originArticleTag, (e) => {
        return includes(deleteTagIds, e.id);
      }).map((e) => {
        return e.id;
      });

      await this.entityManager.transaction(async (manager) => {
        if (insertArticleTags.length > 0) {
          await manager.insert(ArticleTag, insertArticleTags);
        }
        if (deleteArticleTagFieldIds.length > 0) {
          await manager.delete(ArticleTag, deleteArticleTagFieldIds);
        }
      });
    }
  }

  /**
   * like or unlike
   * @param user_id
   * @param article_id
   */
  async like(user_id: number, article_id: number): Promise<void> {
    // redis key
    const user_key = getUserLikeKey(user_id, PostType.ARTICLE);
    const article_key = getPostLikeKey(PostType.ARTICLE);
    const article_hash_key = article_id.toString();
    const redis = this.redisService.getRedis();

    // check like
    const isLiked = await redis.hget(user_key, article_hash_key);
    if (!isLiked) {
      await Promise.all([
        redis.hset(user_key, {
          [article_hash_key]: new Date().getTime(),
        }),
        // post count + 1
        redis.hincrby(article_key, article_hash_key, 1),
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
   * favor or unfavor
   * @param user_id
   * @param article_id
   */
  async favor(user_id: number, article_id: number): Promise<void> {
    // redis key
    const user_key = getUserFavorKey(user_id, PostType.ARTICLE);
    const article_key = getPostFavorKey(PostType.ARTICLE);
    const article_hash_key = article_id.toString();
    const redis = this.redisService.getRedis();

    // check favor
    const isFavored = await redis.hget(user_key, article_hash_key);
    if (!isFavored) {
      await Promise.all([
        redis.hset(user_key, {
          [article_hash_key]: new Date().getTime(),
        }),
        redis.hincrby(article_key, article_hash_key, 1),
      ]);
    }
    // unfavor
    else {
      await Promise.all([
        redis.hdel(user_key, article_hash_key),
        redis.hincrby(article_key, article_hash_key, -1),
      ]);
    }

    // persistence
    this.articleProducer.saveFavor({
      article_id,
      user_id,
      deleted: isFavored ? true : false,
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

  /**
   * delete by self
   * @param user_id
   * @param article_id
   */
  async deleteArticleBySelf(
    user_id: number,
    article_id: number,
  ): Promise<void> {
    const article = await this.articleRepository.findOneBy({
      id: article_id,
      deleted: false,
    });

    // article not exists or already deleted
    if (!article) {
      throw new ApiException(HttpResponseKeyMap.ARTICLE_NOT_EXISTS);
    }

    // user not allowed delete article not belong to self
    if (article.user_id !== user_id) {
      throw new ApiException(HttpResponseKeyMap.PERMS_NOT_ALLOWED);
    }

    await this.articleRepository.update(article_id, {
      deleted: true,
    });
  }

  /**
   * build article list vo
   * @param sqlResult
   * @returns
   */
  async buildAricleListVo(
    sqlResult: ArticleListSqlResult[],
    self: boolean = false,
  ): Promise<ArticleListVo[]> {
    // build article vo list
    const articleEntries: Record<number, ArticleListVo> = {};
    sqlResult
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
          // initialize entries
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
              forum_type: row.forum_type,
            },
            pinned: row.pinned,
            deleted: row.deleted,
            view_count: 0,
            like_count: 0,
            favor_count: 0,
            comment_count: 0,
            created_at: row.created_at,
            updated_at: row.updated_at,
            user_id: row.user_id,
            username: undefined,
            nickname: undefined,
            avatar: undefined,
          };
        }
      });

    // fill info
    const res = await Promise.all(
      Object.values(articleEntries).map(async (e) => {
        // get count, user info
        const [{ like_count, favor_count, comment_count, view_count }, user] =
          await Promise.all([
            this.getAllCount(e.article_id),
            self
              ? null
              : await this.userRepository.findOneBy({ id: e.user_id }),
          ]);
        // fill info
        e.like_count = toNumber(like_count ?? 0);
        e.favor_count = toNumber(favor_count ?? 0);
        e.comment_count = toNumber(comment_count ?? 0);
        if (!self) {
          e.avatar = user.avatar;
          e.username = user.username;
          e.nickname = user.nickname;
        }
        return e;
      }),
    );
    return res;
  }

  /**
   * get all count
   * @param id
   */
  async getAllCount(id: number): Promise<{
    like_count?: number;
    favor_count?: number;
    comment_count?: number;
    view_count?: number;
  }> {
    const article_like_key = getPostLikeKey(PostType.ARTICLE);
    const article_favor_key = getPostFavorKey(PostType.ARTICLE);
    const article_comment_count_key = getArticleCommentCountKey();
    const key = id.toString();
    const redis = this.redisService.getRedis();

    const [likeCnt, favorCnt, commentCnt] = await Promise.all([
      (await redis.hget(article_like_key, key)) ??
        (await this.likeDetailRepository.countBy({
          article_id: id,
          deleted: false,
        })),
      (await redis.hget(article_favor_key, key)) ??
        (await this.favorDetailRepository.countBy({
          article_id: id,
          deleted: false,
        })),
      (await redis.hget(article_comment_count_key, key)) ??
        (await this.commentRepository.countBy({
          article_id: id,
          deleted: false,
        })),
    ]);

    return {
      like_count: toNumber(likeCnt ?? 0),
      favor_count: toNumber(favorCnt ?? 0),
      comment_count: toNumber(commentCnt ?? 0),
    };
  }
}
