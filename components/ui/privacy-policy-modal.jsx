'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Eye, Database, Users, Lock, Mail } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
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
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-xl">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Privacy Notice</h2>
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
              <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-blue-700/20 rounded-xl p-4">
                <p className="leading-relaxed">
                  At <span className="text-blue-400 font-semibold">Vamossy</span>, we are committed to protecting your privacy and personal data. 
                  This Privacy Notice explains how we collect, use, and safeguard your information when you visit our website or use our services.
                </p>
              </div>

              {/* Information We Collect */}                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-4 w-4 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Information We Collect</h3>
                </div>
                
                <div className="grid gap-4 ml-8">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                    <h4 className="font-medium text-blue-400 mb-2">Personal Information</h4>
                    <p className="text-sm">Name, email address, phone number, and company information when you contact us or sign up for our services.</p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                    <h4 className="font-medium text-blue-400 mb-2">Usage Data</h4>
                    <p className="text-sm">Information about how you interact with our website, including pages visited, time spent, and referral sources.</p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                    <h4 className="font-medium text-blue-400 mb-2">Technical Data</h4>
                    <p className="text-sm">IP address, browser type, device information, and cookies for analytics and website functionality.</p>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="h-5 w-5 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">How We Use Your Information</h3>
                </div>
                
                <div className="ml-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-sm">Provide and improve our AI-powered eCommerce consulting services</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-sm">Communicate with you about our services and respond to inquiries</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-sm">Analyze website performance and user experience</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <p className="text-sm">Comply with legal obligations and protect our rights</p>
                  </div>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">Information Sharing</h3>
                </div>
                
                <div className="ml-8 bg-yellow-900/10 border border-yellow-700/20 rounded-lg p-4">
                  <p className="text-sm">
                    We do not sell, trade, or rent your personal information to third parties. We may share your data with:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li>• Trusted service providers who assist in our operations</li>
                    <li>• Legal authorities when required by law</li>
                    <li>• Business partners with your explicit consent</li>
                  </ul>
                </div>
              </div>

              {/* Data Security */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Data Security</h3>
                </div>
                
                <div className="ml-8 bg-purple-900/10 border border-purple-700/20 rounded-lg p-4">
                  <p className="text-sm">
                    We implement industry-standard security measures including encryption, secure servers, 
                    and regular security audits to protect your personal information from unauthorized access, 
                    disclosure, or misuse.
                  </p>
                </div>
              </div>

              {/* Your Rights */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">Your Rights</h3>
                </div>
                
                <div className="ml-8 space-y-2 text-sm">
                  <p>You have the right to:</p>
                  <div className="grid gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Access and review your personal data</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Request corrections or updates</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Request deletion of your data</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <span>Withdraw consent at any time</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-5 w-5 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Contact Us</h3>
                </div>
                
                <div className="ml-8 bg-green-900/10 border border-green-700/20 rounded-lg p-4">
                  <p className="text-sm mb-2">
                    If you have any questions about this Privacy Notice or wish to exercise your rights, please contact us:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>Email: <span className="text-green-400">privacy@vamossy.com</span></p>
                    <p className="text-gray-400">We will respond to your inquiry within 30 days.</p>
                  </div>
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
