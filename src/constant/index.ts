import * as API from '@/service/api';
import ABOUTME from '@/assets/images/about_me.jpg';
import HEAD_UEL from '@/assets/images/header.jpg';
import CARD_URL from '@/assets/images/card.png';
import EMPTY_URL from '@/assets/images/empty.jpg';
import MAIN_COVER from '@/assets/images/mainCover.png';
import CYWL_URL from '@/assets/images/cywl.jpg';
// import BOAT_TO_CHINA_MP3 from '@/assets/music/boatToChina.mp3';
// import MCDGB_MP3 from '@/assets/music/mcdgb.mp3';
// import IS_YOU_MP3 from '@/assets/music/isYou.mp3';
// import CHUNSANYUE_MP3 from '@/assets/music/chunsanyue.mp3';
// import NEWBOY_MP3 from '@/assets/music/newBoy.mp3';
// import BOAT_TO_CHINA_LRC from '@/assets/music/lrc/boatToChina.lrc';
// import CHUNSANYUE_LRC from '@/assets/music/lrc/chunsanyue.lrc';
// import IS_YOU_LRC from '@/assets/music/lrc/isYou.lrc';
// import MCDGB_LRC from '@/assets/music/lrc/mcdgb.lrc';
// import NEWBOY_LRC from '@/assets/music/lrc/newBoy.lrc';
// import BOAT_TO_CHINA_COVER from '@/assets/images/boatToChina.jpg';
// import CHUNSANYUE_COVER from '@/assets/images/chunsanyue.jpg';
// import IS_YOU_COVER from '@/assets/images/isYou.jpg';
// import MCDGB_COVER from '@/assets/images/mcdgb.jpg';
// import NEWBOY_COVER from '@/assets/images/newBoy.jpg';
import SEA from '@/assets/images/sea.jpg';
import SSM from '@/assets/images/ssm.jpg';
import HOME_IMG from '@/assets/images/home.jpg';
import CLASSIFY_IMG from '@/assets/images/classify.jpg';
import TAG_IMG from '@/assets/images/tag.jpg';
import INTERACT_IMG from '@/assets/images/interact.jpg';
import LOGIN_IMG from '@/assets/images/login.jpg';
import PRESONAL_IMG from '@/assets/images/presonal.jpg';
import PROFILE_IMG from '@/assets/images/profile.jpg';
import SEARCH_IMG from '@/assets/images/search.jpg';
import SYSTEM_IMG from '@/assets/images/system.jpg';
import THEME_IMG from '@/assets/images/theme.jpg';
import TIMELINE_IMG from '@/assets/images/timeline.jpg';
import TOOLS_IMG from '@/assets/images/tools.jpg';
import CREATE_DRAFT_IMG from '@/assets/images/create-draft.jpg';
import CREATE_VSCODE_IMG from '@/assets/images/create-vscode.jpg';
import CREATE_DRAFT_EDITER_IMG from '@/assets/images/create-draft-editer.jpg';
import CREATE_VSCODE_EDITER_IMG from '@/assets/images/create-vscode-editer.jpg';
import COLLECT_IMG from '@/assets/images/collect.jpg';
import AUTHOR_IMG from '@/assets/images/author.jpg';
import ACCOUNT_IMG from '@/assets/images/account.jpg';
import PICTURE_IMG from '@/assets/images/picture.jpg';
import DETAIL_IMG from '@/assets/images/detail.jpg';
import CHAT_IMG from '@/assets/images/chat.jpg';
import ARTICLE_IMG from '@/assets/images/article.jpg';
import TAG_LIST_IMG from '@/assets/images/tag-list.jpg';

export {
  SEA,
  SSM,
  ABOUTME,
  HEAD_UEL,
  CARD_URL,
  EMPTY_URL,
  MAIN_COVER,
  CYWL_URL,
  // BOAT_TO_CHINA_MP3,
  // MCDGB_MP3,
  // NEWBOY_MP3,
  // CHUNSANYUE_MP3,
  // IS_YOU_MP3,
  // BOAT_TO_CHINA_LRC,
};

// 线上域名
export const DOMAIN_URL = 'www.dnhyxc.cn';

// 表情资源路径域名
export const EMOJI_HOST = `https://${
  [DOMAIN_URL, 'www.dnhyxc.cn', 'dnhyxc.cn'].includes(window.location.hostname)
    ? DOMAIN_URL
    : '127.0.0.1:9112'
}/image/`;

export const EMOJI_MAP = {
  '[NO]': 'emoji_0@2x.png',
  '[OK]': 'emoji_1@2x.png',
  '[下雨]': 'emoji_2@2x.png',
  '[么么哒]': 'emoji_3@2x.png',
  '[乒乓]': 'emoji_4@2x.png',
  '[便便]': 'emoji_5@2x.png',
  '[信封]': 'emoji_6@2x.png',
  '[偷笑]': 'emoji_7@2x.png',
  '[傲慢]': 'emoji_8@2x.png',
  '[再见]': 'emoji_9@2x.png',
  '[冷汗]': 'emoji_10@2x.png',
  '[凋谢]': 'emoji_11@2x.png',
  '[刀]': 'emoji_12@2x.png',
  '[删除]': 'emoji_13@2x.png',
  '[勾引]': 'emoji_14@2x.png',
  '[发呆]': 'emoji_15@2x.png',
  '[发抖]': 'emoji_16@2x.png',
  '[可怜]': 'emoji_17@2x.png',
  '[可爱]': 'emoji_18@2x.png',
  '[右哼哼]': 'emoji_19@2x.png',
  '[右太极]': 'emoji_20@2x.png',
  '[右车头]': 'emoji_21@2x.png',
  '[吐]': 'emoji_22@2x.png',
  '[吓]': 'emoji_23@2x.png',
  '[咒骂]': 'emoji_24@2x.png',
  '[咖啡]': 'emoji_25@2x.png',
  '[啤酒]': 'emoji_26@2x.png',
  '[嘘]': 'emoji_27@2x.png',
  '[回头]': 'emoji_28@2x.png',
  '[困]': 'emoji_29@2x.png',
  '[坏笑]': 'emoji_30@2x.png',
  '[多云]': 'emoji_31@2x.png',
  '[大兵]': 'emoji_32@2x.png',
  '[大哭]': 'emoji_33@2x.png',
  '[太阳]': 'emoji_34@2x.png',
  '[奋斗]': 'emoji_35@2x.png',
  '[奶瓶]': 'emoji_36@2x.png',
  '[委屈]': 'emoji_37@2x.png',
  '[害羞]': 'emoji_38@2x.png',
  '[尴尬]': 'emoji_39@2x.png',
  '[左哼哼]': 'emoji_40@2x.png',
  '[左太极]': 'emoji_41@2x.png',
  '[左车头]': 'emoji_42@2x.png',
  '[差劲]': 'emoji_43@2x.png',
  '[弱]': 'emoji_44@2x.png',
  '[强]': 'emoji_45@2x.png',
  '[彩带]': 'emoji_46@2x.png',
  '[彩球]': 'emoji_47@2x.png',
  '[得意]': 'emoji_48@2x.png',
  '[微笑]': 'emoji_49@2x.png',
  '[心碎了]': 'emoji_50@2x.png',
  '[快哭了]': 'emoji_51@2x.png',
  '[怄火]': 'emoji_52@2x.png',
  '[怒]': 'emoji_53@2x.png',
  '[惊恐]': 'emoji_54@2x.png',
  '[惊讶]': 'emoji_55@2x.png',
  '[憨笑]': 'emoji_56@2x.png',
  '[手枪]': 'emoji_57@2x.png',
  '[打哈欠]': 'emoji_58@2x.png',
  '[抓狂]': 'emoji_59@2x.png',
  '[折磨]': 'emoji_60@2x.png',
  '[抠鼻]': 'emoji_61@2x.png',
  '[抱抱]': 'emoji_62@2x.png',
  '[抱拳]': 'emoji_63@2x.png',
  '[拳头]': 'emoji_64@2x.png',
  '[挥手]': 'emoji_65@2x.png',
  '[握手]': 'emoji_66@2x.png',
  '[撇嘴]': 'emoji_67@2x.png',
  '[擦汗]': 'emoji_68@2x.png',
  '[敲打]': 'emoji_69@2x.png',
  '[晕]': 'emoji_70@2x.png',
  '[月亮]': 'emoji_71@2x.png',
  '[棒棒糖]': 'emoji_72@2x.png',
  '[汽车]': 'emoji_73@2x.png',
  '[沙发]': 'emoji_74@2x.png',
  '[流汗]': 'emoji_75@2x.png',
  '[流泪]': 'emoji_76@2x.png',
  '[激动]': 'emoji_77@2x.png',
  '[灯泡]': 'emoji_78@2x.png',
  '[炸弹]': 'emoji_79@2x.png',
  '[熊猫]': 'emoji_80@2x.png',
  '[爆筋]': 'emoji_81@2x.png',
  '[爱你]': 'emoji_82@2x.png',
  '[爱心]': 'emoji_83@2x.png',
  '[爱情]': 'emoji_84@2x.png',
  '[猪头]': 'emoji_85@2x.png',
  '[猫咪]': 'emoji_86@2x.png',
  '[献吻]': 'emoji_87@2x.png',
  '[玫瑰]': 'emoji_88@2x.png',
  '[瓢虫]': 'emoji_89@2x.png',
  '[疑问]': 'emoji_90@2x.png',
  '[白眼]': 'emoji_91@2x.png',
  '[皮球]': 'emoji_92@2x.png',
  '[睡觉]': 'emoji_93@2x.png',
  '[磕头]': 'emoji_94@2x.png',
  '[示爱]': 'emoji_95@2x.png',
  '[礼品袋]': 'emoji_96@2x.png',
  '[礼物]': 'emoji_97@2x.png',
  '[篮球]': 'emoji_98@2x.png',
  '[米饭]': 'emoji_99@2x.png',
  '[糗大了]': 'emoji_100@2x.png',
  '[红双喜]': 'emoji_101@2x.png',
  '[红灯笼]': 'emoji_102@2x.png',
  '[纸巾]': 'emoji_103@2x.png',
  '[胜利]': 'emoji_104@2x.png',
  '[色]': 'emoji_105@2x.png',
  '[药]': 'emoji_106@2x.png',
  '[菜刀]': 'emoji_107@2x.png',
  '[蛋糕]': 'emoji_108@2x.png',
  '[蜡烛]': 'emoji_109@2x.png',
  '[街舞]': 'emoji_110@2x.png',
  '[衰]': 'emoji_111@2x.png',
  '[西瓜]': 'emoji_112@2x.png',
  '[调皮]': 'emoji_113@2x.png',
  '[象棋]': 'emoji_114@2x.png',
  '[跳绳]': 'emoji_115@2x.png',
  '[跳跳]': 'emoji_116@2x.png',
  '[车厢]': 'emoji_117@2x.png',
  '[转圈]': 'emoji_118@2x.png',
  '[鄙视]': 'emoji_119@2x.png',
  '[酷]': 'emoji_120@2x.png',
  '[钞票]': 'emoji_121@2x.png',
  '[钻戒]': 'emoji_122@2x.png',
  '[闪电]': 'emoji_123@2x.png',
  '[闭嘴]': 'emoji_124@2x.png',
  '[闹钟]': 'emoji_125@2x.png',
  '[阴险]': 'emoji_126@2x.png',
  '[难过]': 'emoji_127@2x.png',
  '[雨伞]': 'emoji_128@2x.png',
  '[青蛙]': 'emoji_129@2x.png',
  '[面条]': 'emoji_130@2x.png',
  '[鞭炮]': 'emoji_131@2x.png',
  '[风车]': 'emoji_132@2x.png',
  '[飞吻]': 'emoji_133@2x.png',
  '[飞机]': 'emoji_134@2x.png',
  '[饥饿]': 'emoji_135@2x.png',
  '[香蕉]': 'emoji_136@2x.png',
  '[骷髅]': 'emoji_137@2x.png',
  '[麦克风]': 'emoji_138@2x.png',
  '[麻将]': 'emoji_139@2x.png',
  '[鼓掌]': 'emoji_140@2x.png',
  '[龇牙]': 'emoji_141@2x.png',
};
export const EMOJI_NAME = [
  '[龇牙]',
  '[调皮]',
  '[流汗]',
  '[偷笑]',
  '[再见]',
  '[敲打]',
  '[擦汗]',
  '[流泪]',
  '[大哭]',
  '[嘘]',
  '[酷]',
  '[抓狂]',
  '[委屈]',
  '[可爱]',
  '[色]',
  '[害羞]',
  '[得意]',
  '[吐]',
  '[微笑]',
  '[怒]',
  '[尴尬]',
  '[惊恐]',
  '[冷汗]',
  '[白眼]',
  '[傲慢]',
  '[难过]',
  '[惊讶]',
  '[疑问]',
  '[困]',
  '[么么哒]',
  '[憨笑]',
  '[衰]',
  '[撇嘴]',
  '[阴险]',
  '[奋斗]',
  '[发呆]',
  '[右哼哼]',
  '[抱抱]',
  '[坏笑]',
  '[鄙视]',
  '[晕]',
  '[大兵]',
  '[可怜]',
  '[饥饿]',
  '[咒骂]',
  '[折磨]',
  '[抠鼻]',
  '[鼓掌]',
  '[糗大了]',
  '[左哼哼]',
  '[打哈欠]',
  '[快哭了]',
  '[吓]',
  '[闭嘴]',
  '[强]',
  '[弱]',
  '[握手]',
  '[胜利]',
  '[抱拳]',
  '[勾引]',
  '[差劲]',
  '[拳头]',
  '[OK]',
  '[NO]',
  '[爱你]',
  '[爱心]',
  '[心碎了]',
  '[示爱]',
  '[玫瑰]',
  '[凋谢]',
  '[挥手]',
  '[发抖]',
  '[飞吻]',
  '[爱情]',
  '[跳跳]',
  '[怄火]',
  '[转圈]',
  '[磕头]',
  '[回头]',
  '[跳绳]',
  '[激动]',
  '[街舞]',
  '[献吻]',
  '[左太极]',
  '[右太极]',
  '[便便]',
  '[炸弹]',
  '[菜刀]',
  '[刀]',
  '[米饭]',
  '[蛋糕]',
  '[西瓜]',
  '[啤酒]',
  '[咖啡]',
  '[太阳]',
  '[月亮]',
  '[多云]',
  '[闪电]',
  '[下雨]',
  '[雨伞]',
  '[礼物]',
  '[篮球]',
  '[皮球]',
  '[乒乓]',
  '[红双喜]',
  '[鞭炮]',
  '[红灯笼]',
  '[麻将]',
  '[麦克风]',
  '[礼品袋]',
  '[信封]',
  '[象棋]',
  '[彩带]',
  // '[蜡烛]',
  '[爆筋]',
  '[棒棒糖]',
  '[奶瓶]',
  '[面条]',
  '[香蕉]',
  '[飞机]',
  '[左车头]',
  '[车厢]',
  '[右车头]',
  '[钞票]',
  '[灯泡]',
  '[风车]',
  '[闹钟]',
  '[彩球]',
  '[钻戒]',
  '[沙发]',
  '[手枪]',
  '[纸巾]',
  // '[骷髅]',
  '[猪头]',
  '[瓢虫]',
  '[猫咪]',
  '[熊猫]',
  '[青蛙]',
];

