import { services } from '../../data/services';

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Our Services</h1>
      <ul className="space-y-4">
        {services.map(s => (
          <li key={s.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p>{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}