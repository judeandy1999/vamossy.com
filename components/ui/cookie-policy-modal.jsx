'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings, BarChart, Globe, Shield, Clock } from 'lucide-react';

export default function CookiePolicyModal({ isOpen, onClose }) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      color: "green",
      required: true,
      description: "These cookies are necessary for the website to function properly.",
      examples: ["Session management", "Security features", "Basic functionality"],
      retention: "Session or up to 1 year"
    },
    {
      icon: BarChart,
      title: "Analytics Cookies",
      color: "blue",
      required: false,
      description: "Help us understand how visitors interact with our website.",
      examples: ["Google Analytics", "Page view tracking", "User behavior analysis"],
      retention: "Up to 2 years"
    },
    {
      icon: Settings,
      title: "Functional Cookies",
      color: "purple",
      required: false,
      description: "Enable enhanced functionality and personalization.",
      examples: ["Language preferences", "Theme settings", "Form data"],
      retention: "Up to 1 year"
    },
    {
      icon: Globe,
      title: "Marketing Cookies",
      color: "orange",
      required: false,
      description: "Used to track visitors across websites for marketing purposes.",
      examples: ["Social media integration", "Advertising optimization", "Remarketing"],
      retention: "Up to 1 year"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: "text-green-400 bg-green-900/20 border-green-700/30",
      blue: "text-blue-400 bg-blue-900/20 border-blue-700/30",
      purple: "text-purple-400 bg-purple-900/20 border-purple-700/30",
      orange: "text-orange-400 bg-orange-900/20 border-orange-700/30"
    };
    return colors[color] || colors.blue;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl max-w-2xl max-h-[80vh] w-full flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-orange-900/20 to-amber-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/20 rounded-xl">
                <Cookie className="h-6 w-6 text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Cookie Policy</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar-dark min-h-0">
            <div className="space-y-4 text-gray-300">
              {/* Introduction */}
              <div className="bg-gradient-to-r from-orange-900/10 to-amber-900/10 border border-orange-700/20 rounded-xl p-4">
                <p className="leading-relaxed">
                  This Cookie Policy explains how <span className="text-orange-400 font-semibold">Vamossy</span> uses cookies and similar technologies 
                  to recognize you when you visit our website. It explains what these technologies are and why we use them, 
                  as well as your rights to control our use of them.
                </p>
              </div>

              {/* What are cookies */}                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                    <Cookie className="h-4 w-4 text-orange-400" />
                    What are Cookies?
                  </h3>
                <div className="ml-8 bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                    They are widely used by website owners to make their websites work more efficiently, as well as to provide 
                    reporting information and deliver personalized content and advertising.
                  </p>
                </div>
              </div>

              {/* Types of cookies */}                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                    <Settings className="h-4 w-4 text-blue-400" />
                    Types of Cookies We Use
                  </h3>
                
                <div className="grid gap-4 ml-8">
                  {cookieTypes.map((cookie, index) => (
                    <div key={index} className={`border rounded-xl p-4 ${getColorClasses(cookie.color)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <cookie.icon className={`h-5 w-5 ${cookie.color === 'green' ? 'text-green-400' : 
                            cookie.color === 'blue' ? 'text-blue-400' : 
                            cookie.color === 'purple' ? 'text-purple-400' : 'text-orange-400'}`} />
                          <h4 className="font-semibold text-white">{cookie.title}</h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${cookie.required ? 
                          'bg-red-900/30 text-red-400 border border-red-700/30' : 
                          'bg-gray-700/30 text-gray-300 border border-gray-600/30'}`}>
                          {cookie.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3">{cookie.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-400">Examples:</span>
                          <ul className="text-xs text-gray-400 mt-1 space-y-1">
                            {cookie.examples.map((example, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-600/30">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">Retention: {cookie.retention}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to control cookies */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Settings className="h-5 w-5 text-purple-400" />
                  How to Control Cookies
                </h3>
                
                <div className="ml-8 space-y-4">
                  <div className="bg-purple-900/10 border border-purple-700/20 rounded-lg p-4">
                    <h4 className="font-medium text-purple-400 mb-2">Browser Settings</h4>
                    <p className="text-sm text-gray-300">
                      Most web browsers allow you to control cookies through their settings preferences. 
                      You can typically find these in the "Settings" or "Preferences" menu of your browser 
                      under "Privacy" or "Security" sections.
                    </p>
                  </div>
                  
                  <div className="bg-blue-900/10 border border-blue-700/20 rounded-lg p-4">
                    <h4 className="font-medium text-blue-400 mb-2">Cookie Consent Banner</h4>
                    <p className="text-sm text-gray-300">
                      When you first visit our website, you'll see a cookie consent banner where you can choose 
                      to accept or decline non-essential cookies. You can change your preferences at any time.
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
                    <h4 className="font-medium text-gray-300 mb-2">Third-Party Cookies</h4>
                    <p className="text-sm text-gray-400">
                      Some cookies are placed by third-party services. You can opt out of these through 
                      the respective service providers' privacy settings or industry opt-out pages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Updates to this policy */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Updates to This Policy</h3>
                <div className="ml-8 bg-yellow-900/10 border border-yellow-700/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    We may update this Cookie Policy from time to time to reflect changes in our practices 
                    or for other operational, legal, or regulatory reasons. Please check this page periodically 
                    for any changes.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Questions?</h3>
                <div className="ml-8 bg-green-900/10 border border-green-700/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    If you have any questions about our use of cookies, please contact us at{' '}
                    <span className="text-green-400">privacy@vamossy.com</span>
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="border-t border-gray-700/50 pt-4 mt-6">
                <p className="text-sm text-gray-400 text-center">
                  Last updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-700/50 p-4 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
