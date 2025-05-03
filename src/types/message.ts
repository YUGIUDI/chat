
export interface Message {
  id: string;
  body: string;
  phone: string;
  status: 'sent' | 'error';
  timestamp: string;
}

export interface SendMessageRequest {
  body: string;
  isTemplate: boolean;
  template: string;
  type: string;
  phone: string;
}
