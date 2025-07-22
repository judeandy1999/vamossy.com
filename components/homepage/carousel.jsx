'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroButton from '@/components/ui/hero-button';
import { Check } from 'lucide-react';
import Image from 'next/image';

const carouselData = [
    {
        id: 1,
        title: 'Conquer Your Market without a Doubt',
        subtitle: 'Growth is not random - it is the result of a competitive system.',
        description: 'We build a system with you that outperforms and outgrows them all.',
        ctaText: 'Book a Discovery Call',
        bgGradient: 'from-yellow-500/20 to-blue-500/20',
        image: '/homepage/productive.svg',
        imageAlt: 'Strategic chess pieces representing market conquest'
    },
    {
        id: 2,
        title: 'Let us be Your Unfair Advantage',
        subtitle: 'Speed. Scale. Systems. Strategy.',
        description: 'If you\'re done competing on "ad spend," we build the engine that outlasts trends.',
        ctaText: 'Book a Discovery Call',
        bgGradient: 'from-blue-500/20 to-purple-500/20',
        image: '/homepage/thought-process.svg',
        imageAlt: 'Advanced machinery representing competitive advantage'
    },
    {
        id: 3,
        title: 'AI Enhanced Consulting = The Most Advantageous Growth Combo in Ecommerce',
        subtitle: 'We blend founder wisdom, system design, and prompt engineering into your brand\'s competitive forces.',
        description: '',
        ctaText: 'Book a Discovery Call',
        bgGradient: 'from-purple-500/20 to-yellow-500/20',
        image: '/homepage/ai-agent.svg',
        imageAlt: 'AI and analytics visualization'
    },
];

export default function HeroCarousel({ onBookNowClick }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
        }),
    };

    const imageVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.8,
        }),
    };

    const transition = {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
    };

    return (
        <div
            style={{
                background: '#1c1c1c',
                background: 'linear-gradient(95deg, #0c111c 0%, #0d0d1b 50%, #0c111c 100%)',
            }}
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
        >
            <button
                onClick={prevSlide}
                className="cursor-pointer absolute left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 group"
                aria-label="Previous slide"
            >
                <ChevronLeft className="text-white group-hover:text-yellow-400 transition-colors" size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="cursor-pointer absolute right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 group"
                aria-label="Next slide"
            >
                <ChevronRight className="text-white group-hover:text-yellow-400 transition-colors" size={24} />
            </button>

            {/* Slides Container */}
            <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-8">
                <AnimatePresence initial={false} custom={1}>
                    <motion.div
                        key={currentSlide}
                        custom={1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={transition}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {/* 2 Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full h-full">
                            {/* Left Column - Content */}
                            <div className="flex flex-col justify-center space-y-2 px-4 lg:px-0 order-2 lg:order-1">
                                <motion.h1
                                    className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-100 leading-tight"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    {carouselData[currentSlide].title}
                                </motion.h1>

                                <motion.h2
                                    className="text-lg md:text-lg lg:text-xl xl:text-2xl font-medium text-yellow-400 leading-relaxed"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    {carouselData[currentSlide].subtitle}
                                </motion.h2>

                                {carouselData[currentSlide].description && (
                                    <motion.p
                                        className="text-md md:text-lg lg:text-xl text-gray-200 leading-relaxed"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                    >
                                        {carouselData[currentSlide].description}
                                    </motion.p>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="flex justify-start pt-4"
                                >
                                    <HeroButton
                                        onClick={onBookNowClick}
                                        icon={Check}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-10 py-5 text-xl shadow-2xl"
                                    >
                                        {carouselData[currentSlide].ctaText}
                                    </HeroButton>
                                </motion.div>
                            </div>

                            {/* Right Column - Image */}
                            <div className="flex items-center justify-center order-1 lg:order-2 h-full">
                                <AnimatePresence initial={false} custom={1}>
                                    <motion.div
                                        key={`image-${currentSlide}`}
                                        custom={1}
                                        variants={imageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={transition}
                                        className="relative w-full h-64 md:h-80 lg:h-96 xl:h-[500px]"
                                    >
                                        <Image
                                            src={carouselData[currentSlide].image}
                                            alt={carouselData[currentSlide].imageAlt}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            priority={currentSlide === 0}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Line Indicators */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex items-center">
                {carouselData.map((_, index) => (
                    <div key={index} className="flex items-center">
                        {/* Numbered Circle */}
                        <button
                            onClick={() => goToSlide(index)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                                index === currentSlide
                                    ? 'bg-white text-gray-900'
                                    : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            {index + 1}
                        </button>
                        
                        {/* Connecting Line (except for last item) */}
                        {index < carouselData.length - 1 && (
                            <div className="w-8 lg:w-15 h-0.5">
                                <div 
                                    className={`h-full transition-all duration-500 ${
                                        index < currentSlide 
                                            ? 'bg-white' 
                                            : 'bg-white/30'
                                    }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}