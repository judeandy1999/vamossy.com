import { services } from '../../data/services';
import PageWrapper from '@/components/page-wrapper';

export default function Page() {
  return (
    <PageWrapper title="Our Services" subtitle="Explore the range of services we offer to help your business succeed in the digital landscape." color="services">
      <div className="grid md:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold mb-2 text-black-600">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}