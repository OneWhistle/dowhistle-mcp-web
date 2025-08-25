import React from 'react';
import { motion } from 'framer-motion';
import { Car, Bell, Zap, Shield, MapPin, Clock, Users, Star } from 'lucide-react';

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  size = 'small',
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
      className={`group border-gray-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-10 shadow-lg transition-all duration-500 hover:shadow-xl ${className}`}
    >
      <div className="absolute top-0 -right-1/2 z-0 size-full cursor-pointer bg-[linear-gradient(to_right,rgba(22,22,22,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(22,22,22,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]"></div>

      <div className="text-gray-200 group-hover:text-gray-300 absolute right-1 bottom-3 scale-[4] sm:scale-[6] transition-all duration-700 group-hover:scale-[4.2] sm:group-hover:scale-[6.2]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="bg-gray-100 text-gray-700 shadow-gray-200 group-hover:bg-gray-200 group-hover:shadow-gray-300 mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow transition-all duration-500">
            {icon}
          </div>
          <h3 className="mb-2 text-lg sm:text-xl font-semibold tracking-tight text-gray-900">{title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
        </div>
      </div>
      <div className="from-gray-200 to-gray-100 absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r blur-2xl transition-all duration-500 group-hover:blur-lg" />
    </motion.div>
  );
};

export default function ConsumerFeatures() {
  const items = [
    {
      title: 'Smart Alerts & Notifications',
      description: 'Get instant notifications when matching providers are nearby with intelligent proximity detection.',
      icon: <Bell className="size-6" />,
      size: 'large' as const,
    },
    {
      title: 'No Surge Pricing',
      description: 'Enjoy regulated fares with transparent pricing and no hidden costs.',
      icon: <Car className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Quick Access',
      description: 'Find local deals and services instantly with one-tap access.',
      icon: <Zap className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Safe & Secure',
      description: 'Verified providers with built-in safety features and real-time tracking.',
      icon: <Shield className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Location-Based Services',
      description: 'Discover services tailored to your exact location and preferences.',
      icon: <MapPin className="size-6" />,
      size: 'small' as const,
    },
    {
      title: '24/7 Availability',
      description: 'Access services anytime, anywhere with our round-the-clock platform.',
      icon: <Clock className="size-6" />,
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            For Consumer Whistlers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stop searching just Whistle to get alerts when matching providers are nearby. 
            No surge. No hassle. Just what you need.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="w-full max-w-6xl mx-auto mb-16">
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                icon={item.icon}
                size={item.size}
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

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-8 py-4 border border-gray-200">
            <div className="w-3 h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              Ready to start receiving alerts?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
