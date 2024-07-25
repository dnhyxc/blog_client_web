import 'cropperjs/dist/cropper.css';
import React, { ReactNode, useRef, useState } from 'react';
import { Upload, Modal } from 'antd';
import { UploadListType } from 'antd/lib/upload/interface';
import Cropper from 'react-cropper';
import { PlusOutlined } from '@ant-design/icons';
import classname from 'classname';
import type { RcFile } from 'antd/es/upload';
import MIcons from '@/components/Icons';
import MImage from '@/components/Image';
import * as Service from '@/service';
import useStore from '@/store';
import { normalizeResult, success, error, compressImage, md5HashName } from '@/utils';
import { FILETYPE, FILE_UPLOAD_MSG } from '@/constant';
import styles from './index.less';

interface IProps {
  formLabel?: string;
  filePath?: string | undefined;
  form?: any;
  // eslint-disable-next-line no-unused-vars
  setFilePath?: (url: string) => void;
  getUploadFilePath?: Function;
  imgStyle?: string;
  markStyle?: string;
  uploadWrapStyle?: string;
  needPreview?: boolean;
  setAlertStatus?: Function;
  aspectRatio?: number;
  uploadStyle?: string;
  transitionImg?: string;
  uploadNode?: ReactNode;
  listType?: UploadListType;
  deleteOldCoverImage?: Function;
}

const UploadFile: React.FC<IProps> = ({
  formLabel,
  needPreview = true,
  filePath,
  transitionImg,
  form,
  setFilePath,
  imgStyle,
  markStyle,
  uploadWrapStyle,
  setAlertStatus,
  aspectRatio = 1 / 1,
  uploadStyle,
  uploadNode,
  listType = 'picture-card',
  getUploadFilePath,
  deleteOldCoverImage,
}) => {
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [cropperUrl, setCropperUrl] = useState<{
    url: any;
    filename: string;
    type: string;
  }>({
    url: '',
    filename: '',
    type: '',
  });

  const cropperRef = useRef<any>(null);

  const {
    userInfoStore: { getUserInfo },
  } = useStore();

  const beforeUpload = async (file: RcFile) => {
    const fileType = file.type;
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!FILETYPE.includes(fileType)) {
      error(FILE_UPLOAD_MSG);
    }
    if (!isLt20M) {
      error('请上传小于20M的图片');
    }
    // 根据文件资源生成 MD5 hash
    const fileName = (await md5HashName(file)) as string;
    const findIndex = file?.name?.lastIndexOf('.');
    const ext = file.name.slice(findIndex + 1);
    const newFile = new File([file], `${fileName}_${getUserInfo.userId}.${ext}`, {
      type: file.type,
    });
    const reader = new FileReader();
    const image = new Image();
    reader.readAsDataURL(newFile);
    reader.onload = (e) => {
      // onload 事件在图片加载完成后立即执行。
      image.src = reader.result as any;
      image.onload = () => {
        setCropperUrl({
          url: e.target?.result,
          filename: newFile.name,
          type: newFile.type,
        });
        setShowCropper(true);
      };
    };

    return FILETYPE.includes(fileType) && isLt20M;
  };

  const onUpload = () => {
    if (cropperRef.current) {
      cropperRef.current.getCroppedCanvas().toBlob(async (blob: string | Blob) => {
        // 上传前先压缩图片
        const { file } = await compressImage({
          file: blob as File,
          quality: 0.5, // 压缩比例
          mimeType: cropperUrl.type,
        });
        const formData = new FormData();
        formData.append('file', file, cropperUrl.filename);
        const res = normalizeResult<{ filePath: string }>(
          await Service.uploadFile(formData)
        );
        setShowCropper(false);
        if (res.success) {
          setFilePath && setFilePath(res?.data?.filePath);
          form?.setFieldsValue(
            formLabel
              ? { mainCover: res?.data?.filePath }
              : { coverImage: res?.data?.filePath }
          );
          getUploadFilePath && getUploadFilePath(res?.data?.filePath, needPreview);
          success(res.message);
        }
        if (!res.success && res.code === 409) {
          setAlertStatus && setAlertStatus(true);
        }
        if (!res.success && res.code !== 409 && res.code !== 401) {
          error(res.message);
        }
      });
    }
  };

  const onCropperInit = (cropper: any) => {
    cropperRef.current = cropper;
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  // 预览图片
  const onPreview = () => {
    setPreviewVisible(true);
  };

  // 删除图片
  const onDeleteFile = () => {
    deleteOldCoverImage?.();
    setFilePath && setFilePath('');
  };

  return (
    <div className={classname(uploadStyle, styles.Upload)}>
      {showCropper && (
        <Modal
          title="请选择剪裁区域"
          className={styles.cropperModalWrap}
          visible={showCropper}
          width={820}
          onCancel={() => setShowCropper(false)}
          onOk={onUpload}
        >
          <Cropper
            src={cropperUrl.url} // 图片路径，即是base64的值，在Upload上传的时候获取到的
            ref={cropperRef}
            onInitialized={onCropperInit}
            preview=".uploadCrop"
            viewMode={1} // 定义cropper的视图模式
            zoomable // 是否允许放大图像
            type="image/jpeg"
            // movable
            guides={false} // 显示在裁剪框上方的虚线
            background={false} // 是否显示背景的马赛克
            rotatable={false} // 是否旋转
            autoCropArea={1} // 默认值0.8（图片的80%）。--0-1之间的数值，定义自动剪裁区域的大小
            style={{ width: 'auto', height: '100%' }}
            aspectRatio={aspectRatio} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            cropBoxResizable // 默认true ,是否允许拖动 改变裁剪框大小
            cropBoxMovable // 是否可以拖拽裁剪框 默认true
            dragMode="move" // 拖动模式, 默认crop当鼠标 点击一处时根据这个点重新生成一个 裁剪框，move可以拖动图片，none:图片不能拖动
            center
          />
        </Modal>
      )}
      <Upload
        name="file"
        headers={{ Authorization: `Bearer ${sessionStorage.getItem('token')}` }}
        listType={listType!}
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={() => {}} // 覆盖upload action默认的上传行为，改为自定义上传
      >
        {uploadNode || (!filePath && <PlusOutlined />)}
      </Upload>
      {!uploadNode && filePath && (
        <div className={classname(uploadWrapStyle, styles.uploadImgWrap)}>
          <div className={classname(markStyle, styles.mark)}>
            {needPreview && (
              <MIcons
                name="icon-browse"
                className={classname(styles.iconWrap, styles.iconLeft)}
                onClick={onPreview}
              />
            )}
            <MIcons
              name="icon-shanchu"
              className={styles.iconWrap}
              onClick={onDeleteFile}
            />
          </div>
          <MImage
            url={filePath}
            transitionImg={transitionImg}
            className={imgStyle}
            imageWrapStyle={styles.imageWrapStyle}
          />
        </div>
      )}
      {needPreview && filePath && (
        <Modal
          visible={previewVisible}
          centered
          closable={false}
          width={600}
          footer={null}
          onCancel={handleCancel}
        >
          <MImage
            url={filePath}
            transitionImg={transitionImg}
            className={styles.imgStyle}
          />
        </Modal>
      )}
    </div>
  );
};

export default UploadFile;
