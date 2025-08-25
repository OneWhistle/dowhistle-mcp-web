import React from 'react';
import { Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    { icon: Mail, text: 'support@dowhistle.com', href: 'mailto:support@dowhistle.com' },
    { icon: MapPin, text: 'San Francisco, CA', href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Brand Section - Left Side */}
            <div className="text-center md:text-left">
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
                  DoWhistle
                </h3>
                <p className="text-gray-400 mt-3 text-sm sm:text-base">
                  Answering all your needsjust one Whistle away!
                </p>
              </div>
              
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Still curious? Learn more about how DoWhistle connects real needs with real people 
                in your local community. Experience the future of hyper-local marketplace connections.
              </p>
            </div>

            {/* Contact Info - Right Side */}
            {/* <div className="text-center md:text-right">
              <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center justify-center md:justify-end space-x-3 text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>{contact.text}</span>
                  </a>
                ))}
              </div>
            </div> */}

            {/* Contact Info - Right Side */}
{/* <div className="text-center md:text-right">
  <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
  <div className="space-y-3">
    {contactInfo.map((contact, index) => (
      <a
        key={index}
        href={contact.href}
        className="flex items-center justify-start space-x-3 text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm sm:text-base md:justify-start"
      >
        <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span>{contact.text}</span>
      </a>
    ))}
  </div>
</div> */}

{/* Contact Info - Right Side */}
{/* <div className="md:flex md:flex-col md:items-end text-center md:text-left">
  <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
  <div className="space-y-3">
    {contactInfo.map((contact, index) => (
      <a
        key={index}
        href={contact.href}
        className="flex items-center justify-start space-x-3 text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm sm:text-base"
      >
        <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        <span>{contact.text}</span>
      </a>
    ))}
  </div>
</div> */}

{/* Contact Info - Right Side */}
<div className="flex flex-col items-start md:items-end">
  <div className="flex flex-col items-start">
    <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
    <div className="space-y-3">
      {contactInfo.map((contact, index) => (
        <a
          key={index}
          href={contact.href}
          className="flex items-center justify-start space-x-3 text-gray-400 hover:text-gray-300 transition-colors duration-200 text-sm sm:text-base"
        >
          <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>{contact.text}</span>
        </a>
      ))}
    </div>
  </div>
</div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} DoWhistle. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <span className="text-gray-400 text-xs sm:text-sm">Made with ❤️ in San Francisco</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 text-xs sm:text-sm">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
