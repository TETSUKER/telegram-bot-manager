export interface NewHandler {
  name: string;
  reply?: {
    message: string;
    text?: string;
    stickerId?: number;
  };
  reaction?: {
    emoji_id: number;
  };
  broadcast_message?: {
    text: string;
  };
  command?: {
    text: string;
  };
}

export interface Handler extends NewHandler {
  id: number;
}
