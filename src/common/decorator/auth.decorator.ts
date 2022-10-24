import { SetMetadata } from '@nestjs/common';
import {
  AUTHORIZE_KEY_METADATA,
  PERMISSION_OPTIONAL_KEY_METADATA,
} from '../constant/auth.constant';

/**
 * not need token and auth
 */
export const Authorize = () => SetMetadata(AUTHORIZE_KEY_METADATA, true);

/**
 * need token not need auth
 */
export const PermissionOptional = () =>
  SetMetadata(PERMISSION_OPTIONAL_KEY_METADATA, true);
