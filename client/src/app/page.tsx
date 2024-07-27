'use client';

import Sidebar from '@/components/Sidebar';
import { useUser } from '@/components/UserProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 h-full">Good morning {user.name}</div>
    </main>
  );
}
