import { format } from 'date-fns';
/**
 * transform date type format
 */
Date.prototype.toJSON = function () {
  return format(this, 'yyyy-MM-dd HH:mm:ss');
};
