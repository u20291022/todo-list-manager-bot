import { Telegram } from "telegraf";
import { Event } from "../types/event.types";
import { logs } from "../utils/logs";

class EventsHandler {
  public handle(
    event: Event,
    chatId: number | string,
    methods: Telegram
  ): void {
    const scheduledText = `На сегодня у вас запланировано событие: ${event.text}`;

    //@ts-ignore cuz schedule_date is not in interface
    methods.sendMessage(chatId, scheduledText, { schedule_date: event.time });
    logs.write("Event reminder (" + event.text + ") was send!");
  }
}

export const eventsHandler = new EventsHandler();
