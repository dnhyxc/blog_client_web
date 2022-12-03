import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import classname from 'classname';
import { observer } from 'mobx-react';
import useStore from '@/store';
import Header from '@/components/Header';
import TuiEditor from '@/components/TuiEditor';
import {
  useGetArticleDetail,
  useDebounce,
  useVerifyToken,
  useGetSiderVisible,
  useHtmlWidth,
} from '@/hooks';
import * as Server from '@/service';
import { normalizeResult, info, success, error } from '@/utils';
import { ARTICLE_DRAFT } from '@/constant';
import {
  CreateArticleParams,
  CreateDraftParams,
  CreateDraftParamsResult,
} from '@/typings/common';
import ReleaseModel from './ReleaseModel';
import DraftPopover from './DraftPopover';

import styles from './index.less';

interface IProps {}

const CreateArticle: React.FC<IProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [draftArticleId, setDraftArticleId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');

  // 校验token是否过期
  useVerifyToken();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const [search] = useSearchParams();
  const id = search.get('id');
  const draftId = search.get('draftId');
  const { detail } = useGetArticleDetail({ id, draftId, visible, draftArticleId });
  const { htmlWidth } = useHtmlWidth();
  const { siderVisible } = useGetSiderVisible();

  const onGetMackdown = (mackdown: any) => {
    setContent(mackdown.trim());
  };

  useEffect(() => {
    if (visible || id) return;
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [content, visible, id]);

  useEffect(() => {
    if (deleteId === draftId) {
      window.location.href = '/create';
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
    if (res.message) {
      const { id } = res.data;
      setDraftArticleId(id);
      success(res.message);
    } else {
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
        ...values,
        content: content || (detail?.content as string),
        createTime: values?.createTime?.valueOf() || new Date().valueOf(),
        authorId: getUserInfo?.userId,
        articleId: draftId || draftArticleId,
      };

      if (!draftArticleId && !draftId) delete params.articleId;

      articleDraft(params, ARTICLE_DRAFT[draftArticleId || draftId ? 2 : 1]);
    },
    500,
    [visible, content, detail],
    true
  );

  // 删除草稿
  const deleteDraft = async (id?: string, needMessage?: boolean) => {
    if (!draftId && !id) return;
    const res = normalizeResult<string>(await Server.deleteDraft({ id: id || draftId }));
    if (!needMessage) return;
    setDeleteId(res.data);
  };

  const renderRight = () => {
    return (
      <span>
        <Button
          type="link"
          className={styles.release}
          disabled={!content && !detail?.content}
          onClick={() => setVisible(true)}
        >
          发布文章
        </Button>
        <DraftPopover deleteDraft={deleteDraft} />
      </span>
    );
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <Header right={renderRight()}>发布文章</Header>
      <div
        className={classname(
          styles.tuiEditorWrap,
          siderVisible && htmlWidth > 960 && styles.changeHeight
        )}
      >
        <TuiEditor
          onGetMackdown={onGetMackdown}
          initialValue={detail?.content}
          siderVisible={siderVisible}
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
        />
      )}
    </div>
  );
};

export default observer(CreateArticle);