export const PREVIEW_IMGS = [
  {
    name: '首页',
    url: HOME_IMG,
  },
  {
    name: '文章分类',
    url: CLASSIFY_IMG,
  },
  {
    name: '文章标签',
    url: TAG_IMG,
  },
  {
    name: '标签-文章列表',
    url: TAG_LIST_IMG,
  },
  {
    name: '发布文章-富文本',
    url: CREATE_DRAFT_IMG,
  },
  {
    name: '发布文章-VSCode',
    url: CREATE_VSCODE_IMG,
  },
  {
    name: '发布文章-富文本编辑',
    url: CREATE_DRAFT_EDITER_IMG,
  },
  {
    name: '发布文章-VSCode编辑',
    url: CREATE_VSCODE_EDITER_IMG,
  },
  {
    name: '文章详情-当前窗口打开',
    url: DETAIL_IMG,
  },
  {
    name: '文章详情-子窗口打开',
    url: ARTICLE_IMG,
  },
  {
    name: '时间轴',
    url: TIMELINE_IMG,
  },
  {
    name: '关于博主',
    url: AUTHOR_IMG,
  },
  {
    name: '高级搜索',
    url: SEARCH_IMG,
  },
  {
    name: '登录/注册',
    url: LOGIN_IMG,
  },
  {
    name: '留言一角',
    url: INTERACT_IMG,
  },
  {
    name: '实用工具',
    url: TOOLS_IMG,
  },
  {
    name: '图片合集',
    url: PICTURE_IMG,
  },
  {
    name: '我的主页',
    url: PRESONAL_IMG,
  },
  {
    name: '个人资料',
    url: PROFILE_IMG,
  },
  {
    name: '账号设置',
    url: ACCOUNT_IMG,
  },
  {
    name: '系统设置',
    url: SYSTEM_IMG,
  },
  {
    name: '主题设置',
    url: THEME_IMG,
  },
  {
    name: '收藏集',
    url: COLLECT_IMG,
  },
  {
    name: '私聊',
    url: CHAT_IMG,
  },
];

