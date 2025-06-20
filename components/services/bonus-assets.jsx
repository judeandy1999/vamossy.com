import { bonusAssets } from "@/data/data";

export default function BonusAssets() {
  return (
    <section className="relative py-16 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-10">
          Bonus Assets <span className="font-normal">(All Tiers)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr>
                <th className="bg-yellow-400 text-gray-900 text-xl font-bold py-4 px-6 text-left border-b-2 border-gray-300">
                  Asset
                </th>
                <th className="bg-yellow-400 text-gray-900 text-xl font-bold py-4 px-6 text-left border-b-2 border-gray-300">
                  Use
                </th>
              </tr>
            </thead>
            <tbody>
              {bonusAssets.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-400 last:border-b-0">
                  <td className="bg-gray-800 text-white font-semibold py-4 px-6 border-r border-gray-400">
                    {item.asset}
                  </td>
                  <td className="bg-gray-800 text-white font-semibold py-4 px-6">
                    {item.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}