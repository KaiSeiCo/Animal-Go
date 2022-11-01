export enum PostType {
  ARTICLE = 'article',
  PHOTO = 'photo',
}

export function getArticleLikeKey(article_id: number) {
  return `article:${article_id}:like`;
}

export function getArticleFavorKey(article_id: number) {
  return `article:${article_id}:favor`;
}

export function getUserLikeKey(user_id: number, type: PostType) {
  return `user:${user_id}:${type}:like`;
}

export function getUserFavorKey(user_id: number, type: PostType) {
  return `user:${user_id}:${type}:favor`;
}
