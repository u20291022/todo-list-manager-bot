class Time {
  public getCurrentTimeString(): string {
    const date = new Date();
    return date.toLocaleTimeString("ru-RU");
  }

  public getCurrentDateString(): string {
    const date = new Date();
    const dateString = date.toLocaleDateString("ru-RU");
    return dateString.replace(/\./g, "-");
  }

  public convertDateStringIntoTimestamp(dateString: string): number {
    let [day, month, year]: number[] = dateString
      .split(".")
      .map((v) => Number(v));

    year = !year ? new Date().getFullYear() : year;
    month = !month ? new Date().getMonth() + 1 : month;
    day = !day ? new Date().getDate() : day;

    if (year.toString().length === 2) {
      year += 2000;
    }

    const date = new Date(year, month - 1, day); // month - 1 cuz counting starts at 0 (0 - january)
    return date.getTime();
  }

  public getCurrentTimestamp(): number {
    const date = new Date();
    return date.getTime();
  }

  public convertDateStringIntoFullDate(dateString: string): string {
    const dateTimestamp = this.convertDateStringIntoTimestamp(dateString);
    const date = new Date(dateTimestamp);

    return date.toLocaleDateString("ru-RU", { dateStyle: "long" });
  }
}

export const time = new Time();
