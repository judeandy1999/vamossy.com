import { whyClientsWorkWithUs } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

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
              <span className="flex items-center justify-center w-10 h-10 rounded-full border border-yellow-400/70 bg-[#181f36]">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#facc15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="10" stroke="#facc15" strokeWidth="2.2" fill="none"/>
                  <path d="M7 12l3 3 5-5" />
                </svg>
              </span>
              <span className="text-xl md:text-2xl text-white leading-relaxed tracking-normal">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}