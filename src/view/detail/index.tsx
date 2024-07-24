/*
 * @Description: 详情页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\detail\index.tsx
 */
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Affix, BackTop, Spin, Button } from 'antd';
import classname from 'classname';
import { ArrowUpOutlined } from '@ant-design/icons';
import Preview from '@/components/Preview';
import Header from '@/components/Header';
import Image from '@/components/Image';
import Multibar from '@/components/Multibar';
import Footer from '@/components/Footer';
import MIcons from '@/components/Icons';
import { HEAD_UEL, CARD_URL } from '@/constant';
import RightBar from '@/components/RightBar';
import Toc from '@/components/ArticleToc';
import Comments from '@/components/Comments';
import AnotherArticle from '@/components/AnotherArticle';
import { useGetArticleDetail, useGetTheme, useHtmlWidth } from '@/hooks';
import useStore from '@/store';
import { formatDate, info } from '@/utils';
import ActionBar from '@/components/ActionBar';
import ActionIcon from '@/components/ActionIcon';
import { createWebSocket, closeSocket } from '@/socket';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

const ArticleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [search] = useSearchParams();
  const draft = search.get('draft');
  const { detail, loading } = useGetArticleDetail(draft ? { draftId: id } : { id });
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();
  const commentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeSocket();
    if (getUserInfo?.userId) {
      // createWebSocket();
    }
  }, [getUserInfo?.userId]);

  useEffect(() => {
    if (detail?.isDelete) {
      info('该文章已下架');
      navigate('/home');
    }
  }, [detail]);

  // 高级搜索
  const toSearch = () => {
    navigate('/search');
  };

  // 渲染右侧搜索
  const rightNode = () => (
    <div className={styles.searchWrap}>
      <MIcons
        name="icon-sousuo2"
        className={classname(styles.iconWrap, themeMode === 'dark' && styles.darkIcon)}
        onClick={toSearch}
      />
    </div>
  );

  // 编辑文章
  const onEditArticle = () => {
    navigate(`/create?id=${id}`);
  };

  // 去我的主页
  const toSetting = (authorId: string | undefined) => {
    navigate(`/personal?id=${authorId}`);
  };

  // 去标签
  const toTag = (e: any, tag: string) => {
    navigate(`/tag/list?tagName=${tag}`);
  };

  // 去分类
  const toClassify = (e: any, classify: string) => {
    e.stopPropagation();
    navigate(`/classify?classify=${classify}`);
  };

  const renderCoverImg = (detail: ArticleDetailParams) => {
    return (
      <div className={styles.titleWrap}>
        <div className={styles.title}>{detail?.title}</div>
        <div className={styles.userInfo}>
          <Image
            url={detail?.headUrl || HEAD_UEL}
            transitionImg={HEAD_UEL}
            className={styles.herdImg}
            onClick={() => toSetting(detail?.authorId)}
          />
          <div className={styles.createInfo}>
            <div className={styles.username}>{detail?.authorName}</div>
            <div>
              <span>{formatDate(detail?.createTime, 'YYYY年MM月DD日 HH:mm')}</span>
              <span className={styles.readCount}>阅读 {detail?.readCount}</span>
              {getUserInfo?.userId === detail?.authorId && (
                <Button type="link" onClick={onEditArticle}>
                  编辑
                </Button>
              )}
            </div>
          </div>
        </div>
        {detail?.coverImage && (
          <Image
            url={detail?.coverImage || CARD_URL}
            transitionImg={CARD_URL}
            className={styles.image}
          />
        )}
        <p className={styles.desc}>{detail.abstract}</p>
      </div>
    );
  };

  return (
    <Spin spinning={loading} className={styles.spinWrap} tip="正在卖力加载中...">
      <div
        className={classname(
          styles.detailContainer,
          detail?.content.includes('#') && styles.hanToc,
          themeMode === 'dark' && styles.dark
        )}
      >
        <div className={styles.headerWrap}>
          <Header needLeft excludesWidth right={rightNode()} needUser themeMode={themeMode}>
            <div className={styles.headerContent}>文章详情</div>
          </Header>
        </div>
        {detail && (
          <div className={styles.content}>
            <div className={styles.preview}>
              {htmlWidth > 960 && (
                <Multibar
                  id={id as string}
                  detail={detail}
                  commentRef={commentRef}
                  themeMode={themeMode}
                />
              )}
              <Preview
                className={styles.previewContent}
                mackdown={detail.content}
                coverImg={renderCoverImg(detail)}
              >
                <div className={styles.tagWrap}>
                  {detail.classify && (
                    <div className={styles.tagList}>
                      <span className={styles.label}>分类：</span>
                      <div className={styles.tagItemWrap}>
                        <span
                          className={styles.tag}
                          onClick={(e) => toClassify(e, detail.classify)}
                        >
                          {detail.classify}
                        </span>
                      </div>
                    </div>
                  )}
                  {detail.tag && (
                    <div className={styles.tagList}>
                      <span className={styles.label}>标签：</span>
                      <div className={styles.tagItemWrap}>
                        <span className={styles.tag} onClick={(e) => toTag(e, detail.tag)}>
                          {detail.tag}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Preview>
              {!draft && (
                <div className={styles.anotherArticle}>
                  <AnotherArticle id={id} themeMode={themeMode} />
                </div>
              )}
              {!draft && (
                <div ref={commentRef} className={styles.commentContainer}>
                  <Comments
                    authorId={detail.authorId}
                    themeMode={themeMode}
                    htmlWidth={htmlWidth}
                    detail={detail}
                  />
                </div>
              )}
            </div>
            {htmlWidth > 960 && (
              <div className={styles.rightBar}>
                <RightBar themeMode={themeMode} htmlWidth={htmlWidth} />
                <Affix offsetTop={50}>
                  <Toc mackdown={detail.content} themeMode={themeMode} />
                </Affix>
              </div>
            )}
          </div>
        )}
        {htmlWidth <= 960 && detail && !draft && (
          <ActionBar
            id={id as string}
            detail={detail}
            commentRef={commentRef}
            className={themeMode === 'dark' ? styles.darkActionBar : ''}
            themeMode={themeMode}
            htmlWidth={htmlWidth}
          />
        )}
        {htmlWidth <= 960 && <Footer themeMode={themeMode} />}
        <ActionIcon noHideMenuIcon fromDetail themeMode={themeMode} htmlWidth={htmlWidth} />
      </div>
      <BackTop className={htmlWidth > 960 ? styles.backTopWrap : styles.mobileBackTopWrap}>
        <div className={styles.backTop}>
          <ArrowUpOutlined className={styles.topIcon} />
        </div>
      </BackTop>
    </Spin>
  );
};

export default ArticleDetail;
