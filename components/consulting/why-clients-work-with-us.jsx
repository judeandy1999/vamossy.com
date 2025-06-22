import { whyClientsWorkWithUs } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

export default function WhyClientsWorkWithUs() {
  return (
    <Container variant="transparent-gradient">
      <div className="bg-[#151B2C] border border-yellow-400 rounded-2xl shadow-lg flex flex-col items-center w-full max-w-[100ch] mx-auto p-10">
        
        <Title variant="h2" title="Why Clients Work With Us" className="text-yellow-400"/>
        <div className="flex flex-col gap-8 w-full">
          {whyClientsWorkWithUs.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-[#23283a] rounded-xl px-6 py-5 shadow transition hover:scale-[1.02]"
            >
              <span className="text-yellow-400 text-2xl">★</span>
              <span className="text-xl text-white font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}