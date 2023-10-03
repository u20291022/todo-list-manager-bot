import { Telegraf, Telegram } from "telegraf";
import { EventCommandContext, StartCommandContext } from "../types/bot.types";
import { startCommand } from "./start-command";
import { eventCommand } from "./event-command";

class Commands {
  public commands = [
    {
      command: "start",
      description: "Starts the bot.",
    },
    {
      command: "event",
      description:
        "Usage: event_date event_text. Ex: /event 10.03.23 bla-bla-bla",
    },
  ];

  public doStartCommand(
    startCommandContext: StartCommandContext,
    methods: Telegram
  ): void {
    startCommand.run(startCommandContext, methods);
  }

  public doEventCommand(
    eventCommandContext: EventCommandContext,
    methods: Telegram
  ): void {
    eventCommand.run(eventCommandContext, methods);
  }

  public setBotCommands(bot: Telegraf): void {
    bot.telegram.setMyCommands(this.commands);
  }
}

export const commands = new Commands();
