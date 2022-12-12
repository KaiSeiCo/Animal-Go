import { UserInfoVo } from './user.vo';

export type MessageVo = {
  message_id: string;
  user_id: string;
  camp_id: string;
  message_content: string;
  reply_to: string;
};

export type CampMessageVo = {
  message_id: string;
  camp_id: string;
  message_content: string;
  reply_to_message: MessageVo;
};

export type CampMessageListVo = {
  messages: CampMessageVo[];
  users: Record<string, UserInfoVo>;
};
