import { Telegraf, Telegram } from "telegraf";
import { logs } from "../utils/logs";
import { commands } from "./commands";
import { StartCommandContext, EventCommandContext } from "../types/bot.types";

export class Bot {
  public readonly me: Telegraf;
  public readonly methods: Telegram;

  constructor(token: string) {
    this.me = new Telegraf(token);
    this.methods = this.me.telegram;
  }

  public listenStartCommand(): void {
    this.me.command("start", (ctx) => {
      const startCommandContext: StartCommandContext = ctx;
      commands.doStartCommand(startCommandContext, this.methods);
    });
  }

  public listenEventCommand(): void {
    this.me.command("event", (ctx) => {
      const eventCommandContext: EventCommandContext = ctx;
      commands.doEventCommand(eventCommandContext, this.methods);
    });
  }

  public launch(): void {
    commands.setBotCommands(this.me);

    this.listenStartCommand();
    this.listenEventCommand();

    this.me.launch();
    logs.write("Bot was started!");
  }
}
