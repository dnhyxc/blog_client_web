import React from 'react';
import { Skeleton, Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import classname from 'classname';
import { formatGapTime } from '@/utils';
import useStore from '@/store';
import Image from '@/components/Image';
import { CARD_URL } from '@/constant';
import MIcons from '@/components/Icons';
import { ArticleItemResult } from '@/typings/common';
import styles from './index.less';

interface IProps {
  list: ArticleItemResult[];
  toDetail?: Function;
  wrapClass?: string;
  itemClass?: string;
  imgWrapStyle?: string;
  imgWrapClass?: string;
  cardImgWrapStyle?: string;
  descClass?: string;
  skeletonRows?: number;
  skeletonAvatar?: string;
  deleteArticle?: Function;
  likeArticle?: Function;
  onEditArticle?: Function;
  showClassify?: boolean;
  showInfo?: boolean;
}

const Card: React.FC<IProps> = ({
  list,
  toDetail,
  wrapClass,
  itemClass,
  imgWrapStyle,
  imgWrapClass,
  cardImgWrapStyle,
  descClass,
  skeletonRows = 3,
  skeletonAvatar,
  deleteArticle,
  likeArticle,
  onEditArticle,
  showClassify = true,
  showInfo,
}) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const content = (item: ArticleItemResult) => {
    return (
      <>
        <div
          onClick={(e) => onEdit(e, item)}
          className={classname(styles.edit, styles.btn)}
        >
          编辑
        </div>
        <div onClick={(e) => onDelete(e, item)} className={styles.btn}>
          删除
        </div>
      </>
    );
  };

  const onEdit = (e: any, item: ArticleItemResult) => {
    e.stopPropagation();
    onEditArticle && onEditArticle(item.id);
  };

  const onDelete = (e: any, item: ArticleItemResult) => {
    e.stopPropagation();
    deleteArticle && deleteArticle(item.id);
  };

  return (
    <div className={classname(styles.wrap, wrapClass)}>
      {list && list.length > 0 ? (
        list.map((i) => (
          <div
            className={classname(styles.item, itemClass)}
            key={i.id}
            onClick={() => toDetail && toDetail(i.id)}
          >
            <div className={classname(imgWrapStyle, styles.imgWrap)}>
              <div className={styles.text}>{i.title}</div>
              <div className={classname(styles.cardImgWrap, cardImgWrapStyle)}>
                <Image
                  url={i.coverImage || CARD_URL}
                  transitionImg={CARD_URL}
                  className={classname(styles.image, imgWrapClass)}
                  imageScaleStyle={styles.imageScaleStyle}
                />
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{i.title}</div>
              <div className={descClass || styles.desc}>{i.abstract}</div>
              {showClassify && (
                <div className={styles.classifyInfo}>
                  <span>
                    标签：
                    {i.tag}
                  </span>
                  <span className={styles.classify}>
                    分类：
                    {i.classify}
                  </span>
                  <span className={styles.date}>{formatGapTime(i.createTime)}</span>
                </div>
              )}
              <div className={styles.action}>
                <div className={styles.icons}>
                  <MIcons
                    name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'}`}
                    text={i.likeCount! > 0 ? i.likeCount : '点赞'}
                    iconWrapClass={styles.iconWrap}
                    className={i.isLike ? styles.isLike : null}
                    onClick={() => likeArticle && likeArticle(i.id)}
                  />
                  <MIcons
                    name="icon-comment"
                    text="评论"
                    iconWrapClass={styles.iconWrap}
                    onClick={() => toDetail && toDetail(i.id, true)}
                  />
                </div>
                {getUserInfo?.userId === i.authorId && (
                  <Popover
                    placement="left"
                    content={() => content(i)}
                    trigger="hover"
                    zIndex={12}
                  >
                    <EllipsisOutlined
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </Popover>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={classname(styles.item, itemClass, styles.skeletonWrap)}>
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
        </div>
      )}
      {showInfo && (
        <div className={styles.noMore}>
          {list.length > 0
            ? `共(${list.length})
          篇，已是全部家当～～～`
            : `共(${list.length})
            篇，空空如也～～～`}
        </div>
      )}
    </div>
  );
};

export default Card;
