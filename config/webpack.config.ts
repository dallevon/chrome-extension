import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path, { join } from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration } from 'webpack';

import paths, { moduleFileExtensions } from './paths';

const mode = (process.env.NODE_ENV || 'production') as Configuration['mode'];
const production = mode === 'production';
const getStyleLoaders = () =>
  [
    !production ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('dts-css-modules-loader'),
      options: { namedExport: true }
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        modules: {
          localIdentName: production ? '[hash]' : '[path]-[name]__[local]',
          exportLocalsConvention: 'camelCaseOnly'
        }
      }
    }
  ].filter(Boolean);

const config: Configuration = {
  entry: {
    background: join(paths.appSource, 'background', 'background.ts'),
    ui: { import: join(paths.appSource, 'index.tsx'), runtime: 'runtime' }
  },
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    clean: true
  },
  devtool: production ? false : 'inline-source-map',
  mode,
  resolve: {
    modules: [paths.appSource, 'node_modules'],
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: join(paths.appDirectory, '.cache', 'babel-loader')
          }
        }
      },
      {
        test: /\.css$/i,
        use: getStyleLoaders()
      },
      {
        test: /\.s[ac]ss$/i,
        use: [...getStyleLoaders(), require.resolve('sass-loader')]
      }
    ]
  },
  optimization: {
    minimize: production,
    minimizer: [new TerserPlugin({ parallel: true }), new CssMinimizerPlugin()],
    splitChunks: production
      ? {
          chunks: 'all',
          name: false,
          cacheGroups: {
            material: {
              test: /[\\/]node_modules[\\/]@material-ui/,
              name: 'material'
            }
          }
        }
      : false
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: paths.appTsConfig,
        mode: 'write-references',
        diagnosticOptions: { syntactic: true }
      }
    }),
    new ESLintPlugin({
      cache: true,
      cacheLocation: path.resolve(paths.cache, 'eslint', '.eslintcache'),
      context: paths.appDirectory,
      eslintPath: require.resolve('eslint'),
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      exclude: [paths.cache, paths.appBuild, paths.appNodeModules],
      failOnError: true,
      failOnWarning: production,
      quiet: false
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(paths.appPublic, 'index.html'),
      excludeChunks: ['background']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(paths.appPublic, 'manifest.json') },
        { from: path.join(paths.appPublic, 'icons'), to: 'icons' }
      ]
    })
  ]
};
export default config;
