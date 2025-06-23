'use client';
import { bonusAssets } from "@/data/data";
import { motion } from "framer-motion";
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function BonusAssets() {
  return (
    <Container variant="gray-gradient" className="py-16 lg:py-24">
      <motion.div
        className="relative w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 left-10 w-60 h-60 blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          ></motion.div>
          <motion.div
            className="absolute bottom-10 right-10 w-72 h-72  blur-3xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          ></motion.div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <Title
            variant="h2"
            title="Bonus Assets"
            underlineEffect={true}
            className="mb-2 text-center"
          />
          <div className="text-lg md:text-2xl font-medium text-gray-200 text-center mb-10">
            (All Tiers)
          </div>
          <div className="flex flex-col gap-6">
            {bonusAssets.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center border border-yellow-400 rounded-xl px-6 py-5 transition-all duration-200 shadow-none"
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.1 }}
                variants={cardVariants}
                style={{ background: "transparent" }}
              >
                <div className="font-bold text-yellow-400 text-lg md:text-xl min-w-[220px] mb-2 md:mb-0 md:mr-6">
                  {item.asset}
                </div>
                <div className="text-white text-base md:text-lg font-medium">
                  {item.use}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </Container>
  );
}