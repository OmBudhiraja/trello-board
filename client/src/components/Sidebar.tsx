import { FaUser } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { PiSpinnerBold } from 'react-icons/pi';
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md';
import { PiHouseSimple } from 'react-icons/pi';
import { CiViewBoard } from 'react-icons/ci';
import { IoSettingsOutline } from 'react-icons/io5';
import { GoPeople } from 'react-icons/go';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { AiOutlineLineChart } from 'react-icons/ai';
import { useUser } from './UserProvider';
import { TfiDownload } from 'react-icons/tfi';
import Button from './Button';
import { useLogout } from '@/api/mutations';

const tabs = [
  {
    name: 'Home',
    icon: <PiHouseSimple size={24} />,
    selected: true,
  },
  {
    name: 'Boards',
    icon: <CiViewBoard size={24} />,
    selected: false,
  },
  {
    name: 'Settings',
    icon: <IoSettingsOutline size={24} />,
    selected: false,
  },
  {
    name: 'Teams',
    icon: <GoPeople size={24} />,
    selected: false,
  },
  {
    name: 'Analytics',
    icon: <AiOutlineLineChart size={24} />,
    selected: false,
  },
];

function Sidebar({ setShowTaskDrawer }: { setShowTaskDrawer: (val: boolean) => void }) {
  const { user } = useUser();

  return (
    <aside className="h-screen shrink-0 overflow-y-auto w-64 border-r-2 border-gray-300 py-6 px-4 flex flex-col gap-2 text-gray-500">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-gray-200 w-fit">
          <FaUser size={22} />
        </div>
        <span className="capitalize font-semibold">{user?.name}</span>
      </div>
      <ActionButtons />
      <div className="flex flex-col mt-2">
        {tabs.map((tab, i) => (
          <button
            className={`w-full flex items-center gap-2 p-2 font-medium ${
              tab.selected && 'bg-gray-100 border border-gray-200 rounded-md'
            }`}
            key={i}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>
      <Button onClick={() => setShowTaskDrawer(true)}>
        Create new task
        <BsFillPlusCircleFill size={20} />
      </Button>
      <div className="flex items-end flex-1 w-full mt-5">
        <button className="w-full flex gap-4 items-center justify-center bg-gray-100 rounded-lg p-2">
          <TfiDownload size={20} />
          <div className="flex flex-col items-start">
            <span className="font-medium">Download the app</span>
            <span className="text-xs">Get the full Experience</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

function ActionButtons() {
  const logoutMutation = useLogout();

  return (
    <div className="text-gray-600 flex items-center justify-between">
      <div className="flex gap-4 items-center ml-0.5">
        <button>
          <IoNotificationsOutline size={24} />
        </button>
        <button className="relative">
          <PiSpinnerBold size={24} />
          <span className="absolute w-2 h-2 bg-yellow-400 rounded-full top-0 right-0"></span>
        </button>
        <button>
          <MdOutlineKeyboardDoubleArrowRight size={24} />
        </button>
      </div>
      <button
        className="bg-gray-100 rounded-md px-3 py-2 font-medium text-sm"
        onClick={() => logoutMutation.mutate()}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
