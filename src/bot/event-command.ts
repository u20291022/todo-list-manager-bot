import { Telegram } from "telegraf";
import { EventCommandContext, SendMessageResult } from "../types/bot.types";
import { time } from "../utils/time";
import { eventsHandler } from "../events/events-handler";
import { Event } from "../types/event.types";
import { logs } from "../utils/logs";
import { queryHandler } from "./query-handler";

class EventCommand {
  private async sendEventToChannel(
    event: Event,
    methods: Telegram
  ): Promise<SendMessageResult> {
    const eventText =
      event.text + "\n" + (event.time !== 0 ? event.dateString : "");

    return methods.sendMessage(event.channelId, eventText, {
      reply_markup: {
        inline_keyboard: queryHandler.DefaultKeyboard,
      },
    });
  }

  public async run(
    eventCommandContext: EventCommandContext,
    methods: Telegram
  ): Promise<void> {
    const { chat, args, message } = eventCommandContext;
    const channelId = process.env["CHANNEL_ID"];

    if (!channelId) {
      methods.sendMessage(
        chat.id,
        "Я не могу отправить это событие, так как id канала не указан!"
      );
      return;
    }

    if (args.length < 2) {
      methods.sendMessage(
        chat.id,
        "Использование команды event: /event дата текст_события."
      );
      return;
    }

    const dateString = args[0]; // 31.12.2023 31 December of 2023
    const eventTime =
      dateString === "-" ? 0 : time.convertDateStringIntoTimestamp(dateString);

    const eventText = args.slice(1).join(" "); // First is date. All other is text.
    const event: Event = {
      dateString: dateString,
      time: eventTime,
      text: eventText,
      chatId: chat.id,
      channelId: channelId,
      messageId: -1,
    };

    const channelMessageData = await this.sendEventToChannel(event, methods);
    event.messageId = channelMessageData.message_id; // Set channel message id for delete query

    eventsHandler.handle(event);

    methods.sendMessage(
      chat.id,
      `Событие было записано${eventTime !== 0 ? " на " + dateString : ""}.`
    );

    logs.write(`New event on ${dateString}!`);
  }
}

export const eventCommand = new EventCommand();
