import { Injectable } from '@nestjs/common';
import { uniqBy } from 'lodash';
import { HttpResponseKeyMap } from 'src/common/constant/http/http-res-map.constants';
import { ApiException } from 'src/common/exception/api.exception';
import { PageOptionsDto } from 'src/model/dto/page.dto';
import { Comment } from 'src/model/entity/app/comment.entity';
import User from 'src/model/entity/sys/user.entity';
import { ArticleRepository } from 'src/model/repository/app/article.repository';
import { CommentRepository } from 'src/model/repository/app/comment.repository';
import { UserRepository } from 'src/model/repository/sys/user.repository';
import { ArticleCommentVo } from 'src/model/vo/comment.vo';
import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   *
   * @param article_id
   * @param pageDto
   * @returns
   */
  async listArticleComments(
    article_id: number,
    pageDto: PageOptionsDto,
  ): Promise<ArticleCommentVo> {
    // page query
    const { limit, page } = pageDto;
    const comments: Comment[] = await this.commentRepository.find({
      where: {
        article_id,
        deleted: false,
        reviewed: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // build vo
    const result: ArticleCommentVo = {
      comments: {},
      users: {},
    };

    comments
      .filter((c) => !!c)
      .forEach((c) => {
        result['comments'][c.id] = {
          comment_id: c.id,
          comment_content: c.comment_content,
          user_id: c.user_id,
          parent_id: c.parent_id,
          reply_to: c.reply_to,
          article_id: c.article_id,
        };
      });

    await Promise.all(
      uniqBy(comments, 'user_id')
        .filter((c) => !!c.user_id)
        .map(async (c) => {
          const user: User = await this.userRepository.findOneBy({
            id: c.user_id,
          });
          result['users'][user.id] = {
            user_id: user.id,
            username: user.username,
            nickname: user.nickname,
            avatar: user.avatar,
          };
        }),
    );

    return result;
  }

  /**
   *
   * @param user_id
   * @param dto
   */
  async comment(user_id: number, dto: CommentDto) {
    const { article_id, comment_content, reply_to } = dto;
    const [article, replyComment] = await Promise.all([
      this.articleRepository.findOneBy({
        id: dto.article_id,
      }),
      this.commentRepository.findOneBy({
        id: reply_to,
        deleted: false,
      }),
    ]);

    if (!article) {
      throw new ApiException(HttpResponseKeyMap.ARTICLE_NOT_EXISTS);
    }

    if (reply_to && !replyComment) {
      throw new ApiException(HttpResponseKeyMap.COMMENT_NOT_EXISTS);
    }

    await this.commentRepository.insert({
      article_id,
      comment_content,
      user_id,
      deleted: false,
      reviewed: true,
      reply_to,
    });
  }

  /**
   *
   * @param user_id
   * @param comment_id
   */
  async deleteCommentSelf(user_id: number, comment_id: number) {
    const comment = await this.commentRepository.findOneBy({
      id: comment_id,
      deleted: false,
    });

    if (!comment || (comment && comment.user_id !== user_id)) {
      throw new ApiException(HttpResponseKeyMap.PERMS_NOT_ALLOWED);
    }

    await this.commentRepository.update(comment_id, {
      deleted: true,
    });
  }
}
