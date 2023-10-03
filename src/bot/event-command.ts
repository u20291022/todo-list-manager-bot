import { Telegram } from "telegraf";
import { EventCommandContext } from "../types/bot.types";
import { time } from "../utils/time";
import { eventsHandler } from "../events/events-handler";
import { Event } from "../types/event.types";
import { logs } from "../utils/logs";

class EventCommand {
  public run(
    eventCommandContext: EventCommandContext,
    methods: Telegram
  ): void {
    const { chat, args } = eventCommandContext;
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
    const event: Event = { time: eventTime, text: eventText };

    methods.sendMessage(channelId, eventText);

    eventsHandler.handle(event, chat.id, methods);
    methods.sendMessage(
      chat.id,
      `Событие было записано${eventTime !== 0 ? " на " + dateString : ""}.`
    );

    logs.write(`New event on ${dateString}!`);
  }
}

export const eventCommand = new EventCommand();
