// components/DigitalMarketingServices.jsx
'use client';
import { motion } from "framer-motion";
import { services } from "@/data/data";

export default function DigitalMarketingServices() {
  const titleVariants = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  const featuresVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-[#02355A] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.h2 
          className="text-[68px] mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={titleVariants}
        >
          Digital Marketing Services
        </motion.h2>
        <motion.div 
          className="grid md:grid-cols-5 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={featuresVariants}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-transparent border border-white/25 text-left p-6 rounded-lg hover:shadow-lg hover:-translate-y-1 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <h3 className="text-[20px] text-white font-semibold">
                    {service.title}
                  </h3>
                </div>
                <hr className="border-t border-white/25 ml-[-24px] w-[calc(100%+48px)] my-2" />
                <ul className="pt-4 text-gray-400 text-[18px] space-y-1">
                  {service.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="text-yellow-400 font-light text-[16px] inline-flex items-center gap-1 hover:underline"
                >
                  {service.link} <span>&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
