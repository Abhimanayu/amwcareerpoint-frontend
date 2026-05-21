'use client';

function CountryLoading() {
  return (
    <div
      className="min-h-screen bg-[#faf7f2]"
      aria-label="Loading country page"
    >
      {/* Animated progress bar */}
      <style>{`
        @keyframes amwProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .amw-progress-bar {
          animation: amwProgress 2s infinite ease-in-out;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100/50 z-50">
        <div
          className="amw-progress-bar h-full w-1/3 bg-gradient-to-r from-[#F7B37E] to-[#F5A367]"
        />
      </div>
    </div>
  );
}

export default CountryLoading;
