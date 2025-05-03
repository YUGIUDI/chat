
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";
import { sendWhatsAppMessage } from "@/services/messageService";
import { Message } from "@/types/message";
import { WhatsAppConfig } from "./WhatsAppMessenger";
import { Label } from "./ui/label";

interface MessageFormProps {
  onMessageSent: (message: Message) => void;
}

const MessageForm = ({ onMessageSent }: MessageFormProps) => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfig, setApiConfig] = useState<WhatsAppConfig>({
    userName: "",
    password: "",
    instanceId: ""
  });

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !message || !apiConfig.userName || !apiConfig.password || !apiConfig.instanceId) {
      return;
    }

    setIsLoading(true);

    const success = await sendWhatsAppMessage({
      body: message,
      isTemplate: false,
      template: "",
      type: "text",
      phone: phone,
    }, apiConfig);

    if (success) {
      const newMessage: Message = {
        id: Date.now().toString(),
        body: message,
        phone: phone,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
      
      onMessageSent(newMessage);
      setMessage("");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-whatsapp-dark text-white rounded-t-lg">
        <CardTitle>Send WhatsApp Message</CardTitle>
        <CardDescription className="text-gray-200">
          Enter a phone number and message to send via WhatsApp
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h3 className="font-medium">WhatsApp API Settings</h3>
            
            <div>
              <Label htmlFor="userName" className="block mb-2">
                Username
              </Label>
              <Input 
                id="userName"
                name="userName"
                value={apiConfig.userName}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="block mb-2">
                Password
              </Label>
              <Input 
                id="password"
                name="password"
                type="password"
                value={apiConfig.password}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="instanceId" className="block mb-2">
                Instance ID
              </Label>
              <Input 
                id="instanceId"
                name="instanceId"
                value={apiConfig.instanceId}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Phone Number (with country code)
            </label>
            <Input 
              id="phone"
              type="text"
              placeholder="e.g. 201021058376"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Include country code without '+' (e.g. 201021058376 for Egypt)</p>
          </div>

          <div>
            <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] w-full"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-whatsapp-primary hover:bg-whatsapp-dark transition-colors"
            disabled={isLoading || !phone || !message || !apiConfig.userName || !apiConfig.password || !apiConfig.instanceId}
          >
            {isLoading ? (
              <>Sending...</>
            ) : (
              <>
                <SendHorizontal className="w-4 h-4 mr-2" /> Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MessageForm;
