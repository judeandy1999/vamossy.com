import { whyClients } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';
import { Check } from 'lucide-react';

export default function WhyClients() {
  return (
    <Container variant="black">
      <div className="flex flex-col items-center w-full mx-auto bg-transparent">
        <Title variant="h2" title="Why Clients Appreciate Us" underlineEffect={true}/>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 text-center mb-4 sm:mb-6 md:mb-2 px-4 sm:px-6 md:px-0">Here's what sets us apart and keeps clients coming back.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-7 w-full mt-4 px-4 sm:px-6 md:px-0">
          
          {whyClients.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 sm:gap-4 md:gap-5 bg-[#20263a] rounded-lg px-3 sm:px-4 md:px-5 py-3 sm:py-3 md:py-3 border-l-4 border-yellow-400/50 shadow-sm hover:shadow-md transition-shadow min-h-[100px] sm:min-h-[110px] md:min-h-[120px]"
            >
              
              {/* Minimal outlined checkmark icon */}
              <span className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-yellow-400/70 flex-shrink-0">
                <div className='rounded-full border-2 border-yellow-400/70 p-1 sm:p-1.5 md:p-2 bg-yellow-400/10 flex items-center justify-center'>
                  <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-yellow-400" />
                </div>
              </span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed tracking-normal">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}