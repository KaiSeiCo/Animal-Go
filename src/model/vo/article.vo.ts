export type TagVo = {
  tag_id: string;
  tag_name: string;
};

export type ArticleDetailVo = {
  article_id: string;
  article_title: string;
  article_content: string;
  view_count: number;
  comment_count: number;
  like_count: number;
  favor_count: number;
  article_tags: TagVo[];
  created_at: Date;
  updated_at: Date;
  author: {
    author_id: string;
    author_username: string;
    author_nickname: string;
    author_avatar: string;
  };
};

export type ArticleListVo = {
  article_id: string;
  article_title: string;
  article_desc: string;
  article_tags: TagVo[];
  user_id: string;
  username: string;
  nickname: string;
  avatar: string;
  pinned: boolean;
  deleted: boolean;
  view_count: number;
  like_count: number;
  favor_count: number;
  comment_count: number;
  created_at: Date;
  updated_at: Date;
};