// export const MUSIC_LRCS = {
//   [BOAT_TO_CHINA_MP3]: BOAT_TO_CHINA_LRC,
//   [MCDGB_MP3]: MCDGB_LRC,
//   [NEWBOY_MP3]: NEWBOY_LRC,
//   [CHUNSANYUE_MP3]: CHUNSANYUE_LRC,
//   [IS_YOU_MP3]: IS_YOU_LRC,
// };

// 歌曲url
export const MUSIC_PATHS = [
  '',
  // BOAT_TO_CHINA_MP3,
  // MCDGB_MP3,
  // NEWBOY_MP3,
  // CHUNSANYUE_MP3,
  // IS_YOU_MP3,
];

// 歌曲列表信息
export const MUSIC_LIST_INFO = [
  {
    key: '1',
    BOAT_TO_CHINA_MP3: 'BOAT_TO_CHINA_MP3',
    // [BOAT_TO_CHINA_MP3]: BOAT_TO_CHINA_MP3,
    path: '',
    // path: BOAT_TO_CHINA_MP3,
    name: 'On a Slow Boat to China',
    author: 'Luke Thompson',
    lrc: '',
    cover: '',
  },
  // {
  //   key: '2',
  //   [MCDGB_MP3]: MCDGB_MP3,
  //   path: MCDGB_MP3,
  //   name: '漫长的告白',
  //   author: '双笙',
  //   lrc: '',
  //   cover: MCDGB_COVER,
  // },
  // {
  //   key: '3',
  //   [NEWBOY_MP3]: NEWBOY_MP3,
  //   path: NEWBOY_MP3,
  //   name: 'New Boy',
  //   author: '房东的猫',
  //   lrc: '',
  //   cover: NEWBOY_COVER,
  // },
  // {
  //   key: '4',
  //   [CHUNSANYUE_MP3]: CHUNSANYUE_MP3,
  //   // [CHUNSANYUE_MP3]: CHUNSANYUE_MP3,
  //   path: CHUNSANYUE_MP3,
  //   name: '春三月',
  //   author: '司南',
  //   lrc: '',
  //   cover: CHUNSANYUE_COVER,
  // },
  // {
  //   key: '5',
  //   [IS_YOU_MP3]: IS_YOU_MP3,
  //   path: IS_YOU_MP3,
  //   name: '是你',
  //   author: '梦然',
  //   lrc: '',
  //   cover: IS_YOU_COVER,
  // },
];

