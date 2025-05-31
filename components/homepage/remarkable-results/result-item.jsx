
export default function ResultItem({ resultItem, index }) {
  return (
      <div
        key={index}
        className="bg-white p-6 rounded-md shadow-xl/10 hover:shadow-lg transition"
      >
        <h3 className="text-[30px] font-semibold mb-4">{resultItem.title}</h3>
        <div className="grid grid-cols-2">
          {resultItem.stats.map((stat, idx) => (
            <div key={idx} className="relative flex justify-around">
              <div className="text-center">
                <p className="text-[30px] xl:text-[48px] md:text-[30px] font-bold">
                  {stat.value}
                </p>
                <p className="text-gray-600">{stat.description}</p>
              </div>
              {idx !== resultItem.stats.length - 1 && (
                <div className="mx-4 mt-3 h-[80%] w-[1px] bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
  );
}