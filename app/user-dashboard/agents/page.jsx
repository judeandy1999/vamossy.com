// app/user-dashboard/agents/page.jsx
'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import VamossyAgentChat from '@/components/agents/VamossyAgentChat';
import Spinner from '@/components/ui/spinner';

export default function AgentsPage() {
  const { session, status, role } = useAuthWithRedirect();

  if (status === 'loading') {
    return <Spinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vamossy Agents</h1>
        <p className="text-gray-600">
          Get expert guidance from our specialized AI agents. Choose an agent based on your specific needs and ask questions about growing your ecommerce business.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <VamossyAgentChat />
      </div>
    </div>
  );
}