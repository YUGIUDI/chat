
import { toast } from "sonner";
import { SendMessageRequest } from "@/types/message";
import { WhatsAppConfig } from "@/components/WhatsAppMessenger";

const API_URL = "https://socket-live.awfar.io/api/message/sendCrmMessage";

export async function sendWhatsAppMessage(
  messageData: SendMessageRequest, 
  config: WhatsAppConfig
): Promise<boolean> {
  try {
    // Format the phone number correctly if it doesn't start with country code
    const formattedPhone = messageData.phone.startsWith('+') 
      ? messageData.phone.substring(1) 
      : messageData.phone;
    
    const url = `${API_URL}?userName=${config.userName}&password=${config.password}&phone=${formattedPhone}&instanceId=${config.instanceId}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...messageData,
        phone: formattedPhone
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to send message:", errorData);
      toast.error("Failed to send message. Please try again.");
      return false;
    }

    const data = await response.json();
    console.log("Message sent successfully:", data);
    toast.success("Message sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Error sending message. Please check your connection and try again.");
    return false;
  }
}
