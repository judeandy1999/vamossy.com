import { ourProcess } from '@/data/data';
import Title from '@/components/ui/title'; 
import Container from '@/components/ui/container';

export default function OurProcess() {
  // Tweak these values for spacing
  const STEP_HEIGHT = 120;
  const STEP_LEFT = 2; // grid column span

  return (
    <Container variant="gray-gradient">
      <div className="flex flex-col items-start">
        <Title variant="h2" title="Our Process" underlineEffect={true} className="self-center mb-12"/>

        <div
          className="grid relative w-full"
          style={{
            gridTemplateColumns: `repeat(${ourProcess.length * STEP_LEFT}, minmax(0, 1fr))`,
            minHeight: `${STEP_HEIGHT * ourProcess.length + STEP_HEIGHT}px`,
          }}
        >
          {ourProcess.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-center"
              style={{
                gridColumn: `${index * STEP_LEFT + 1} / span ${STEP_LEFT}`,
                gridRow: `${index + 1}`,
                minHeight: `${STEP_HEIGHT}px`,
                position: 'relative',
              }}
            >
              
              <div className="text-yellow-400 text-2xl font-bold w-10 z-10">{step.step}</div>
              <div className="z-10">
                <Title variant="h4" title={step.title} className="text-yellow-400"/>
                <p className="text-lg text-gray-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}