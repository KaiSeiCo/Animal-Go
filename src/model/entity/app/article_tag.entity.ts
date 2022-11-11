import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'tb_article_tag' })
export class ArticleTag extends BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    unsigned: true,
    generated: 'increment',
  })
  id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '文章id',
  })
  @Index('article-index')
  article_id: number;

  @Column({
    type: 'bigint',
    unsigned: true,
    comment: '标签id',
  })
  tag_id: number;
}
