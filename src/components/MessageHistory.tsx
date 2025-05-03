
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from "@/types/message";
import { MessageSquare, CheckCheck, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface MessageHistoryProps {
  messages: Message[];
}

const MessageHistory = ({ messages }: MessageHistoryProps) => {
  if (messages.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" /> Message History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>No messages sent yet.</p>
            <p className="text-sm">Messages you send will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" /> Message History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`rounded-lg p-4 ${message.status === 'sent' ? 'bg-whatsapp-light' : 'bg-red-100'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">To: {message.phone}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-gray-800 mb-2">{message.body}</p>
              <div className="flex justify-end items-center">
                {message.status === 'sent' ? (
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCheck className="h-4 w-4 mr-1" /> Sent
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Failed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageHistory;
