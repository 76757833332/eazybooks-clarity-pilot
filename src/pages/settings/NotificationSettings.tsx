
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    invoices: true,
    reminders: true,
    paymentConfirmations: true,
    systemUpdates: false,
    marketing: false
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    invoices: true,
    reminders: true,
    paymentConfirmations: true,
    systemUpdates: true,
    marketing: false
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    
    try {
      // Here we would call an API to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Notification preferences updated successfully");
    } catch (error: any) {
      toast.error("Failed to update notification preferences");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Manage your email notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Invoice Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive notifications about invoices</p>
            </div>
            <Switch 
              checked={emailNotifications.invoices}
              onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, invoices: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Reminders</h3>
              <p className="text-sm text-muted-foreground">Get notified about upcoming or overdue payments</p>
            </div>
            <Switch 
              checked={emailNotifications.reminders}
              onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, reminders: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Confirmations</h3>
              <p className="text-sm text-muted-foreground">Receive confirmation when payments are processed</p>
            </div>
            <Switch 
              checked={emailNotifications.paymentConfirmations}
              onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, paymentConfirmations: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-muted-foreground">Get notified about system updates and new features</p>
            </div>
            <Switch 
              checked={emailNotifications.systemUpdates}
              onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, systemUpdates: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Marketing & Promotions</h3>
              <p className="text-sm text-muted-foreground">Receive marketing emails and special offers</p>
            </div>
            <Switch 
              checked={emailNotifications.marketing}
              onCheckedChange={(checked) => setEmailNotifications(prev => ({ ...prev, marketing: checked }))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotificationSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Manage your browser push notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Invoice Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive push notifications about invoices</p>
            </div>
            <Switch 
              checked={pushNotifications.invoices}
              onCheckedChange={(checked) => setPushNotifications(prev => ({ ...prev, invoices: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Reminders</h3>
              <p className="text-sm text-muted-foreground">Get push notifications about upcoming or overdue payments</p>
            </div>
            <Switch 
              checked={pushNotifications.reminders}
              onCheckedChange={(checked) => setPushNotifications(prev => ({ ...prev, reminders: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Payment Confirmations</h3>
              <p className="text-sm text-muted-foreground">Receive push confirmation when payments are processed</p>
            </div>
            <Switch 
              checked={pushNotifications.paymentConfirmations}
              onCheckedChange={(checked) => setPushNotifications(prev => ({ ...prev, paymentConfirmations: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">System Updates</h3>
              <p className="text-sm text-muted-foreground">Get push notifications about system updates</p>
            </div>
            <Switch 
              checked={pushNotifications.systemUpdates}
              onCheckedChange={(checked) => setPushNotifications(prev => ({ ...prev, systemUpdates: checked }))}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotificationSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
