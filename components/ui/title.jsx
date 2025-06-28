'use client';

import { motion } from 'framer-motion';
import { Typewriter } from "react-simple-typewriter";

export default function Title({ 
  title, 
  variant = 'h1', 
  typewriter = false, 
  underlineEffect = false, 
  titlePosition = 'center', 
  animationVariant = 'topToBottom',
  className ='',
  isAnimationEnabled = true,
}) {

  const topToBottom = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const leftToRight = {
		hidden: { opacity: 0, x: -100 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 1,
				ease: "easeOut",
			},
		},
	};

  const rightToLeft = {
		hidden: { opacity: 0, x: 100 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 1,
				ease: "easeOut",
			},
		},
	};

  const getAnimationVariant = (animationVariant) => {
    switch (animationVariant) {
      case 'topToBottom':
        return topToBottom;
      case 'leftToRight':
        return leftToRight;
      case 'rightToLeft':
        return rightToLeft;
      default:
        return topToBottom;
    }
  };

  const getClasses = (variant) => {
    const baseClasses = `${titlePosition === 'center' ? 'items-center text-center' : titlePosition === 'left' ? 'md:items-start md:text-left' : 'md:items-end md:text-right' } ${className} mb-2 md:mb-4 flex flex-col justify-center px-6 text-gray-100 leading-tight`;
    const underlineEffectClasses = underlineEffect
      && `${animationVariant === 'leftToRight' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-gray-300 via-gray-300 to-yellow-200 bg-clip-text text-transparent md:max-w-full`;
    
    switch (variant) {
      case 'h1':
        return `${baseClasses} ${underlineEffectClasses} text-3xl font-semibold md:text-4xl lg:text-5xl md:max-w-[80%]`;
      case 'h2':
        return `${baseClasses} ${underlineEffectClasses} text-3xl font-semibold md:text-4xl lg:text-5xl`;
      case 'h3':
        return `${baseClasses} ${underlineEffectClasses} text-xl md:text-3xl lg:text-4xl font-normal max-w-full md:max-w-[80%]`;
      case 'h3-full':
        return `${baseClasses} ${underlineEffectClasses} text-xl md:text-3xl lg:text-4xl font-normal max-w-full`;
      case 'h4':
        return `${baseClasses} ${underlineEffectClasses} text-sm !flex-row !mb-0 !md:mb-4 text-gray-200 md:text-xl lg:text-2xl mt-2 font-light md:max-w-[60%]`;
      case 'h5':
        return `${baseClasses} ${underlineEffectClasses} text-xl !flex-row !mb-0 !md:mb-4 text-gray-200 md:text-xl lg:text-2xl mt-2 font-light`;
      case 'h6':
        return `${baseClasses} ${underlineEffectClasses} text-sm !flex-row !mb-0 !md:mb-4 text-gray-200 md:text-xl lg:text-xl mt-2 font-light`;
      default:
        return `${baseClasses} ${underlineEffectClasses} text-xl md:text-5xl lg:text-6xl`;
    }
  };

  const MotionComponent = motion[variant] || motion.h1;

  return (
    <MotionComponent
      className={getClasses(variant)}
      variants={isAnimationEnabled && getAnimationVariant(animationVariant)}
       initial="hidden"
       whileInView="visible"
      viewport={{ once: false, amount: 0 }}
    >
      {typewriter ? (
        <Typewriter
          words={[
            title
          ]}
          cursor={true}
          cursorStyle="|"
          loop={true}
          typeSpeed={60}
          deleteSpeed={30}
          delaySpeed={2000}
        />
      ) : (
        title
      )}
      { underlineEffect &&
        <div className={`m-auto ${animationVariant === 'leftToRight' ? 'md:ml-0' : animationVariant === 'rightToLeft' ? 'md:mr-0' : 'md:m-auto'} w-16 h-[2px] md:w-32 lg:h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4 relative`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-sm"></div>
        </div>
      }
    </MotionComponent>
  );
}
