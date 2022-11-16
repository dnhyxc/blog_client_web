/*
 * @Description: 头部组件
 * @Author: dnh
 * @Date: 2022-06-13 09:41:39
 * @LastEditors: dnh
 * @FilePath: \src\components\Header\index.tsx
 */
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import classname from 'classname';
import { LeftOutlined } from '@ant-design/icons';
import { useHtmlWidth, useGetSiderVisible } from '@/hooks';
import MIcons from '../Icons';
import HeadMenu from '../HeadMenu';
import User from './User';
import styles from './index.less';

interface IProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  needLeft?: boolean;
  excludesWidth?: boolean;
  className?: string;
  itemStyles?: string; // header item 的样式
  iconStyles?: string; // 左侧 icon 的样式
  headerRef?: any;
}

const Header: React.FC<IProps> = ({
  children,
  left,
  right,
  needLeft = true,
  excludesWidth = false,
  className,
  headerRef,
  itemStyles,
  iconStyles,
}) => {
  const { siderVisible } = useGetSiderVisible();

  const navigate = useNavigate();
  const { htmlWidth } = useHtmlWidth();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  return (
    <div className={classname(className, styles.herderWrap)} ref={headerRef}>
      <div className={styles.left}>
        {needLeft &&
          (left || (
            <div className={styles.back} onClick={goBack}>
              <LeftOutlined />
              <MIcons
                name="icon-haidao_"
                className={classname(styles.iconWrap, iconStyles)}
                onClick={goHome}
              />
            </div>
          ))}
        <div className={styles.child}>{children}</div>
        {(excludesWidth || siderVisible) && htmlWidth > 960 && (
          <HeadMenu itemStyles={itemStyles} />
        )}
      </div>
      <div className={styles.right}>
        {right && <span>{right}</span>}
        <User />
      </div>
    </div>
  );
};

export default Header;
