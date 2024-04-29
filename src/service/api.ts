// 上传文件
const UPLOAD = '/api/upload';
// 上传文件
const DOWNLOAD_FILE = '/api/downloadFile';
// 删除文件
const REMOVE_FILE = '/api/removeFile';

// 用户注册
const REGISTER = '/api/register';
// 获取验证码
const VERIFY_CODE = '/api/verifyCode';
// 用户登录
const LOGIN = '/api/login';
// 更新用户信息
const UPDATE_INFO = '/api/updateInfo';
// 获取用户信息
const GET_USER_INFO = '/api/getUserInfo';
// 重置密码
const RESET_PASSWORD = '/api/resetPassword';

// 创建文章
const CREATE_ARTICLE = '/api/createArticle';
// 更新文章
const UPDATE_ARTICLE = '/api/updateArticle';
// 获取文章列表
const ARTICLE_LIST = '/api/articleList';
// 获取文章详情
const ARTICLE_DETAIL = '/api/articleDetail';
// 根据封面图获取文章
const FIND_ARTICLE_BY_COVER_IMAGE = '/api/findArticleByCoverImage';
// 获取文章详情
const DELETE_ARTICLE = '/api/deleteArticle';
// 文章点赞
const LIKE_ARTICLE = '/api/likeArticle';
// 文章搜索
const SEARCH_ARTICLE = '/api/searchArticle';
// 文章搜索
const GET_ARTICLE_BY_RANDOM = '/api/getArticleByRandom';
// 文章草稿
const CREATE_DRAFT = '/api/createDraft';
// 更新文章草稿
const UPDATE_DRAFT = '/api/updateDraft';
// 获取草稿列表
const GET_DRAFT_LIST = '/api/getDraftList';
// 获取草稿详情
const GET_DRAFT_BY_ID = '/api/getDraftById';
// 获取草稿详情
const DELETE_DRAFT = '/api/deleteDraft';
// 高级搜索
const ADVANCED_SEARCH = '/api/advancedSearch';

// 评论
const COMMENTS = '/api/comments';
// 获取评论
const GET_COMMENT_LIST = '/api/getCommentList';
// 点赞
const GIVE_LIKE = '/api/giveLike';
// 校验文章点赞状态
const CHECK_ARTICLE_LIKE_STATUS = '/api/checkArticleLikeStatus';
// 删除评论
const DELETE_COMMENT = '/api/deleteComment';

// 获取文章分类
const GET_CLASSIFY_LIST = '/api/getClassifyList';
// 获取文章标签
const GET_TAG_LIST = '/api/getTagList';
// 获取文章分类
const GET_TIMELINE_LIST = '/api/getTimelineList';

// 获取我发布的文章列表
const GET_MY_ARTICLE_LIST = '/api/getMyArticleList';

// 获取我点赞的文章列表
const GET_LIKE_ARTICLE_LIST = '/api/getLikeArticleList';

// 获取我点赞的文章列表
const GET_AUTHOR_ARTICLE_LIST = '/api/getAuthorArticleList';

// 获取博主点赞的文章列表
const GET_AUTHOR_LIKE_ARTICLES = '/api/getAuthorLikeArticles';

// 获取博主点赞的文章列表
const GET_AUTHOR_TIMELINE = '/api/getAuthorTimeline';

// 获取博主点赞的文章列表
const DEL_ALL_ARTICLE = '/api/delAllArticle';

// 获取博主点赞的文章列表
const GET_PREV_ARTICLE = '/api/getPrevArticle';

// 获取博主点赞的文章列表
const GET_NEXT_ARTICLE = '/api/getNextArticle';

// 校验token是否过期
const VERIFY = '/api/verify';

// 创建收藏集
const CREATE_COLLECTION = '/api/createCollection';
// 获取收藏集列表
const GET_COLLECTION_LIST = '/api/getCollectionList';
// 收藏文章
const COLLECT_ARTICLES = '/api/collectArticles';
// 收藏文章
const CHECK_COLLECTION_STATUS = '/api/checkCollectionStatus';
// 取消收藏
const CANCEL_COLLECTED = '/api/cancelCollected';
// 获取收藏文章总条数
const GET_COLLECTED_TOTAL = '/api/getCollectedTotal';
// 删除收藏集
const DEL_COLLECTION = '/api/delCollection';
// 更新收藏集
const UPDATE_COLLECTION = '/api/updateCollection';
// 收藏集详情
const GET_COLLECT_INFO = '/api/getCollectInfo';
// 获取收藏集中收藏的文章列表
const GET_COLLECT_ARTICLES = '/api/getCollectArticles';
// 移除收藏集中的文章
const REMOVE_COLLECT_ARTICLE = '/api/removeCollectArticle';
// 获取收藏集总数
const GET_COLLECT_TOTAL = '/api/getCollectTotal';
// 注销
const LOGOUT = '/api/logout';

export {
  REGISTER,
  VERIFY_CODE,
  LOGIN,
  UPDATE_INFO,
  ARTICLE_LIST,
  LIKE_ARTICLE,
  CREATE_ARTICLE,
  UPDATE_ARTICLE,
  UPLOAD,
  DOWNLOAD_FILE,
  REMOVE_FILE,
  ARTICLE_DETAIL,
  FIND_ARTICLE_BY_COVER_IMAGE,
  COMMENTS,
  GET_COMMENT_LIST,
  GIVE_LIKE,
  CHECK_ARTICLE_LIKE_STATUS,
  DELETE_COMMENT,
  DELETE_ARTICLE,
  SEARCH_ARTICLE,
  CREATE_DRAFT,
  UPDATE_DRAFT,
  GET_DRAFT_LIST,
  GET_DRAFT_BY_ID,
  DELETE_DRAFT,
  ADVANCED_SEARCH,
  GET_CLASSIFY_LIST,
  GET_TAG_LIST,
  GET_TIMELINE_LIST,
  GET_MY_ARTICLE_LIST,
  GET_LIKE_ARTICLE_LIST,
  GET_USER_INFO,
  RESET_PASSWORD,
  GET_ARTICLE_BY_RANDOM,
  GET_AUTHOR_ARTICLE_LIST,
  GET_AUTHOR_LIKE_ARTICLES,
  GET_AUTHOR_TIMELINE,
  DEL_ALL_ARTICLE,
  GET_PREV_ARTICLE,
  GET_NEXT_ARTICLE,
  VERIFY,
  CREATE_COLLECTION,
  GET_COLLECTION_LIST,
  COLLECT_ARTICLES,
  CHECK_COLLECTION_STATUS,
  CANCEL_COLLECTED,
  GET_COLLECTED_TOTAL,
  DEL_COLLECTION,
  UPDATE_COLLECTION,
  GET_COLLECT_INFO,
  GET_COLLECT_ARTICLES,
  REMOVE_COLLECT_ARTICLE,
  GET_COLLECT_TOTAL,
  LOGOUT,
};
