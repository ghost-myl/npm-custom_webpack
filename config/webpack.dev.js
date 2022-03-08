const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js打包文件 优化build速度、优化start速度

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: process.env.NODE_ENV,
});
