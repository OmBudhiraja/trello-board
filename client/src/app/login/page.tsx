'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VscEye } from 'react-icons/vsc';
import { VscEyeClosed } from 'react-icons/vsc';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/user';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@/components/UserProvider';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user, setUser } = useUser();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message || 'Something went wrong');
      } else {
        console.error(err, 'error');
        toast.error(err.message);
      }
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success('Login successful');
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return (
    <main
      className="min-h-screen flex justify-center items-center px-16 py-20 max-md:px-5"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #AFA3FF 100%)' }}
    >
      <form
        className="max-w-lg flex flex-col gap-6 p-16 mt-10 rounded-2xl border border-solid border-stone-300 w-[648px] max-md:px-5 bg-white text-gray-600"
        onSubmit={handleSubmit}
      >
        <div className="text-3xl mb-3 font-semibold text-center text-zinc-800 max-md:max-w-full max-md:text-4xl">
          Welcome to <span className="text-indigo-800">Workflo</span>!
        </div>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 rounded-md py-2 px-3 w-full outline-gray-400"
            placeholder="Your email"
            type="email"
            required
          />
        </div>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-200 rounded-md py-2 px-3 pr-7 w-full outline-gray-400"
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
          />
          <button type="button" className="absolute top-1/2 right-2 -translate-y-1/2">
            {showPassword ? (
              <VscEyeClosed onClick={() => setShowPassword(false)} className="text-gray-500" />
            ) : (
              <VscEye onClick={() => setShowPassword(true)} className="text-gray-500" />
            )}
          </button>
        </div>
        <Button
          disabled={loginMutation.isPending}
          isLoading={loginMutation.isPending}
          type="submit"
        >
          Login
        </Button>
        <div className="text-center mt-3">
          <span className="text-gray-500">Don’t have an account? Create a </span>
          <Link className="text-blue-800" href="/signup">
            new account
          </Link>
        </div>
      </form>
    </main>
  );
}
