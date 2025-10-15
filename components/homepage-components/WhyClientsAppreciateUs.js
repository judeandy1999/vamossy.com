'use client';
import React, { useState } from 'react';
import { Target, Play, Truck, Zap, BarChart2, ShieldCheck, BookOpen, Shuffle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const items = [
    {
        icon: <Target className="w-8 h-8" />,
        title: 'Fit over volume',
        description:
            'Curated shortlists (3–5) with evidence—past work, references, capacity, and cultural fit.',
    },
    {
        icon: <Play className="w-8 h-8" />,
        title: 'Pilot-first, KPI-tied',
        description:
            'Prove it before retainers: clear scope, success metrics, and a real exit plan.',
    },
    {
        icon: <Truck className="w-8 h-8" />,
        title: 'AI that actually ships',
        description: 'Practical workflows embedded in your stack—with training.',
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Speed with rigor',
        description: 'Days—not weeks—to a shortlist, plus normalized scopes.',
    },
    {
        icon: <BarChart2 className="w-8 h-8" />,
        title: 'Measurable outcomes',
        description:
            'Baselines, dashboards, post-mortems, and a decision pack you can take to leadership.',
    },
    {
        icon: <ShieldCheck className="w-8 h-8" />,
        title: 'Procurement & security friendly',
        description:
            'NDA by default, MSA/SOW templates, DPA guidance, least-privilege access.',
    },
    {
        icon: <BookOpen className="w-8 h-8" />,
        title: 'Knowledge you keep',
        description:
            'Playbooks, SOPs, and handover docs—so results persist beyond the engagement.',
    },
    {
        icon: <Shuffle className="w-8 h-8" />,
        title: 'Platform-agnostic choices',
        description:
            'Shopify/Headless, CRM, ad platforms, analytics—no vendor bias, just what fits your goals.',
    },
];

const WhyClientsAppreciateUs = () => {
    const [page, setPage] = useState(0);
    const itemsPerPage = 4;
    const maxPage = Math.floor((items.length - 1) / itemsPerPage);

    const handlePrev = () => setPage((p) => Math.max(0, p - 1));
    const handleNext = () => setPage((p) => Math.min(maxPage, p + 1));

    const visibleItems = items.slice(
        page * itemsPerPage,
        page * itemsPerPage + itemsPerPage
    );

    return (
        <section className="py-16 px-4 bg-[#dbeafe]">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#294792] mb-4">
                    Why Clients Appreciate Us
                </h2>
                <p className="text-base max-w-3xl mx-auto md:text-lg text-[#505a66] mb-12">
                    Independent operators, faster traction, cleaner handoffs. Here&apos;s what
                    brands tell us they value most.
                </p>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        {visibleItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center"
                            >
                                <span className="bg-[#1f40af] text-white rounded-xl p-4 mb-4 flex items-center justify-center">
                                    {item.icon}
                                </span>
                                <h3 className="font-bold text-[#1f40af] text-lg mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-[#505a66]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <button
                            onClick={handlePrev}
                            disabled={page === 0}
                            className={`p-2 cursor-pointer rounded-full border border-[#1f40af] text-[#1f40af] bg-white hover:bg-blue-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <span className="text-[#1f40af] font-semibold">
                            {page + 1} / {maxPage + 1}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={page === maxPage}
                            className={`p-2 cursor-pointer rounded-full border border-[#1f40af] text-[#1f40af] bg-white hover:bg-blue-100 transition disabled:opacity-40 disabled:cursor-not-allowed`}
                            aria-label="Next"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="w-full md:w-auto cursor-pointer bg-[#1f40af] text-white font-semibold px-8 py-4 rounded-lg shadow hover:bg-blue-800 transition text-lg flex items-center justify-center gap-2"
                        data-cal-link="dev-vamossy/discovery-call"
                        data-cal-namespace="discovery-call"
                        data-cal-config='{"layout":"month_view"}'
                    >
                        <Calendar className="w-5 h-5" />
                        Ready to experience it? See How it Works
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyClientsAppreciateUs;