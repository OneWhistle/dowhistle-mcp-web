import React, { useEffect, useRef } from 'react';

interface HeroProps {
  onStartWhistling: () => void;
}

export default function Hero({ onStartWhistling }: HeroProps) {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = document.querySelectorAll<HTMLElement>('.word');
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute('data-delay') || '0', 10);
      const timer = setTimeout(() => {
        word.style.animation = 'word-appear 0.8s ease-out forwards';
      }, delay);
      // Store timer id for potential cleanup if needed
      (word as any)._timerId = timer;
    });

    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + 'px';
        gradient.style.top = e.clientY - 192 + 'px';
        gradient.style.opacity = '1';
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = '0';
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    function onClick(e: MouseEvent) {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '4px';
      ripple.style.height = '4px';
      ripple.style.background = 'rgba(107,114,128,0.4)'; // gray-500 tint
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'pulse-glow 1s ease-out forwards';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener('click', onClick);

    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document
          .querySelectorAll<HTMLElement>('.floating-element')
          .forEach((el, index) => {
            setTimeout(() => {
              el.style.animationPlayState = 'running';
            }, index * 200);
          });
      }
    }
    window.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      words.forEach((word) => {
        const id = (word as any)._timerId;
        if (id) clearTimeout(id);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* SVG grid background (light schema) */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(17,24,39,0.06)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line x1="0" y1="20%" x2="100%" y2="20%" className="grid-line" style={{ animationDelay: '0.5s' }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" className="grid-line" style={{ animationDelay: '1s' }} />
        <line x1="20%" y1="0" x2="20%" y2="100%" className="grid-line" style={{ animationDelay: '1.5s' }} />
        <line x1="80%" y1="0" x2="80%" y2="100%" className="grid-line" style={{ animationDelay: '2s' }} />
        <line x1="50%" y1="0" x2="50%" y2="100%" className="grid-line" style={{ animationDelay: '2.5s', opacity: 0.05 }} />
        <line x1="0" y1="50%" x2="100%" y2="50%" className="grid-line" style={{ animationDelay: '3s', opacity: 0.05 }} />
        <circle cx="20%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3s' }} />
        <circle cx="80%" cy="20%" r="2" className="detail-dot" style={{ animationDelay: '3.2s' }} />
        <circle cx="20%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.4s' }} />
        <circle cx="80%" cy="80%" r="2" className="detail-dot" style={{ animationDelay: '3.6s' }} />
      </svg>

      {/* Floating dots that start on scroll */}
      <div className="floating-element" style={{ top: '25%', left: '15%', animationDelay: '5s' }}></div>
      <div className="floating-element" style={{ top: '60%', left: '85%', animationDelay: '5.5s' }}></div>
      <div className="floating-element" style={{ top: '40%', left: '10%', animationDelay: '6s' }}></div>
      <div className="floating-element" style={{ top: '75%', left: '90%', animationDelay: '6.5s' }}></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8 py-12 md:px-16 md:py-20">
        {/* Top Brand Tagline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg">
            <div className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              <span className="word" data-delay="0">Bridging</span>
              <span className="word" data-delay="150">the</span>
              <span className="word" data-delay="300">'Need'</span>
              <span className="word" data-delay="450">and</span>
              <span className="word" data-delay="600">'Have'</span>
            </span>
          </div>
          <div className="mt-4 h-px w-16 opacity-30 mx-auto" style={{ background: 'linear-gradient(to right, transparent, rgba(17,24,39,0.25), transparent)' }}></div>
        </div>

        {/* Main Headline */}
        <div className="mx-auto max-w-5xl text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight text-decoration">
            <span className="word" data-delay="800">Answering</span>
            <span className="word" data-delay="950">all</span>
            <span className="word" data-delay="1100">your</span>
            <span className="word" data-delay="1250">needs</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm animate-accent">just one Whistle away</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="word" data-delay="2200">Whether</span>
            <span className="word" data-delay="2350">you're</span>
            <span className="word" data-delay="2500">offering</span>
            <span className="word" data-delay="2650">a</span>
            <span className="word" data-delay="2800">ride,</span>
            <span className="word" data-delay="2950">a</span>
            <span className="word" data-delay="3100">deal,</span>
            <span className="word" data-delay="3250">or</span>
            <span className="word" data-delay="3400">a</span>
            <span className="word" data-delay="3550">local</span>
            <span className="word" data-delay="3700">service,</span>
            <span className="word" data-delay="3850">simply</span>
            <span className="word" data-delay="4000">Whistle</span>
            <span className="word" data-delay="4150">and</span>
            <span className="word" data-delay="4300">nearby</span>
            <span className="word" data-delay="4450">matches</span>
            <span className="word" data-delay="4600">come</span>
            <span className="word" data-delay="4750">to</span>
            <span className="word" data-delay="4900">you.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={onStartWhistling} className="brand-button-primary px-8 py-4 rounded-full text-lg font-semibold shadow-lg">
            Start Whistling
          </button>
          <a href="https://www.dowhistle.com/about.html" target="_blank" rel="noopener noreferrer" className="brand-button-secondary px-8 py-4 rounded-full text-lg font-semibold inline-block text-center">
            Learn More
          </a>
        </div>

        {/* Bottom Tagline */}
        <div className="text-center">
          <div className="mb-4 h-px w-16 opacity-30 mx-auto" style={{ background: 'linear-gradient(to right, transparent, rgba(17,24,39,0.25), transparent)' }}></div>
          <p className="text-lg text-gray-600 font-medium">
            <span className="word" data-delay="5200">Search</span>
            <span className="word" data-delay="5350">on</span>
            <span className="word" data-delay="5500">the</span>
            <span className="word" data-delay="5650">move.</span>
          </p>
          <div className="mt-4 flex justify-center space-x-2 opacity-0" style={{ animation: 'word-appear 1s ease-out forwards', animationDelay: '5.2s' }}>
            <div className="w-2 h-2 bg-gray-500/60 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600/70 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500/60 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mouse-follow gradient */}
      <div ref={gradientRef} className="pointer-events-none fixed h-96 w-96 rounded-full opacity-0 blur-3xl transition-all duration-500 ease-out" style={{ background: 'radial-gradient(circle, rgba(107,114,128,0.15) 0%, transparent 60%)' }}></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Inline styles for keyframes and classes used by the hero */}
      <style>{`
        @keyframes word-appear {
          0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(8px); }
          60% { opacity: 0.9; transform: translateY(6px) scale(1.01); filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes grid-draw {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          50% { opacity: 0.25; }
          100% { stroke-dashoffset: 0; opacity: 0.15; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.1); }
        }
        @keyframes accent-pop {
          0% { transform: translateY(8px) scale(0.98); filter: blur(2px); }
          100% { transform: translateY(0) scale(1); filter: blur(0); }
        }
        .word { display: inline-block; opacity: 0; margin: 0 0.12em; transition: all 0.3s ease; }
        .word:hover { color: #374151; transform: translateY(-2px); }
        .grid-line { stroke: #9ca3af; stroke-width: 0.5; opacity: 0; stroke-dasharray: 5 5; stroke-dashoffset: 1000; animation: grid-draw 2s ease-out forwards; }
        .detail-dot { fill: #9ca3af; opacity: 0; animation: pulse-glow 3s ease-in-out infinite; }
        .floating-element { position: absolute; width: 2px; height: 2px; background: #9ca3af; border-radius: 50%; opacity: 0.2; animation: float 4s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-10px) translateX(5px); opacity: 0.6; }
          50% { transform: translateY(-5px) translateX(-3px); opacity: 0.4; }
          75% { transform: translateY(-15px) translateX(7px); opacity: 0.8; }
        }
        .text-decoration { position: relative; }
        .text-decoration::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(17,24,39,0.35), transparent); animation: underline-grow 2s ease-out forwards; animation-delay: 1.6s; }
        @keyframes underline-grow { to { width: 100%; } }
        .animate-accent { animation: accent-pop 700ms ease-out both; animation-delay: 1.5s; }
      `}</style>
    </div>
  );
}