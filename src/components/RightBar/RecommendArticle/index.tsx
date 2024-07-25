import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import useStore from '@/store';
import { useGetSiderVisible } from '@/hooks';
import { formatGapTime, error } from '@/utils';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { ArticleItem } from '@/typings/common';

import styles from './index.less';

interface IProps {
  scrollRef?: any;
  themeMode?: string;
  htmlWidth?: number;
}

const RecommendArticle: React.FC<IProps> = ({ scrollRef, themeMode, htmlWidth = 0 }) => {
  const [recommendList, setRecommendList] = useState<ArticleItem[]>([]);

  const navigate = useNavigate();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const { siderVisible } = useGetSiderVisible();

  useEffect(() => {
    getArticleByRandom();
  }, []);

  // 随机获取文章
  const getArticleByRandom = async () => {
    const res = normalizeResult<ArticleItem[]>(
      await Service.getArticleByRandom({
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      setRecommendList(res.data);
    } else {
      error(res.message);
    }
  };

  const toDetail = (id: string) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div
      className={classname(
        styles.NewArticles,
        siderVisible && htmlWidth > 960 && styles.changeTop,
        themeMode === 'dark' && styles.dark
      )}
      ref={scrollRef}
    >
      <div className={classname(styles.contant, themeMode === 'dark' && styles.dark)}>
        <div className={classname(styles.header, themeMode === 'dark' && styles.dark)}>
          文章推荐
        </div>
        {recommendList.length > 0 &&
          recommendList.map((i) => (
            <div
              key={i.id}
              className={classname(styles.item, themeMode === 'dark' && styles.itemDark)}
              onClick={() => toDetail(i.id)}
            >
              <div className={styles.title}>{i.title}</div>
              <div className={styles.abstract}>
                <span>{formatGapTime(i.createTime)}</span>
                {i?.likeCount > 0 && (
                  <span className={styles.likeCount}>{i.likeCount} 点赞</span>
                )}
              </div>
            </div>
          ))}
      </div>
      {siderVisible && (
        <div className={styles.ipcWrap}>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            浙ICP备2024111222号-1
          </a>
        </div>
      )}
    </div>
  );
};

export default RecommendArticle;
