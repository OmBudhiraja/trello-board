import { cn } from '@/utils/cn';
import { ButtonHTMLAttributes } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

function Button({ children, className, isLoading = false, ...rest }: ActionButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'w-full relative bg-violet-900 text-white text-sm lg:text-base px-2 py-2.5 lg:px-3 rounded-lg flex items-center gap-2 justify-center',
        className
      )}
    >
      <span
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
        className="flex items-center justify-center w-full gap-2"
      >
        {children}
      </span>

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <BiLoaderAlt className="animate-spin w-5 h-5" />
        </div>
      )}
    </button>
  );
}

export default Button;
