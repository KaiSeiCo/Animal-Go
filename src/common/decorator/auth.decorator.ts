import { SetMetadata } from '@nestjs/common';
import {
  OPEN_API_KEY_METADATA,
  ONLY_REQUIRE_LOGIN_KEY_METADATA,
} from '../constant/system.constant';

/**
 * not need token and auth
 */
export const OpenApi = () => SetMetadata(OPEN_API_KEY_METADATA, true);

/**
 * need token but not need perm
 */
export const OnlyRequireLogin = () =>
  SetMetadata(ONLY_REQUIRE_LOGIN_KEY_METADATA, true);
