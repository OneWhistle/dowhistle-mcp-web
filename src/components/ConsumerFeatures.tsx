import React from 'react';
import { Car, Bell, Zap, Shield } from 'lucide-react';

export default function ConsumerFeatures() {
  const features = [
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified when matching providers are nearby",
      color: "from-gray-500 to-gray-600"
    },
    {
      icon: Car,
      title: "No Surge Pricing",
      description: "Regulated fares with transparent pricing",
      color: "from-gray-600 to-gray-700"
    },
    {
      icon: Zap,
      title: "Quick Access",
      description: "Find local deals and services instantly",
      color: "from-gray-700 to-gray-800"
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified providers with built-in safety features",
      color: "from-gray-800 to-gray-900"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            For Consumer Whistlers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stop searchingjust Whistle to get alerts when matching providers are nearby. 
            No surge. No hassle. Just what you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card p-8 text-center group hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
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
