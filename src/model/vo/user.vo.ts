export type LoginVo = {
  token: string;
};

export type UserListVo = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  intro: string;
  status: boolean;
};

export type UserToken = {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  intro: string;
  status: boolean;
  role_id: number;
  role_name: string;
  role_label: string;
  perms: string[];
};
