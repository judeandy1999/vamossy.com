import { ourProcess } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';
import { Pencil, ClipboardList, Hammer, Repeat2 } from "lucide-react";

const stepBorderColors = [
  "border-yellow-400",
  "border-blue-400",
  "border-yellow-400",
  "border-blue-400"
];

const stepIconBgColors = [
  "text-yellow-400",
  "text-blue-400",
  "text-yellow-400",
  "text-blue-400"
];

const stepIcons = [
  Pencil,        // Diagnosis
  ClipboardList, // Blueprint
  Hammer,        // Prototyping & Enablement
  Repeat2        // Capability Transfer
];

const stepDividerColors = [
  "bg-yellow-400",
  "bg-blue-400",
  "bg-yellow-400",
  "bg-blue-400"
];

export default function OurProcess() {
  return (
    <Container variant="transparent-gradient" className="items-center min-h-[60vh]">
      <div className="flex flex-col items-center">
        <Title variant="h2" title="Our Process" underlineEffect={true} className="!mb-4" />
        <div className="text-gray-300 text-2xl mb-10 text-center">We take a customized, insight-led approach</div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mx-auto">
          {ourProcess.map((step, idx) => {
            const Icon = stepIcons[idx];
            const borderColor = stepBorderColors[idx];
            const iconColor = stepIconBgColors[idx];
            const dividerColor = stepDividerColors[idx];
            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-between bg-[#23283a]/80 backdrop-blur-md rounded-3xl border-2 ${borderColor} px-8 py-10 w-full min-h-[300px] shadow-2xl transition-transform duration-300 shadow-yellow-400/30 border-opacity-90`}
                style={{ boxShadow: '0 5px 20px 0 rgba(138, 138, 138, 0.47), 0 1.5px 8px 0 rgba(0,0,0,0.18)' }}
              >
                {/* Icon Circle Centered with Step Number Badge */}
                <div className="flex flex-col items-center mb-6 w-full">
                  <div className={`h-1 w-20 ${dividerColor} rounded mb-4 transition-transform`} />
                  <div className={`relative flex items-center justify-center rounded-full border-2 ${borderColor} bg-[#181f33]/80 w-20 h-20 mb-4 shadow-lg shadow-xl transition-shadow`}>
                    <Icon className={`${iconColor} w-12 h-12`} />
                    {/* Step Number Badge */}
                    <span className={`absolute -top-3 -right-3 bg-[#23283a] ${iconColor} text-base font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-md border-2 ${borderColor}`}>{idx + 1}</span>
                  </div>
                </div>
                {/* Step Content */}
                <div className="flex flex-col items-center text-center flex-1 w-full">
                  <span className="sr-only">Step {idx + 1}</span>
                  <span className="font-bold text-2xl sm:text-2xl text-white leading-tight mb-2">{step.title}</span>
                  <div className="text-gray-300 text-xl sm:text-xl mx-auto">{step.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}