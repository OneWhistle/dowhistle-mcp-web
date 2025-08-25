import React from 'react';

interface HeroProps {
  onStartWhistling: () => void;
}

export default function Hero({ onStartWhistling }: HeroProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(22,22,22,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-200 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-12 md:px-16 md:py-20">
        {/* Top Brand Tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Bridging the 'Need' and 'Have'</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mx-auto max-w-5xl text-center mb-12 ">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Answering all your needs
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">
              just one Whistle away
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're offering a ride, a deal, or a local service, simply Whistleand nearby matches come to you.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button 
            onClick={onStartWhistling}
            className="brand-button-primary px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
          >
            Start Whistling
          </button>
          <a 
            href="https://www.dowhistle.com/about.html"
            target="_blank"
            rel="noopener noreferrer"
            className="brand-button-secondary px-8 py-4 rounded-full text-lg font-semibold inline-block text-center"
          >
            Learn More
          </a>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center">
          <p className="text-lg text-gray-600 font-medium">
            Search on the move.
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}