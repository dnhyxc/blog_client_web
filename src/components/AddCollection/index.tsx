import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Radio, Button } from 'antd';
import useStore from '@/store';
import * as Service from '@/service';
import { normalizeResult, error, success } from '@/utils';
import { AddCollectionRes } from '@/typings/common';
import styles from './index.less';

interface IProps {
  visible: boolean;
  onCancel: Function;
  collectInfo?: AddCollectionRes;
  showCollection?: Function;
  callback?: Function;
  updateCollection?: Function;
}

const { TextArea } = Input;

const AddCollection: React.FC<IProps> = ({
  visible,
  onCancel,
  showCollection,
  callback,
  collectInfo = null,
  updateCollection,
}) => {
  const [collectionName, setCollectionName] = useState<string>('');
  const [form] = Form.useForm();
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  useEffect(() => {
    if (collectInfo?.name) {
      setCollectionName(collectInfo?.name);
    }
  }, [collectInfo]);

  const onChangeCollectionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setCollectionName(value);
  };

  const onClose = () => {
    onCancel();
    showCollection && showCollection();
  };

  // 新建
  const create = async () => {
    const values = form.getFieldsValue();
    const res = normalizeResult<AddCollectionRes>(
      await Service.createCollection({ ...values, userId: getUserInfo?.userId })
    );
    if (!res.success) {
      error(res.message);
    } else {
      success(res.message);
      onCancel();
      showCollection && showCollection();
      callback && callback(res.data);
    }
  };

  // 更新
  const update = async () => {
    if (!collectInfo?.id) return;
    const values = form.getFieldsValue();
    const res = normalizeResult<{ id: string }>(
      await Service.updateCollection({
        ...values,
        userId: getUserInfo?.userId,
        id: collectInfo?.id,
      })
    );
    if (res.success) {
      success(res.message);
      onCancel();
      updateCollection && updateCollection({ ...values, id: collectInfo?.id });
    } else {
      error(res.message);
    }
  };

  const onSubmit = async () => {
    if (!getUserInfo?.userId) return;
    if (!collectInfo?.id) {
      create();
    } else {
      update();
    }
  };

  return (
    <Modal
      title="新建收藏集"
      width={520}
      centered
      visible={visible}
      wrapClassName={styles.wrapClassName}
      onCancel={onClose}
      keyboard
      maskClosable={false}
      footer={[
        <Button key="back" type="primary" ghost className={styles.action} onClick={onClose}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          className={styles.action}
          onClick={onSubmit}
          disabled={!collectionName}
        >
          确定
        </Button>,
      ]}
    >
      <div className={styles.AddCollection}>
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          form={form}
          name="form"
        >
          <Form.Item label="名称" name="name" initialValue={collectInfo?.name}>
            <Input
              placeholder="请输入收藏集名称"
              maxLength={50}
              value={collectionName}
              onChange={(e) => onChangeCollectionName(e)}
            />
          </Form.Item>
          <Form.Item label="描述" name="desc" initialValue={collectInfo?.desc}>
            <TextArea
              placeholder="请输入收藏集描述"
              rows={5}
              autoSize={{ minRows: 5, maxRows: 10 }}
              maxLength={100}
              showCount
            />
          </Form.Item>
          <Form.Item
            name="status"
            wrapperCol={{ offset: 1, span: 20 }}
            initialValue={collectInfo?.status || 1}
          >
            <Radio.Group className={styles.radioGroup}>
              <Radio value={1} className={styles.radio}>
                <span>公开</span>
                <span className={styles.info}>当其他人关注此收藏集后不可再更改为隐私</span>
              </Radio>
              <Radio value={2}>
                <span>隐私</span>
                <span className={styles.info}>仅自己可见此收藏集</span>
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddCollection;
