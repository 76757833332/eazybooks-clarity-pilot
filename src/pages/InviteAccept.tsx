import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '@/contexts/AuthContext';

const InviteAccept = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (token: string) => {
    try {
      const { data: invite, error: inviteError } = await (supabase.from('invites') as any).select('*').eq('token', token).single();

      if (inviteError) {
        console.error('Error fetching invite:', inviteError);
        toast.error('Invalid invite link.');
        setIsTokenValid(false);
        return;
      }

      if (!invite) {
        toast.error('Invite not found.');
        setIsTokenValid(false);
        return;
      }

      if (new Date(invite.expires_at) < new Date()) {
        toast.error('Invite has expired.');
        setIsTokenValid(false);
        return;
      }

      setEmail(invite.email);
      setIsTokenValid(true);
    } catch (error) {
      console.error('Error verifying token:', error);
      toast.error('An error occurred while verifying the invite.');
      setIsTokenValid(false);
    }
  };

  const handleAcceptInvite = async () => {
    if (!token) {
      toast.error('Invalid invite link.');
      return;
    }

    if (!email || !password) {
      toast.error('Please provide an email and password.');
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      if (!token) {
        toast.error('Invalid invite link.');
        return;
      }
      
      const { data: invite, error: inviteError } = await (supabase.from('invites') as any).select('*').eq('token', token).single();

      if (inviteError) {
        console.error('Error fetching invite:', inviteError);
        toast.error('Invalid invite link.');
        setIsTokenValid(false);
        return;
      }

      if (!invite) {
        toast.error('Invite not found.');
        setIsTokenValid(false);
        return;
      }

      if (new Date(invite.expires_at) < new Date()) {
        toast.error('Invite has expired.');
        setIsTokenValid(false);
        return;
      }

      // Sign up the user
      await signUp(email, password, '', '', invite.role);

      // Delete the invite after successful signup
      const { error: deleteError } = await (supabase.from('invites') as any).delete().eq('token', token);
      if (deleteError) {
        console.error('Error deleting invite:', deleteError);
        toast.error('But there was an error deleting the invite. Please contact support.');
      }

      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      toast.error(error.message || 'An error occurred while accepting the invite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Accept Invitation</CardTitle>
          <CardDescription>Create your account to join the team.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {isTokenValid ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  disabled
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleAcceptInvite} disabled={loading}>
                {loading ? 'Creating Account...' : 'Accept Invite'}
              </Button>
            </>
          ) : (
            <p className="text-center text-gray-500">
              {token ? 'Verifying invite...' : 'Invalid invite link.'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAccept;
