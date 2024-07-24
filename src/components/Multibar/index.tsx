import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Popover } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { shareQQ, shareSinaWeiBo, error } from '@/utils';
import Qrcode from '@/components/Qrcode';
import { useVerifyToken } from '@/hooks';
import { EventBus } from '@/event';
import { show, close } from '@/components/Render';
import MIcons from '@/components/Icons';
import CollectionModal from '@/components/CollectionModel';
import CreateCollectModel from '@/components/CreateCollectModel';
import { sendMessage } from '@/socket';
import { ArticleDetailParams } from '@/typings/common';
import styles from './index.less';

interface IProps {
  id: string;
  detail: ArticleDetailParams;
  commentRef: any;
  themeMode?: string;
}

const Multibar: React.FC<IProps> = ({ id, detail, commentRef, themeMode }) => {
  const [likeCount, setLikeCount] = useState<number | undefined>(0);
  const [isLike, setIsLike] = useState<boolean | undefined>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [addVisible, setAddVisible] = useState<boolean>(false);
  const [collected, setCollected] = useState<boolean>(false);
  const [createCollectId, setCreateCollectId] = useState<string>('');
  const [commentCount, setCommentCount] = useState<number>(0);

  const { pathname, search } = useLocation();
  const { loginStatus } = useVerifyToken(true, false, true);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    EventBus.onSetCommentCount.listen(() => {
      const count = EventBus.commentCount;
      setCommentCount(count);
    });
  }, []);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    setLikeCount(detail?.likeCount);
    setIsLike(detail?.isLike);
  }, [detail]);

  useEffect(() => {
    if (!visible) {
      getCollectionStatus();
      checkArticleLikeStatus();
    }
  }, [visible, id, loginStatus]);

  // 关闭alert弹窗
  const closeAlert = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = setTimeout(() => {
      close();
    }, 5000);
  };

  // 推送ws消息
  const sendMeg = (type: string) => {
    if (getUserInfo?.userId !== detail?.authorId) {
      const data = { ...detail };
      // @ts-ignore
      delete data.content;
      sendMessage(
        JSON.stringify({
          action: 'push',
          data: {
            ...data,
            articleId: id,
            toUserId: data?.authorId,
            fromUsername: getUserInfo?.username,
            fromUserId: getUserInfo?.userId,
            action: type,
          },
          userId: getUserInfo?.userId!,
        })
      );
    }
  };

  // 文章点赞
  const onLikeArticle = async () => {
    if (!id) return;
    if (!getUserInfo?.userId || !loginStatus.success) {
      show({ pathname, search });
      closeAlert();
      return;
    }
    const res = normalizeResult<{ id: string; isLike: boolean; likeCount: number }>(
      await Service.likeArticle({ id, userId: getUserInfo?.userId })
    );
    if (!res.success) {
      if (res.code !== 401) {
        show({ pathname, search });
        closeAlert();
      }
      return;
    }
    setIsLike(res.data.isLike);

    setLikeCount(res.data.likeCount);
    // if (!res.data.isLike) {
    //   setLikeCount(likeCount! - 1);
    // } else {
    //   setLikeCount(likeCount! + 1);
    // }

    // 给别人点赞或取消点赞之后推送websocket消息
    sendMeg(res.data.isLike ? 'LIKE_ARTICLE' : 'CANCEL_LIKE_ARTICLE');
  };

  // 收藏
  const onCollection = () => {
    if (!getUserInfo?.userId || !loginStatus.success) {
      show({ pathname, search });
      closeAlert();
      return;
    }
    setVisible(true);
  };

  const onHideCollectModel = () => {
    setVisible(false);
    setCreateCollectId('');
  };

  // 滚动到评论
  const onScrollToComment = () => {
    if (!commentRef.current) return;
    const { offsetTop } = commentRef.current;
    document.documentElement.scrollTop = offsetTop;
  };

  const getAddVisible = (value: boolean) => {
    setAddVisible(value);
  };

  // 获取收藏状态
  const getCollectionStatus = async () => {
    if (!getUserInfo?.userId || !loginStatus.success) return;
    const res = normalizeResult<{ collected: boolean }>(
      await Service.checkCollectionStatus({
        articleId: id,
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      setCollected(res.data.collected);
    }
  };

  // 校验文章点赞状态
  const checkArticleLikeStatus = async () => {
    // 检验是否有userId，如果没有禁止发送请求
    const res = normalizeResult<{ id: string; isLike: boolean }>(
      await Service.checkArticleLikeStatus({
        id,
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      // setLikeStatus(res.data.isLike);
      setIsLike(res.data.isLike);
    }
  };

  // 取消收藏
  const cancelCollected = async () => {
    if (!getUserInfo?.userId || !loginStatus.success) {
      show({ pathname, search });
      closeAlert();
      return;
    }
    const res = normalizeResult<number>(
      await Service.cancelCollected({
        articleId: id,
        userId: getUserInfo?.userId,
      })
    );
    if (res.success) {
      getCollectionStatus();
      sendMeg('CANCEL_COLLECT');
    } else if (res.code === 409) {
      show({ pathname, search });
      closeAlert();
    } else {
      error(res.message);
    }
  };

  // 获取新建的收藏集id
  const getCreateCollectId = (id: string) => {
    setCreateCollectId(id);
  };

  const shareContent = (
    <div className={styles.shareContent}>
      <Popover
        placement="top"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
        content={<Qrcode />}
        overlayClassName={themeMode === 'dark' ? styles.overlayClassName : ''}
      >
        <div className={styles.wechart}>
          <div>
            <MIcons name="icon-weixin1" className={styles.wechartIcon} />
          </div>
          <span>微信</span>
        </div>
      </Popover>
      <div
        className={styles.weibo}
        onClick={() => shareSinaWeiBo(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons name="icon-xinlangweibo" className={styles.weiboIcon} noStopPropagation />
        </div>
        <span>新浪微博</span>
      </div>
      <div
        className={styles.shareQZon}
        onClick={() => shareQQ(detail?.title!, detail?.coverImage)}
      >
        <div>
          <MIcons name="icon-qq" className={styles.qqIcon} noStopPropagation />
        </div>
        <span>QQ</span>
      </div>
    </div>
  );

  return (
    <div className={classname(styles.Multibar, themeMode === 'dark' && styles.dark)}>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-24gf-thumbsUp2"
          className={classname(styles.actionIcon, isLike && styles.likeActionIcon)}
          onClick={onLikeArticle}
          customStyle
        />
        {likeCount! > 0 && <span className={styles.likeCount}>{likeCount}</span>}
      </div>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-pinglun1"
          className={styles.commentIcon}
          onClick={onScrollToComment}
          customStyle
        />
        {commentCount > 0 && (
          <span className={styles.likeCount}>
            {commentCount > 999 ? (
              <span title={(commentCount && JSON.stringify(commentCount)) || ''}>999+</span>
            ) : (
              commentCount
            )}
          </span>
        )}
      </div>
      <div className={styles.actionBtn}>
        <MIcons
          name="icon-31shoucangxuanzhong"
          className={classname(styles.collectionIcon, collected && styles.collectedIcon)}
          onClick={collected ? cancelCollected : onCollection}
          customStyle
        />
      </div>
      <Popover
        placement="rightTop"
        trigger="hover"
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
        content={shareContent}
        overlayClassName={classname(
          styles.shareOverlayClassName,
          themeMode === 'dark' && styles.darkShareOverlayClassName
        )}
      >
        <div className={styles.actionBtn}>
          <MIcons name="icon-tiaoguofenxiang" className={styles.shareIcon} customStyle />
        </div>
      </Popover>
      <CollectionModal
        visible={visible}
        onCancel={onHideCollectModel}
        getAddVisible={getAddVisible}
        createCollectId={createCollectId}
        themeMode={themeMode}
        sendMsg={sendMeg}
      />
      <CreateCollectModel
        key={Math.random()}
        visible={addVisible}
        onCancel={() => setAddVisible(false)}
        showCollection={onCollection}
        getCreateCollectId={getCreateCollectId}
        themeMode={themeMode}
      />
    </div>
  );
};

export default Multibar;
