'use client';

import { useState, useEffect } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { signInAndUpdatePassword, isOAuthUser } from '@/utils/authService';
import { User, Mail, Lock, Save, Shield, Calendar } from 'lucide-react';
import Spinner from '@/components/ui/spinner';

export default function AccountSettings() {
  const { session, status } = useAuthWithRedirect();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userIsOAuth, setUserIsOAuth] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthMethod = async () => {
      if (session) {
        const { isOAuth, provider } = await isOAuthUser();
        setUserIsOAuth(isOAuth);
        setOauthProvider(provider);
      }
      setCheckingAuth(false);
    };

    checkAuthMethod();
  }, [session]);

  if (status === 'loading' || checkingAuth) {
    return <Spinner />;
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await signInAndUpdatePassword(currentPassword, newPassword);
      
      if (error) {
        setMessage(error.message || 'Failed to update password');
        setMessageType('error');
      } else {
        setMessage('Password updated successfully');
        setMessageType('success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <User size={20} />
            Profile Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {userIsOAuth && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Shield size={16} className="inline mr-2" />
                  Authentication Method
                </label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className="text-gray-700 capitalize font-medium">{oauthProvider}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">OAuth</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your account is secured through {oauthProvider}. Password management is handled by {oauthProvider}.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Calendar size={16} className="inline mr-2" />
                Account Created
              </label>
              <input
                type="text"
                value={session?.user?.created_at ? formatDate(session.user.created_at) : 'Not available'}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Change Password - Only show for email/password users */}
        {!userIsOAuth && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  isLoading || !currentPassword || !newPassword || !confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security Notice for OAuth users */}
        {userIsOAuth && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={20} />
              Security Settings
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">OAuth Security</h3>
              <p className="text-blue-700 text-sm">
                Your account is protected by {oauthProvider}'s security systems. To manage your password, 
                update security settings, or enable two-factor authentication, please visit your {oauthProvider} account settings.
              </p>
              <a 
                href={`https://myaccount.${oauthProvider.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Manage {oauthProvider} Account
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}