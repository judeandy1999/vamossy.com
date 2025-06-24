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
        <div className="w-full flex flex-col md:flex-row md:flex-wrap md:justify-center gap-8 mx-auto">
          {ourProcess.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center bg-[#23283a] rounded-full border-1 ${stepBorderColors[idx]} px-6 py-4 w-full md:w-[48%] shadow-lg`}
            >
              {/* Icon Circle */}
              <div className={`flex items-center justify-center rounded-full border-3 ${stepBorderColors[idx]} bg-[#151B2C] w-16 h-16 mr-6`}>
                <span className={`text-3xl ${stepIconBgColors[idx]}`}>{idx + 1}</span>
              </div>
              {/* Step Content */}
              <div className="flex flex-col flex-1">
                <div className="font-bold text-3xl text-white mb-1">{step.title}</div>
                <div className="text-gray-300 text-lg">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}