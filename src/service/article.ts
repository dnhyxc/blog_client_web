import { post, del } from '@/utils/request';
import * as API from './api';
import {
  CreateArticleParams,
  SearchArticleParams,
  GetArticleListParams,
  CommentParams,
  AnotherParams,
  AdvancedSearchParams,
} from '@/typings/common';

export async function createArticle(params: CreateArticleParams) {
  const res = await post(API.CREATE_ARTICLE, params);
  return res;
}

export async function updateArticle(params: CreateArticleParams) {
  const res = await post(API.UPDATE_ARTICLE, params);
  return res;
}

export async function searchArticle(params: SearchArticleParams) {
  const res = await post(API.SEARCH_ARTICLE, params);
  return res;
}

export async function advancedSearch(params: AdvancedSearchParams) {
  const res = await post(API.ADVANCED_SEARCH, params);
  return res;
}

export async function articleDraft(params: CreateArticleParams, path: string) {
  const res = await post(path, params);
  return res;
}

export async function getDraftById(params: { id: string }) {
  const res = await post(API.GET_DRAFT_BY_ID, params);
  return res;
}

export async function deleteDraft(params: { id: string | null }) {
  const res = await post(API.DELETE_DRAFT, params);
  return res;
}

export async function getDraftList(params: GetArticleListParams) {
  const res = await post(API.GET_DRAFT_LIST, params);
  return res;
}

export async function deleteArticle(params: {
  articleId: string;
  pageNo?: number;
  pageSize?: number;
  type?: string;
  keyword?: string;
  classify?: string;
  userId?: string;
  tagName?: string;
  accessUserId?: string;
  delType?: string;
  authorPage?: boolean;
  authorLike?: boolean;
  filterList?: string[];
}) {
  const res = await post(API.DELETE_ARTICLE, params);
  return res;
}

export async function likeArticle(params: {
  id: string;
  userId: string;
  authorId?: string | null | undefined;
}) {
  const res = await post(API.LIKE_ARTICLE, params);
  return res;
}

export async function getArticleList(params: GetArticleListParams) {
  const res = await post(API.ARTICLE_LIST, params);
  return res;
}

export async function getArticleDetail(params: { id: string }) {
  const res = await post(API.ARTICLE_DETAIL, params);
  return res;
}

export async function findArticleByCoverImage(params: {
  coverImage: string;
  authorId: string;
}) {
  const res = await post(API.FIND_ARTICLE_BY_COVER_IMAGE, params);
  return res;
}

/**
 * 第一层区别方式
 *  - id: 0，formContent: ''
 *
 * 第二层：
 *  - id: 第一层uid，formContent: ''
 *
 * 第三层：
 *  - id: 第二层uid，fromContent: 第二层回复内容
 */
export async function releaseComment(params: CommentParams) {
  const res = await post(API.COMMENTS, params);
  return res;
}

export async function getCommentList(params: { id: string; userId: string }) {
  const res = await post(API.GET_COMMENT_LIST, params);
  return res;
}

export async function giveLike(params: { commentId: string; fromCommentId?: string }) {
  const res = await post(API.GIVE_LIKE, params);
  return res;
}

export async function deleteComment(params: { commentId: string; fromCommentId?: string }) {
  const res = await post(API.DELETE_COMMENT, params);
  return res;
}

export async function getClassifyList(params: {
  pageNo?: number;
  pageSize?: number;
  classify: string | number;
  userId?: string;
}) {
  const res = await post(API.GET_CLASSIFY_LIST, params);
  return res;
}

export async function getTagList() {
  const res = await post(API.GET_TAG_LIST);
  return res;
}

export async function getTimelineList(params: {
  pageNo?: number;
  pageSize?: number;
  userId: string;
}) {
  const res = await post(API.GET_TIMELINE_LIST, params);
  return res;
}

export async function getArticleByRandom(params: { userId?: string }) {
  const res = await post(API.GET_ARTICLE_BY_RANDOM, params);
  return res;
}

export async function delAllArticle() {
  const res = await del(API.DEL_ALL_ARTICLE);
  return res;
}

export async function getPrevArticle(params: AnotherParams) {
  const res = await post(API.GET_PREV_ARTICLE, params);
  return res;
}

export async function getNextArticle(params: AnotherParams) {
  const res = await post(API.GET_NEXT_ARTICLE, params);
  return res;
}

// 校验文章点赞点赞状态
export const checkArticleLikeStatus = async (params: { id: string; userId: string }) => {
  const res = await post(API.CHECK_ARTICLE_LIKE_STATUS, params);
  return res;
};
