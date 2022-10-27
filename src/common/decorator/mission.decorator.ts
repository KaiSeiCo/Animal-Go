import { SetMetadata } from '@nestjs/common';
import { SYSTEM_MISSION_KEY } from '../constant/system.constant';
/**
 * declare as a runnable task with @Mission
 * @returns
 */
export const Mission = () => SetMetadata(SYSTEM_MISSION_KEY, true);
