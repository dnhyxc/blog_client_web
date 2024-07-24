/*
 * @Description: 布局组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\layout\index.tsx
 */
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import classname from 'classname';
import MenuList from '@/components/MenuList';
import Footer from '@/components/Footer';
import User from '@/components/User';
import { EventBus } from '@/event';
import ExitReminder from '@/components/ExitReminder';
import Decorator from '@/components/Decorator';
import { useGetTheme } from '@/hooks';
import { createWebSocket } from '@/socket';
import { storage } from '@/utils';
import styles from './index.less';

const { Content } = Layout;

const AppLayout = () => {
  const [status, setStatus] = useState(false);
  const { themeMode } = useGetTheme();

  useEffect(() => {
    EventBus.onToggleLoginStatus.listen(() => {
      const { loginStatus } = EventBus;
      setStatus(loginStatus);
    });
  }, []);

  useEffect(() => {
    if (storage?.ssnGetItem('token')) {
      // createWebSocket();
    }
  }, [storage?.ssnGetItem('token')]);

  return (
    <div className={styles.container}>
      {status && <ExitReminder />}
      <MenuList themeMode={themeMode} />
      <div className={styles.user}>
        <User themeMode={themeMode} />
      </div>
      <Layout className={classname(styles.layout, themeMode === 'dark' && styles.dark)}>
        <Content>
          <Outlet />
        </Content>
        <Footer themeMode={themeMode} />
      </Layout>
      <Decorator themeMode={themeMode} />
    </div>
  );
};

export default AppLayout;
