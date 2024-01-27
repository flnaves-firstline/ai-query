const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const analyzePlugins = process.env.analyze === 'yes' ? [new BundleAnalyzerPlugin()] : [];

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    app: ['./src/index.tsx'],
  },
  stats: {
    builtAt: true,
    modules: false,
  },
  target: ['web', 'es5'],
  output: {
    path: path.resolve(__dirname, 'output'),
    filename: '[name].js?[contenthash]',
    publicPath: '/',
  },
  optimization: {
    minimizer: [new TerserJSPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(((j|t)sx?)|(s?css))$/,
        exclude: /node_modules/,
        use: (info) => [
          {
            loader: 'prettier-loader',
            options: JSON.stringify({ filepath: info.realResource, ignoreInitial: true }),
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { transpileOnly: true },
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(ico|png|jpg|gif|eot|ttf|woff|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[contenthash]',
        },
      },
      {
        test: /\.csv$/,
        type: 'asset/source',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new MiniCssExtractPlugin({
      filename: '[name].css?[contenthash]',
      chunkFilename: '[id].css?[contenthash]',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // favicon: './public/favicon.ico',
      minify: false,
      chunks: ['app'],
    }),
    {
      apply(compiler) {
        compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
          const children = stats.compilation.children;
          if (Array.isArray(children))
            stats.compilation.children = children.filter(
              (child) => child.name.indexOf('mini-css-extract-plugin') !== 0
            );
        });
      },
    },
    ...analyzePlugins,
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  devtool: isDev ? 'eval-source-map' : false,
  performance: {
    maxEntrypointSize: Math.pow(10, 6), // 1 MB
    maxAssetSize: Math.pow(10, 6), // 1 MB
  },
};
