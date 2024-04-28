import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import classname from 'classname';
import { observer } from 'mobx-react';
import useStore from '@/store';
import Header from '@/components/Header';
import ActionIcon from '@/components/ActionIcon';
import TuiEditor from '@/components/TuiEditor';
import {
  useGetArticleDetail,
  useDebounce,
  useVerifyToken,
  useGetSiderVisible,
  useHtmlWidth,
  useGetTheme,
} from '@/hooks';
import * as Server from '@/service';
import { normalizeResult, info, success, error } from '@/utils';
import { ARTICLE_DRAFT } from '@/constant';
import {
  CreateArticleParams,
  CreateDraftParams,
  CreateDraftParamsResult,
  ArticleDetailParams,
} from '@/typings/common';
import ReleaseModel from './ReleaseModel';
import DraftPopover from './DraftPopover';

import styles from './index.less';

interface IProps {
}

const CreateArticle: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [draftArticleId, setDraftArticleId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);

  // 校验token是否过期
  useVerifyToken();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const id = search.get('id');
  const draftId = search.get('draftId');
  const { detail, setDetail } = useGetArticleDetail({
    id,
    draftId,
    visible,
    draftArticleId,
  });
  const { htmlWidth } = useHtmlWidth();
  const { siderVisible } = useGetSiderVisible();
  const { themeMode } = useGetTheme();

  const onGetMackdown = (mackdown: any) => {
    setContent(mackdown.trim());
  };

  useEffect(() => {
    if (visible) return;
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [content, visible]);

  useEffect(() => {
    if (deleteId === draftId) {
      setDetail({ content: '' } as ArticleDetailParams);
      navigate('/create');
    }
  }, [deleteId, draftId]);

  // 监听是否是ctrl+enter组合键
  const onKeyDown = (event: any) => {
    if (event.ctrlKey && event.keyCode === 13) {
      onSaveDraft();
    }
  };

  // 文章草稿的创建及更新接口
  const articleDraft = async (params: CreateArticleParams, path: string) => {
    const res = normalizeResult<CreateDraftParamsResult>(
      await Server.articleDraft(params, path)
    );
    if (res.success) {
      setDraftArticleId(res.data?.id);
      success(res.message);
      setVisible(false);
    }

    if (!res.success && res.code !== 401 && res.code !== 409) {
      error(res.message);
    }
  };

  // 保存草稿
  const onSaveDraft = useDebounce(
    async (values: CreateArticleParams) => {
      if (!content && !detail?.content) {
        info('嘿，醒醒！文章还一个字没写呢...');
        return;
      }

      const params: CreateDraftParams = {
        ...detail,
        ...values,
        content: content || detail?.content!,
        createTime: values?.createTime?.valueOf() || new Date().valueOf(),
        authorId: getUserInfo?.userId,
        articleId: draftId || draftArticleId,
        originalArticleId: id || detail?.originalArticleId,
      };

      if (!draftArticleId && !draftId) delete params.articleId;

      articleDraft(params, ARTICLE_DRAFT[draftArticleId || draftId ? 2 : 1]);
    },
    500,
    [visible, content, id, draftArticleId, draftId],
    true
  );

  // 删除草稿
  const deleteDraft = async (id?: string, needMessage?: boolean) => {
    if (!draftId && !id && !draftArticleId) return;
    const res = normalizeResult<string>(
      await Server.deleteDraft({ id: id || draftArticleId || draftId })
    );
    if (!needMessage) return;
    setDeleteId(res.data);
    // 如果删除的草稿id等于新创建的草稿id，则需要清空草稿id
    if (res.data === draftArticleId) {
      setDraftArticleId('');
    }
  };

  // 显示草稿弹窗
  const showDraftDrawer = () => {
    setDrawerVisible(true);
  };

  const hideDraftDrawer = () => {
    setDrawerVisible(false);
  };

  const renderRight = () => {
    return (
      <span>
        <Button
          type="link"
          className={classname(styles.release, themeMode === 'dark' && styles.darkRelease)}
          disabled={!content && !detail?.content}
          onClick={() => setVisible(true)}
        >
          发布文章
        </Button>
        {htmlWidth <= 960 && (
          <Button type="link" className={styles.draftBtn} onClick={showDraftDrawer}>
            草稿箱
          </Button>
        )}
        <DraftPopover
          deleteDraft={deleteDraft}
          hideDraftDrawer={hideDraftDrawer}
          drawerVisible={drawerVisible}
          themeMode={themeMode}
        />
      </span>
    );
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      {htmlWidth <= 960 && (
        <ActionIcon
          noHideMenuIcon
          className={styles.changeIconWrap}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
        />
      )}
      <Header right={renderRight()} themeMode={themeMode}>
        发布文章
      </Header>
      <div
        className={classname(
          styles.tuiEditorWrap,
          siderVisible && htmlWidth > 960 && styles.changeHeight,
          themeMode === 'dark' && styles.dark
        )}
      >
        <TuiEditor
          key={detail?.content}
          onGetMackdown={onGetMackdown}
          initialValue={detail?.content}
          siderVisible={siderVisible}
          onSaveDraft={onSaveDraft}
          themeMode={themeMode}
          htmlWidth={htmlWidth}
        />
      </div>
      {visible && (
        <ReleaseModel
          visible={visible}
          content={content || detail!.content}
          onCancel={onCancel}
          initialValue={detail}
          articleId={id}
          onSaveDraft={onSaveDraft}
          deleteDraft={deleteDraft}
          themeMode={themeMode}
        />
      )}
    </div>
  );
};

export default observer(CreateArticle);
