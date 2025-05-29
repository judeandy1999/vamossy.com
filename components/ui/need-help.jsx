export default function NeedHelp() {
  return (
    <div className="z-100 fixed right-[0.9rem] top-[32%] -rotate-90 origin-bottom-right">
      <a
        href="#help"
        className="bg-yellow-400 text-black text-4xl font-bold px-8 py-4 rounded-r-full shadow-lg hover:bg-yellow-500 transition"
        style={{ transform: "scaleY(-1)" }}
      >
        Need Help?
      </a>
    </div>
  );
}