import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children?: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  primary?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button = ({ 
  children, 
  icon, 
  onClick, 
  type = 'button', 
  primary = false,
  disabled = false,
  fullWidth = false
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors
        ${fullWidth ? 'w-full' : ''}
        ${primary 
          ? 'bg-primary-500 hover:bg-primary-600 text-white' 
          : 'bg-dark-800 hover:bg-dark-700 text-dark-200 border border-dark-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;