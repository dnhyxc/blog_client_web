import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, Result } from '@/utils/tools';
import { EventBus } from '@/event';
import { error, storage } from '@/utils';
import { PAGESIZE } from '@/constant';
import { close } from '@/components/Render';
import { sendMessage } from '@/socket';
import {
  ArticleDetailParams,
  ScrollEvent,
  useScrollLoadParams,
  useDeleteArticleParams,
  useDeleteTimelineParams,
  ArticleItem,
  TimelineResult,
  useLikeArticleParams,
  UseGetArticleDetailParams,
  ArticleListResult,
  UserInfoParams,
} from '@/typings/common';

// 防抖函数
export const useDebounce = (
  fn: Function,
  delay: number,
  dep?: any[],
  immediate: boolean = false
) => {
  const { current } = useRef<any>({ fn, timer: null, count: 0 });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args: any[]) => {
    if (immediate && current.count === 0) {
      current.fn(...args);
      current.count += 1;
    } else {
      if (current.timer) {
        clearTimeout(current.timer);
        // current.count = 0;
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
        current.count += 1;
      }, delay);
    }
  }, dep || []);
};

// 节流函数
export const useThrottle = (fn: Function, delay: number, dep: any[] = []) => {
  const { current } = useRef<any>({ fn, timer: null });

  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args: any[]) => {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer;
      }, delay);
      current.fn(...args);
    }
  }, dep || []);
};

// 实时获取页面宽度的hooks
export const useHtmlWidth = () => {
  const [htmlWidth, setHtmlWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onResize = useDebounce(
    () => {
      const width = window.innerWidth;
      setHtmlWidth(width);
    },
    100,
    []
  );

  return { htmlWidth };
};

export const useGetBodyWidth = () => {
  const [bodyWidth, setBodyWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    setBodyWidth(window.innerWidth);
  }, []);

  return { bodyWidth };
};

// 获取登录状态的hooks
export const useLoginStatus = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const { commonStore } = useStore();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (showAlert) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = setTimeout(() => {
        onCloseAlert();
      }, 5000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [showAlert]);

  const onCloseAlert = () => {
    setShowAlert(false);
  };

  const setAlertStatus = (status: boolean) => {
    setShowAlert(status);
  };

  const toLogin = () => {
    commonStore.setAuth({ redirectUrl: `${pathname}${search}` });
    navigate('/login', { replace: true });
  };

  const setResult = (res: any, callback?: Function) => {
    if (res.success) {
      callback && callback();
    }
    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  return { showAlert, toLogin, onCloseAlert, setAlertStatus, setResult };
};

// 是否需要滚动到评论输入框位置hooks
export const useScroll = (needScroll: string | null) => {
  const [commentOffsetTop, setCommentOffsetTop] = useState<number>(0);

  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (commentRef && commentRef.current) {
      setCommentOffsetTop(commentRef.current.offsetTop);
    }
  }, [commentRef]);

  useEffect(() => {
    let timer: any = null;
    if (needScroll === '1') {
      if (timer) {
        clearInterval(timer);
      }
      timer = setTimeout(() => {
        document.documentElement.scrollTop = commentOffsetTop;
      }, 100);
    }
    return () => {
      clearInterval(timer);
    };
  }, [commentOffsetTop, needScroll]);

  return { commentRef, commentOffsetTop };
};

// 获取详情的hooks
export const useGetArticleDetail = ({
  id,
  draftArticleId,
  draftId,
  visible,
}: UseGetArticleDetailParams) => {
  const [detail, setDetail] = useState<ArticleDetailParams>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      getArticleDetail();
      return;
    }
    if (draftId) {
      getDraftById();
    }
  }, [id, draftId]);

  useEffect(() => {
    if (visible) {
      getDraftById();
    }
  }, [visible]);

  const getArticleDetail = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleDetailParams>(
      await Service.getArticleDetail({ id: id! })
    );
    setLoading(false);
    if (res.success) {
      setDetail(res.data);
    } else {
      error(res.message);
    }
  };

  const getDraftById = async () => {
    setLoading(true);
    if (!draftId && !draftArticleId) return;
    const res = normalizeResult<ArticleDetailParams>(
      await Service.getDraftById({ id: draftId! || draftArticleId! })
    );
    setLoading(false);
    if (res.success) {
      setDetail(res.data);
    } else {
      error(res.message);
    }
  };

  return { detail, loading, setDetail };
};

