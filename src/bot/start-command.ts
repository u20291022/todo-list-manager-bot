import { Telegram } from "telegraf";
import { StartCommandContext } from "../types/bot.types";

class StartCommand {
  private getStartText(): string {
    const startText =
      "Привет!\nИспользуй команду event для того, чтобы отправить событие в канал.\n" +
      "Пример использования: <b>/event 29.10.23 Сходить на свидание.</b>\n" +
      "Если событие не зависит от даты, то дату можно опустить.";

    return startText;
  }

  public run(
    startCommandContext: StartCommandContext,
    methods: Telegram
  ): void {
    const { chat } = startCommandContext;
    const startText = this.getStartText();

    methods.sendMessage(chat.id, startText, { parse_mode: "HTML" }).catch(() => {});
  }
}

export const startCommand = new StartCommand();
