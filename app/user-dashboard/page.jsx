
'use client';
import { useEffect } from "react";
import { getUser } from '@/utils/authService';
import { useSendToKlaviyo } from '@/hooks/useSendToKlaviyo';

export default function UserDashboard() {
  const { sendToKlaviyo } = useSendToKlaviyo();

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getUser();
      if (user) {
        await sendToKlaviyo(user);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4">Welcome to Dashboard</h1>
        <p className="text-gray-600">
          Select an option from the sidebar to get started.
        </p>
      </div>
    </div>
  );
}