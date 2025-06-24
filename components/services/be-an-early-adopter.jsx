'use client';
import { motion } from 'framer-motion';
import { earlyAdopter } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

export default function BeAnEarlyAdopter() {
  return (
    <Container variant="transparent-gradient">
      <div className="mx-auto flex flex-col items-center text-center gap-6">
        <Title
          variant="h2"
          title={earlyAdopter.heading}
          className="mb-2"
        />
        
        <Title
          variant="h4"
          title={earlyAdopter.description}
          className="text-xl md:text-xl text-gray-200 font-light md:mt-5"
        />
        {/* Consulting Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center mb-8">
          {earlyAdopter.consulting.map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex-1 rounded-2xl border border-yellow-400/60 bg-gray-900/80 p-6 flex flex-col items-start gap-2 min-w-[220px]`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-9 h-9 flex items-center justify-center rounded-full ${item.iconBg}`}>
                  {item.icon}
                </span>
                <span className="text-xl font-bold text-gray-100">{item.title}</span>
              </div>
              <div className="text-gray-300 text-left text-lg font-light">{item.description}</div>
            </motion.div>
          ))}
        </div>
        <div className="text-gray-200 text-lg md:text-xl font-light max-w-2xl mx-auto mb-8">
          {earlyAdopter.planVsAutomate}
        </div>
      </div>
    </Container>
  );
}