import React from 'react';
import { motion } from 'framer-motion';
import { User, Radio, Users, DollarSign, Clock, TrendingUp, MapPin, Shield, Zap } from 'lucide-react';

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

export default function ProviderFeatures() {
  const steps = [
    {
      number: "1",
      title: "Set up your profile",
      description: "Create your provider profile with services and pricing"
    },
    {
      number: "2",
      title: "Go live with Whistle",
      description: "Activate your availability and set your service radius"
    },
    {
      number: "3",
      title: "Connect with nearby consumers",
      description: "Get discovered and start earning immediately"
    }
  ];

  const items = [
    {
      title: 'Set Your Own Rates',
      description: 'No middleman fees - set your own rates with transparent pricing and keep 100% of your earnings.',
      icon: <DollarSign className="size-6" />,
      size: 'large' as const,
    },
    {
      title: 'In-App Meter & Tracking',
      description: 'Track time, distance, and earnings in real-time with our built-in meter system.',
      icon: <Clock className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'On-the-Go Offers',
      description: 'Attract customers while you\'re mobile with dynamic service radius and availability.',
      icon: <TrendingUp className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Location-Based Discovery',
      description: 'Get discovered by nearby consumers based on your current location and service area.',
      icon: <MapPin className="size-6" />,
      size: 'medium' as const,
    },
    {
      title: 'Verified Provider Status',
      description: 'Build trust with verified profiles, ratings, and safety features for consumers.',
      icon: <Shield className="size-6" />,
      size: 'small' as const,
    },
    {
      title: 'Instant Notifications',
      description: 'Receive real-time alerts when consumers in your area need your services.',
      icon: <Zap className="size-6" />,
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
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            For Provider Whistlers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whistle your servicesrides, deals, skillsset your radius, get discovered. 
            No middleman. Just direct local connections.
          </p>
        </div>

        {/* Stepper UI */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex items-center justify-between relative">
            {/* Connector Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 flex flex-col items-center">
                {/* Step Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 transition-all duration-300 ${
                  index === 0 ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-600 to-gray-700' : 
                  'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  {step.number}
                </div>
                
                {/* Step Content */}
                <div className="text-center max-w-48">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-8 py-4 border border-gray-200 shadow-lg">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">
              Ready to start providing services?
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
