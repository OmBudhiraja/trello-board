'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { VscEye } from 'react-icons/vsc';
import { VscEyeClosed } from 'react-icons/vsc';
import { useUser } from '@/components/UserProvider';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { useSignup } from '@/api/mutations';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user, setUser } = useUser();
  const router = useRouter();

  const signupMutation = useSignup();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signupMutation.mutate({ name, email, password });
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
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-200 rounded-md py-2 px-3 w-full outline-gray-400"
            placeholder="Full Name"
            type="text"
            required
          />
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
          disabled={signupMutation.isPending}
          isLoading={signupMutation.isPending}
          type="submit"
        >
          Sign up
        </Button>
        <div className="text-center mt-3">
          <span className="text-gray-500">Already have an account? </span>
          <Link className="text-blue-800" href="/login">
            Log in
          </Link>
        </div>
      </form>
    </main>
  );
}