// 点赞hooks
export const useLikeArticle = ({
  setAlertStatus,
  articleList,
  updateList,
  isTimeLine,
  isAboutMe,
  listRef,
}: useLikeArticleParams) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  // 文章点赞
  const likeArticle = async (id: string, data?: ArticleItem) => {
    if (!getUserInfo) {
      setAlertStatus(true);
      return;
    }

    const res = normalizeResult<{ id: string; isLike: boolean; likeCount: number }>(
      await Service.likeArticle({ id, userId: getUserInfo.userId })
    );

    if (res.success) {
      const { id, isLike, likeCount } = res.data;
      if (isTimeLine) {
        const cloneArticles: TimelineResult[] = JSON.parse(JSON.stringify(articleList));

        const timelineList = cloneArticles.map((i) => {
          i.articles.forEach((j) => {
            if (j.id === id) {
              j.isLike = res.data.isLike;
              j.likeCount = likeCount;
              // if (isLike) {
              //   j.likeCount += 1;
              // } else {
              //   j.likeCount > 0 ? (j.likeCount -= 1) : (j.likeCount = 0);
              // }
            }
          });
          return i;
        });

        updateList(timelineList);
      } else {
        const cloneList: ArticleItem[] = JSON.parse(JSON.stringify(articleList.list));

        const list = cloneList.map((i) => {
          if (i.id === id) {
            i.isLike = res.data.isLike;
            i.likeCount = likeCount;
            // if (isLike) {
            //   i.likeCount += 1;
            // } else {
            //   i.likeCount > 0 ? (i.likeCount -= 1) : (i.likeCount = 0);
            // }
          }
          return i;
        });

        listRef.current = list;

        // isAboutMe为true，就是用户自己的主页或博主自己进入博主主页，此时点赞需要删除取消点赞的文章
        if (isAboutMe) {
          const likes = list.filter((i) => i.isLike);
          listRef.current = likes;
          updateList({
            ...articleList,
            list: listRef.current,
          });
        } else {
          updateList({
            ...articleList,
            list: listRef.current,
          });
        }
      }
      // 给别人点赞或取消点赞之后推送websocket消息
      if (getUserInfo?.userId !== data?.authorId) {
        sendMessage(
          JSON.stringify({
            action: 'push',
            data: {
              ...data,
              articleId: id,
              toUserId: data?.authorId,
              fromUsername: getUserInfo?.username,
              fromUserId: getUserInfo?.userId,
              action: isLike ? 'LIKE_ARTICLE' : 'CANCEL_LIKE_ARTICLE',
            },
            userId: getUserInfo?.userId!,
          })
        );
      }
    }
    if (!res.success && res.code === 409) {
      setAlertStatus(true);
    }
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  return { likeArticle };
};

