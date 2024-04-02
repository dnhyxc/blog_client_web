/*
 * @Description: 登录页
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\view\login\index.tsx
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Checkbox, InputNumber } from 'antd';
import classname from 'classname';
import useStore from '@/store';
import { register, login, verify, resetPassword, verifyCode } from '@/service';
import {
  normalizeResult,
  useCookies,
  encrypt,
  decrypt,
  success,
  error,
  verifyUsername,
  verifyPassword,
  verifyPhone,
  drawCharater,
} from '@/utils';
import { close } from '@/components/Render';
import { LoginData, VerifyCodeParams } from '@/typings/common';
import styles from './index.less';

const { getCoolie, setCookie, removeCoolie } = useCookies;

const Login = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [resetUname, setResetUname] = useState<string>(getCoolie('uname') as string);
  const [resetPwd, setResetPwd] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<number>();
  const [verifyPwd, setVerifyPwd] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [verifyCodeInfo, setVerifyCodeInfo] = useState<Partial<VerifyCodeParams>>({});
  const [isRegister, setIsRegster] = useState(false);

  const { userInfoStore, commonStore } = useStore();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [search] = useSearchParams();
  const verifyPath = search.get('verify');
  const query = search.get('search');
  const pathname = search.get('pathname');

  const canvasCtxRef = useRef(null);

  useEffect(() => {
    let timer: any = null;
    timer = setTimeout(() => close(), 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!verifyPath) {
      verifyToken();
    }
  }, [verifyPath]);

  useEffect(() => {
    if (resetPwd && verifyPwd && resetPwd !== verifyPwd) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [resetPwd, verifyPwd]);

  useEffect(() => {
    getVerifyCode();
  }, []);

  useEffect(() => {
    canvasCtxRef.current && getCharaterValue(canvasCtxRef.current);
  }, [verifyCodeInfo]);

  const getVerifyCode = async () => {
    const res = normalizeResult<VerifyCodeParams>(
      await verifyCode({ id: verifyCodeInfo.id! })
    );
    if (res.success) {
      const code = decrypt(res.data.code);
      setVerifyCodeInfo({
        ...res.data,
        code,
      });
    }
  };

  // 生成验证码
  const getCharaterValue = (element: HTMLCanvasElement) => {
    drawCharater({
      canvasElement: element,
      width: 120,
      height: 40,
      code: verifyCodeInfo.code!,
    });
  };

  // 校验token是否过期
  const verifyToken = async () => {
    const res = normalizeResult<number>(await verify());
    if (res.success) {
      navigate(`${commonStore.auth.redirectUrl}` || `${pathname}${query}` || '/home', {
        replace: true,
      });
    }
  };

  const onRegister = async () => {
    const values = await form.validateFields();
    const password = encrypt(values.password);
    const phone = encrypt(values.phone);
    const { username } = values;
    const res = normalizeResult<LoginData>(await register({ username, password, phone }));
    if (res.success) {
      success(res.message);
      toRegister();
    } else {
      res.message && error(res.message);
    }
  };

  const onLogin = async (newValues?: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    const values = newValues || (await form.validateFields());
    const password = values?.password && encrypt(values.password);
    const username = values?.username;
    const code = values?.code && encrypt(values.code);
    const res = normalizeResult<LoginData>(
      await login({
        username,
        password,
        codeId: verifyCodeInfo.id!,
        code,
      })
    );
    if (res.success) {
      const userInfo = { ...res.data };
      delete userInfo.token;
      // 将登录信息保存到store中
      userInfoStore.setUserInfo({
        ...userInfo,
      });
      sessionStorage.setItem('token', res.data?.token!);
      values?.remember ? setCookie('100', password as string, 1) : removeCoolie('100');
      values?.remember
        ? username && setCookie('uname', username, 1)
        : removeCoolie('uname');
      navigate(`${commonStore.auth.redirectUrl}` || `${pathname}${query}` || '/home', {
        replace: true,
      });
    } else {
      res.message && error(res.message);
      getVerifyCode();
    }
  };

  const toRegister = () => {
    getVerifyCode();
    setIsRegster(!isRegister);
  };

  const onBackHome = () => {
    navigate('/home');
  };

  const onForget = () => {
    setVisible(true);
  };

  const onBackLogin = () => {
    getVerifyCode();
    setVisible(false);
  };

  // 重置密码接口
  const onResetPwd = async () => {
    if (!resetUname) {
      error('账号不能为空');
      return;
    }
    if (!phoneNumber) {
      error('手机号不能为空');
      return;
    }
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(phoneNumber.toString())) {
      error('手机号不合法');
      return;
    }
    if (!resetPwd) {
      error('新密码不能为空');
      return;
    }
    if (!verifyPwd) {
      error('确认密码不能为空');
      return;
    }
    if (resetPwd !== verifyPwd) {
      error('两次密码不一致');
      return;
    }
    const res = normalizeResult<LoginData>(
      await resetPassword({ username: resetUname, password: encrypt(resetPwd as string), phone: encrypt(phoneNumber.toString()) })
    );
    if (res.success) {
      userInfoStore.setUserInfo({
        ...res.data,
      });
      success(res.message);
      onBackLogin();
    } else {
      error(res.message);
    }
  };

  const onChangeUname = (e: any) => {
    setResetUname(e.target.value.trim());
  };

  const onChangePwd = (e: any) => {
    setResetPwd(e.target.value.trim());
  };

  const onChangeVerifyPwd = (e: any) => {
    setVerifyPwd(e.target.value.trim());
  };

  const onChangePhoneNumber = (value: number) => {
    setPhoneNumber(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        {!visible ? (
          <div className={styles.content}>
            <div className={styles.title}>账号密码登录</div>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              className={styles.form}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '' },
                  {
                    validator: (_, value) => verifyUsername(_, value),
                  },
                ]}
                initialValue={getCoolie('uname')}
              >
                <Input placeholder="请输入用户名" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '' },
                  {
                    validator: (_, value) => verifyPassword(_, value),
                  },
                ]}
                initialValue={
                  getCoolie('100') ? decrypt(getCoolie('100') as string) : undefined
                }
              >
                <Input.Password placeholder="请输入密码" size="large" />
              </Form.Item>
              {!isRegister && (
                <div className={styles.codeItem}>
                  <Form.Item
                    name="code"
                    rules={[{ required: true, message: '请输入验证码' }]}
                  >
                    <Input placeholder="请输入验证码" size="large" />
                  </Form.Item>
                  <canvas
                    ref={canvasCtxRef}
                    className={styles.codeCanvas}
                    width={120}
                    height={40}
                    onClick={getVerifyCode}
                  />
                </div>
              )}
              {
                isRegister && (
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: '' },
                      {
                        validator: (_, value) => verifyPhone(_, value),
                      },
                    ]}
                  >
                    <InputNumber className={styles.phoneInp} controls={false} placeholder="请输入手机号码（号码将会被加密，无需担心泄露）" size="large" />
                  </Form.Item>
                )
              }
              <Form.Item
                name="remember"
                valuePropName="checked"
                className={styles.remember}
              >
                <Checkbox>记住本次登录密码</Checkbox>
              </Form.Item>
              <Form.Item className={styles.actions}>
                {!isRegister && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.login}
                    onClick={() => onLogin()}
                    size="large"
                  >
                    登录
                  </Button>
                )}
                {isRegister && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className={styles.login}
                    onClick={onRegister}
                  >
                    注册
                  </Button>
                )}
              </Form.Item>
            </Form>
            <div className={styles.forget}>
              <Button type="link" className={styles.backBtn} onClick={toRegister}>
                {isRegister ? '已有账号，前往登录' : '没有账号，前往注册'}
              </Button>
              <Button type="link" className={styles.backBtn} onClick={onBackHome}>
                返回首页
              </Button>
              <Button type="link" className={styles.forgetBtn} onClick={onForget}>
                忘记密码
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.resetModel}>
              <div className={styles.title}>重置用户密码</div>
              <div className={styles.resetInfo}>
                <span className={styles.label}>用户名：</span>
                <Input
                  placeholder="请输入用户名"
                  size="large"
                  value={resetUname}
                  onChange={onChangeUname}
                  maxLength={20}
                />
              </div>
              <div className={styles.resetInfo}>
                <span className={styles.label}>手机号码：</span>
                <InputNumber className={styles.phoneInp} value={phoneNumber} onChange={onChangePhoneNumber} controls={false} placeholder="请输入手机号码（号码将会被加密，无需担心泄露）" size="large" />
              </div>
              <div className={styles.resetInfo}>
                <span className={styles.label}>新密码：</span>
                <Input.Password
                  placeholder="请输入新密码"
                  size="large"
                  maxLength={20}
                  value={resetPwd}
                  onChange={onChangePwd}
                />
              </div>
              <div className={styles.verifyInfo}>
                <span className={styles.label}>确认密码：</span>
                <Input.Password
                  placeholder="请输入确认密码"
                  size="large"
                  maxLength={20}
                  value={verifyPwd}
                  onChange={onChangeVerifyPwd}
                />
                <span className={classname(styles.errMsg, showInfo && styles.showErrMsg)}>
                  两次密码不一致
                </span>
              </div>
              <div className={styles.resetBtnWrap}>
                <Button
                  type="primary"
                  size="large"
                  className={styles.resetSubmitBtn}
                  onClick={onResetPwd}
                >
                  重置
                </Button>
                <Button
                  htmlType="submit"
                  size="large"
                  className={styles.backLogin}
                  onClick={onBackLogin}
                >
                  返回登录
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
