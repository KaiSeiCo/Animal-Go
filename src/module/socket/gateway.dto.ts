export class SendMessageDto {
  user_id: string;
  camp_id: string;
  message_content: string;
  reply_to: string;
}

export class BuildCampDto {
  camp_name: string;
  camp_desc: string;
  user_id: string;
  personal: boolean;
}

export class JoinCampDto {
  user_id: string;
  camp_id: string;
}

export class LeaveCampDto {
  user_id: string;
  camp_id: string;
}
