'use client';

import { User } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import FullScreenLoader from './FullScreenLoader';
import { useUserData } from '@/api/queries';

const UserContext = createContext<{ user: User | null; setUser: (data: User | null) => void }>({
  user: null,
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { isLoading, data } = useUserData();

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
