/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Footer\index.tsx
 */
import React, { ReactNode } from 'react';
import classname from 'classname';
import { useGetSiderVisible, useHtmlWidth } from '@/hooks';
import MenuList from './Menu';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  themeMode?: string;
}

const Footer: React.FC<IProps> = ({ children, themeMode }) => {
  const { siderVisible } = useGetSiderVisible();
  const { htmlWidth } = useHtmlWidth();

  return (
    <div
      className={classname(
        styles.footerWrap,
        siderVisible && htmlWidth > 960 && styles.showFooter,
        themeMode === 'dark' && styles.dark
      )}
    >
      {!siderVisible && htmlWidth > 960 && (
        <div className={styles.ipcWrap}>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            浙ICP备2024111222号-1
          </a>
        </div>
      )}
      {htmlWidth <= 960 && <MenuList htmlWidth={htmlWidth} />}
      {htmlWidth <= 960 && children}
    </div>
  );
};

export default Footer;
