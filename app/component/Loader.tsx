export default function Loader() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Protein Shaker Bottle SVG */}
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full drop-shadow-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bottle Cap */}
            <rect
              x="35"
              y="5"
              width="30"
              height="10"
              rx="2"
              className="fill-black"
            />

            {/* Bottle Neck */}
            <path d="M38 15 L38 25 L62 25 L62 15" className="fill-gray-800" />

            {/* Bottle Body */}
            <path
              d="M30 25 L38 25 L62 25 L70 25 L75 110 L25 110 L30 25"
              className="fill-gray-600 opacity-80"
            />

            {/* Liquid Level - Animated */}
            <rect
              x="28"
              y="60"
              width="44"
              height="47"
              className="fill-red-600 animate-pulse"
            />

            {/* Measurement Lines */}
            <line
              x1="28"
              y1="60"
              x2="72"
              y2="60"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="28"
              y1="75"
              x2="72"
              y2="75"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="28"
              y1="90"
              x2="72"
              y2="90"
              stroke="white"
              strokeWidth="1"
            />

            {/* Shaker Ball */}
            <circle
              cx="50"
              cy="80"
              r="5"
              className="fill-white animate-bounce"
              style={{ animationDuration: "1.5s" }}
            />

            {/* Bottle Outline */}
            <path
              d="M30 25 L38 25 L62 25 L70 25 L75 110 L25 110 L30 25 M38 15 L38 25 M62 15 L62 25"
              fill="none"
              stroke="black"
              strokeWidth="2"
            />
          </svg>

          {/* Animated Circles */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-75">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-red-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">Loading Profile</h2>
        <p className="text-gray-600">
          Please wait while we fetch your information
        </p>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
          <div className="h-full bg-red-600 rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
}
