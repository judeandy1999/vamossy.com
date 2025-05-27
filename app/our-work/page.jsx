import PageWrapper from '@/components/page-wrapper';

export default function Page() {
  return (
    <PageWrapper title="Our Work" subtitle="Explore some of our recent projects that showcase our expertise in web design and development." color="work">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Project Alpha</h2>
          <p className="text-gray-600">A full-stack solution for a retail brand with custom CMS and integrated e-commerce.</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Project Beta</h2>
          <p className="text-gray-600">SEO-optimized marketing site for a startup launching in the health tech space.</p>
        </div>
      </div>
    </PageWrapper>
  );
}