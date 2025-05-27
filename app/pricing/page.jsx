import PageWrapper from '@/components/page-wrapper';

export default function Page() {
  return (
    <PageWrapper title="Pricing & Packages" subtitle="Choose the right plan for your business needs. Our packages are designed to provide value at every level." color="pricing">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Starter</h2>
          <p className="text-gray-600 mb-4">Perfect for small businesses.</p>
          <p className="text-2xl font-bold">$499</p>
        </div>
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Professional</h2>
          <p className="text-gray-600 mb-4">Great for growing brands.</p>
          <p className="text-2xl font-bold">$999</p>
        </div>
        <div className="border p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Enterprise</h2>
          <p className="text-gray-600 mb-4">Custom solutions for scale.</p>
          <p className="text-2xl font-bold">$1999+</p>
        </div>
      </div>
    </PageWrapper>
  );
}