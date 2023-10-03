import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
} from "fs";

class FileSystem {
  readonly dataDirPath = "./data";

  constructor() {
    if (!existsSync(this.dataDirPath)) {
      mkdirSync(this.dataDirPath);
      return;
    }
  }

  public exists(path: string): boolean {
    return existsSync(path);
  }

  public mkdir(path: string): void {
    if (!this.exists(path)) {
      mkdirSync(path);
    }
  }

  public readToString(path: string): string {
    if (!this.exists(path)) {
      return "";
    }

    return readFileSync(path, { encoding: "utf-8" });
  }

  public write<T extends { toString(): string }>(path: string, data: T): void {
    writeFileSync(path, data.toString());
  }

  public append<T extends { toString(): string }>(path: string, data: T): void {
    appendFileSync(path, data.toString() + "\n");
  }

  public writeJson<T extends {}>(path: string, data: T): void {
    const stringifiedJson = JSON.stringify(data, null, "\t");
    this.write(path, stringifiedJson);
  }

  public readJson(path: string): any {
    if (!this.exists(path)) {
      return {};
    }

    const stringifiedData = this.readToString(path);
    const jsonData = JSON.parse(stringifiedData);

    return jsonData;
  }
}

export const fileSystem = new FileSystem();
