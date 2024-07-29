/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { useUser } from '@/components/UserProvider';
import { useRouter } from 'next/navigation';
import { BsFillPlusCircleFill, BsQuestionCircle } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { CiCalendar } from 'react-icons/ci';
import { BsStars } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { GoShareAndroid } from 'react-icons/go';
import Button from '@/components/Button';
import Board from '@/components/Board';

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
    <main className="h-screen overflow-hidden flex text-gray-600">
      <Sidebar />
      <div className="overflow-hidden flex-1 h-screen w-full py-6 px-4 flex flex-col gap-4 bg-gray-100">
        <section className="flex justify-between items-center">
          <h3 className="text-2xl lg:text-3xl font-semibold">Good morning, {user.name}!</h3>
          <button className="text-sm lg:text-base flex gap-2 items-center">
            <span>Help & Feedback</span>
            <BsQuestionCircle size={20} />
          </button>
        </section>
        <Cards />
        <section className="flex items-center justify-between">
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search"
              className="bg-white rounded-md py-1.5 px-3 pr-7 w-full border-[1.5px] border-gray-200 outline-gray-400"
            />
            <FiSearch
              size={20}
              className="absolute cursor-default top-1/2 -translate-y-1/2 right-2 text-gray-500"
            />
          </div>
          <div className="flex items-center gap-2 lg:gap-3.5">
            <button className="w-fit flex items-center gap-2 justify-center rounded-md py-2 px-2 text-xs lg:text-sm">
              Calender View
              <CiCalendar className="size-3.5 lg:size-5" />
            </button>
            <button className="w-fit flex items-center gap-2 justify-center rounded-md py-2 px-2 text-xs lg:text-sm">
              Automation
              <BsStars className="size-3.5 lg:size-5" />
            </button>
            <button className="w-fit flex items-center gap-2 justify-center rounded-md py-2 px-2 text-xs lg:text-sm">
              Filter
              <FiFilter className="size-3.5 lg:size-5" />
            </button>
            <button className="w-fit flex items-center gap-2 justify-center rounded-md py-2 px-2 text-xs lg:text-sm">
              Share
              <GoShareAndroid className="size-3.5 lg:size-5" />
            </button>
            <Button className="w-fit shrink-0 lg:px-2.5">
              Create New
              <BsFillPlusCircleFill size={20} />
            </Button>
          </div>
        </section>
        <Board />
      </div>
    </main>
  );
}

const cards = [
  {
    title: 'Introducing tags',
    description:
      'Easily categorize and find your notes by adding tags. Keep your workspace clutter-free and efficient.',
    image: '/card-1.svg',
  },
  {
    title: 'Share Notes Instantly',
    description:
      'Effortlessly share your notes with others via email or link. Enhance collaboration with quick sharing options.',
    image: '/card-2.svg',
  },
  {
    title: 'Access Anywhere',
    description:
      "Sync your notes across all devices. Stay productive whether you're on your phone, tablet, or computer.",
    image: '/card-3.svg',
  },
];

function Cards() {
  return (
    <section className="flex gap-2">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex-1 bg-white rounded-md p-3.5 flex flex-col lg:flex-row items-center justify-between gap-3"
        >
          <img src={card.image} alt="" />
          <div className="flex-1 flex flex-col gap-1.5">
            <p className="text-gray-600 text-[15px] font-medium">{card.title}</p>
            <p className="text-gray-500 text-xs leading-snug">{card.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
