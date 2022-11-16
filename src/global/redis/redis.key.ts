export enum PostType {
  ARTICLE = 'article',
  PHOTO = 'photo',
}

/**
 * get article like hash
 * @param article_id
 * @returns
 */
export function getPostLikeKey(type: PostType) {
  return `${type}:like`;
}

/**
 * get article favor hash
 * @param article_id
 * @returns
 */
export function getPostFavorKey(type: PostType) {
  return `${type}:favor`;
}

/**
 * get user like hash
 * @param user_id
 * @param type
 * @returns
 */
export function getUserLikeKey(user_id: number, type: PostType) {
  return `user:${user_id}:${type}:like`;
}

/**
 * get user favor hash
 * @param user_id
 * @param type
 * @returns
 */
export function getUserFavorKey(user_id: number, type: PostType) {
  return `user:${user_id}:${type}:favor`;
}

/**
 * login record redis key
 * @param user_id
 * @returns
 */
export function getLoginRecordKey(user_id: number) {
  return `user:login:${user_id}`;
}

/**
 * get article comment count key
 */
export function getArticleCommentCountKey() {
  return `article:comment:count`;
}
