import { ScrollEvent } from '@/typings/component';

export { ScrollEvent };

export interface LoginData {
  username: string;
  token?: string;
  userId: string;
  job?: string;
  motto?: string;
  introduce?: string;
  headUrl?: string;
  github?: string;
  juejin?: string;
  zhihu?: string;
  blog?: string;
  mainCover?: string;
}

export interface VerifyCodeParams {
  id: string;
  createTime: string;
  code: string;
}

export interface LoginParams {
  codeId?: string;
  code?: string;
  username?: string;
  password?: string;
  phone?: string;
}

export interface UserInfoParams {
  userId?: string;
  token?: string;
  username?: string;
  job?: string;
  motto?: string;
  introduce?: string;
  headUrl?: string;
  github?: string;
  juejin?: string;
  zhihu?: string;
  blog?: string;
  mainCover?: string;
  articleTotal?: string;
}
export interface ResetPasswordParams {
  username: string;
  password: string;
  phone: string;
}

export interface UpdateData {
  id: string;
}

export interface CreateArticleParams {
  title?: string;
  content: string;
  classify?: string;
  tag?: string;
  coverImage?: string;
  abstract?: string;
  createTime: number;
  authorId: string;
}

export interface SearchArticleParams {
  keyword?: string | undefined | null;
  tagName?: string | undefined | null;
  pageNo: number;
  pageSize: number;
  userId?: string;
}

// 高级搜索参数
export interface AdvancedSearchParams {
  keyword: string;
  pageNo: number;
  pageSize: number;
  userId: string;
  filterValues?: string[];
}

export interface CreateResult {
  id: number;
}

export interface GetArticleListParams {
  pageNo: number;
  pageSize: number;
  filter?: any;
  userId?: string;
}
export interface ArticleItem extends AddCollectionRes {
  abstract: string;
  authorId: string;
  authorName: string;
  classify: string;
  content?: string;
  coverImage: string;
  createTime: number;
  id: string;
  isLike: boolean;
  likeCount: number;
  replyCount: number;
  readCount: number;
  tag: string;
  title: string;
  commentCount?: number;
  isDelete?: boolean;
}

export interface ArticleListResult {
  list: ArticleItem[];
  total: number;
  count: number;
}

export interface ArticleDetailParams {
  id: string;
  title: string;
  content: string;
  classify: string;
  tag: string;
  coverImage: string;
  headUrl?: string;
  abstract: string;
  createTime: number;
  comments?: CommentParams[];
  authorName: string;
  authorId: string;
  replyCount?: number;
  likeCount: number;
  readCount: number;
  isLike: boolean;
  originalArticleId?: string | number;
  isDelete?: boolean;
}

export interface UseGetArticleDetailParams {
  id?: string | undefined | null;
  draftArticleId?: string | null;
  draftId?: string | null | undefined;
  visible?: boolean;
  draft?: any;
}

/**
 * 第一层区别方式
 *  - id: 0，formContent: ''
 *
 * 第二层：
 *  - id: 第一层comment，formContent: ''
 *
 * 第三层：
 *  - id: 第二层comment，fromContent: 第二层回复内容
 */
export interface CommentParams {
  commentId?: string;
  articleId: string;
  userId: string;
  username: string;
  date: number;
  content?: string;
  fromUserId?: string;
  likeCount?: number;
  replyCount?: number;
  headUrl?: string;
  fromUsername?: string;
  formContent?: string;
  replyList?: CommentParams[];
  fromCommentId?: string;
  isLike?: boolean;
}

export interface ReplayCommentResult {
  commentId: string;
}

export interface GiveLikeResult {
  status: number;
}

export interface DeleteCommentResult {
  status: number;
}

interface Articles {
  title: string;
  id: string;
}

// 文章分类item
export interface ClassifyList {
  count: number;
  classify: string;
  articles: Articles[];
}

export interface PageInfo {
  pageNo: number;
  pageSize: number;
}

export interface TagResult {
  name: string;
  value: number;
}

