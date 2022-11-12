export type TagVo = {
  tag_id: number;
  tag_name: string;
};

export type ArticleForumVo = {
  forum_id: number;
  forum_name: string;
};

export type ArticleDetailVo = {
  article_id: number;
  article_title: string;
  article_content: string;
  view_count: number;
  comment_count: number;
  like_count: number;
  favor_count: number;
  article_tags: TagVo[];
  article_forum: ArticleForumVo;
  publish_at: Date;
  edit_at: Date;
};

export type ArticleListVo = {
  article_id: number;
  article_title: string;
  article_desc: string;
  article_tags: TagVo[];
  article_forum: ArticleForumVo;
  user_id: number;
  username: string;
  avatar: string;
  pinned: boolean;
  deleted: boolean;
  view_count: number;
  like_count: number;
  favor_count: number;
  comment_count: number;
  publish_at: Date;
  edit_at: Date;
};
