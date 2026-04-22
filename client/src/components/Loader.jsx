export default function Loader({ fullScreen = true }) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen" : "py-10"
      }`}
    >
      <div className="relative">
        {/* Outer ring */}
        <div className="h-14 w-14 rounded-full border-4 border-blue-100"></div>

        {/* Animated ring */}
        <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-transparent border-t-[rgb(21,98,160)] border-r-[rgb(21,98,160)]"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-[rgb(21,98,160)]"></div>
        </div>
      </div>
    </div>
  );
}
