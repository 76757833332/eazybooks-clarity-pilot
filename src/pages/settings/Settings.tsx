
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileSettings from "./ProfileSettings";
import BusinessSettings from "./BusinessSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <AppLayout title="Settings">
      <div className="container max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and business settings</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
            <TabsTrigger 
              value="profile" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-eazybooks-purple data-[state=active]:bg-transparent"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-eazybooks-purple data-[state=active]:bg-transparent"
            >
              Business
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-eazybooks-purple data-[state=active]:bg-transparent"
            >
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-eazybooks-purple data-[state=active]:bg-transparent"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-0 border-none">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="business" className="p-0 border-none">
            <BusinessSettings />
          </TabsContent>
          
          <TabsContent value="security" className="p-0 border-none">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="p-0 border-none">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
