
'use client';

import { motion } from "framer-motion";
import { Play } from 'lucide-react';
import { clientTypes, growthSteps } from '@/data/data';
import { FaSearch, FaProjectDiagram, FaShieldAlt } from 'react-icons/fa';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";

export default function HowWeDrive() {

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const brandYellow = '#FFD600';
  const cardStyles = [
    {
      border: `border-[${brandYellow}]`,
      icon: 'search',
      number: '01',
      dot: brandYellow,
      iconComponent: (props) => <FaSearch {...props} style={{ color: brandYellow }} />,
    },
    {
      border: `border-[${brandYellow}]`,
      icon: 'briefcase',
      number: '02',
      dot: brandYellow,
      iconComponent: (props) => <FaProjectDiagram {...props} style={{ color: brandYellow }} />,
    },
    {
      border: `border-[${brandYellow}]`,
      icon: 'mountain',
      number: '03',
      dot: brandYellow,
      iconComponent: (props) => <FaShieldAlt {...props} style={{ color: brandYellow }} />,
    },
  ];

  return (
    <Container className="relative w-full !pb-24 md:!pb-40" variant="transparent">
      <div className="mt-6 mb-6 text-center md:mt-8 md:mb-8 md:text-right">
        <Title title="Grow with Confidence" variant="h2" />
      </div>

      <motion.div
        className="max-w-full md:max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 px-2 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        {cardStyles.map((style, index) => (
          <motion.div
            key={index}
            className="group"
            variants={cardVariants}
          >
            <div
              className={`relative p-6 md:p-12 rounded-[28px] md:rounded-[40px] shadow-2xl flex flex-col items-center justify-center w-full`}
              style={{
                minHeight: 180,
                boxShadow: '0 8px 48px 0 rgba(44,62,80,0.25)',
                background: 'rgba(18,22,34,0.98)',
                filter: 'blur(0.5px)',
                borderTop: `2px solid ${style.dot}`,
                borderLeft: `2px solid ${style.dot}`,
                borderRight: '2px solid transparent',
                borderBottom: '2px solid transparent',
              }}
            >
              {/* Dotted border bottom and right (custom dots, outside the border) */}
              <>
                {/* Dots on right */}
                {Array.from({ length: 13 }).map((_, i) => (
                  <div
                    key={`dot-right-${i}`}
                    className="absolute"
                    style={{
                      right: '-12px',
                      top: `${18 + i * 12}px`,
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: style.dot,
                      opacity: 0.5,
                      zIndex: 1,
                    }}
                  />
                ))}
                {/* Dots on bottom */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={`dot-bottom-${i}`}
                    className="absolute"
                    style={{
                      left: `${24 + i * 14}px`,
                      bottom: '-12px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: style.dot,
                      opacity: 0.5,
                      zIndex: 1,
                    }}
                  />
                ))}
              </>
              {/* Icon */}
              <div className="mb-4 md:mb-6 mt-1 md:mt-2 flex justify-center z-10">
                {style.iconComponent && style.iconComponent({ className: 'w-10 h-10 md:w-14 md:h-14' })}
              </div>
              {/* Title */}
              <h3 className="mb-1 md:mb-2 text-white text-lg md:text-2xl font-bold text-center tracking-wide z-10">
                {growthSteps[index]?.title || `Diagnostics`}
              </h3>
              {/* Description */}
              <p className="text-[#b3c2d4] text-sm md:text-lg font-normal text-center leading-relaxed z-10">
                {growthSteps[index]?.description || 'Deep discovery, audit, effort vs reward opportunities'}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}