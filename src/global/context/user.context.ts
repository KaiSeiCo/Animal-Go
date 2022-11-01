import { Injectable } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';
import { UserToken } from 'src/model/vo/user.vo';

export interface UserStore extends ClsStore {
  user: UserToken;
}

export type UserStoreKey = keyof UserStore;

@Injectable()
export class UserContext {
  constructor(private readonly clsService: ClsService<UserStore>) {}

  set(key: UserStoreKey, value: UserStore) {
    this.clsService.set(key, value.user);
  }

  get(key: UserStoreKey) {
    return this.clsService.get(key);
  }
}
