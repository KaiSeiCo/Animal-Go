export type TagVo = {
  tag_id: number;
  tag_name: string;
};

export type ForumVo = {
  forum_id: number;
  forum_name: string;
  forum_type: number;
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
  article_forum: ForumVo;
  created_at: Date;
  updated_at: Date;
  author: {
    author_id: number;
    author_username: string;
    author_nickname: string;
    author_avatar: string;
  };
};

export type ArticleListVo = {
  article_id: number;
  article_title: string;
  article_desc: string;
  article_tags: TagVo[];
  article_forum: ForumVo;
  user_id: number;
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
