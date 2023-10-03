import { Bot } from "./bot/bot";
import * as dotenv from "dotenv";

async function main() {
  dotenv.config();

  const botToken = process.env["BOT_TOKEN"];

  if (!botToken) {
    return;
  }

  const bot = new Bot(botToken);
  bot.launch();
}

main();
