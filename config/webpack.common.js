/**
 * HMR hot module replacement 热模块替换 / 模块热替换
 * 作用：一个模块发生变化，只会重新打包这一个模块(而不是打包所有模块)  可以极大的提升构建速度
 * 样式文件：可以使用HMR功能：因为style-loader内部实现了HMR功能   开发环境使用style-loader会使性能更好 打包速度更快
 * html文件：默认没有HMR功能，代表html不能热更新
 */
const webpack = require('webpack');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // 压缩js打包文件 优化build速度、优化start速度

const devMode = process.env.NODE_ENV === 'production';
const cssLoaders = [
  devMode ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: {
        auto: (resourcePath) => resourcePath.endsWith('.less'),
        localIdentName: '[local]_[hash:base64:10]',
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [['autoprefixer'], require('postcss-preset-env')()],
      },
    },
  },
];

module.exports = {
  stats: 'errors-only',
  entry: './example/index.jsx',
  /** 多入口:   特点:如果有一个入口最终只有一个bundle
   *                如果有两个入口就有两个bundle
   * entry: {
   *   main: './src/index.js',
   *   test: './src/index.js',
   *  },
   */
  output: {
    filename: 'js/main.js',
    path: resolve(resolve(__dirname, '..'), 'dist'),
    clean: true,
  },
  /**
   * 解析模块规则别名
   */
  resolve: {
    /**
     * 使用 @ 代替路径 @ 代表从src/ 下面找路径
     */
    alias: {
      '@': resolve(resolve(__dirname, '..'), 'src/'),
    },
    /**配置省略文件路径的后缀名
     * index.jsx ===  index    index相当于index.jsx
     */
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    /**配置省略文件路径的后缀名
     * demo/index.jsx ===  demo
     */
    mainFiles: ['index'],
  },

  devtool: !devMode && 'inline-source-map',

  devServer: {
    hot: true,
    port: 3000,
    host: '127.0.0.1',
    compress: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3003',
        pathRewrite: { '^/api': '' },
        secure: false,
      },
    },
  },
  module: {
    rules: [
      {
        /**
         * lazy loading懒加载
         */
        test: /\.(js|jsx)$/,
        include: resolve(resolve(__dirname, '..'), ''),
        exclude: /node_modules/,
        /**
         *  pre:优先执行
         *  post:延后执行
         *  不设置enforce则顺序执行
         */
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              // 缓存：第二次构建时，会读取之前的缓存
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [...cssLoaders],
      },
      {
        test: /\.less$/,
        use: [...cssLoaders, 'less-loader'],
      },
      {
        test: /\.s[ac]ss$/,
        use: [...cssLoaders, 'sass-loader'],
      },
      {
        exclude: /.(html|less|css|sass|js|jsx|ts|tsx)$/,
        test: /\.(jpg|jpe|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'imgs/[name].[ext]',
          outputPath: 'other',
        },
      },
      {
        test: /\.(ect|ttf|svg|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'icon/[name].[ext]',
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      title: 'My App',
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    // 显示百分比编译
    new webpack.ProgressPlugin({
      activeModules: false,
      entries: true,
      modules: true,
      modulesCount: 5000,
      profile: false,
      dependencies: true,
      dependenciesCount: 10000,
      percentBy: 'entries',
    }),
    new ESLintPlugin({
      fix: true /* 自动帮助修复 */,
      extensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'react'],
      exclude: 'node_modules',
    }),
  ],
};
