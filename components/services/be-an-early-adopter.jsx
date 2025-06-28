'use client';
import { motion } from 'framer-motion';
import { earlyAdopter } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

export default function BeAnEarlyAdopter() {
  return (
    <Container variant="transparent-gradient" className="flex items-center">
      <div className="mx-auto flex flex-col items-center text-center gap-4 sm:gap-6 md:gap-8 w-full px-4 sm:px-6">
        <Title
          variant="h2"
          title={earlyAdopter.heading}
          className="!mb-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl"
        />
        <Title
          variant="h4"
          title={earlyAdopter.description}
          className="!mt-0 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light"
        />
        {/* Consulting Cards */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-3 w-full justify-center">
          {earlyAdopter.consulting.map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex-1 rounded-2xl border border-yellow-400/60 bg-gray-900/80 p-3 sm:p-4 md:p-6 flex flex-col items-start gap-2 min-w-0 md:min-w-[220px] w-full md:w-auto`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full ${item.iconBg}`}>
                  {item.icon}
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-100">{item.title}</span>
              </div>
              <div className="text-gray-300 text-left text-sm sm:text-base md:text-lg lg:text-xl font-light">{item.description}</div>
            </motion.div>
          ))}
        </div>
        <div className="text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl font-light mx-auto px-2 sm:px-4 md:px-0">
          {earlyAdopter.planVsAutomate.map((part, idx) =>
            part.highlight ? (
              <motion.span
                key={idx}
                className="text-yellow-400 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                {part.text}
              </motion.span>
            ) : (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                {part.text}
              </motion.span>
            )
          )}
        </div>
      </div>
    </Container>
  );
}