// 滚动加载自定义hooks
export const useScrollLoad = ({
  data,
  loading,
  pageSize,
  scrollStyle, // 如果需要吸顶，组件必须设置ref=scrollRef，且必须传入scrollStyle参数
  paddingTopStyle,
  headerStyle, // header 特定样式
  headerDarkStyle, // header 暗黑样式
  themeMode, // 主题模式
  siderVisible, // 左侧菜单显示控制
}: useScrollLoadParams<any>) => {
  const [pageNo, setPageNo] = useState<number>(1);
  const [suckTop, setSuckTop] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);

  const scrollRef = useRef<any>(null);
  const scrollbarRef = useRef<any>(null);
  const contentWrapRef = useRef<any>(null);
  const headerRef = useRef<any>(null);

  // 点击主题切换时，实时更新样式
  useEffect(() => {
    if (themeMode === 'dark' && scrollTop >= document.body.clientHeight - 50) {
      headerStyle && headerRef?.current?.classList?.remove(headerStyle);
      headerStyle && headerRef?.current?.classList?.add(headerDarkStyle);
    }

    if (themeMode === 'light' && scrollTop >= document.body.clientHeight - 50) {
      headerStyle && headerRef?.current?.classList?.remove(headerDarkStyle);
      headerStyle && headerRef?.current?.classList?.add(headerStyle);
    }
  }, [themeMode, scrollTop, siderVisible]);

  const addClassName = (scrollTop: number) => {
    const currentTop = paddingTopStyle
      ? document.body.clientHeight + 380
      : scrollRef?.current?.offsetTop;
    // 有首页有coverImage 时 document.body.clientHeight + 450 否则 scrollRef?.current?.offsetTop
    if (scrollTop >= currentTop) {
      setSuckTop(true);
      scrollStyle && scrollRef?.current?.classList?.add(scrollStyle);
      scrollRef?.current?.setAttribute('id', '__SCROLL_TOP__');
    } else {
      setSuckTop(false);
      scrollStyle && scrollRef?.current?.classList?.remove(scrollStyle);
      scrollRef?.current?.removeAttribute('id');
    }

    // 动态计算首页Content组件中contentWrap元素的paddingTop
    if (scrollTop >= document.body.clientHeight - 50 && themeMode === 'light') {
      headerStyle && headerRef?.current?.classList?.remove(headerDarkStyle);
      headerStyle && headerRef?.current?.classList?.add(headerStyle);
    } else {
      headerStyle && headerRef?.current?.classList?.remove(headerStyle);
    }

    // 动态计算首页Content组件中contentWrap元素的paddingTop
    if (scrollTop >= document.body.clientHeight - 50 && themeMode === 'dark') {
      headerStyle && headerRef?.current?.classList?.remove(headerStyle);
      headerStyle && headerRef?.current?.classList?.add(headerDarkStyle);
    } else {
      headerStyle && headerRef?.current?.classList?.remove(headerDarkStyle);
    }
  };

  // 滚动加载
  const onScroll = (event: ScrollEvent) => {
    const { scrollTop, scrollHeight, clientHeight } = event;
    // 元素吸顶控制器
    addClassName(scrollTop);
    setScrollTop(scrollTop);
    if (
      !loading &&
      data?.count === pageSize &&
      data?.list?.length < data?.total &&
      Math.round(scrollTop) + clientHeight + 1 >= scrollHeight
    ) {
      setPageNo(pageNo + 1);
    }
  };

  return {
    pageNo,
    setPageNo,
    onScroll,
    scrollRef,
    suckTop,
    scrollbarRef,
    scrollTop,
    contentWrapRef,
    headerRef,
  };
};

