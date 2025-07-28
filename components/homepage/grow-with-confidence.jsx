'use client';

import { motion } from "framer-motion";
import { growthSteps } from '@/data/data';
import { FaRocket, FaLightbulb, FaChartLine, FaUsers } from 'react-icons/fa';
import Title from "@/components/ui/title";
import Container from "@/components/ui/container";


export default function GrowWithConfidence() {
    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.18 },
        },
    };
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.97, y: 32 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.55, ease: "easeOut" },
        },
    };

    const getStepIcon = (index) => {
        const colorClasses = [
            "text-[#2176ff]", 
            "text-[#ffc72c]", 
            "text-[#2176ff]"  
        ];
        const iconProps = {
            size: 44,
            className: colorClasses[index] + " drop-shadow",
            style: { filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }
        };
        switch (index) {
            case 0:
                return <FaRocket {...iconProps} />;
            case 1:
                return <FaLightbulb {...iconProps} />;
            case 2:
                return <FaChartLine {...iconProps} />;
            default:
                return <FaRocket {...iconProps} />;
        }
    };

    return (
            
            <Container className="relative w-full py-20" variant="gray">
                <div className="flex flex-col items-center justify-center mt-8 mb-12">
                    <Title
                        title="Grow with confidence"
                        variant="h2"
                        className="mb-3"
                        underlineEffect={true}
                    />
                </div>
            <div className="w-full flex justify-center">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 place-content-center mx-auto"
                    style={{ maxWidth: '1150px', width: '100%' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    variants={containerVariants}
                >
                    {[0,1,2].map((index) => {
                        const step = growthSteps[index];
                        const accentColors = [
                            { bg: "bg-[#eaf3ff]", shadow: "bg-[#4da3ff]", text: '#2176ff' },
                            { bg: "bg-[#fffbe6]", shadow: "bg-[#ffd600]", text: '#ffc72c' },
                            { bg: "bg-[#eaf3ff]", shadow: "bg-[#2176ff]", text: '#2176ff' }
                        ];
                        const accent = accentColors[index];
                        const cardBg = "#f1e3e3ff";
                        return (
                <motion.div
                    key={index}
                    className="group relative flex justify-center"
                    variants={cardVariants}
                >
                    <div
                        className={`absolute left-4 top-4 w-full h-full rounded-2xl z-0 ${accent.shadow}`}
                        style={{
                            transform: 'rotate(-7deg)',
                            filter: 'blur(0.5px)',
                            opacity: 0.92,
                            background: accent.shadow.replace('bg-[','').replace(']',''),
                        }}
                    ></div>
                    <div
                        className={`relative h-full px-8 py-12 rounded-2xl shadow-xl flex flex-col items-center mx-auto z-10`}
                        style={{ minWidth: '320px', maxWidth: '400px', width: '100%', background: cardBg }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <div className={`w-14 h-14 flex items-center justify-center ${accent.bg} rounded-full shadow-md`} style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}>
                                <div className="flex items-center justify-center">
                                    {getStepIcon(index)}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className={`mb-2 text-center text-lg lg:text-xl font-bold tracking-wide`}
                            style={{ color: accent.text, fontWeight: 700 }}>
                            {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[#6b7280] text-md lg:text-lg font-normal text-center leading-relaxed mb-2" style={{ color: '#6b7280' }}>
                            {step.description}
                        </p>
                    </div>
                </motion.div>
                        );
                    })}
                </motion.div>
            </div>
            </Container>
    );
}