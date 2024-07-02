import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import { useLoginStatus, useHtmlWidth, useVerifyToken, useGetTheme } from '@/hooks';
import * as Service from '@/service';
import { normalizeResult, storage, success, error, info } from '@/utils';
import MAlert from '@/components/MAlert';
import Content from '@/components/Content';
import UploadFile from '@/components/Upload';
import Image from '@/components/Image';
import ActionIcon from '@/components/ActionIcon';
import MDropdown from '@/components/MDropdown';
import { HEAD_UEL, UPDATE_INFO_API_PATH, MAIN_COVER } from '@/constant';
import { LoginData } from '@/typings/common';
import styles from './index.less';

const { TextArea } = Input;

const Profile: React.FC = () => {
  const [filePath, setFilePath] = useState<string>(HEAD_UEL);
  const [mainCoverPath, setMainCoverPath] = useState<string>(MAIN_COVER);

  // 校验token是否过期
  useVerifyToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userInfoStore } = useStore();
  const { showAlert, toLogin, onCloseAlert, setAlertStatus } = useLoginStatus();
  const {
    getUserInfo: { headUrl, mainCover, username, userId, job, motto, introduce },
  } = userInfoStore;
  const { htmlWidth } = useHtmlWidth();
  const { themeMode } = useGetTheme();

  useEffect(() => {
    if (mainCover) {
      setMainCoverPath(mainCover);
    }
    if (headUrl) {
      setFilePath(headUrl);
    }
  }, [mainCover, headUrl]);

  // 获取上传到的图片
  const getUploadFilePath = async (url: string, needPreview: boolean) => {
    await updateUserImage(needPreview ? { headUrl: url } : { mainCover: url });
  };

  // 更改用户头像、封面图
  const updateUserImage = async (params: { headUrl?: string; mainCover?: string }) => {
    const res = normalizeResult<LoginData>(
      await Service.updateInfo(
        {
          ...params,
          userId,
        },
        UPDATE_INFO_API_PATH[1]
      )
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
    }
  };

  // 修改用户信息
  const onUpdateUserInfo = async () => {
    const values = await form.validateFields();
    if (
      values.username !== username ||
      values.job !== job ||
      values.motto !== motto ||
      values.introduce !== introduce ||
      headUrl !== filePath ||
      mainCover !== mainCoverPath
    ) {
      const res = normalizeResult<LoginData>(
        await Service.updateInfo(
          {
            ...values,
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
        if (values.username !== username) {
          storage.ssnRemoveItem('token');
          storage.ssnRemoveItem('userInfo');
          success('用户名称已修改，请重新登录');
          navigate('/login', { replace: true });
        } else {
          success(res.message);
        }
      }
      if (!res.success && res.code !== 401 && res.code !== 409) {
        error(res.message);
      }
    } else {
      info('没修改信息，休想提交');
    }
  };

  return (
    <div className={classname(styles.Profile, themeMode === 'dark' && styles.dark)}>
      <ActionIcon
        noHideMenuIcon
        className={styles.changeIconWrap}
        themeMode={themeMode}
        htmlWidth={htmlWidth}
      />
      {showAlert && <MAlert onClick={toLogin} onClose={onCloseAlert} />}
      <Content
        containerClassName={styles.containerClassName}
        wrapClassName={styles.wrapClassName}
        className={styles.scrollWrap}
        themeMode={themeMode}
      >
        <div className={styles.header}>
          <div className={styles.title}>
            <div className={styles.infoText}>
              <span>个人资料</span>
              {htmlWidth < 960 && (
                <MDropdown
                  overlayClassName={themeMode === 'dark' ? styles.overlayClassName : ''}
                />
              )}
            </div>
            <div className={styles.mainCover}>
              <Image
                url={mainCoverPath}
                transitionImg={MAIN_COVER}
                className={styles.image}
                imageWrapStyle={styles.imageWrapStyle}
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
              getUploadFilePath={getUploadFilePath}
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
              getUploadFilePath={getUploadFilePath}
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
              <Form.Item label="用户名" name="username" initialValue={username}>
                <Input placeholder="请输入用户名" maxLength={50} />
              </Form.Item>
              <Form.Item label="职位" name="job" initialValue={job}>
                <Input placeholder="请输入职位" maxLength={50} />
              </Form.Item>
              <Form.Item label="座右铭" name="motto" initialValue={motto}>
                <Input placeholder="请输入座右铭" maxLength={50} />
              </Form.Item>
              <Form.Item label="个人介绍" name="introduce" initialValue={introduce}>
                <TextArea
                  placeholder="请输入个人介绍"
                  rows={3}
                  autoSize={{ minRows: 4, maxRows: 10 }}
                  maxLength={100}
                  showCount
                />
              </Form.Item>
              <Form.Item
                wrapperCol={
                  htmlWidth > 576 ? { offset: 6, span: 13 } : { offset: 0, span: 13 }
                }
              >
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
