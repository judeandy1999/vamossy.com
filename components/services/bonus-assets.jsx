'use client';
import { bonusAssets } from "@/data/data";
import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const tableVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function BonusAssets() {
  return (
    <motion.section
      className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2 }}
      variants={sectionVariants}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
        <motion.div
          className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        ></motion.div>
      </div>
      <div className="relative max-w-4xl mx-auto overflow-x-hidden overflow-y-hidden">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Bonus Assets <span className="font-normal">(All Tiers)</span>
        </motion.h2>
        <div className="overflow-x-hidden overflow-y-hidden">
          <motion.table
            className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <thead>
              <tr>
                <motion.th
                  className="bg-yellow-400 text-gray-900 text-xl font-bold py-4 px-6 text-left border-b-2 border-gray-300"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  Asset
                </motion.th>
                <motion.th
                  className="bg-yellow-400 text-gray-900 text-xl font-bold py-4 px-6 text-left border-b-2 border-gray-300"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Use
                </motion.th>
              </tr>
            </thead>
            <tbody>
              {bonusAssets.map((item, idx) => (
                <motion.tr
                  key={idx}
                  className="border-b border-gray-400 last:border-b-0"
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ amount: 0.1 }}
                  variants={tableVariants}
                >
                  <td className="bg-gray-800 text-white font-semibold py-4 px-6 border-r border-gray-400">
                    {item.asset}
                  </td>
                  <td className="bg-gray-800 text-white font-semibold py-4 px-6">
                    {item.use}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </motion.section>
  );
}