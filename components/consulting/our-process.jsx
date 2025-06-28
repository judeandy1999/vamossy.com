import { ourProcess } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';
import { Pencil, ClipboardList, Hammer, Repeat2 } from "lucide-react";

const stepBorderColors = [
  "border-yellow-400/50",
  "border-blue-400/50",
  "border-yellow-400/50",
  "border-blue-400/50"
];

const stepIconBgColors = [
  "text-yellow-400/50",
  "text-blue-400/50",
  "text-yellow-400/50",
  "text-blue-400/50"
];

const stepIcons = [
  Pencil,        // Diagnosis
  ClipboardList, // Blueprint
  Hammer,        // Prototyping & Enablement
  Repeat2        // Capability Transfer
];

const stepDividerColors = [
  "bg-yellow-400/50",
  "bg-blue-400/50",
  "bg-yellow-400/50",
  "bg-blue-400/50"
];

export default function OurProcess() {
  return (
    <Container variant="transparent-gradient" className="items-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <Title variant="h2" title="Our Process" underlineEffect={true} className="!mb-4" />
        <div className="text-gray-300 text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 text-center">We take a customized, insight-led approach</div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mx-auto">
          {ourProcess.map((step, idx) => {
            const Icon = stepIcons[idx];
            const borderColor = stepBorderColors[idx];
            const iconColor = stepIconBgColors[idx];
            const dividerColor = stepDividerColors[idx];
            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center bg-gradient-to-br from-[#1a2139] to-[#0f1220] backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 ${borderColor} px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 w-full min-h-[200px] sm:min-h-[250px] md:min-h-[280px] shadow-2xl transition-transform duration-300 shadow-yellow-400/30 border-opacity-90`}
                style={{ boxShadow: '0 5px 20px 0 rgba(138, 138, 138, 0.47), 0 1.5px 8px 0 rgba(0,0,0,0.18)' }}
              >
                {/* Icon Circle Centered with Step Number Badge */}
                <div className="flex flex-col items-center mb-3 sm:mb-4 md:mb-5 w-full">
                  <div className={`h-1 w-16 sm:w-18 md:w-20 ${dividerColor} rounded mb-3 sm:mb-4 transition-transform`} />
                  <div className={`relative flex items-center justify-center rounded-full border-2 ${borderColor} bg-[#181f33]/80 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 shadow-lg shadow-xl transition-shadow`}>
                    <Icon className={`${iconColor} w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12`} />
                    {/* Step Number Badge */}
                    <span className={`absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-[#23283a] ${iconColor} text-sm sm:text-base font-bold rounded-full w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md border-2 ${borderColor}`}>{idx + 1}</span>
                  </div>
                </div>
                {/* Step Content */}
                <div className="flex flex-col items-center text-center w-full">
                  <span className="sr-only">Step {idx + 1}</span>
                  <span className="font-bold text-lg sm:text-xl md:text-2xl text-gray-300 leading-tight mb-2 px-2">{step.title}</span>
                  <div className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mx-auto px-2">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}