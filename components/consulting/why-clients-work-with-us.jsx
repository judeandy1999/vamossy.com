import { whyClientsWorkWithUs } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';
import { Check } from 'lucide-react';

export default function WhyClientsWorkWithUs() {
  return (
    <Container variant="gray-gradient">
      <div className="flex flex-col items-center w-full mx-auto bg-transparent">
        <Title variant="h2" title="Why Clients Work With Us" underlineEffect={true}/>
        <p className="text-2xl text-gray-300 text-center mb-2">Here's what sets us apart and keeps clients coming back.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 w-full mt-4">
          
          {whyClientsWorkWithUs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-5 bg-[#20263a] rounded-lg px-5 py-3 border-l-4 border-yellow-400/50 shadow-sm hover:shadow-md transition-shadow min-h-[120px]"
            >
              
              {/* Minimal outlined checkmark icon */}
              <span className="flex items-center justify-center w-16 h-16 border-yellow-400/70">
                <div className='rounded-full border-2 border-yellow-400/70 p-2 bg-yellow-400/10 flex items-center justify-center p-1'>
                  <Check className="w-5 h-5 text-yellow-400" />
                </div>
              </span>
              <span className="text-xl md:text-2xl text-gray-300 leading-relaxed tracking-normal">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}