
import { ReactNode } from 'react';

interface FormationSectionWrapperProps {
  children: ReactNode;
  isActive: boolean;
  className?: string;
}

const FormationSectionWrapper = ({ children, isActive, className = "" }: FormationSectionWrapperProps) => {
  return (
    <div 
      className={`
        absolute inset-0 transition-all duration-500 ease-in-out
        ${isActive 
          ? 'opacity-100 translate-x-0 pointer-events-auto' 
          : 'opacity-0 translate-x-full pointer-events-none'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default FormationSectionWrapper;
