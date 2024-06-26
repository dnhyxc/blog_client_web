import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Popover } from 'antd';
import { useParams } from 'react-router-dom';
import classname from 'classname';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error, insertContent } from '@/utils';
import Image from '@/components/Image';
import { HEAD_UEL } from '@/constant';
import { sendMessage } from '@/socket';
import Emoji from '@/components/Emoji';
import UploadFile from '@/components/Upload';
import { ArticleDetailParams, CommentParams, ReplayCommentResult, LoginData } from '@/typings/common';
import styles from './index.less';

const { TextArea } = Input;

interface IProps {
  showAvatar?: boolean;
  className?: string;
  selectComment?: CommentParams;
  isThreeTier?: boolean;
  onReplay?: Function;
  getCommentList?: Function;
  onHideInput?: Function;
  getAlertStatus?: Function;
  focus?: boolean;
  onJump?: Function;
  themeMode?: string;
  htmlWidth?: number;
  textAreaWrapH5?: string;
  emojiWrapH5?: string;
  detail?: ArticleDetailParams;
}

const DraftInput: React.FC<IProps> = ({
  showAvatar = true,
  className,
  selectComment,
  isThreeTier,
  onJump,
  onReplay,
  getCommentList,
  onHideInput,
  focus = true,
  getAlertStatus,
  themeMode,
  htmlWidth = 0,
  textAreaWrapH5,
  emojiWrapH5,
  detail,
}) => {
  const [showIcon, setShowIcon] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');

  const { id } = useParams();

  const inputRef: any = useRef();

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    window.addEventListener('click', onClickNode);
    return () => {
      window.removeEventListener('click', onClickNode);
    };
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current && focus) {
      inputRef.current.focus({
        cursor: 'end',
      });
    }
  }, [inputRef, focus]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keyword, inputRef]);

  // 监听是否是ctrl+enter组合键
  const onKeyDown = (event: any) => {
    if (event.ctrlKey && event.keyCode === 13) {
      submitComment();
      inputRef.current.blur();
    }
  };

  // window点击事件，判断点击的元素是否存在id，如果不存在则隐藏相关按钮或输入框
  const onClickNode = (e: any) => {
    if (!e.target.id) {
      setShowIcon(false);
      // 隐藏回复评论的输入框
      // onHideInput && onHideInput();
    }
  };

  const onFocus = () => {
    setShowIcon(true);
  };

  // 输入框onchange事件
  const onCommentChange = (e: any) => {
    setKeyword(e.target.value);
  };

  // 发布评论
  const submitComment = async () => {
    if (!keyword.trim()) return;
    if (!getUserInfo) {
      getAlertStatus && getAlertStatus(true);
      onReplay && onReplay({}, true);
      setKeyword('');
      setShowIcon(false);
      return;
    }
    const params = {
      userId: getUserInfo?.userId,
      username: getUserInfo?.username,
      articleId: id || '',
      date: new Date().valueOf(),
      content: keyword,
      commentId: selectComment?.commentId,
      fromUsername: selectComment?.username,
      fromUserId: selectComment?.userId,
      formContent: selectComment?.content,
      fromCommentId: selectComment?.commentId,
    };

    if (!isThreeTier) {
      delete params.fromUsername;
      delete params.fromUserId;
      delete params.formContent;
      delete params.fromCommentId;
    }

    const res = normalizeResult<ReplayCommentResult>(await Service.releaseComment(params));

    onReplay && onReplay({}, true);
    setKeyword('');
    setShowIcon(false);

    if (res.success) {
      getCommentList && getCommentList();
      if (
        !isThreeTier &&
        !selectComment?.commentId &&
        detail &&
        getUserInfo?.userId! !== detail?.authorId &&
        getUserInfo?.userId !== detail?.authorId
      ) {
        const data = { ...detail };
        // @ts-ignore
        delete data.content;
        sendMessage(
          JSON.stringify({
            action: 'push',
            data: {
              ...data,
              toUserId: data?.authorId,
              articleId: data?.id,
              fromUsername: getUserInfo?.username,
              fromUserId: getUserInfo?.userId,
              action: 'COMMENT',
            },
            userId: getUserInfo?.userId,
          })
        );
      }
    }

    if (!res.success && res.code === 409) {
      getAlertStatus && getAlertStatus(true);
    }

    if (!res.success && res.code !== 409 && res.code !== 401) {
      error(res.message);
    }
  };

  const onVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  // 添加表情
  const addEmoji = (key: string) => {
    const value = insertContent({ keyword, node: (inputRef?.current as any).resizableTextArea?.textArea, emoji: key });
    setKeyword(value);
  };

  const content = (
    <Emoji addEmoji={addEmoji} setVisible={setVisible} />
  );

  // 获取上传到的图片
  const getUploadFilePath = async (url: string) => {
    setShowIcon(true);
    const value = insertContent({
      keyword,
      node: (inputRef?.current as any).resizableTextArea?.textArea,
      username: getUserInfo.username,
      url,
    });
    setKeyword(value);
    inputRef.current.focus({
      cursor: 'end',
    });
  };

  return (
    <div className={styles.DraftInput} id="DRAFT_INPUT">
      {showAvatar && (
        <div id="COMMENTS" className={styles.comments}>
          评论
        </div>
      )}
      <div className={classname(className, styles.content)} id="CONTENT">
        {showAvatar && (
          <div className={styles.avatar} id="AVATAR">
            <Image
              url={getUserInfo?.headUrl || HEAD_UEL}
              transitionImg={HEAD_UEL}
              className={styles.image}
              id="IMAGE"
              onClick={onJump}
            />
          </div>
        )}
        <div className={styles.input} id="INPUT">
          <div
            className={classname(styles.textAreaWrap, textAreaWrapH5)}
            id="TEXTAREA_WRAP"
          >
            <TextArea
              placeholder={
                selectComment?.content
                  ? `回复 ${selectComment?.content}...`
                  : '请输入评论（Enter换行，Ctrl + Enter 发送）'
              }
              autoSize={{ minRows: 3 }}
              className={classname(
                styles.textArea,
                themeMode === 'dark' && styles.darkTextArea
              )}
              value={keyword}
              onFocus={onFocus}
              id="TEXTAREA_WRAP"
              ref={inputRef}
              onChange={onCommentChange}
            />
          </div>
          {(showIcon || !showAvatar) && (
            <div className={classname(styles.emojiWrap, emojiWrapH5, !showIcon && styles.hide)} id="EMOJI_WRAP" key={showIcon ? 1 : 2}>
              <div id="ICONFONT" className={styles.iconfontWrap}>
                <Popover visible={visible} placement="bottomLeft" content={content} trigger="click" title={null} overlayClassName={styles.emojiPopover} overlayInnerStyle={{ padding: 0 }} onVisibleChange={onVisibleChange}>
                  <span
                    className={classname(styles.iconfont, 'iconfont icon-xiaolian')}
                    id="BIAOQING_XUE"
                  >
                    <span id="BIAOQING_XUE" className={styles.iconText}>
                      表情
                    </span>
                  </span>
                </Popover>
                <UploadFile
                  formLabel="mainCover"
                  uploadWrapStyle={styles.uploadWrapStyle}
                  aspectRatio={0}
                  needPreview={false}
                  uploadStyle={styles.uploadStyle}
                  listType="text"
                  getUploadFilePath={getUploadFilePath}
                  uploadNode={
                    <div
                      className={classname(styles.iconfont, 'iconfont icon-tupian')}
                      id="CHARUTUPIAN"
                    >
                      <span id="CHARUTUPIAN" className={styles.iconText}>
                        图片
                      </span>
                    </div>
                  }
                />
              </div>
              <div id="ACTION" className={themeMode === 'dark' ? styles.darkBtn : ''}>
                {htmlWidth > 960 && (
                  <span id="ENTER" className={styles.enter}>
                    Ctrl + Enter
                  </span>
                )}
                <Button
                  id="BTN"
                  type="primary"
                  disabled={!keyword.trim()}
                  onClick={submitComment}
                >
                  <span id="BTN">发表评论</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftInput;
