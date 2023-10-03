export interface StartCommandContext {
  chat: {
    id: number | string;
  };
}

export interface EventCommandContext {
  chat: {
    id: number | string;
  };
  args: string[];
}
