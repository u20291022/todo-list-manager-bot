import { Telegraf, Telegram } from "telegraf";
import { callbackQuery } from "telegraf/filters";
import { logs } from "../utils/logs";
import { commands } from "./commands";
import { StartCommandContext, EventCommandContext, QueryData } from "../types/bot.types";
import { eventsHandler } from "../events/events-handler";
import { queryHandler } from "./query-handler";

export class Bot {
  public readonly me: Telegraf;
  public readonly methods: Telegram;
  public readonly adminId: number;

  constructor(token: string) {
    this.me = new Telegraf(token);
    this.methods = this.me.telegram;
    this.adminId = Number(process.env["ADMIN_ID"]) || -1;
  }

  public listenStartCommand(): void {
    this.me.command("start", (ctx) => {
      if (ctx.from.id !== this.adminId) {
        return;
      }

      const startCommandContext: StartCommandContext = ctx;
      commands.doStartCommand(startCommandContext, this.methods);
    });
  }

  public listenEventCommand(): void {
    this.me.command("event", (ctx) => {
      if (ctx.from.id !== this.adminId) {
        return;
      }
      
      const eventCommandContext: EventCommandContext = ctx;
      commands.doEventCommand(eventCommandContext, this.methods);
    });
  }

  public listenQuery(): void {
    this.me.on(callbackQuery("data"), (ctx) => {
      const query = ctx.update.callback_query

      if (query.from.id !== this.adminId) {
        ctx.answerCbQuery();
        return;
      }
      
      const queryData: QueryData = {
        data: query.data,
        messageId: query.message?.message_id,
        chatId: query.message?.chat.id
      };

      queryHandler.handle(queryData, this.methods);
      ctx.answerCbQuery();
    })
  }

  public async launch(): Promise<void> {
    await commands.setBotCommands(this.me);
    
    this.listenStartCommand();
    this.listenEventCommand();
    this.listenQuery();

    this.me.launch();
    logs.write("Bot was started!");

    eventsHandler.interval(this.methods);
    logs.write("Events interval was started!");
  }
}
