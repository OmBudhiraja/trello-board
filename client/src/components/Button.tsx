import { cn } from '@/utils/cn';
import { ButtonHTMLAttributes } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, className, ...rest }: ActionButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'w-full bg-violet-900 text-white text-sm lg:text-base px-2 py-2.5 lg:px-3 rounded-lg flex items-center gap-2 justify-center',
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
