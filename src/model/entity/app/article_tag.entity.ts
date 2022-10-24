import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../base.entity";

@Entity({ name: 'tb_article_tag' })
export class ArticleTag extends BaseEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true
  })
  id: number

  @Column({
    type: 'int',
    unsigned: true,
    comment: '文章id'
  })
  article_id: number

  @Column({
    type: 'int',
    unsigned: true,
    comment: '标签id'
  })
  tag_id: number
}