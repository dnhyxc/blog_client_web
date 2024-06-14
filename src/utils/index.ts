import Cookies from 'js-cookie';
import moment from 'moment';
import SparkMD5 from 'spark-md5';
import {
  SET_ITEM_CONFIG,
  CODE_LENGTH,
  EMOJI_MAP,
  EMOJI_NAME,
  EMOJI_HOST,
} from '@/constant';

import { encrypt, decrypt } from './crypto';
import { normalizeResult } from './tools';
import { storage } from './storage';
import { success, error, info, warn } from './message';
import { shareQQ, shareQZon, shareSinaWeiBo } from './share';
import { onDowmloadElement, onPrintElement } from './print';

export { compressImage } from './compress';

// 格式化时间
export const formatDate = (date: number, format = 'YYYY/MM/DD HH:mm:ss') => {
  if (!date) return;

  return moment(date).format(format);
};

// 数组去重方法
export const uniqueFunc = (arr: any, uniId: string) => {
  const res = new Map();
  return arr.filter((item: any) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};

// 格式化歌曲时间
export const formatTime = (val: number) => {
  const min = Math.floor(val / 60);
  const sec = Math.floor(val % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// 格式歌曲名称
export const formatName = (val: string) => {
  return val.replace(/\.mp3$/, '');
};

class JsCookies {
  name?: string;

  constructor(name?: string) {
    if (name) {
      this.getCoolie(name);
    }
  }

  setCookie(name: string, value: string, time: number) {
    Cookies.set(name, value, { expires: time });
  }

  getCoolie(name: string) {
    return Cookies.get(name);
  }

  removeCoolie(name: string) {
    Cookies.remove(name);
  }
}

const useCookies = new JsCookies();

// 转化距离当前时间的间隔时长
const formatGapTime = (date: number) => {
  const ms = Date.now() - date;
  const seconds = Math.round(ms / 1000);
  const minutes = Math.round(ms / 60000);
  const hours = Math.round(ms / 3600000);
  const days = Math.round(ms / 86400000);
  const months = Math.round(ms / 2592000000);
  const years = Math.round(ms / 31104000000);

  switch (true) {
    case seconds < 60:
      return '刚刚';
    case minutes < 60:
      return `${minutes} 分钟前`;
    case hours < 24:
      return `${hours} 小时前`;
    case days < 30:
      return `${days} 天前`;
    case months < 12:
      return `${months} 月前`;
    default:
      return `${years} 年前`;
  }
};

// 根据url中的type类型获取权限状态
const getSetItemConfig = (auth: number, type: string | null) => {
  if (auth || type === 'DELETE__ALL__ARTICLE') {
    return SET_ITEM_CONFIG;
  }
  return SET_ITEM_CONFIG.filter((i) => i.label !== 'auth');
};

// 获取随机数min-max之间的随机数，包含min和max（大于等于min，小于等于max）
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 元素处于焦点返回true，反之返回false
export const elementIsInFocus = (el: any) => el === document.activeElement;

// 获取选定的文本
export const getSelectedText = () => window.getSelection()?.toString();

// 文字复制到剪贴板
export const copyText = async (text: string) => await navigator.clipboard.writeText(text);

// 判断鼠标是否在指定元素内部
export const isInsideElement = (e: any, dom: HTMLDivElement) => {
  const x = e.pageX; // 鼠标相对屏幕横坐标
  const y = e.pageY; // 鼠标相对屏幕纵坐标
  // const x = e.changedTouches[0].clientX; // 鼠标相对屏幕横坐标
  // const y = e.changedTouches[0].clientY; // 鼠标相对屏幕纵坐标
  const left = Number(dom.getBoundingClientRect().left); // obj相对屏幕的横坐标
  const clientWidth = Number(dom.getBoundingClientRect().left + dom.clientWidth); // obj相对屏幕的横坐标+width
  const top = Number(dom.getBoundingClientRect().top); // obj相对屏幕的纵坐标
  const clientHeight = Number(dom.getBoundingClientRect().top + dom.clientHeight); // obj相对屏幕的纵坐标+height
  if (x > left && x < clientWidth && y > top && y < clientHeight) {
    return true;
  }
  return false;
};

// 账号校验
const verifyUsername = (_: any, value: string) => {
  const usrRegex =
    /^((?!\\|\/|\(|\)|\+|-|=|~|～|`|!|！|:|\*|\?|<|>|\||'|%|#|&|\$|\^|&|\*).){1,20}$/;
  if (usrRegex.test(value)) {
    return Promise.resolve();
  }
  if (value.length < 1) {
    return Promise.reject('用户名不能少于1位');
  }
  if (value.length > 15) {
    return Promise.reject('用户名不能大于15位');
  }
  return Promise.reject('用户名不能包含特殊字符');
};

// 密码校验
const verifyPassword = (_: any, value: string) => {
  const pwdRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
  if (value.length > 20) {
    return Promise.reject('密码不能不大于20位');
  }
  if (value.length < 8) {
    return Promise.reject('密码不能少于8位');
  }
  if (pwdRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject('必须包含字母、数字、特称字符');
};

// 电话号码校验
const verifyPhone = (_: any, value: string) => {
  const phoneRegex = /^1[3456789]\d{9}$/;
  if (phoneRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject('请输入有效的电话号码');
};

// 密码校验
const verifyResetPassword = (value: string) => {
  const pwdRegex = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
  if (value.length > 20) {
    warn('密码不能不大于20位');
    return false;
  }
  if (value.length < 8) {
    warn('密码不能少于8位');
    return false;
  }
  if (pwdRegex.test(value)) {
    return true;
  }
  warn('必须包含字母、数字、特称字符');
  return false;
};

// 验证码校验
export const verifyInputCode = (_: any, value: string, charater: string) => {
  if (!value) {
    return Promise.reject('请输入验证码');
  }
  if (value.toLowerCase() === charater.toLowerCase()) {
    return Promise.resolve();
  }
  return Promise.reject('验证码输入错误');
};

// 获取存储在electron-store中的登录信息
export const getStoreUserInfo = () => {
  // 获取存储在硬盘store中的登录信息
  const userInfo =
    storage.ssnGetItem('userInfo') && JSON.parse(storage.ssnGetItem('userInfo') as string);
  const token = storage.ssnGetItem('token');
  return {
    userInfo,
    token,
  };
};

const md5HashName = (file: File) => {
  return new Promise((resolve, reject) => {
    // 创建FileReader实例
    const fileReader = new FileReader();
    // 开始读文件
    fileReader.readAsBinaryString(file);
    // 文件读完之后，触发load事件
    fileReader.onload = (e) => {
      // result是fileReader读到的部分
      const result = (e.target as FileReader).result as string;
      // 如果读到的长度和文件长度一致，则读取成功
      const isSuccess = file.size === result?.length;
      // 读取成功，则生成MD5，扔出去。失败就报错
      isSuccess ? resolve(SparkMD5.hashBinary(result)) : reject(new Error('读取出错了'));
    };
    // 读取过程中出错也直接报错
    fileReader.onerror = () => reject(new Error('读取出错了'));
  });
};

// 检测系统类型
const checkOs = () => {
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
  if (isMac) {
    return 'MAC';
  }
  return 'WIN';
};

// 随机生成颜色
const randomColor = (min: number, max: number) => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};

// 随机生成数字
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// canvas 绘制验证码
const drawCharater = ({
  canvasElement,
  width,
  height,
  code,
}: {
  canvasElement: HTMLCanvasElement;
  width: number;
  height: number;
  code: string;
}) => {
  // let txt = '';
  // for (let i = 0; i < CODE_LENGTH; i++) {
  //   txt += CHARACTERS[randomNum(0, CHARACTERS.length)];
  // }
  const ctx = canvasElement?.getContext('2d') as CanvasRenderingContext2D;
  ctx.fillStyle = randomColor(180, 255);
  ctx.fillRect(0, 0, width, height);
  // 字体对齐位置
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center'; // 设置文本对齐方式为居中
  ctx.fillRect(0, 0, width, height); // 填充背景色
  ctx.font = '32px sans-serif'; // 设置字体样式
  // 随机生成字体大小(0.5 - 0.75)高的范围
  // ctx.font = randomNum((height * 2) / 4, (height * 3) / 4) + 'px sans-serif';
  ctx.fillStyle = randomColor(0, 255);
  ctx.fillText(code, width / 2, height / 2 + 3); // 绘制文本
  // 绘制干扰线
  for (let j = 0; j < CODE_LENGTH; j++) {
    ctx.strokeStyle = randomColor(30, 180);
    ctx.beginPath();
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.stroke();
  }
  // 绘制干扰点
  for (let k = 0; k < 30; k++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }

  return code;
};

// 处理输入的换行符
const replaceCommentContent = (content: string) => {
  const context = content.replace(/\n/g, '<br/>');
  return replaceEmojis(context);
};

// 表情包转换
const replaceEmojis = (content: string) => {
  content = content.replace(/\[[^[^\]]+]/g, (word) => {
    const index = EMOJI_NAME.indexOf(word);
    if (index > -1) {
      return `<img style="vertical-align: middle;width: 32px;height: 32px" src="${
        EMOJI_HOST + EMOJI_MAP[word]
      }" alt="" title="${word}"/>`;
    }
    return word;
  });
  return replacePictures(content);
};

// 图片转换
const replacePictures = (content: string) => {
  content = content.replace(/<[^<^>]+>/g, (word) => {
    const index = word.indexOf(',');
    if (index > -1) {
      const arr = word.replace('<', '').replace('>', '').split(',');
      return `
        <img
          id="__COMMENT_IMG__"
          style="border-radius: 5px;
          width: 100%;
          max-width: 250px;
          height:auto;
          display: block;
          padding: 5px 0;
          cursor: pointer;
          -webkit-user-drag: none;
          user-select: none;"
          src="${arr[1]}"
          title="${arr[0]}"
          alt=""
        />
      `;
    }
    return word;
  });
  return wordToLink(content);
  // return content;
};

const wordToLink = (content: string) => {
  if (checkHref(content)) {
    return `<a style="color: #2b7de7; cursor: pointer; word-break: break-all;">${content}</a>`;
  }
  return content;
};

// 校验是否是有效的链接
const checkHref = (url: string) => {
  const Expression =
    /^(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_-]*)?(#[0-9a-z=&%_-]*)?/gi;
  const objExp = new RegExp(Expression);
  return objExp.test(url);
};

// 向光标所在位置插入内容
const insertContent = ({
  keyword,
  node,
  username,
  url,
  emoji,
}: {
  keyword: string; // textarea输入内容
  node?: HTMLTextAreaElement; // textarea输入框元素
  username?: string; // 用户名称
  url?: string; // 图片地址
  emoji?: string; // 表情内容
}) => {
  const content = emoji || `<${username},${url}>`;
  if (keyword.substring(0, node?.selectionStart)) {
    return `${keyword.substring(0, node?.selectionStart)}${content}${keyword.substring(
      node?.selectionEnd!,
      node?.textLength
    )}`;
  }
  // selectionStart 为0时，默认向最后面插入
  return `${keyword.substring(
    node?.selectionEnd!,
    node?.textLength
  )}${content}${keyword.substring(0, node?.selectionStart)}`;
};

export {
  normalizeResult,
  useCookies,
  encrypt,
  decrypt,
  formatGapTime,
  getSetItemConfig,
  storage,
  success,
  error,
  info,
  warn,
  shareQQ,
  shareQZon,
  shareSinaWeiBo,
  onDowmloadElement,
  onPrintElement,
  verifyUsername,
  verifyPassword,
  verifyResetPassword,
  verifyPhone,
  md5HashName,
  checkOs,
  drawCharater,
  replaceCommentContent,
  replaceEmojis,
  replacePictures,
  wordToLink,
  checkHref,
  insertContent,
};
