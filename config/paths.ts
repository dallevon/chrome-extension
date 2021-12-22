import fs from 'fs';
import { join, resolve } from 'path';

const appDirectory = fs.realpathSync(join(__dirname, '../'));
const resolveApp = (relativePath: string) => resolve(appDirectory, relativePath);

export const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
];

export default {
  appDirectory,
  appBuild: resolveApp('build'),
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'),
  appPublic: resolveApp('public'),
  appSource: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  cache: resolveApp('.cache')
};
