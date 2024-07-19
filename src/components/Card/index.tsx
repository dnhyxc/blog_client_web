/* eslint-disable no-unused-vars */
import React, { CSSProperties, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Skeleton, Popover, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import classname from 'classname';
import { formatGapTime, warn } from '@/utils';
import { useDebounce } from '@/hooks';
import useStore from '@/store';
import Image from '@/components/Image';
import { CARD_URL } from '@/constant';
import MIcons from '@/components/Icons';
import { ArticleItem } from '@/typings/common';
import styles from './index.less';

interface IProps {
  list: ArticleItem[];
  htmlWidth?: number;
  total?: number;
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
  removeArticle?: (id: string) => void;
  onEditArticle?: Function;
  moveTo?(id: string): void;
  showClassify?: boolean;
  loadText?: string;
  timelineNoMoreText?: string;
  loading?: boolean;
  style?: CSSProperties;
  fromPage?: boolean;
  customRender?: boolean;
  noMoreStyle?: string;
  themeMode?: string;
}

const Card: React.FC<IProps> = ({
  list,
  total,
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
  loadText,
  timelineNoMoreText,
  loading,
  style,
  fromPage,
  customRender,
  moveTo,
  removeArticle,
  noMoreStyle,
  themeMode,
  htmlWidth = 0,
}) => {
  const {
    userInfoStore: { getUserInfo },
  } = useStore();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const authorId = search.get('authorId');
  const [delay, setDelay] = useState<boolean>(false);

  const renderAction = (id: string, isDelete: boolean | undefined) => {
    const onRemoveArticle = (id: string) => {
      Modal.confirm({
        className:
          htmlWidth < 960
            ? classname(
                styles.removeArticleConfirm,
                themeMode === 'dark' && styles.darkRemoveArticleConfirm
              )
            : '',
        title: '确定移除该文章吗？',
        content: '移除后，该文章将从当前收藏集中删除',
        centered: htmlWidth < 960,
        width: htmlWidth < 960 ? '80%' : '',
        onOk() {
          removeArticle && removeArticle(id);
        },
      });
    };

    return (
      <div className={styles.actions}>
        {!isDelete && (
          <span className={styles.edit}>
            <MIcons
              name="icon-table_move-o"
              iconWrapClass={styles.moveIcon}
              text="转移"
              onClick={() => moveTo && moveTo(id)}
            />
          </span>
        )}
        <span className={styles.delete}>
          <MIcons
            name="icon-shanchu"
            iconWrapClass={styles.delIcon}
            text="移除"
            onClick={() => onRemoveArticle(id)}
          />
        </span>
      </div>
    );
  };

  const content = (item: ArticleItem) => {
    return (
      <>
        {getUserInfo?.userId === item.authorId && (
          <div
            onClick={(e) => onEdit(e, item)}
            className={classname(styles.edit, styles.btn)}
          >
            编辑
          </div>
        )}
        <div
          onClick={(e) => onDelete(e, item)}
          className={classname(styles.btn, styles.delBtn)}
        >
          下架
        </div>
      </>
    );
  };

  const onLikeArticle = async (id: string, item: ArticleItem) => {
    if (delay) return;
    setDelay(true);
    likeArticle && (await likeArticle(id, item));
    setDelay(false);
  };

  const onEdit = (e: any, item: ArticleItem) => {
    e.stopPropagation();
    onEditArticle && onEditArticle(item.id);
  };

  const onDelete = (e: any, item: ArticleItem) => {
    e.stopPropagation();
    deleteArticle && deleteArticle(item.id);
  };

  const toClassify = (e: Event, classify: string) => {
    e.stopPropagation();
    navigate(`/classify?classify=${classify}`);
  };

  const toTagList = (e: MouseEvent, tag: string) => {
    e.stopPropagation();
    navigate(`/tag/list?tagName=${tag}`);
  };

  const toPersonal = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    if (fromPage || id !== getUserInfo?.userId) {
      window.location.href = `/personal?id=${id}`;
      // navigate(`/personal?id=${id}&tab=1`);
    } else {
      navigate(`/personal?id=${id}`);
    }
  };

  // 点击已下架文章
  const onClickDelete = useDebounce(() => {
    warn('该文章已下架');
  }, 200);

  return (
    <div className={classname(styles.wrap, wrapClass)} style={style}>
      {list && list.length > 0 ? (
        list.map((i) => (
          <div
            className={classname(
              styles.item,
              itemClass,
              themeMode === 'dark' && styles.dark
            )}
            key={i.id}
            onClick={() => (i.isDelete ? onClickDelete() : toDetail && toDetail(i.id))}
          >
            {htmlWidth > 960 && (
              <div className={classname(imgWrapStyle, styles.imgWrap)}>
                {/* <div className={styles.text}>{i.title}</div> */}
                <div className={classname(styles.cardImgWrap, cardImgWrapStyle)}>
                  {i?.isDelete && <div className={styles.mask}>文章已下架</div>}
                  <Image
                    url={i.coverImage || CARD_URL}
                    transitionImg={CARD_URL}
                    className={classname(styles.image, imgWrapClass)}
                    imageScaleStyle={styles.imageScaleStyle}
                  />
                </div>
              </div>
            )}
            <div className={styles.info}>
              <div className={styles.name}>
                <div className={styles.title} title={i.title}>
                  {i.title}
                </div>
                {(getUserInfo?.userId === i.authorId || getUserInfo?.auth === 1) &&
                  (customRender ? (
                    authorId === getUserInfo?.userId && renderAction(i.id, i.isDelete)
                  ) : (
                    <Popover
                      placement="left"
                      content={() => content(i)}
                      trigger="hover"
                      className={styles.popover}
                      overlayClassName={themeMode === 'dark' && styles.overlayClassName}
                      zIndex={12}
                      getPopupContainer={(node) => node}
                    >
                      <EllipsisOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </Popover>
                  ))}
              </div>
              {htmlWidth > 960 && (
                <div className={descClass || styles.desc}>{i.abstract}</div>
              )}
              {htmlWidth <= 960 && (
                <div className={styles.mobileDesc}>
                  <div className={descClass || styles.desc}>{i.abstract}</div>
                  <div className={styles.mobileImgWrap}>
                    {i?.isDelete && htmlWidth <= 960 && (
                      <div className={styles.mask}>文章已下架</div>
                    )}
                    <Image
                      url={i.coverImage || CARD_URL}
                      transitionImg={CARD_URL}
                      className={classname(styles.image, imgWrapClass)}
                      imageScaleStyle={styles.imageScaleStyle}
                    />
                  </div>
                </div>
              )}
              {showClassify && htmlWidth > 960 && (
                <div className={styles.classifyInfo}>
                  <span onClick={(e) => toPersonal(e as unknown as MouseEvent, i.authorId)}>
                    {i?.authorName}
                  </span>
                  <span
                    className={classname(
                      styles.classify,
                      themeMode === 'dark' && styles.dark && styles.darkClassify
                    )}
                    onClick={(e) => toTagList(e as unknown as MouseEvent, i.tag)}
                  >
                    标签：
                    <span className={styles.tag}>{i.tag}</span>
                  </span>
                  <span onClick={(e) => toClassify(e as unknown as MouseEvent, i.classify)}>
                    分类：
                    <span className={styles.tag}>{i.classify}</span>
                  </span>
                  <span
                    className={classname(
                      styles.date,
                      themeMode === 'dark' && styles.dark && styles.darkDate
                    )}
                  >
                    {formatGapTime(i.createTime)}
                  </span>
                </div>
              )}
              <div className={styles.action}>
                <div className={styles.icons}>
                  <div className={styles.iconList}>
                    <MIcons
                      name={`${i.isLike ? 'icon-24gf-thumbsUp2' : 'icon-24gl-thumbsUp2'}`}
                      text={i.likeCount > 0 ? i.likeCount : '点赞'}
                      iconWrapClass={styles.iconWrap}
                      className={classname(
                        i.isLike ? styles.isLike : null,
                        themeMode === 'dark' && styles.darkText
                      )}
                      textStyle={themeMode === 'dark' && styles.darkText}
                      onClick={() => onLikeArticle(i.id, i)}
                    />
                    <MIcons
                      name="icon-comment"
                      text={i.commentCount ? i.commentCount : '评论'}
                      iconWrapClass={styles.iconWrap}
                      onClick={() => toDetail && toDetail(i.id, true)}
                      className={classname(themeMode === 'dark' && styles.darkText)}
                      textStyle={themeMode === 'dark' && styles.darkText}
                    />
                    <MIcons
                      name="icon-yanjing"
                      text={i.readCount > 0 ? i.readCount : '阅读'}
                      iconWrapClass={styles.iconWrap}
                      className={(styles.eyes, themeMode === 'dark' && styles.darkText)}
                      textStyle={themeMode === 'dark' && styles.darkText}
                    />
                  </div>
                  {htmlWidth < 960 && (
                    <div className={styles.classifyWrap}>
                      <span
                        onClick={(e) => toPersonal(e as unknown as MouseEvent, i.authorId)}
                      >
                        {i?.authorName?.length > 10
                          ? `${i?.authorName.slice(0, 10)}...`
                          : i?.authorName}
                      </span>
                      <span
                        className={classname(
                          styles.classifyTag,
                          themeMode === 'dark' && styles.darkClassifyTag
                        )}
                        onClick={(e) => toClassify(e as unknown as MouseEvent, i.classify)}
                      >
                        {i.classify}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : htmlWidth > 960 ? (
        <div
          className={classname(
            styles.item,
            itemClass,
            styles.skeletonWrap,
            themeMode === 'dark' && styles.dark
          )}
        >
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
        </div>
      ) : (
        <div
          className={classname(
            styles.item,
            itemClass,
            styles.skeletonWrap,
            themeMode === 'dark' && styles.dark
          )}
        >
          <Skeleton active title paragraph={{ rows: skeletonRows }} />
          <Skeleton.Image className={classname(styles.skeletonAvatar, skeletonAvatar)} />
        </div>
      )}
      {!loading && list.length === total ? (
        <div
          className={classname(
            styles.noMore,
            noMoreStyle,
            themeMode === 'dark' && styles.darkNoMore
          )}
        >
          {list.length > 0
            ? `${timelineNoMoreText || ''}共 (${list.length})
          篇，${loadText || '已是全部家当'}～～～`
            : `共(${list.length})
            篇，空空如也～～～`}
        </div>
      ) : (
        <div
          className={classname(
            styles.noMore,
            noMoreStyle,
            themeMode === 'dark' && styles.darkNoMore
          )}
        >
          loading...
        </div>
      )}
    </div>
  );
};

export default Card;
