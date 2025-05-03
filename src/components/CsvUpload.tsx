
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendWhatsAppMessage } from "@/services/messageService";
import { Message } from "@/types/message";
import { WhatsAppConfig } from "./WhatsAppMessenger";
import { toast } from "sonner";
import { File } from "lucide-react";

interface CsvUploadProps {
  onMessageSent: (message: Message) => void;
}

interface CsvRow {
  phone: string;
  message: string;
}

const CsvUpload = ({ onMessageSent }: CsvUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [bulkMessage, setBulkMessage] = useState("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const parseCSV = (text: string): CsvRow[] => {
    const rows = text.split('\n');
    const result: CsvRow[] = [];
    
    // Skip header row if present
    const startRow = rows[0].toLowerCase().includes('phone') ? 1 : 0;
    
    for (let i = startRow; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
      
      // Check if the row has a comma
      if (row.includes(',')) {
        const [phone, ...messageParts] = row.split(',');
        const message = messageParts.join(',').trim();
        
        if (phone) {
          result.push({
            phone: phone.trim(),
            // If no specific message for this row, use the bulk message
            message: message || bulkMessage
          });
        }
      } else if (row) {
        // If no comma, assume it's just a phone number
        result.push({
          phone: row.trim(),
          message: bulkMessage
        });
      }
    }
    
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !bulkMessage) {
      toast.error("Please select a CSV file and/or enter a message");
      return;
    }

    if (!apiConfig.userName || !apiConfig.password || !apiConfig.instanceId) {
      toast.error("Please enter your WhatsApp API credentials");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (file) {
        const text = await file.text();
        const rows = parseCSV(text);
        
        if (rows.length === 0) {
          toast.error("No valid data found in the CSV file");
          setIsLoading(false);
          return;
        }
        
        let successCount = 0;
        let failCount = 0;
        
        for (const row of rows) {
          if (!row.phone || !row.message) continue;
          
          const success = await sendWhatsAppMessage({
            body: row.message,
            isTemplate: false,
            template: "",
            type: "text",
            phone: row.phone,
          }, apiConfig);
          
          if (success) {
            successCount++;
            
            const newMessage: Message = {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              body: row.message,
              phone: row.phone,
              status: 'sent',
              timestamp: new Date().toISOString(),
            };
            
            onMessageSent(newMessage);
          } else {
            failCount++;
          }
          
          // Add a small delay between messages
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (successCount > 0) {
          toast.success(`Successfully sent ${successCount} messages`);
        }
        
        if (failCount > 0) {
          toast.error(`Failed to send ${failCount} messages`);
        }
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      toast.error("Error processing CSV file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="bg-whatsapp-dark text-white rounded-t-lg">
        <CardTitle>Bulk Send Messages</CardTitle>
        <CardDescription className="text-gray-200">
          Upload a CSV file with phone numbers and messages
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <h3 className="font-medium">WhatsApp API Settings</h3>
            
            <div>
              <Label htmlFor="csvUserName" className="block mb-2">
                Username
              </Label>
              <Input 
                id="csvUserName"
                name="userName"
                value={apiConfig.userName}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="csvPassword" className="block mb-2">
                Password
              </Label>
              <Input 
                id="csvPassword"
                name="password"
                type="password"
                value={apiConfig.password}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="csvInstanceId" className="block mb-2">
                Instance ID
              </Label>
              <Input 
                id="csvInstanceId"
                name="instanceId"
                value={apiConfig.instanceId}
                onChange={handleConfigChange}
                className="w-full"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="csvFile" className="block mb-2">
              CSV File
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format: phone,message (or just phone numbers, one per line)
            </p>
          </div>

          <div>
            <Label htmlFor="bulkMessage" className="block mb-2">
              Default Message
            </Label>
            <Input
              id="bulkMessage"
              type="text"
              placeholder="Message to send to all contacts"
              value={bulkMessage}
              onChange={(e) => setBulkMessage(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used when no specific message is provided in CSV
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-whatsapp-primary hover:bg-whatsapp-dark transition-colors"
            disabled={isLoading || (!file && !bulkMessage) || !apiConfig.userName || !apiConfig.password || !apiConfig.instanceId}
          >
            {isLoading ? (
              <>Sending bulk messages...</>
            ) : (
              <>
                <File className="w-4 h-4 mr-2" /> Send to Multiple Recipients
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
