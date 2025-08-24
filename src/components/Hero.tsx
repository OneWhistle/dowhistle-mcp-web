import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>('.word');
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute('data-delay') || '0', 10);
      setTimeout(() => {
        word.style.animation = 'word-appear 0.8s ease-out forwards';
      }, delay);
    });

    // Mouse gradient
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

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener('mouseenter', () => {
        word.style.textShadow = '0 0 20px hsl(var(--secondary) / 0.5)';
      });
      word.addEventListener('mouseleave', () => {
        word.style.textShadow = 'none';
      });
    });

    // Click ripple effect
    function onClick(e: MouseEvent) {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '4px';
      ripple.style.height = '4px';
      ripple.style.background = 'hsl(var(--secondary) / 0.6)';
      ripple.style.borderRadius = '50%';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'pulse-glow 1s ease-out forwards';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener('click', onClick);

    // Floating elements on scroll
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
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-primary via-foreground to-primary text-card">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="hsl(var(--secondary) / 0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          className="grid-line"
          style={{ animationDelay: '0.5s' }}
        />
        <line
          x1="0"
          y1="80%"
          x2="100%"
          y2="80%"
          className="grid-line"
          style={{ animationDelay: '1s' }}
        />
        <line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: '1.5s' }}
        />
        <line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: '2s' }}
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: '2.5s', opacity: 0.05 }}
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          className="grid-line"
          style={{ animationDelay: '3s', opacity: 0.05 }}
        />
        <circle
          cx="20%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: '3s' }}
        />
        <circle
          cx="80%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: '3.2s' }}
        />
        <circle
          cx="20%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: '3.4s' }}
        />
        <circle
          cx="80%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: '3.6s' }}
        />
        <circle
          cx="50%"
          cy="50%"
          r="1.5"
          className="detail-dot"
          style={{ animationDelay: '4s' }}
        />
      </svg>

      {/* Corner elements */}
      <div
        className="corner-element top-8 left-8"
        style={{ animationDelay: '4s' }}
      >
        <div className="absolute top-0 left-0 h-2 w-2 bg-secondary/30"></div>
      </div>
      <div
        className="corner-element top-8 right-8"
        style={{ animationDelay: '4.2s' }}
      >
        <div className="absolute top-0 right-0 h-2 w-2 bg-secondary/30"></div>
      </div>
      <div
        className="corner-element bottom-8 left-8"
        style={{ animationDelay: '4.4s' }}
      >
        <div className="absolute bottom-0 left-0 h-2 w-2 bg-secondary/30"></div>
      </div>
      <div
        className="corner-element right-8 bottom-8"
        style={{ animationDelay: '4.6s' }}
      >
        <div className="absolute right-0 bottom-0 h-2 w-2 bg-secondary/30"></div>
      </div>

      {/* Floating elements */}
      <div
        className="floating-element"
        style={{ top: '25%', left: '15%', animationDelay: '5s' }}
      ></div>
      <div
        className="floating-element"
        style={{ top: '60%', left: '85%', animationDelay: '5.5s' }}
      ></div>
      <div
        className="floating-element"
        style={{ top: '40%', left: '10%', animationDelay: '6s' }}
      ></div>
      <div
        className="floating-element"
        style={{ top: '75%', left: '90%', animationDelay: '6.5s' }}
      ></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-8 py-12 md:px-16 md:py-20">
        {/* Top tagline */}
        <div className="text-center">
          <h2 className="font-mono text-xs font-light tracking-[0.2em] uppercase opacity-80 md:text-sm text-secondary">
            <span className="word" data-delay="0">
              Welcome
            </span>
            <span className="word" data-delay="200">
              to
            </span>
            <span className="word" data-delay="400">
              <b>DoWhistle</b>
            </span>
            <span className="word" data-delay="600">
              — 
            </span>
            <span className="word" data-delay="800">
              Transportation
            </span>
            <span className="word" data-delay="1000">
              on
            </span>
            <span className="word" data-delay="1200">
              the
            </span>
            <span className="word" data-delay="1400">
              move.
            </span>
          </h2>
          <div className="mt-4 h-px w-16 opacity-30 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
        </div>

        {/* Main headline */}
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-decoration text-3xl leading-tight font-extralight tracking-tight md:text-5xl lg:text-6xl text-card">
            <div className="mb-4 md:mb-6">
              <span className="word" data-delay="1600">
                Connect
              </span>
              <span className="word" data-delay="1750">
                with
              </span>
              <span className="word" data-delay="1900">
                transportation
              </span>
              <span className="word" data-delay="2050">
                services
              </span>
              <span className="word" data-delay="2200">
                and
              </span>
              <span className="word" data-delay="2350">
                providers.
              </span>
            </div>
            <div className="text-2xl leading-relaxed font-thin md:text-3xl lg:text-4xl text-secondary">
              <span className="word" data-delay="2600">
                Search,
              </span>
              <span className="word" data-delay="2750">
                book,
              </span>
              <span className="word" data-delay="2900">
                and
              </span>
              <span className="word" data-delay="3050">
                travel
              </span>
              <span className="word" data-delay="3200">
                seamlessly
              </span>
              <span className="word" data-delay="3350">
                —
              </span>
              <span className="word" data-delay="3500">
                all
              </span>
              <span className="word" data-delay="3650">
                powered
              </span>
              <span className="word" data-delay="3800">
                by
              </span>
              <span className="word" data-delay="3950">
                intelligent
              </span>
              <span className="word" data-delay="4100">
                assistance.
              </span>
            </div>
          </h1>
          <div
            className="absolute top-1/2 -left-8 h-px w-4 opacity-20 bg-secondary"
            style={{
              animation: 'word-appear 1s ease-out forwards',
              animationDelay: '3.5s',
            }}
          ></div>
          <div
            className="absolute top-1/2 -right-8 h-px w-4 opacity-20 bg-secondary"
            style={{
              animation: 'word-appear 1s ease-out forwards',
              animationDelay: '3.7s',
            }}
          ></div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center">
          <div className="mb-4 h-px w-16 opacity-30 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
          <h2 className="font-mono text-xs font-light tracking-[0.2em] uppercase opacity-80 md:text-sm text-secondary">
            <span className="word" data-delay="4400">
              AI-powered
            </span>
            <span className="word" data-delay="4550">
              assistance,
            </span>
            <span className="word" data-delay="4700">
              real-time
            </span>
            <span className="word" data-delay="4850">
              updates,
            </span>
            <span className="word" data-delay="5000">
              seamless
            </span>
            <span className="word" data-delay="5150">
              connections.
            </span>
          </h2>
          <div
            className="mt-6 flex justify-center space-x-4 opacity-0"
            style={{
              animation: 'word-appear 1s ease-out forwards',
              animationDelay: '4.5s',
            }}
          >
            <div className="h-1 w-1 rounded-full opacity-40 bg-secondary"></div>
            <div className="h-1 w-1 rounded-full opacity-60 bg-secondary"></div>
            <div className="h-1 w-1 rounded-full opacity-40 bg-secondary"></div>
          </div>
        </div>
      </div>

      <div
        id="mouse-gradient"
        ref={gradientRef}
        className="pointer-events-none fixed h-96 w-96 rounded-full opacity-0 blur-3xl transition-all duration-500 ease-out"
        style={{
          background: `radial-gradient(circle, hsl(var(--secondary) / 0.05) 0%, transparent 100%)`,
        }}
      ></div>
    </div>
  );
}