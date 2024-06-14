/* eslint-disable react/no-danger */
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'antd';
import classname from 'classname';
import Image from '@/components/Image';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult } from '@/utils/tools';
import { formatGapTime, error, replaceCommentContent } from '@/utils';
import { HEAD_UEL } from '@/constant';
import MIcons from '@/components/Icons';
import MAlert from '@/components/MAlert';
import { useLoginStatus, useScroll } from '@/hooks';
import { EventBus } from '@/event';
import {
  CommentParams,
  GiveLikeResult,
  DeleteCommentResult,
  ArticleDetailParams,
} from '@/typings/common';
import DraftInput from '../DraftInput';
import styles from './index.less';

interface IProps {
  authorId: string;
  getCommentLength?: Function;
  themeMode?: string;
  htmlWidth?: number;
  detail?: ArticleDetailParams;
}

const Comments: React.FC<IProps> = ({
  authorId,
  getCommentLength,
  themeMode,
  htmlWidth = 0,
  detail,
}) => {
  const [viewMoreComments, setViewMoreComments] = useState<string[]>([]);
  const [selectComment, setSelectComment] = useState<CommentParams>();
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentParams[]>([]);

  const { id } = useParams();
  const [search] = useSearchParams();
  const needScroll: string | null = search.get('needScroll');
  const { commentRef } = useScroll(needScroll);
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getCommentList();
  }, [id]);

  const getCount = (comments: CommentParams[]) => {
    let count = 0;
    comments.forEach((i) => {
      const length: number = i.replyList?.length || 0;
      count += length + 1;
    });
    return count;
  };

  // 计算评论数
  const getCommentCount = useMemo(() => {
    return getCount(comments);
  }, [comments]);

  // 获取评论列表
  const getCommentList = async () => {
    const res = normalizeResult<CommentParams[]>(
      await Service.getCommentList({ id: id!, userId: getUserInfo?.userId })
    );
    if (res.success) {
      setComments(res.data);
      const count = getCount(res.data);
      EventBus.getCommentNum(count);
      getCommentLength && getCommentLength(res.data);
    } else {
      error(res.message);
    }
  };

  // 收集可以查看全部的commentId
  const onViewMoreReply = (commentId: string) => {
    setViewMoreComments([...viewMoreComments, commentId]);
  };

  // 判断viewMoreComments是否包含commentId，以此返回对应的replyList
  const checkReplyList = (replyList: CommentParams[], commentId: string) => {
    if (viewMoreComments.includes(commentId)) {
      return replyList;
    }
    return replyList.slice(0, 2);
  };

  // 点击回复按钮事件
  const onReplay = (comment: CommentParams, status: boolean) => {
    if (status) {
      setSelectComment({} as any);
    } else {
      setSelectComment(comment);
    }
  };

  // 隐藏回复输入框
  const onHideInput = () => {
    setSelectComment({} as any);
  };

  // 点赞接口
  const onGiveLike = async (comment: CommentParams, isThreeTier?: boolean) => {
    if (loading) return;
    if (!getUserInfo) {
      setAlertStatus && setAlertStatus(true);
      return;
    }
    const params = isThreeTier
      ? {
        commentId: comment.commentId!,
        fromCommentId: comment.commentId!,
        userId: getUserInfo?.userId,
      }
      : {
        commentId: comment.commentId!,
        userId: getUserInfo?.userId,
      };
    setLoading(true);
    const res = normalizeResult<GiveLikeResult>(await Service.giveLike(params));
    setLoading(false);
    if (res.success) {
      getCommentList && getCommentList();
    }
    if (!res.success && res.code === 409) {
      setAlertStatus && setAlertStatus(true);
    }
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  // 删除评论
  const onDeleteComment = (comment: CommentParams, isThreeTier?: boolean) => {
    const params = isThreeTier
      ? {
        commentId: comment.commentId!,
        fromCommentId: comment.commentId!,
        articleId: id,
      }
      : {
        commentId: comment.commentId!,
        articleId: id,
      };
    Modal.confirm(modalConfig(params));
  };

  const modalConfig = (params: {
    commentId: string;
    fromCommentId?: string;
    articleId: string | undefined;
  }) => {
    return {
      title: '确定删除该评论吗？',
      className:
        htmlWidth < 960
          ? classname(
            styles.removeCommentConfirm,
            themeMode === 'dark' && styles.darkRemoveCommentConfirm
          )
          : '',
      centered: htmlWidth < 960,
      width: htmlWidth < 960 ? '80%' : '',
      async onOk() {
        deleteComment(params);
      },
    };
  };

  // 删除评论接口
  const deleteComment = async (params: {
    commentId: string;
    fromCommentId?: string;
    articleId: string | undefined;
  }) => {
    const res = normalizeResult<DeleteCommentResult>(await Service.deleteComment(params));
    if (res.success) {
      getCommentList && getCommentList();
    }
    if (!res.success && res.code === 409) {
      setAlertStatus && setAlertStatus(true);
    }
    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  const toPersonal = (userId: string) => {
    navigate(`/personal?id=${userId}`);
  };

  return (
    <div
      className={classname(styles.Comments, themeMode === 'dark' && styles.dark)}
      ref={commentRef}
    >
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <div className={styles.draftInputWrap}>
        <DraftInput
          getCommentList={getCommentList}
          focus={false}
          getAlertStatus={setAlertStatus}
          onJump={() => toPersonal(authorId)}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
          detail={detail}
        />
      </div>
      {comments?.length > 0 && (
        <div className={styles.title}>
          全部评论<span className={styles.replyCount}>{getCommentCount}</span>
        </div>
      )}
      {comments?.length > 0 &&
        comments.map((i) => {
          return (
            <div className={styles.commentWrap} key={i.commentId}>
              <div className={styles.avatar}>
                <Image
                  url={i.headUrl || HEAD_UEL}
                  transitionImg={HEAD_UEL}
                  className={styles.image}
                  onClick={() => toPersonal(i.userId)}
                />
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentMain}>
                  <div className={styles.userInfo}>
                    <span className={styles.name}>{i.username}</span>
                    <span className={styles.date}>{formatGapTime(i.date)}</span>
                  </div>
                  <div className={styles.desc} dangerouslySetInnerHTML={{ __html: replaceCommentContent(i.content || '') }} />
                  <div className={styles.action}>
                    <div className={styles.actionContent}>
                      <div className={styles.likeAndReplay}>
                        <MIcons
                          name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'
                            }`}
                          text={i.likeCount! > 0 ? i.likeCount : '点赞'}
                          iconWrapClass={styles.iconWrap}
                          className={i.isLike ? styles.isLike : null}
                          onClick={() => onGiveLike(i)}
                        />
                        <MIcons
                          name="icon-comment"
                          className={
                            selectComment?.commentId === i.commentId
                              ? styles.cancelReplay
                              : null
                          }
                          text={
                            selectComment?.commentId === i.commentId ? (
                              <span className={styles.cancelReplay} id="ON_REPLAY">
                                取消回复
                              </span>
                            ) : (
                              <span>{i.replyList?.length || '回复'}</span>
                            )
                          }
                          iconWrapClass={styles.iconWrap}
                          onClick={() =>
                            onReplay(i, selectComment?.commentId === i.commentId)
                          }
                        />
                      </div>
                      {getUserInfo?.userId === i.userId && (
                        <Button
                          type="link"
                          className={styles.deleteComment}
                          onClick={() => onDeleteComment(i)}
                        >
                          删除
                        </Button>
                      )}
                    </div>
                    {selectComment?.commentId === i.commentId && (
                      <DraftInput
                        showAvatar={false}
                        className={styles.draftContent}
                        selectComment={selectComment}
                        onReplay={onReplay}
                        getCommentList={getCommentList}
                        onHideInput={onHideInput}
                        getAlertStatus={setAlertStatus}
                        themeMode={themeMode}
                        htmlWidth={htmlWidth}
                      />
                    )}
                  </div>
                </div>
                {i.replyList && i.replyList.length > 0 && (
                  <div className={styles.commentChild}>
                    {checkReplyList(i.replyList, i.commentId!).map((j) => {
                      return (
                        <div className={styles.commentChildItem} key={j.commentId}>
                          <div className={styles.avatar}>
                            <Image
                              url={j.headUrl || HEAD_UEL}
                              transitionImg={HEAD_UEL}
                              className={styles.image}
                              onClick={() => toPersonal(j.userId)}
                            />
                          </div>
                          <div className={styles.commentChildItemContent}>
                            <div className={styles.userInfo}>
                              <span className={styles.name}>
                                <span>{j.username}</span>
                                {j.userId === authorId && (
                                  <span className={styles.isAuthor}>(作者)</span>
                                )}
                                {j.fromUsername && (
                                  <span className={styles.replyInfo}>
                                    回复
                                    <span className={styles.fromUsername}>
                                      {j.fromUsername}
                                    </span>
                                  </span>
                                )}
                              </span>
                              <span className={styles.date}>{formatGapTime(j.date)}</span>
                            </div>
                            {j.content && <div className={styles.desc} dangerouslySetInnerHTML={{ __html: replaceCommentContent(j.content || '') }} />}
                            {j.formContent && (
                              <div className={styles.formContent}>
                                {`“${j.formContent}”`}
                              </div>
                            )}
                            <div className={styles.action} id="ON_REPLAY">
                              <div className={styles.actionContent}>
                                <div className={styles.likeAndReplay}>
                                  <MIcons
                                    name={`${j.isLike
                                      ? 'icon-24gf-thumbsUp2'
                                      : 'icon-24gl-thumbsUp2'
                                      }`}
                                    text={j.likeCount! > 0 ? j.likeCount : '点赞'}
                                    iconWrapClass={styles.iconWrap}
                                    className={j.isLike ? styles.isLike : null}
                                    onClick={() => onGiveLike(j, true)}
                                  />
                                  <MIcons
                                    name="icon-comment"
                                    className={
                                      selectComment?.commentId === j.commentId
                                        ? styles.cancelReplay
                                        : null
                                    }
                                    text={
                                      selectComment?.commentId === j.commentId ? (
                                        <span
                                          className={styles.cancelReplay}
                                          id="ON_REPLAY"
                                        >
                                          取消回复
                                        </span>
                                      ) : (
                                        <span>回复</span>
                                      )
                                    }
                                    iconWrapClass={styles.iconWrap}
                                    onClick={() =>
                                      onReplay(j, selectComment?.commentId === j.commentId)
                                    }
                                  />
                                </div>
                                {getUserInfo?.userId === j.userId && (
                                  <Button
                                    type="link"
                                    className={styles.deleteComment}
                                    onClick={() => onDeleteComment(j, true)}
                                  >
                                    删除
                                  </Button>
                                )}
                              </div>
                              {selectComment?.commentId === j.commentId && (
                                <DraftInput
                                  showAvatar={false}
                                  className={styles.draftContent}
                                  selectComment={selectComment}
                                  isThreeTier
                                  onReplay={onReplay}
                                  getCommentList={getCommentList}
                                  onHideInput={onHideInput}
                                  getAlertStatus={setAlertStatus}
                                  themeMode={themeMode}
                                  htmlWidth={htmlWidth}
                                  textAreaWrapH5={styles.textAreaWrapH5}
                                  emojiWrapH5={styles.emojiWrapH5}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {checkReplyList(i.replyList, i.commentId!).length !==
                      i.replyList.length && (
                        <div
                          className={styles.viewMore}
                          onClick={() => onViewMoreReply(i.commentId!)}
                        >
                          <span className={styles.viewText}>
                            查看更多（{i.replyList && i.replyList.length - 2}条）回复
                          </span>
                          <MIcons
                            name="icon-xiajiantou"
                            iconWrapClass={styles.iconWrap}
                            onClick={() => onViewMoreReply(i.commentId!)}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default Comments;
