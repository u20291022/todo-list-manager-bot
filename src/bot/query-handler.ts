import { Telegram } from "telegraf";
import { QueryData } from "../types/bot.types";
import { logs } from "../utils/logs";
import { eventsHandler } from "../events/events-handler";

class QueryHandler {
  public readonly DefaultKeyboard = [
    [
      { text: "✅", callback_data: "Completed" },
      { text: "❌", callback_data: "Delete" },
    ],
  ];

  public readonly CompletedKeyboard = [
    [
      { text: "❇️", callback_data: "EmptyData" },
      { text: "❎", callback_data: "DeleteCompleted" },
      { text: "❇️", callback_data: "EmptyData" }
    ],
  ];

  public readonly DeleteCompletedKeyboard = [
    [
      { text: "Удалить событие?", callback_data: "DeleteConfirm" },
      { text: "⬅️ Назад", callback_data: "Completed" },
    ],
  ]

  public readonly DeleteKeyboard = [
    [
      { text: "Удалить событие?", callback_data: "DeleteConfirm" },
      { text: "⬅️ Назад", callback_data: "Back" },
    ],
  ];

  public async handle(queryData: QueryData, methods: Telegram) {
    const data = queryData.data;
    const messageId = queryData.messageId;
    const chatId = queryData.chatId;

    if (!messageId || !chatId) {
      return;
    }

    if (data === "Back") {
      methods.editMessageReplyMarkup(chatId, Number(messageId), undefined, {
        inline_keyboard: this.DefaultKeyboard,
      }).catch(() => {});
    }

    if (data === "Completed") {
      methods.editMessageReplyMarkup(chatId, Number(messageId), undefined, {
        inline_keyboard: this.CompletedKeyboard,
      }).catch(() => {});
    }

    if (data === "DeleteCompleted") {
      methods.editMessageReplyMarkup(chatId, Number(messageId), undefined, {
        inline_keyboard: this.DeleteCompletedKeyboard,
      }).catch(() => {});
    }

    if (data === "Delete") {
      methods.editMessageReplyMarkup(chatId, Number(messageId), undefined, {
        inline_keyboard: this.DeleteKeyboard,
      }).catch(() => {});
    }

    if (data === "DeleteConfirm") {
      try {
        (await methods.deleteMessage(chatId, Number(messageId)));
      } catch(err) {}
      
      eventsHandler.deleteEvent(messageId);
    }

    logs.write(`Query (${data}) was handled!`);
  }
}

export const queryHandler = new QueryHandler();
