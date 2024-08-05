const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 兼容路径
const ompatiblePath = (url, url2 = '') => {
  return url2 ? path.join(url, url2) : path.resolve(url);
};

const onCompressFile = (localFilePath) => {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 }
    }).on('error', (err) => {
      resolve({
        code: 1,
        stderr: `压缩文件失败: ${err}`
      });
    });
    const output = fs.createWriteStream(ompatiblePath(localFilePath, 'dist.zip'));
    output.on('close', (err) => {
      if (err) {
        resolve({
          code: 1,
          stderr: `压缩本地文件 ${ompatiblePath(localFilePath, 'dist')} 失败: ${err}`
        });
      }
      resolve({
        code: 0,
        stdout: `压缩本地文件: ${ompatiblePath(localFilePath, 'dist')} 成功`
      });
    });
    archive.pipe(output);
    // 第二参数表示在压缩包中创建 dist 目录，将压缩内容放在 dist 目录下，而不是散列到压缩包的根目录
    archive.directory(ompatiblePath(localFilePath, 'dist'), '/dist');
    archive.finalize();
  });
};

onCompressFile(process.cwd());
