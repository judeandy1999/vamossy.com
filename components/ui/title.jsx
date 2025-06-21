'use client';

import { motion } from 'framer-motion';
import { Typewriter } from "react-simple-typewriter";

export default function Title({ 
  title, 
  variant = 'h1', 
  typewriter = false, 
  underlineEffect = false, 
  titlePosition = 'center', 
  animationVariant = 'topToBottom' 
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

  const getTitlePosition = (titlePosition) => {
    switch (titlePosition) {
      case 'left':
        return 'left';
      case 'right':
        return 'right';
      case 'center':
        return 'center';
      default:
        return 'center';
    }
  };

  const getClasses = (variant) => {
    const baseClasses = `${titlePosition === 'center' ? 'items-center text-center' : titlePosition === 'left' ? 'md:items-start md:text-left' : 'md:items-end md:text-right' } mb-2 md:mb-4 flex flex-col justify-center px-6 text-gray-100 leading-tight`;
    const underlineEffectClasses = underlineEffect
      && `${animationVariant === 'leftToRight' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white via-white to-yellow-200 bg-clip-text text-transparent md:max-w-full`;
    
    switch (variant) {
      case 'h1':
        return `${baseClasses} ${underlineEffectClasses} text-3xl font-semibold md:text-5xl lg:text-6xl md:max-w-[80%]`;
      case 'h2':
        return `${baseClasses} ${underlineEffectClasses} text-3xl font-semibold md:text-5xl lg:text-6xl`;
      case 'h3':
        return `${baseClasses} ${underlineEffectClasses} text-xl md:text-3xl lg:text-4xl font-normal max-w-full`;
      case 'h4':
        return `${baseClasses} ${underlineEffectClasses} text-sm !flex-row !mb-0 !md:mb-4 text-gray-200 md:text-xl lg:text-2xl mt-2 font-light md:max-w-[60%]`;
      default:
        return `${baseClasses} ${underlineEffectClasses} text-xl md:text-5xl lg:text-6xl`;
    }
  };

  const MotionComponent = motion[variant] || motion.h1;
console.log( animationVariant, getAnimationVariant(animationVariant) );
  return (
    <MotionComponent
      className={getClasses(variant)}
      variants={getAnimationVariant(animationVariant)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
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
        <div className={`m-auto ${animationVariant === 'leftToRight' ? 'md:ml-0' : 'md:mr-0'} w-16 h-[2px] md:w-32 lg:h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4 relative`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-sm"></div>
        </div>
      }
    </MotionComponent>
  );
}
