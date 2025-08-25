import React from 'react';
import { User, Radio, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

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

  const benefits = [
    {
      icon: DollarSign,
      title: "No Surge Pricing",
      description: "Set your own rates with transparent pricing",
      color: "from-gray-500 to-gray-600"
    },
    {
      icon: Clock,
      title: "In-App Meter",
      description: "Track time and earnings in real-time",
      color: "from-gray-600 to-gray-700"
    },
    {
      icon: TrendingUp,
      title: "On-the-Go Offers",
      description: "Attract customers while you're mobile",
      color: "from-gray-700 to-gray-800"
    }
  ];

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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="feature-card p-8 text-center group hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
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
