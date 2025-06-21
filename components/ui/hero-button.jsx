'use client';
import { motion } from 'framer-motion';

export default function HeroButton({ 
  children, 
  onClick, 
  icon: Icon, 
  variant = 'primary',
  className = '',
  delay = 0,
  ...props 
}) {

  const buttonVariants = {
    hidden: { opacity: 0, y: 400 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const baseClasses = "cursor-pointer lg:text-xl border-2 border-gray-600 group flex items-center justify-center gap-2 py-4 px-2 md:py-6 w-[20rem] bg-[#262626] text-gray-200 hover:scale-105 hover:bg-gray-800 font-semibold rounded-xl";

  return (
    <motion.button
      variants={buttonVariants}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {Icon && (
        <div className="w-7 h-7 md:w-8 md:h-8 p-1 rounded-full border-2 border-yellow-500 bg-[#262626] group-hover:bg-gray-800 flex items-center justify-center">
          <Icon size={22} className="text-yellow-500" />
        </div>
      )}
      {children}
    </motion.button>
  );
}