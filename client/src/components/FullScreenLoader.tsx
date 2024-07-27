import { BiLoaderAlt } from 'react-icons/bi';

function FullScreenLoader() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <BiLoaderAlt className="animate-spin w-10 h-10" />
    </div>
  );
}

export default FullScreenLoader;
