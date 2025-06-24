'use client';
import Title from '@/components/ui/title';
import Container from '@/components/ui/container';
import HeroButton from "@/components/ui/hero-button";
import HubSpotCalendar from "@/components/ui/hubspot-calendar";
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function LetsBuild() {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleBookNowClick = (e) => {
        e.preventDefault();
        setShowCalendar(true);
    };

    const handleCloseCalendar = () => {
        setShowCalendar(false);
    };

    return (
        <Container variant="transparent-gradient">
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="w-full">
                    <div className="rounded-3xlm px-6 py-12 md:px-16 flex flex-col items-center gap-8">
                        <Title
                            variant="h2"
                            title="Let's Build Smart Growth Systems Together"
                            className="mb-2 text-center"
                        />
                        <Title
                            title="We work best with ambitious brands, product-led founders, and internal teams looking to operate at the edge of marketing innovation."
                            className="text-lg md:text-xl text-gray-200 text-center mb-4 font-normal"
                            variant="h4"
                        />
                        <div className="w-full flex justify-center">
                            <HeroButton
                                onClick={handleBookNowClick}
                                icon={Check}
                                delay={0.2}
                                className="w-full max-w-xs"
                            >
                                Book a Consulting Discovery Call
                            </HeroButton>
                        </div>
                    </div>
                </div>
            </div>
            <HubSpotCalendar
                isOpen={showCalendar}
                onClose={handleCloseCalendar}
            />
        </Container>
    );
}