// 全局样式
export const GLOBAL_STYLES = {
  DARK_BGC: '#333',
  DARK_BGC_DEEP: '#262626',
  DARK_GRAY: '#565656',
  DARK_FC_GRAY: '#a5a5a5',
  DARK_FC: '#f1f1f1',
  WHITE: '#fff',
  MASK_BGC: 'rgba(0, 0, 0, 0.35)',
};

// Drawer 暗黑样式
export const DRAWER_STYLES = {
  headerStyle: {
    backgroundColor: GLOBAL_STYLES.DARK_BGC_DEEP,
    color: GLOBAL_STYLES.DARK_FC,
  },
  bodyStyle: { backgroundColor: GLOBAL_STYLES.DARK_BGC_DEEP },
  maskStyle: { backgroundColor: GLOBAL_STYLES.MASK_BGC },
};

// 播放顺序图标
export const MUSIC_ORDER_ICONS = [
  'icon-24gl-repeat2',
  'icon-24gl-shuffle',
  'icon-24gl-repeatOnce2',
];

// 每页数量
export const PAGESIZE = 20;

// 文件上传路径
export const UPLOADURL = '/api/upload';

// 账号设置配置
export const SET_ITEM_CONFIG = [
  {
    name: '个人掘金',
    label: 'juejin',
    action: '设置',
  },
  {
    name: '个人知乎',
    label: 'zhihu',
    action: '设置',
  },
  {
    name: 'github',
    label: 'github',
    action: '设置',
  },
  {
    name: '个人网站',
    label: 'blog',
    action: '设置',
  },
  {
    name: '密码',
    label: 'password',
    action: '重置',
  },
  {
    name: '账号注销',
    label: 'logout',
    action: '注销',
  },
];

