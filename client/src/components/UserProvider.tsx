'use client';

import { getMe } from '@/api/user';
import { User } from '@/types';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import FullScreenLoader from './FullScreenLoader';

const UserContext = createContext<{ user: User | null; setUser: (data: User | null) => void }>({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  function setUser(user: User | null) {
    queryClient.setQueryData(['user'], { user });
  }

  return (
    <UserContext.Provider value={{ user: data?.user ?? null, setUser }}>
      {isLoading ? <FullScreenLoader /> : children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserProvider;
