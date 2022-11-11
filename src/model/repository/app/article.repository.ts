import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { toNumber, toString } from 'lodash';
import { Article } from 'src/model/entity/app/article.entity';
import { ArticleTag } from 'src/model/entity/app/article_tag.entity';
import { Forum } from 'src/model/entity/app/forum.entity';
import { Tag } from 'src/model/entity/app/tag.entity';
import { ArticleListVo } from 'src/model/vo/article.vo';
import { ArticleListSqlResult, ArticleQueryDto } from 'src/module/api/article/article.dto';
import { buildDynamicSqlAppendWhere } from 'src/util/typeorm.util';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(
    @InjectRepository(Article)
    repository: Repository<Article>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async getArticleListSqlResult(
    dto: ArticleQueryDto,
  ): Promise<ArticleListSqlResult[]> {
    const { article_title, deleted, status, forum_id, tag_ids, limit, page, user_id } =
      dto;

    const basicSql = buildDynamicSqlAppendWhere(
      this.createQueryBuilder('a')
        .select(
          `
            a.id as article_id,
            a.article_title as article_title,
            a.article_desc as article_desc,
            a.created_at as publish_at,
            a.updated_at as edit_at,
            a.pinned as pinned,
            a.deleted as deleted,
            a.status as status,
            a.user_id as user_id,
            t.id as tag_id,
            t.tag_name as tag_name,
            f.id as forum_id,
            f.forum_name as forum_name
          `,
        )
        .leftJoin(Forum, 'f', 'f.id = a.forum_id')
        .leftJoin(ArticleTag, 'at', 'at.article_id = a.id')
        .leftJoin(Tag, 't', 't.id = at.tag_id'),
      [
        {
          field: 'deleted',
          condition: '=',
          value: deleted,
        },
        {
          field: 'status',
          condition: '=',
          value: status,
        },
        {
          field: 'article_title',
          condition: 'LIKE',
          value: article_title,
        },
        {
          field: 'forum_id',
          condition: '=',
          value: forum_id,
        },
        {
          field: 'tag_id',
          condition: 'in',
          value: tag_ids,
        },
        {
          field: 'user_id',
          condition: '=',
          value: user_id
        }
      ],
    );
    basicSql.skip((page - 1) * limit).limit(limit);
    return await basicSql.getRawMany();
  }
}
