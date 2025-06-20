
'use client';
import { getUser } from '@/utils/authService';
import { useSendToKlaviyo } from '@/hooks/useSendToKlaviyo';
import { useEffect, useState } from 'react'
import TaskCard from '@/components/shared/task-card';
import Link from 'next/link'
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import Spinner from '@/components/ui/spinner';

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const { sendToKlaviyo } = useSendToKlaviyo();
  const { role } = useAuthWithRedirect();
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getUser();
      if (user) {
        setUser(user);
        await sendToKlaviyo(user);
      }
    };
  
    fetchUser();
  }, []);

  if (!user) return <Spinner />;

  return (
    <div className="flex flex-col gap-6 px-8 py-6 max-w-4xl">
      <h1 className="text-2xl font-semibold">Welcome back!</h1>

      {role === 'admin' && (
        <Link
          href="/tasks/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-max"
        >
          + Create Task
        </Link>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-medium mb-2">Assigned Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2 text-sm text-blue-600">
        <Link href="/logs/upload" className="hover:underline">
          Upload Task Log
        </Link>
        <Link href="/evaluations" className="hover:underline">
          View Evaluation Results
        </Link>
      </div>
    </div>
  );
}
