import React from "react";

// Using placeholder URLs - replace with actual image paths when available
const ventureParkLogo = "https://via.placeholder.com/200x60/EAB308/000000?text=VenturePark";
const cimpLogo = "https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=CIMP-BIIF";
const startupBiharLogo = "https://via.placeholder.com/200x60/10B981/FFFFFF?text=Startup+Bihar";
const startupIndiaLogo = "https://via.placeholder.com/200x60/8B5CF6/FFFFFF?text=Startup+India";

const incubations = [
  { name: "VenturePark", logo: ventureParkLogo, fallback: "VenturePark" },
  { name: "CIMP-BIIF", logo: cimpLogo, fallback: "CIMP-BIIF" },
  { name: "Startup Bihar", logo: startupBiharLogo, fallback: "Startup Bihar" },
  { name: "Startup India", logo: startupIndiaLogo, fallback: "Startup India" },
];

const LogoComponent = ({ partner, className = "", style = {} }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      {!imageError ? (
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
          style={{ width: "auto", height: "56px" }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="text-white font-bold text-sm tracking-wider opacity-80 group-hover:opacity-100 transition-all duration-300 text-center">
          {partner.fallback}
        </div>
      )}
    </div>
  );
};

const Partners = () => (
  <section className="py-20 bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Incubations & Recognitions</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Recognized and incubated by leading startup ecosystems and government organizations.
        </p>
      </div>
      <div className="overflow-hidden mb-8">
        <div className="flex space-x-10 animate-scroll-right">
          {[...incubations, ...incubations].map((partner, index) => (
            <div
              key={`incubation-${index}`}
              className="flex-shrink-0 bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 group"
            >
              <LogoComponent partner={partner} className="h-14 w-48" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">4+</div>
          <div className="text-gray-400">Incubation Partners</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">Government</div>
          <div className="text-gray-400">Recognitions</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">National</div>
          <div className="text-gray-400">Startup Programs</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">Incubated</div>
          <div className="text-gray-400">by Leaders</div>
        </div>
      </div>
    </div>
    <style>{`
      @keyframes scrollRight {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      .animate-scroll-right {
        animation: scrollRight 28s linear infinite;
      }
      .animate-scroll-right:hover {
        animation-play-state: paused;
      }
    `}</style>
  </section>
);

export default Partners;










