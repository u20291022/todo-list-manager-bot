export interface StartCommandContext {
  chat: {
    id: number | string;
  };
}

export interface EventCommandContext {
  message: {
    message_id: number | string;
  };
  chat: {
    id: number | string;
  };
  args: string[];
}

export interface QueryData {
  data: string;
  messageId?: string | number;
  chatId?: string | number;
}

export interface SendMessageResult {
  message_id: string | number;
  chat: { id: string | number };
}
