import React from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Zap } from 'lucide-react';

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const DarkBentoGridItem = ({
  title,
  description,
  icon,
  className,
}: BentoGridItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25 },
    },
  };

  return (
    <motion.div
      variants={variants}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-10 shadow-lg transition-all duration-500 hover:shadow-xl hover:border-white/25 ${className}`}
    >
      <div className="absolute top-0 -right-1/2 z-0 size-full bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

      <div className="text-white/15 group-hover:text-white/20 absolute right-1 bottom-3 scale-[4] sm:scale-[6] transition-all duration-700 group-hover:scale-[4.2] sm:group-hover:scale-[6.2]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="bg-white/15 text-white shadow-black/20 group-hover:bg-white/20 group-hover:shadow-black/30 mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow transition-all duration-500">
            {icon}
          </div>
          <h3 className="mb-2 text-lg sm:text-xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-white/80 text-xs sm:text-sm">{description}</p>
        </div>
      </div>
      <div className="from-white/40 to-white/20 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

export default function DownloadCTA() {
  const appStoreLink = "https://apps.apple.com/us/app/dowhistle/id1381405367?ign-itscg=30200&ign-itsct=apps_box_badge";
  const googlePlayLink = "https://play.google.com/store/apps/details?id=com.onewhistle.whistle&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1&pli=1";

  const items = [
    {
      title: 'Real-time Alerts',
      description: 'Get instant notifications when relevant providers or requests are nearby.',
      icon: <Zap className="size-6" />,
      size: 'large' as const,
    },
    {
      title: 'Mobile-first Experience',
      description: 'Designed for speed and clarity on the go with a minimal interface.',
      icon: <Smartphone className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Easy Setup',
      description: 'Create your profile and start in minutes with simple onboarding.',
      icon: <Download className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Smart Matching',
      description: 'We surface the best local matches based on your context.',
      icon: <Zap className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'On-the-go Control',
      description: 'Manage whistles and responses seamlessly from your phone.',
      icon: <Smartphone className="size-6" />,
      size: 'small' as const,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-8 text-center">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30 mb-8">
            <Download className="w-5 h-5" />
            <span className="text-sm font-medium">Available Now</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Whistle community
            <span className="block">download now!</span>
          </h2>
          
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Connect with local services, rides, and deals in real-time. 
            Experience the future of hyper-local marketplace connections.
          </p>
        </div>

        {/* App Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          {/* App Store Button */}
          <a 
            href={appStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="app-store-button px-8 py-4 flex items-center space-x-3 min-w-[280px] rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs text-white/80">Download on the</div>
              <div className="text-lg font-semibold text-white">App Store</div>
            </div>
          </a>

          {/* Google Play Button */}
          <a 
            href={googlePlayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="app-store-button px-8 py-4 flex items-center space-x-3 min-w-[280px] rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors duration-200"
          >
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs text-white/80">GET IT ON</div>
              <div className="text-lg font-semibold text-white">Google Play</div>
            </div>
          </a>
        </div>

        {/* Bento Grid (mirrors ProviderFeatures structure) */}
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item, i) => (
              <DarkBentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                icon={item.icon}
                className={
                  item.size === 'large'
                    ? 'lg:col-span-2 xl:col-span-4'
                    : item.size === 'medium'
                      ? 'lg:col-span-2 xl:col-span-3'
                      : 'lg:col-span-1 xl:col-span-2'
                }
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
