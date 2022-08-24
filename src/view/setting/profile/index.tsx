import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import useStore from '@/store';
import { useLoginStatus } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, encrypt } from '@/utils';
import MAlert from '@/components/Alert';
import Content from '@/components/Content';
import UploadFile from '@/components/Upload';
import Image from '@/components/Image';
import { HEAD_UEL, UPDATE_INFO_API_PATH, MAIN_COVER } from '@/constant';
import { LoginData } from '@/typings/common';
import styles from './index.less';

const { TextArea } = Input;

const Profile: React.FC = () => {
  const [filePath, setFilePath] = useState<string>(HEAD_UEL);
  const [mainCoverPath, setMainCoverPath] = useState<string>(MAIN_COVER);

  const [form] = Form.useForm();
  const { userInfoStore } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    getUserInfo: { headUrl, mainCover, username, userId, job, motto, introduce },
  } = userInfoStore;

  useEffect(() => {
    if (mainCover) {
      setMainCoverPath(mainCover);
    }
    if (headUrl) {
      setFilePath(headUrl);
    }
  }, [mainCover, headUrl]);

  // 修改用户信息
  const onUpdateUserInfo = async () => {
    const values = await form.validateFields();
    const info = {
      ...values,
      username: encrypt(values.username),
    };
    const res = normalizeResult<LoginData>(
      await Service.updateInfo(
        {
          ...info,
          headUrl: filePath,
          mainCover: mainCoverPath,
          userId,
        },
        UPDATE_INFO_API_PATH[1]
      )
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      message.success(res.message, 2);
    } else {
      message.error(res.message, 2);
    }
  };

  return (
    <div className={styles.Profile}>
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        className={styles.scrollWrap}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <span>个人资料</span>
            <div className={styles.mainCover}>
              <Image
                url={mainCoverPath || MAIN_COVER}
                transitionImg={MAIN_COVER}
                className={styles.image}
              />
            </div>
            <UploadFile
              formLabel="mainCover"
              form={form}
              filePath={mainCoverPath}
              setFilePath={setMainCoverPath}
              setAlertStatus={setAlertStatus}
              uploadWrapStyle={styles.uploadWrapStyle}
              aspectRatio={888 / 228}
              needPreview={false}
              uploadStyle={styles.uploadStyle}
              listType="text"
              uploadNode={
                <Button ghost className={styles.changeCover}>
                  编辑封面图片
                </Button>
              }
            />
          </div>
          <div className={styles.headerWrap}>
            <UploadFile
              form={form}
              filePath={filePath}
              setFilePath={setFilePath}
              setAlertStatus={setAlertStatus}
              imgStyle={styles.uploadImg}
              markStyle={styles.markStyle}
              uploadWrapStyle={styles.uploadWrapStyle}
              transitionImg={HEAD_UEL}
            />
            <div className={styles.username}>{username}</div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.formWrap}>
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 13 }}
              layout="horizontal"
              form={form}
              name="form"
            >
              <Form.Item
                label="用户名"
                name="username"
                initialValue={username}
                rules={[{ required: true, message: '请先输入用户名' }]}
              >
                <Input placeholder="请输入用户名" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="职位"
                name="job"
                initialValue={job}
                rules={[{ required: true, message: '请先输入职位' }]}
              >
                <Input placeholder="请输入职位" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="座右铭"
                name="motto"
                initialValue={motto}
                rules={[{ required: true, message: '请先输入座右铭' }]}
              >
                <Input placeholder="请输入座右铭" maxLength={50} />
              </Form.Item>
              <Form.Item
                label="个人介绍"
                name="introduce"
                initialValue={introduce}
                rules={[{ required: true, message: '请先输入个人介绍' }]}
              >
                <TextArea
                  placeholder="请输入个人介绍"
                  rows={3}
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  maxLength={100}
                  showCount
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 13 }}>
                <Button type="primary" className={styles.submit} onClick={onUpdateUserInfo}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Profile;