interface TimelineArticles {
  id: string;
  title: string;
  abstract: string;
  createTime: number;
  authorId: string;
  authorName: string;
  coverImage: string;
  isLike: boolean;
  tag: string;
  classify: string;
  likeCount: number;
  replyCount: number;
  readCount: number;
}

export interface TimelineResult {
  date: string;
  articles: TimelineArticles[];
}

export interface ArticleItemResult {
  id: string;
  title: string;
  abstract: string;
  createTime: number;
  authorId: string;
  authorName: string;
  coverImage: string;
  isLike: boolean;
  tag: string;
  classify: string;
  likeCount: number;
}

export interface LikeArticleList<T> {
  list: Array<T>;
  loading: boolean;
}

export interface useLikeArticleParams {
  // eslint-disable-next-line no-unused-vars
  setAlertStatus: (status: boolean) => void;
  articleList: any;
  updateList: Function;
  isTimeLine?: boolean;
  isAboutMe?: boolean;
  listRef?: any;
}

export interface useScrollLoadParams<T> {
  data?: T;
  loading?: boolean;
  pageSize?: number;
  scrollStyle?: string;
  paddingTopStyle?: string;
  headerStyle?: string;
  headerDarkStyle?: string;
  themeMode?: string;
  siderVisible?: boolean;
}

export interface useDeleteArticleParams {
  articleList: ArticleListResult;
  setArticleList: Function;
  getArticleList: Function;
  setAlertStatus: Function;
  listRef: any;
  delType?: string;
  pageNo?: any;
  keyword?: string;
  classify?: string;
  tagName?: string;
  authorId?: string;
  accessUserId?: string;
  authorPage?: boolean;
  authorLike?: boolean;
  filterList?: string[];
  getCollectionTotal?: Function;
  getCollectedTotal?: Function;
  removeConfirmStyle?: string;
}

export interface useUpdateCollectedParams {
  params: ArticleItem;
  articleList: ArticleListResult;
  setArticleList: Function;
  listRef: any;
  pageNo: number;
}

export interface useDeleteTimelineParams {
  timelineList: TimelineResult[];
  setTimelineList: Function;
  setAlertStatus: Function;
  removeConfirmStyle?: string;
}

// 上下页参数定义
export interface AnotherParams {
  id?: string;
  userId?: string;
  from?: string;
  accessUserId?: string;
  selectKey?: string;
}

export interface GetUserInfoParams {
  userId?: string | null;
  auth?: number;
  needTotal?: boolean;
}

export interface SearchTypeParams {
  label: string;
  type: string;
  key: string;
}
export interface CreateDraftParams {
  content: string;
  createTime: number;
  authorId: string;
  articleId?: string | null;
  originalArticleId?: string | number | null;
}

export interface CreateDraftParamsResult {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createTime: number;
}

// 歌词信息
export interface LrcInfo {
  ti: string;
  ar: string;
  al: string;
  by: string;
  offset: number;
  ms: { t: string; c: string }[];
}

// 创建收藏集接口参数
export interface CreateCollectionParams {
  name: string;
  desc: string;
  status: number;
  userId: string;
  id?: string;
}

// 获取收藏集列表参数
export interface GetCollectionListParams {
  userId: string;
  pageNo: number;
  pageSize: number;
}

// 创建收藏集返回值
export interface AddCollectionRes {
  id: string;
  name?: string;
  createTime?: string;
  count?: number;
  status?: number;
  desc?: string;
  articleIds?: string[];
}

export interface updateCollectParams {
  name?: string;
  desc?: string;
  status?: number;
}

// 创建收藏集返回值
export interface CollectionListRes {
  total: number;
  count: number;
  list: AddCollectionRes[];
}

// 我的主页获取列表数据的参数定义
export interface PerGetArticlesParams {
  pageNo: number;
  pageSize: number;
  userId: string;
  accessUserId: string;
  isVisitor?: boolean;
}

export interface getCollectArticlesParams {
  pageNo: number;
  pageSize: number;
  userId: string;
  articleIds?: string[];
}
