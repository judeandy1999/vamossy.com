import PageWrapper from '@/components/page-wrapper';


export default function Page() {
  return (
    <PageWrapper title="Contact Us" subtitle="We'd love to hear from you! Fill out the form below to get in touch." color="contact">
      <form className="space-y-6">
        <input className="w-full border border-gray-300 p-3 rounded" type="text" placeholder="Your Name" />
        <input className="w-full border border-gray-300 p-3 rounded" type="email" placeholder="Your Email" />
        <textarea className="w-full border border-gray-300 p-3 rounded" rows="5" placeholder="Your Message"></textarea>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition w-full">
          Send Message
        </button>
      </form>
    </PageWrapper>
  );
}