// setting 菜单配置
export const SettingMenu = [
  {
    key: 'profile',
    label: '个人设置',
    name: '个人设置',
    path: '/setting/profile',
  },
  {
    key: 'account',
    label: '账号设置',
    name: '账号设置',
    path: '/setting/account',
  },
];

export const getSetItemConfig = (auth: string) => {
  if (!auth) {
    return SET_ITEM_CONFIG.filter((i) => i.label !== 'auth');
  }
  return SET_ITEM_CONFIG;
};

// 允许上传的文件类型
export const FILETYPE = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/svg',
];

// 上传文件提示
export const FILE_UPLOAD_MSG = '请上传 png、jpg、jpeg、gif、webp、svg 格式的图片';

export const ABOUT_ME_TABS = [
  {
    name: '我的文章',
    value: '1',
  },
  {
    name: '点赞文章',
    value: '2',
  },
  {
    name: '我的收藏',
    value: '3',
  },
];

export const AUTHOR_TABS = [
  {
    name: '博主文章',
    value: '1',
  },
  {
    name: '博主点赞',
    value: '2',
  },
  {
    name: '时间轴',
    value: '3',
  },
];

export const ABOUT_TABS = [
  {
    name: '他的文章',
    value: '1',
  },
  {
    name: '他的收藏',
    value: '3',
  },
];

// 我的主页页面API
export const ABOUT_ME_API_PATH = {
  1: API.GET_MY_ARTICLE_LIST,
  2: API.GET_LIKE_ARTICLE_LIST,
  3: API.GET_COLLECTION_LIST,
};

// 关于博主页面接口path
export const AUTHOR_API_PATH = {
  1: API.GET_AUTHOR_ARTICLE_LIST,
  2: API.GET_AUTHOR_LIKE_ARTICLES,
};

export const UPDATE_INFO_API_PATH = {
  1: API.UPDATE_INFO,
  2: API.RESET_PASSWORD,
};

export const ARTICLE_DRAFT = {
  1: API.CREATE_DRAFT,
  2: API.UPDATE_DRAFT,
};

