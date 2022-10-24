import { merge } from 'lodash';
import { IConfig } from './defineConfig';
import DefaultConfig from './config.default';

/**
 * 环境变量配置
 */
export default () => {
  let envConfig: IConfig = {};
  try {
    envConfig = require(`./config.${process.env.NODE_ENV}`).default;
  } catch (e) {
    // skip
  }
  return merge(envConfig, DefaultConfig);
};
