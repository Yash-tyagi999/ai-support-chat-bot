export interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isNew?: boolean;
}

export interface FAQ {
  q: string;
  desc: string;
}
