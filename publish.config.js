module.exports = {
  // 服务器配置
  serverInfo: {
    // 目标服务器IP
    host: '101.43.50.15',
    // 目标服务器用户名
    username: 'root',
    // 端口号
    port: 22,
  },
  porjectInfo: {
    blogClientWeb: {
      name: 'html',
      // dist 文件路径
      localFilePath: '/Users/dnhyxc/Documents/code/blog-client-web',
      // 目标服务器项目文件路径
      remoteFilePath: '/usr/local/nginx/html',
      isServer: false
    }
  }
};
