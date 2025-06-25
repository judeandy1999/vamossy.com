"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";

export default function FounderCard({ founder }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <Container variant="transparent-gradient" className="py-16">
      <div className=" mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Meet The Founder
          </h2>
          <div className="h-1 w-20 bg-yellow-400 mx-auto" />
        </motion.div>

        <motion.div
          className="bg-gray-900/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-gray-700/50"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <motion.div
              className="lg:col-span-2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative w-74 h-110 rounded-2xl overflow-hidden border-2 border-yellow-400/50 shadow-2xl">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 5%" }}
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="space-y-4">
                <h3 className="text-xl md:text-3xl font-bold text-white">
                  {founder.name}
                </h3>
                <p className="text-lg md:text-xl text-yellow-400 font-semibold">
                  {founder.intro}
                </p>
              </div>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                {founder.bio.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-base md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-700">
                <p className="text-yellow-400 font-semibold text-lg md:text-xl">
                  {founder.closing}
                </p>
                <p className="text-white font-semibold text-lg md:text-xl">
                  {founder.closing2}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}