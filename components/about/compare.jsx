"use client";
import { agencyComparison } from "../../data/data";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/ui/container";
import Title from "@/components/ui/title";

export default function Compare() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <Container
      variant="gray-gradient"
    >
      <div className="relative mx-auto" ref={ref}>
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <Title
            title={agencyComparison.title}
            variant="h2"
            animationVariant="topToBottom"
            className="mb-2"
          />
          <Title
            title={agencyComparison.subtitle}
            variant="h5"
            animationVariant="leftToRight"
            className="text-gray-300 font-light mx-auto"
            isAnimationEnabled={false}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center">
          {agencyComparison.columns.map((col, idx) => (
            <motion.div
              key={col.heading}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-300 w-full mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + idx * 0.1 }}
            >
              <div className="flex flex-col items-center mb-8">
                <Title
                  title={col.heading}
                  variant="h3"
                  className="mb-0 font-semibold tracking-tight text-gray-300 whitespace-nowrap"
                  isAnimationEnabled={false}
                />
                <div className="w-15 h-1 bg-yellow-400 rounded-full mt-3" />
              </div>
              <ul className="space-y-4">
                {col.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <span className={`text-lg md:text-xl mt-0.5 ${
                      item.type === "good"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}>
                      {item.type === "good" ? "✓" : "✗"}
                    </span>
                    <span className={`text-lg md:text-xl leading-relaxed ${
                      item.type === "good"
                        ? "text-gray-300"
                        : "text-gray-400"
                    }`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}