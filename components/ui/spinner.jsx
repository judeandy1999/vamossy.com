

export default function Spinner({size}) {
  if (size === 'small') {
    return (
      <div className="flex justify-center items-center h-8 w-8 mx-auto">
        <div className="mx-auto w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
    </div>
  );
}