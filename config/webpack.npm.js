const { resolve } = require('path');
const cssLoaders = [
  'style-loader',
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
  entry: './src/index.jsx',
  mode: process.env.NODE_ENV,
  /** 多入口:   特点:如果有一个入口最终只有一个bundle
   *                如果有两个入口就有两个bundle
   * entry: {
   *   main: './src/index.js',
   *   test: './src/index.js',
   *  },
   */
  externals: {
    antd: 'antd',
    react: 'React',
  },
  output: {
    libraryTarget: 'umd',
    filename: 'index.js',
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

  devServer: {
    hot: true,
    port: 3002,
    host: '127.0.0.1',
    compress: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3002',
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
};
