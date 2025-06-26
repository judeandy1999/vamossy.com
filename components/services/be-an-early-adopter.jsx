'use client';
import { motion } from 'framer-motion';
import { earlyAdopter } from '@/data/data';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';

export default function BeAnEarlyAdopter() {
  return (
    <Container variant="transparent-gradient" className='h-[80vh] items-center'>
      <div className="mx-auto flex flex-col items-center text-center gap-6">
        <Title
          variant="h2"
          title={earlyAdopter.heading}
          className='!mb-0'
        />
        
        <Title
          variant="h4"
          title={earlyAdopter.description}
          className="text-xl md:text-xl text-gray-200 font-light"
        />
        {/* Consulting Cards */}
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          {earlyAdopter.consulting.map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex-1 rounded-2xl border border-yellow-400/60 bg-gray-900/80 p-6 flex flex-col items-start gap-2 min-w-[220px]`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-9 h-9 flex items-center justify-center rounded-full ${item.iconBg}`}>
                  {item.icon}
                </span>
                <span className="text-2xl font-semibold text-gray-100">{item.title}</span>
              </div>
              <div className="text-gray-300 text-left text-xl font-light">{item.description}</div>
            </motion.div>
          ))}
        </div>
        <div className="text-gray-200 text-xl md:text-2xl font-light max-w-3xl mx-auto">
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