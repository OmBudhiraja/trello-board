import { logout } from '@/api/user';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import { useUser } from './UserProvider';

function Sidebar() {
  const { setUser } = useUser();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onError: (err) => {
      toast.error('Something went wrong');
    },
    onSuccess: () => {
      toast.success('Logged out');
      setUser(null);
    },
  });

  return (
    <aside className="h-screen w-64 border-r-2 border-gray-300 py-8 px-4">
      <div>
        <div className="p-2 rounded-full bg-gray-200 w-fit">
          <FaUser size={20} />
        </div>
      </div>
      <button onClick={() => logoutMutation.mutate()}>Logout</button>
    </aside>
  );
}

export default Sidebar;