// 删除文章hooks
export const useDeleteArticle = ({
  articleList,
  setArticleList,
  setAlertStatus,
  delType,
  listRef,
  pageNo,
  keyword, // 首页搜索输入内容
  filterList, // 高级搜索列表
  classify, // 文章分类页面搜索条件
  tagName, // 标签页选中的标签
  authorId, // 我的主页作者id
  accessUserId, // 我的主页登录人id
  authorPage, // 代表博主页面
  authorLike, // 代表博主页面博主点赞列表
  getCollectionTotal, // 获取收藏集总数的方法
  getCollectedTotal, // 获取收藏集中收藏的文章总数的方法
  removeConfirmStyle, // confirm 样式
}: useDeleteArticleParams) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();

  const deleteArticle = (id: string) => {
    Modal.confirm(modalConfig(id));
  };

  // 删除收藏集
  const delCollection = async (id: string) => {
    const res = normalizeResult<ArticleListResult>(
      await Service.delCollection({
        id,
        userId: getUserInfo?.userId,
        pageNo,
        pageSize: PAGESIZE,
      })
    );
    if (res.success) {
      const nextPageOne = res?.data?.list[0] || '';
      const list = articleList.list.filter((i) => i.id !== id);
      listRef.current = nextPageOne ? [...list, nextPageOne] : list;
      setArticleList({
        ...articleList,
        total: articleList.total - 1,
        list: listRef.current,
      });
      // 如果是收藏集tab，getCollectionTotal有值，需要实时获取删除后的收藏集总条数
      getCollectionTotal && getCollectionTotal();
      getCollectedTotal && getCollectedTotal();
    }
    return res;
  };

  // 删除文章
  const delArticle = async (articleId: string) => {
    const res = normalizeResult<ArticleListResult>(
      await Service.deleteArticle({
        articleId,
        pageNo,
        pageSize: PAGESIZE,
        keyword,
        classify,
        tagName,
        userId: authorId || getUserInfo?.userId,
        accessUserId,
        delType: delType === '2' ? delType : '',
        authorPage,
        authorLike,
        filterList,
      })
    );

    if (res.success) {
      const nextPageOne = res?.data?.list[0] || '';
      const list = articleList.list.filter((i) => i.id !== articleId);
      listRef.current = nextPageOne ? [...list, nextPageOne] : list;
      setArticleList({
        ...articleList,
        total: articleList.total - 1,
        list: listRef.current,
      });
    }
    return res;
  };

  const modalConfig = (articleId: string) => {
    return {
      title: delType !== '3' ? '确定删除该文章吗？' : '确定删除该收藏集吗？',
      className: removeConfirmStyle,
      width: htmlWidth < 960 ? '80%' : '',
      content: delType === '3' ? '删除收藏集同时会移除收藏集中的文章' : null,
      centered: htmlWidth < 960,
      async onOk() {
        let res = {} as Result<{ id: string } | ArticleListResult>;
        if (delType !== '3') {
          res = await delArticle(articleId);
        } else {
          res = await delCollection(articleId);
        }

        if (!res.success && res.code === 409) {
          setAlertStatus(true);
        }
        if (!res.success && res.code !== 409 && res.code !== 401) {
          error(res.message);
        }
      },
    };
  };

  return { deleteArticle };
};

// 删除timeline文章hooks
export const useDeleteTimelineArticle = ({
  timelineList,
  setTimelineList,
  setAlertStatus,
  removeConfirmStyle,
}: useDeleteTimelineParams) => {
  const { htmlWidth } = useHtmlWidth();

  const deleteTimeline = (articleId: string) => {
    Modal.confirm(modalConfig(articleId));
  };

  const modalConfig = (articleId: string) => {
    return {
      title: '确定删除该文章吗？',
      className: removeConfirmStyle,
      centered: htmlWidth < 960,
      width: htmlWidth < 960 ? '80%' : '',
      async onOk() {
        const res = normalizeResult<{ id: string }>(
          await Service.deleteArticle({ articleId, type: 'timeline' })
        );
        if (res.success) {
          const list = timelineList.map((i) => {
            if (i.articles.length) {
              const filterList = i.articles.filter((j) => j.id !== articleId);
              return {
                ...i,
                count: filterList.length,
                articles: filterList,
              };
            }
            return { ...i };
          });
          setTimelineList(list);
        }
        if (!res.success && res.code === 409) {
          setAlertStatus(true);
        }
        if (!res.success && res.code !== 409 && res.code !== 401) {
          error(res.message);
        }
      },
    };
  };

  return { deleteTimeline };
};

// 校验token是否过期的hook
export const useVerifyToken = (
  needRes?: boolean,
  needMsg?: boolean,
  fromDetail?: boolean
) => {
  const [loginStatus, setLoginStatus] = useState<{
    success?: boolean;
    message?: string;
    code?: number | string;
    data?: any;
  }>({});
  const timerRef = useRef<any>(null);

  const { commonStore } = useStore();

  const navigate = useNavigate();

  const { pathname, search } = useLocation();

  useEffect(() => {
    verifyToken(fromDetail);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => close(), 5000);
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [fromDetail]);

  const verifyToken = async (fromDetail?: boolean) => {
    const res = normalizeResult<number>(await Service.verify({ fromDetail }));
    if (!res.success && !needRes) {
      needMsg && res.code === 409 && error(res.message);
      commonStore.setAuth({ redirectUrl: `${pathname}${search}` });
      navigate(`/login?verify=${pathname.slice(1)}`);
    }

    setLoginStatus({
      success: res.success,
      message: res.message,
      code: res.code,
      data: res.data,
    });
  };

  return { loginStatus };
};

