import { existsSync } from 'fs';
import { join, parse, resolve } from 'path';

/**
 * @desc get application root path
 * @return root path
 */
export function getAppRootPath(): string {
  // check env var
  if (process.env.APP_ROOT_PATH) {
    return resolve(process.env.APP_ROOT_PATH);
  }

  // env vat not exists, start on current dir
  let cur = __dirname;
  const root = parse(cur).root;

  let appRootPath = '';
  while (true) {
    if (
      existsSync(join(cur, 'node_modules')) &&
      existsSync(join(cur, 'package.json'))
    ) {
      // if 'node_modules', 'package.json' exists
      appRootPath = cur;
    }
    // if root path, break
    if (root === cur) {
      break;
    }
    // keep finding
    cur = resolve(cur, '..');
  }

  if (appRootPath) {
    process.env.APP_ROOT_PATH = appRootPath;
  }
  return appRootPath;
}
