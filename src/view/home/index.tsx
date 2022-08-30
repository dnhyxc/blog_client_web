/*
 * @Description: 首页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\home\index.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import Content from '@/components/Content';
import Header from '@/components/Header';
import RightBar from '@/components/RightBar';
import Card from '@/components/Card';
import MIcons from '@/components/Icons';
import MAlert from '@/components/Alert';
import MSearch from '@/components/MSearch';
import BackTop from '@/components/BackTop';
import { useLoginStatus, useLikeArticle, useScrollLoad, useDeleteArticle } from '@/hooks';
import useStore from '@/store';
import * as Service from '@/service';
import { PAGESIZE } from '@/constant';
import { normalizeResult, storage } from '@/utils';
import { ArticleListResult, ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {}

const Home: React.FC<IProps> = () => {
  const [articleList, setArticleList] = useState<ArticleListResult>({
    list: [],
    total: 0,
    count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const inputRef = useRef<any>(null);
  const listRef = useRef<ArticleItem[]>([]);

  const navigate = useNavigate();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { pageNo, setPageNo, onScroll, scrollRef, contentRef, scrollTop } = useScrollLoad({
    data: articleList,
    loading,
    pageSize: PAGESIZE,
    scrollStyle: styles.scrollStyle,
  });

  useEffect(() => {
    storage.locRemoveItem('params');
  }, []);

  useEffect(() => {
    if (isSearch) {
      onSearchArticle(keyword);
    } else {
      getArticleList();
    }
  }, [pageNo, keyword, isSearch]);

  useEffect(() => {
    if (showSearch) {
      inputRef?.current?.focus({
        cursor: 'end',
      });
    }
  }, [inputRef, showSearch]);

  // 获取文章列表
  const getArticleList = async () => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.getArticleList({
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
      })
    );
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      // 使用ref暂存list，防止滚动加载时，list添加错乱问题
      listRef.current = [...listRef.current, ...list];
      setArticleList({
        list: listRef.current,
        total,
        count: list.length,
      });
    } else {
      message.error(res.message);
    }
  };

  // 删除文章
  const { deleteArticle } = useDeleteArticle({
    articleList,
    setArticleList,
    getArticleList,
    setAlertStatus,
  });

  // 文章点赞
  const { likeArticle } = useLikeArticle({
    setAlertStatus,
    articleList,
    updateList: setArticleList,
  });

  // 文章搜索
  const onSearchArticle = async (value: string) => {
    setLoading(true);
    const res = normalizeResult<ArticleListResult>(
      await Service.searchArticle({
        keyword: value,
        pageNo,
        pageSize: PAGESIZE,
        userId: getUserInfo?.userId,
      })
    );
    setLoading(false);
    if (res.success) {
      const { total, list } = res.data;
      listRef.current = [...listRef.current, ...list];
      setArticleList({
        list: listRef.current,
        total,
        count: list.length,
      });
    } else {
      message.error(res.message);
    }
  };

  // 点击进入详情
  const toDetail = (id: string, needScroll: boolean): void => {
    if (needScroll) {
      navigate(`/detail/${id}?needScroll=1`);
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 编辑文章
  const onEditArticle = (id: string) => {
    navigate(`/create?id=${id}`);
  };

  // 控制搜索框显隐
  const onShowSearch = () => {
    setShowSearch(true);
  };

  // 搜索
  const onSearch = (value: string) => {
    setKeyword(value);
    if (keyword !== value) {
      setPageNo(1);
      listRef.current = [];
      setArticleList({
        list: listRef.current,
        total: 0,
        count: 0,
      });
    }
    if (value) {
      setIsSearch(true);
    } else {
      setIsSearch(false);
    }
  };

  // 当失去焦点时隐藏搜索输入框
  const onBlur = () => {
    setShowSearch(false);
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <>
      {!showSearch && (
        <MIcons name="icon-sousuo2" className={styles.iconWrap} onClick={onShowSearch} />
      )}
      {showSearch && <MSearch inputRef={inputRef} onSearch={onSearch} onBlur={onBlur} />}
    </>
  );

  return (
    <div className={styles.container}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Header right={rightNode()}>
        文章列表
      </Header>
      {articleList && (
        <Content className={styles.contentWrap} onScroll={onScroll} contentRef={contentRef}>
          <div className={styles.content}>
            <Card
              list={articleList.list}
              toDetail={toDetail}
              deleteArticle={deleteArticle}
              likeArticle={likeArticle}
              onEditArticle={onEditArticle}
              showInfo={articleList.list.length === articleList.total}
              loading={loading}
            />
            <RightBar
              className={styles.rightbar}
              showRecommendArticle
              scrollRef={scrollRef}
            />
          </div>
        </Content>
      )}
      <BackTop scrollTop={scrollTop} contentRef={contentRef} />
    </div>
  );
};

export default Home;
