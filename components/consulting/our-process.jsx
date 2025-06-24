import { ourProcess } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

const stepBorderColors = [
  "border-yellow-400",
  "border-blue-400",
  "border-blue-400",
  "border-yellow-400"
];

const stepIconBgColors = [
  "text-yellow-400",
  "text-blue-400",
  "text-blue-400",
  "text-yellow-400"
];

export default function OurProcess() {
  return (
    <Container variant="transparent-gradient" className="items-center min-h-[80vh]">
      <div className="flex flex-col items-center">
        <Title variant="h2" title="Our Process" underlineEffect={true} className="!mb-10"/>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mx-auto">
          {ourProcess.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center bg-[#23283a] rounded-2xl border-2 ${stepBorderColors[idx]} px-6 py-8 w-full min-h-[320px] shadow-lg transition-transform hover:scale-105`}
            >
              {/* Icon Circle */}
              <div className={`flex flex-col items-center justify-center rounded-full border-4 ${stepBorderColors[idx]} bg-[#151B2C] w-16 h-16 mb-4`}>
                {step.icon && (
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="w-7 h-7 mb-1 object-contain"
                  />
                )}
                <span className={`text-lg font-bold ${stepIconBgColors[idx]}`}>{idx + 1}</span>
              </div>
              {/* Step Content */}
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="font-bold text-xl sm:text-2xl text-white mb-2">{step.title}</div>
                <div className="text-gray-300 text-sm sm:text-base">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}