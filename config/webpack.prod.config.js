// const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const FileManagerWebpackPlugin = require('filemanager-webpack-plugin');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          // 配置less模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.less$/,
        include: [/node_modules/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                sourceMap: true,
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#1DA57A',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 配置scss模块化导入
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CssMinimizerWebpackPlugin(), // 打包完成后自动生成zip压缩包
    // new FileManagerWebpackPlugin({
    //   events: {
    //     onEnd: {
    //       archive: [
    //         {
    //           source: path.resolve(__dirname, '../dist'),
    //           destination: path.resolve(__dirname, '../dist.zip'),
    //         },
    //       ],
    //     },
    //   },
    // })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new MiniCssExtractPlugin({
        // 设置打包出来css文件放置在 style 目录下
        filename: 'style/[name].[hash:6].css',
        ignoreOrder: true,
      }),
      new TerserPlugin({
        // parallel: true, // 多进程
        extractComments: false, // 删除注释
        terserOptions: {
          compress: {
            drop_console: true, // 去除log
          },
        },
      }),
    ],
  },
});
