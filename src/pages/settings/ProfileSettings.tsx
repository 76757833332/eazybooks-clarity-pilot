
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const ProfileSettings = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form when profile changes (e.g., when it's loaded)
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      console.log("Profile loaded in settings:", profile.id);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    setSaveSuccess(false);
    
    try {
      // Validate form data
      if (!firstName.trim()) {
        toast.error("First name is required.");
        setIsUpdating(false);
        return;
      }
      
      if (!lastName.trim()) {
        toast.error("Last name is required.");
        setIsUpdating(false);
        return;
      }
      
      const success = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      
      if (success) {
        toast.success("Profile updated successfully!");
        setSaveSuccess(true);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Spinner className="h-8 w-8 text-eazybooks-purple" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-secondary/20 border-border"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-secondary/20 border-border"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user?.email || ""}
            readOnly
            disabled
            className="bg-secondary/20 border-border"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={profile?.role ? profile.role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : ""}
            readOnly
            disabled
            className="bg-secondary/20 border-border"
          />
        </div>
        {profile?.subscription_tier && (
          <div className="grid gap-2">
            <Label htmlFor="subscription">Subscription</Label>
            <Input
              id="subscription"
              value={profile.subscription_tier.charAt(0).toUpperCase() + profile.subscription_tier.slice(1)}
              readOnly
              disabled
              className="bg-secondary/20 border-border"
            />
          </div>
        )}
      </CardContent>
      <div className="flex justify-end space-x-2 p-4">
        <Button 
          onClick={handleUpdateProfile} 
          disabled={isUpdating || (!firstName.trim() || !lastName.trim())} 
          className={`${saveSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-eazybooks-purple hover:bg-eazybooks-purple-secondary'}`}
        >
          {isUpdating ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Updating...
            </>
          ) : saveSuccess ? "Successfully Updated" : "Update Profile"}
        </Button>
      </div>
    </Card>
  );
};

export default ProfileSettings;
