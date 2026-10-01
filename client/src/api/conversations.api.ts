import api from "./axios";

export interface ConversationParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  role: "developer" | "client" | "admin";
}

export interface ConversationJob {
  _id: string;
  title: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
}

export interface Conversation {
  _id: string;
  application: {
    _id: string;
    job: string;
    developer: string;
    coverLetter: string;
    bidAmount: number;
    estimatedDays: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  job: ConversationJob;
  participants: ConversationParticipant[];
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const getMyConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/conversations");

  return response.data.conversations;
};


export interface MessageSender {
  _id: string;
  firstName: string;
  lastName: string;
  role: "developer" | "client" | "admin";
}

export interface Message {
  _id: string;
  conversation: string;
  sender: MessageSender;
  content: string;
  messageType: "text" | "image" | "file";
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const getConversationMessages = async (
  conversationId: string,
): Promise<Message[]> => {
  const response = await api.get(
    `/conversations/${conversationId}/messages`,
  );

  return response.data.messages;
};
