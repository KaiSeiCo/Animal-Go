type CommentVo = {
  comment_id: number;
  article_id: number;
  user_id: number;
  parent_id: number;
  reply_to: number;
  comment_content: string;
};

type CommentUserVo = {
  user_id: number;
  username: string;
  nickname: string;
  avatar: string;
};

export type ArticleCommentVo = {
  comments: Record<number, CommentVo>;
  users: Record<number, CommentUserVo>;
};
