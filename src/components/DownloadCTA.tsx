import React from 'react';
import { Download, Smartphone, Zap } from 'lucide-react';

export default function DownloadCTA() {
  const appStoreLink = "https://apps.apple.com/us/app/dowhistle/id1381405367?ign-itscg=30200&ign-itsct=apps_box_badge";
  const googlePlayLink = "https://play.google.com/store/apps/details?id=com.onewhistle.whistle&hl=en&gl=US&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1&pli=1";

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
            className="app-store-button px-8 py-4 flex items-center space-x-3 min-w-[280px] hover:scale-105 transition-transform duration-200"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs opacity-90">Download on the</div>
              <div className="text-lg font-semibold">App Store</div>
            </div>
          </a>

          {/* Google Play Button */}
          <a 
            href={googlePlayLink}
            target="_blank"
            rel="noopener noreferrer"
            className="app-store-button px-8 py-4 flex items-center space-x-3 min-w-[280px] hover:scale-105 transition-transform duration-200"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="text-xs opacity-90">GET IT ON</div>
              <div className="text-lg font-semibold">Google Play</div>
            </div>
          </a>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Alerts</h3>
            <p className="text-gray-200 text-sm">
              Get instant notifications when providers are nearby
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
            <p className="text-gray-200 text-sm">
              Designed for on-the-go convenience and speed
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Setup</h3>
            <p className="text-gray-200 text-sm">
              Get started in minutes with simple onboarding
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
