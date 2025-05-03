
import { useState } from "react";
import { Message } from "@/types/message";
import MessageForm from "./MessageForm";
import MessageHistory from "./MessageHistory";
import CsvUpload from "./CsvUpload";

export interface WhatsAppConfig {
  userName: string;
  password: string;
  instanceId: string;
}

const WhatsAppMessenger = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleMessageSent = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <CsvUpload onMessageSent={handleMessageSent} />
      <MessageForm onMessageSent={handleMessageSent} />
      <MessageHistory messages={messages} />
    </div>
  );
};

export default WhatsAppMessenger;
