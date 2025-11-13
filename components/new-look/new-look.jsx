'use client';

import { useState } from 'react';
import { Book, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2 } from 'lucide-react';
import { generatePageMetadata } from "@/utils/seo";

export default function PDFBookViewer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // You can replace this with your actual PDF URL
  const defaultPdfUrl = '/Data-core-system-summary-11-13-2025_05_04_PM.pdf';

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePdfUrlChange = (e) => {
    setPdfUrl(e.target.value);
  };

  const currentPdfUrl = pdfUrl || defaultPdfUrl;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-24 pb-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-[#222222] mb-4">
              Unified Theory of Systems
            </h1>
            
            <p className="text-lg sm:text-xl text-[#3A3A3A] mb-2 leading-relaxed">
              An Interactive Reading Experience
            </p>
            
            <p className="text-base text-[#025965] font-medium">
              co-authored by GPT5.0 and GPT5.1
            </p>
          </div>
        </div>
      </div>

      {/* PDF Controls Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* PDF URL Input */}
            {/* <div className="flex-1 max-w-md">
              <label htmlFor="pdfUrl" className="sr-only">PDF URL</label>
              <input
                type="url"
                id="pdfUrl"
                placeholder="Enter PDF URL (optional)"
                value={pdfUrl}
                onChange={handlePdfUrlChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div> */}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-[#025965] text-white rounded-lg hover:bg-[#023d46] transition-colors text-sm font-medium"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
              
              <a
                href={currentPdfUrl}
                download
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Section */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
        <div className={`${isFullscreen ? 'h-full' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          <div className={`${isFullscreen ? 'h-full' : 'min-h-[80vh]'} bg-gray-50 rounded-lg shadow-lg overflow-hidden`}>
            {/* PDF Display */}
            <div className="relative w-full h-full">
              <iframe
                src={currentPdfUrl}
                className="w-full h-full border-0"
                style={{ minHeight: isFullscreen ? '100vh' : '80vh' }}
                title="PDF Book Viewer"
                loading="lazy"
              >
                Your browser does not support PDFs. Please download the PDF to view it.
              </iframe>
              
              {/* Fallback content for when iframe fails to load */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50 opacity-0 pointer-events-none">
                <Book className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">Unable to display PDF</p>
                <p className="text-sm text-gray-500 mb-4">
                  Your browser doesn't support inline PDF viewing.
                </p>
                <a
                  href={currentPdfUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#025965] text-white rounded-lg hover:bg-[#023d46] transition-colors font-medium pointer-events-auto"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Instead
                </a>
              </div>
            </div>
          </div>

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 bg-gray-800 bg-opacity-75 text-white rounded-lg hover:bg-opacity-90 transition-all z-10"
              title="Exit Fullscreen"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#222222] mb-4">
              About This Book
            </h2>
            <p className="text-[#3A3A3A] max-w-3xl mx-auto leading-relaxed">
              This digital book represents a collaborative effort between advanced AI systems 
              GPT5.0 and GPT5.1, bringing together cutting-edge knowledge and insights.
            </p>
          </div>

          {/* Feature Grid */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ZoomIn className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#222222] mb-2">Responsive Design</h3>
              <p className="text-sm text-[#3A3A3A]">
                Optimized viewing experience across desktop, tablet, and mobile devices.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#222222] mb-2">Download Ready</h3>
              <p className="text-sm text-[#3A3A3A]">
                Save the book locally for offline reading whenever you need it.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Maximize2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-[#222222] mb-2">Fullscreen Mode</h3>
              <p className="text-sm text-[#3A3A3A]">
                Immersive reading experience with distraction-free fullscreen viewing.
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Reading Tips */}
      {/* <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-[#222222] mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-600" />
              Reading Tips
            </h3>
            <ul className="space-y-2 text-sm text-[#3A3A3A]">
              <li>• Use fullscreen mode for immersive reading experience</li>
              <li>• Most browsers support zooming in/out using Ctrl + / Ctrl -</li>
              <li>• Download the PDF for offline reading or printing</li>
              <li>• On mobile devices, rotate to landscape for better viewing</li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
}

// Export metadata for SEO
export const metadata = generatePageMetadata({
  title: "Digital Book Viewer | AI-Authored Content",
  description: "Read our latest digital book co-authored by GPT5.0 and GPT5.1. Featuring responsive design, fullscreen viewing, and download capabilities.",
  keywords: [
    "digital book",
    "PDF viewer",
    "AI authored content",
    "GPT5.0",
    "GPT5.1",
    "online reading",
    "responsive design"
  ],
  url: "/new-look",
});
