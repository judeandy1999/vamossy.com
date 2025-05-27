import PageWrapper from '@/components/page-wrapper';

export default function Page() {
  return (
    <PageWrapper title="About Us" subtitle="We are a team of passionate designers, developers, and strategists focused on building impactful digital experiences.">
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600">To help businesses thrive in the digital world through beautiful and functional websites.</p>
          </div>
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
            <p className="text-gray-600">Innovation, Integrity, and Excellence in every project we take on.</p>
          </div>
        </section>
    </PageWrapper>
  );
}