// 获取用户信息hook
export const useGetUserInfo = ({
  userId,
  authorId,
  clearInfo,
}: {
  userId: string;
  authorId: string;
  clearInfo?: boolean;
}) => {
  const [userInfo, setUserInfo] = useState<UserInfoParams | null>({ userId: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if ((userId === authorId || !userId) && clearInfo) {
      setUserInfo(null);
      return;
    }
    if (!userId) return;
    onGetPersonalInfo();
  }, [userId, authorId, clearInfo]);

  // 获取用户信息
  const onGetPersonalInfo = async () => {
    if (!userId) return;
    const res = normalizeResult<UserInfoParams>(
      await Service.getUserInfo({
        userId,
      })
    );
    if (res.success) {
      setUserInfo(res.data);
      return;
    }
    if (res.code === 406) {
      error(res.message);
      navigate('home');
    }
  };

  return { userInfo };
};

// 实时获取sider的显隐状态
export const useGetSiderVisible = () => {
  const { siderStore } = useStore();

  const [siderVisible, setSiderVisible] = useState<boolean>(
    siderStore.toggleSider || false
  );

  useEffect(() => {
    EventBus.onToggleSider.listen(() => {
      setSiderVisible(EventBus.visible);
    });
  }, []);

  return { siderVisible };
};

// 计算文章目录滚动位置
export const useGetTocScrollHeight = ({ tocVisible }: { tocVisible: boolean }) => {
  const tocScrollRef: any = useRef(null);

  useEffect(() => {
    if (tocScrollRef && !tocScrollRef.current) return;
    window.addEventListener('scroll', onHtmlScroll);
    return () => {
      window.removeEventListener('scroll', onHtmlScroll);
    };
  }, [tocScrollRef, tocVisible]);

  const onHtmlScroll = () => {
    const scrollRefScrollHeight = tocScrollRef?.current?.getScrollHeight();
    const htmlScrollTop = document.documentElement?.scrollTop;
    const htmlScrollHeight = document.documentElement?.scrollHeight;
    const percent = scrollRefScrollHeight / htmlScrollHeight;
    const needScrollTop = percent * htmlScrollTop;
    tocScrollRef?.current?.scrollTop(needScrollTop);
  };

  return { tocScrollRef };
};

// 获取sider的显隐状态
export const useGetSiderStatus = () => {
  const { siderStore } = useStore();

  const [htmlWidth, setHtmlWidth] = useState<number>(window.innerWidth);
  const [siderStatus, setSiderStatus] = useState<boolean>(false);
  const [siderVisible, setSiderVisible] = useState<boolean>(
    siderStore.toggleSider || false
  );

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onResize = useDebounce(
    () => {
      const width = window.innerWidth;
      setHtmlWidth(width);
    },
    100,
    []
  );

  useEffect(() => {
    EventBus.onToggleSider.listen(() => {
      setSiderVisible(EventBus.visible);
    });
  }, []);

  useEffect(() => {
    if (siderVisible && htmlWidth > 960) {
      setSiderStatus(true);
    } else {
      setSiderStatus(false);
    }
  }, [siderVisible, htmlWidth]);

  return { siderStatus };
};

// 获取主题模式的hook
export const useGetTheme = () => {
  const [themeMode, setThemeMode] = useState<string>(storage.ssnGetItem('theme') as string);

  useEffect(() => {
    EventBus.onToggleTheme.listen(() => {
      const { theme } = EventBus;
      setThemeMode(theme);
    });
  }, []);

  useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('__DARK_BODY__');
    } else {
      document.body.classList.remove('__DARK_BODY__');
    }
  }, [themeMode]);

  return { themeMode };
};
