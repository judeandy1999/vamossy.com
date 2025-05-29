'use client';
import Image from "next/image";
import { motion } from 'framer-motion';

export default function ServicesPromoSection({
  icon,
  heading,
  subheading,
  description,
  stat,
  statCaption,
  imageSrc,
  reverse = false,
}) {

  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: reverse ? -200: 200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className={`py-20 px-4 ${reverse ? "bg-gray-100" : "bg-white"}`}>
      <div
        className={`max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text Content */}
        <motion.div 
          className="md:w-1/2 space-y-6 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={textVariants}
        >
          <div className="text-[20px] flex items-center justify-center md:justify-start gap-2 text-[#02355A] font-semibold">
            <span>{heading}</span>
          </div>
          <h2 className="text-[48px] font-semibold leading-tight text-gray-800">
            {subheading}
          </h2>
          <p className="text-gray-600 text-[28px]">{description}</p>
          <div className="flex items-center text-[68px] font-black text-green-700">
            {stat} <span className="ml-4 text-[28px] font-light text-green-700">{statCaption}</span>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="md:w-1/2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={zoomInVariants}
        >
          <Image
            src={imageSrc}
            alt="Website Samples"
            width={800}
            height={600}
            className="rounded-lg shadow-md w-full h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}