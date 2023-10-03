import { Telegram } from "telegraf";
import { Event } from "../types/event.types";
import { fileSystem } from "../utils/filesystem";
import { logs } from "../utils/logs";
import { time } from "../utils/time";

class EventsHandler {
  public readonly eventsDataPath = fileSystem.dataDirPath + "/events.json";
  private events: Event[] = [];

  constructor() {
    if (!fileSystem.exists(this.eventsDataPath)) {
      fileSystem.writeJson(this.eventsDataPath, []);
      return;
    }

    this.events = fileSystem.readJson(this.eventsDataPath);
  }

  private updateEventsDataFile(): void {
    fileSystem.writeJson(this.eventsDataPath, this.events);
  }

  public deleteEvent(messageId: string | number): void {
    this.events.forEach((event, index) => {
      if (event.messageId === messageId) {
        this.events.splice(index, 1);
      }
    })

    this.updateEventsDataFile();
  }

  public handle(event: Event): void {
    if (event.time !== 0) {
      this.events.push(event);
      logs.write("Event reminder (" + event.text + ") was scheduled!");
    }

    this.updateEventsDataFile();
  }

  public interval(methods: Telegram): void {
    setInterval(() => {
      const currentTimestamp = time.getCurrentTimestamp();

      this.events.forEach((event, index) => {
        if (event.time <= currentTimestamp) {
          methods.sendMessage(event.chatId, `На сегодня у вас запланировано событие:\n${event.text}`);
          this.deleteEvent(event.messageId);
        }
      })
    }, 10000);
  }
}

export const eventsHandler = new EventsHandler();