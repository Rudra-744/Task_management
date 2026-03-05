import { Loader2 } from "lucide-react";

const Loading = ({ fullScreen = false, message = "Loading..." }) => {
  const containerClass = fullScreen
    ? "fixed inset-0 bg-[#f0ede8] flex flex-col items-center justify-center z-50 h-screen w-screen"
    : "flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]";

  return (
    <div className={containerClass}>
      <Loader2
        className="text-[#ff0000] animate-spin mb-4"
        size={fullScreen ? 48 : 32}
      />
      <p className="text-stone-500 font-medium text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loading;
