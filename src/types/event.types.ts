export interface Event {
  dateString: string,
  time: number;
  text: string;
  chatId: string | number;
  channelId: string | number;
  messageId: string | number;
}
