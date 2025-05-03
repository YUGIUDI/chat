
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppConfig } from "./WhatsAppMessenger";
import { toast } from "sonner";

interface ConfigurationFormProps {
  config: WhatsAppConfig;
  onConfigUpdate: (config: WhatsAppConfig) => void;
}

const ConfigurationForm = ({ config, onConfigUpdate }: ConfigurationFormProps) => {
  const [formData, setFormData] = useState<WhatsAppConfig>(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigUpdate(formData);
    toast.success("Configuration updated successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">WhatsApp API Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instanceId">Instance ID</Label>
            <Input
              id="instanceId"
              name="instanceId"
              value={formData.instanceId}
              onChange={handleChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-whatsapp-primary hover:bg-whatsapp-dark transition-colors">
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigurationForm;