export const ICONLINKS = [
  {
    name: 'icon-juejin',
    className: 'juejin',
    label: 'juejin',
    title: '掘金',
  },
  {
    name: 'icon-github-fill',
    className: 'adsIcon',
    label: 'github',
    title: 'github',
  },
  {
    name: 'icon-zhihu-circle-fill',
    className: 'adsIcon',
    label: 'zhihu',
    title: '知乎',
  },
  {
    name: 'icon-wangzhi',
    className: 'wangzhiIcon',
    label: 'blog',
    title: '其它',
  },
];

export const ARTICLE_CLASSIFY = [
  '前端',
  '后端',
  '架构',
  '数据库',
  '设计模式',
  '数据结构',
  '算法',
  '开发工具',
  '代码人生',
  '前端框架',
  '计算机',
  '网络协议',
  '可视化',
  '移动端',
  '阅读',
  '其它',
];

export const ARTICLE_TAG = [
  {
    label: '前端',
    key: '1',
  },
  {
    label: '后端',
    key: '2',
  },
  {
    label: 'JavaScript',
    key: '3',
  },
  {
    label: 'Node.js',
    key: '4',
  },
  {
    label: 'TypeScript',
    key: '5',
  },
  {
    label: '前端框架',
    key: '6',
  },
  {
    label: 'React',
    key: '7',
  },
  {
    label: 'Vue',
    key: '8',
  },
  {
    label: 'Preact',
    key: '9',
  },
  {
    label: 'Webpack',
    key: '10',
  },
  {
    label: 'Koa.js',
    key: '11',
  },
  {
    label: '面试',
    key: '12',
  },
  {
    label: 'Java',
    key: '13',
  },
  {
    label: '架构',
    key: '14',
  },
  {
    label: 'CSS',
    key: '15',
  },
  {
    label: 'HTML',
    key: '16',
  },
  {
    label: '数据结构',
    key: '17',
  },
  {
    label: '算法',
    key: '18',
  },
  {
    label: 'GitHub',
    key: '19',
  },
  {
    label: 'Git',
    key: '20',
  },
  {
    label: '设计模式',
    key: '21',
  },
  {
    label: '数据库',
    key: '22',
  },
  {
    label: '项目部署',
    key: '23',
  },
  {
    label: 'Docker',
    key: '24',
  },
  {
    label: 'Nginx',
    key: '25',
  },
];

export const SEARCH_TYPE = [
  {
    label: '全部',
    type: 'all',
    key: '1',
  },
  {
    label: '文章标题',
    type: 'title',
    key: '2',
  },
  {
    label: '文章标签',
    type: 'tag',
    key: '3',
  },
  {
    label: '文章分类',
    type: 'classify',
    key: '4',
  },
  {
    label: '文章摘要',
    type: 'abstract',
    key: '5',
  },
  {
    label: '文章内容',
    type: 'content',
    key: '6',
  },
  {
    label: '我点赞的',
    type: 'isLike',
    key: '7',
  },
  {
    label: '作者名称',
    type: 'authorName',
    key: '8',
  },
  {
    label: '最多评论',
    type: 'replyCount',
    key: '9',
  },
  {
    label: '最多点赞',
    type: 'likeCount',
    key: '10',
  },
];

export const USER_MENU = [
  {
    key: '1',
    icon: 'icon-gerenzhongxin',
    text: '我的主页',
    path: '/personal',
  },
  {
    key: '2',
    icon: 'icon-shezhi3',
    text: '个人设置',
    path: '/setting/profile',
  },
  {
    key: '3',
    icon: 'icon-tuichu1',
    text: '退出登录',
    path: '/login',
  },
];

interface NumberKey {
  [key: number]: any;
}

