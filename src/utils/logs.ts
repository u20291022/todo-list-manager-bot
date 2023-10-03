import { fileSystem } from "./filesystem";
import { time } from "./time";

class Logs {
  readonly logsDir = fileSystem.dataDirPath + "/logs";

  constructor() {
    fileSystem.mkdir(this.logsDir);
  }

  public write<T extends { toString(): string }>(
    logText: T,
    silent = false
  ): void {
    const currentTimeString = time.getCurrentTimeString();
    const currentDateString = time.getCurrentDateString();

    const log = `[${currentTimeString}] ${logText}`;
    const logPath = `${this.logsDir}/${currentDateString}.txt`;

    fileSystem.append(logPath, log.toString());

    if (!silent) {
      console.log(log);
    }
  }
}

export const logs = new Logs();
