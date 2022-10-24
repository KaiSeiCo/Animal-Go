import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticlePublishDto, ArticleQueryDto } from "src/model/dto/app/article.dto";
import { Article } from "src/model/entity/app/article.entity";
import { ArticleTag } from "src/model/entity/app/article_tag.entity";
import { Tag } from "src/model/entity/app/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleTag)
    private articleTagRepository: Repository<Tag>
  ){}

  async queryArticle(dto: ArticleQueryDto) {
    this.articleRepository.createQueryBuilder('article')
      .select()
  }

  async publishArticle(dto: ArticlePublishDto) {
    const { article_content, article_cover, article_title, article_desc, pinned, status, forum_id, tag_ids } = dto
    const desc = article_desc ?? article_content.substring(0, 30) + '...'
    // save article
    const result = await this.articleRepository.insert({
      article_content,
      article_cover,
      article_title,
      article_desc: desc,
      pinned,
      status,
      forum_id,
    })
    const id = result.generatedMaps[0]['id'] as number
    // save relavant tags
    const articleTag = tag_ids.filter((t) => !!t).map((t) => {
      return {
        article_id: id,
        tag_id: t
      } as Partial<Tag>
    })
    await this.articleTagRepository.insert(articleTag)
  }
}