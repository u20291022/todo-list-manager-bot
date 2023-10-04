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

    if (!day || !month || !year) {
      return 0;
    }

    if (year.toString().length === 2) {
      year += 2000;
    }

    const date = new Date(year, month - 1, day, 14, 1, 20);
    return date.getTime();
  }

  public getCurrentTimestamp(): number {
    const date = new Date();
    return date.getTime();
  }
}

export const time = new Time();