export const TAG_STYLES: NumberKey = {
  1: {
    color: '#00BFFF',
    fontSize: '14px',
    transform: `rotate(${Math.random() * 180}deg)`,
  },
  2: {
    color: '#00FFFF',
    fontSize: '15px',
    transform: `rotate(${-Math.random() * 90}deg)`,
  },
  3: {
    color: '#98FB98',
    fontSize: '16px',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  4: {
    color: 'yellow',
    fontSize: '17px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  5: {
    color: '#9400D3',
    fontSize: '18px',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  6: {
    color: '#00BFFF',
    fontSize: '19px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  7: {
    color: '#20B2AA',
    fontSize: '20px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  8: {
    color: '#9ACD32',
    fontSize: '21px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  9: {
    color: '#ADFF2F',
    fontSize: '22px',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  10: {
    color: '#FFD700',
    fontSize: '23px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  11: {
    color: '#FF8C00',
    fontSize: '24px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  12: {
    color: '#FF7F50',
    fontSize: '25px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  13: {
    color: '#FF6347',
    fontSize: '26px',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  14: {
    color: '#FFA500',
    fontSize: '27px',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  15: {
    color: '#9ACD32',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  16: {
    color: '#FFD700',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  17: {
    color: '#98FB98',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  18: {
    color: '#00CED1',
    transform: `rotate(${-Math.random() * 360}deg)`,
  },
  19: {
    color: '#AFEEEE',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
  20: {
    color: '#7B68EE',
    transform: `rotate(${Math.random() * 360}deg)`,
  },
};

export const GATEWAY_HOST = '';

export const IMAGE_BASE64 =
  'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI1NnB4IiB2aWV3Qm94PSIwIDAgNTQ4LjE3NiA1NDguMTc2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NDguMTc2IDU0OC4xNzY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNNTI0LjE4MywyOTcuMDY1Yy0xNS45ODUtMTkuODkzLTM2LjI2NS0zMi42OTEtNjAuODE1LTM4LjM5OWM3LjgxLTExLjk5MywxMS43MDQtMjUuMTI2LDExLjcwNC0zOS4zOTkgICBjMC0yMC4xNzctNy4xMzktMzcuNDAxLTIxLjQwOS01MS42NzhjLTE0LjI3My0xNC4yNzItMzEuNDk4LTIxLjQxMS01MS42NzUtMjEuNDExYy0xOC4yNzEsMC0zNC4wNzEsNS45MDEtNDcuMzksMTcuNzAzICAgYy0xMS4yMjUtMjcuMDI4LTI5LjA3NS00OC45MTctNTMuNTI5LTY1LjY2N2MtMjQuNDYtMTYuNzQ2LTUxLjcyOC0yNS4xMjUtODEuODAyLTI1LjEyNWMtNDAuMzQ5LDAtNzQuODAyLDE0LjI3OS0xMDMuMzUzLDQyLjgzICAgYy0yOC41NTMsMjguNTQ0LTQyLjgyNSw2Mi45OTktNDIuODI1LDEwMy4zNTFjMCwyLjg1NiwwLjE5MSw2Ljk0NSwwLjU3MSwxMi4yNzVjLTIyLjA3OCwxMC4yNzktMzkuODc2LDI1LjgzOC01My4zODksNDYuNjg2ICAgQzYuNzU5LDI5OS4wNjcsMCwzMjIuMDU1LDAsMzQ3LjE4YzAsMzUuMjExLDEyLjUxNyw2NS4zMzMsMzcuNTQ0LDkwLjM1OWMyNS4wMjgsMjUuMDMzLDU1LjE1LDM3LjU0OCw5MC4zNjIsMzcuNTQ4aDMxMC42MzYgICBjMzAuMjU5LDAsNTYuMDk2LTEwLjcxNSw3Ny41MTItMzIuMTIxYzIxLjQxMy0yMS40MTIsMzIuMTIxLTQ3LjI0OSwzMi4xMjEtNzcuNTE1ICAgQzU0OC4xNzIsMzM5Ljc1Nyw1NDAuMTc0LDMxNi45NTIsNTI0LjE4MywyOTcuMDY1eiIgZmlsbD0iI0ZGRkZGRiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=';

export const CAT_BASE64 =
  'data:image/png;base64,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';

export const BIRD_BASE64 =
  'data:image/png;base64,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';

// 生成的验证码长度
export const CODE_LENGTH = 4;
// 随机生成的字符集
export const CHARACTERS = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz';
