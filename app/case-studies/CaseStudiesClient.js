'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, ArrowRight, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { caseStudies, searchCaseStudies, getUniqueCategories, getUniqueIndustries } from '@/data/caseStudies';

export default function CaseStudiesClient() {
  // Initialize with stable default values
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = getUniqueCategories();
  const industries = getUniqueIndustries();

  // Ensure consistent filtering logic
  const filteredCaseStudies = useMemo(() => {
    // Apply filters consistently on both server and client
    let filtered = searchCaseStudies(searchQuery);
    
    if (selectedCategory) {
      filtered = filtered.filter(study => study.category === selectedCategory);
    }
    
    if (selectedIndustry) {
      filtered = filtered.filter(study => study.industry === selectedIndustry);
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedIndustry]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedIndustry('');
  };

  return (
    <section className="relative bg-[#dbeafe] py-16 px-4 min-h-screen">
      <div className="absolute h-[500px] w-full top-0 left-0 z-0" style={{ background: 'linear-gradient(135deg, #1e377a 0%, #1e3e9f 100%)' }}></div>
      <div className="relative z-1 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Case Studies
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            Real results from real clients. See how we&apos;ve helped eCommerce brands overcome challenges and achieve measurable growth.
          </p>
        </div>

        <div className="shadow-2xl bg-[#f1f5fb] p-8 rounded-lg max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#505a66] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-[#505a66] w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f40af] focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-[#505a66] cursor-pointer gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <Filter className="text-[#505a66] w-5 h-5" />
                Filters
              </button>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory || selectedIndustry) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 text-[#1f40af] hover:bg-blue-50 rounded-lg transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1e283c] mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className=" text-[#505a66] cursor-pointer w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f40af]"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1e283c] mb-2">
                      Industry
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="text-[#505a66] cursor-pointer w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f40af]"
                    >
                      <option value="">All Industries</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-[#505a66]">
              Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
            </p>
          </div>

          {/* Case Studies Grid */}
          {filteredCaseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((study) => (
                <div
                  key={study.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Badge */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="flex items-center justify-center rounded-lg p-2 bg-[#2fc55f] text-white">
                        <Star className="w-5 h-5" />
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce6] text-[#37ae61]">
                        Case Study
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[#1e283c] text-lg mb-2 line-clamp-2">
                      {study.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-[#505a66] mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {study.readTime}
                      </span>
                      <span>{study.industry}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-[#f1f5fb] text-[#1f40af] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {study.tags.length > 2 && (
                        <span className="px-2 py-1 bg-[#f1f5fb] text-[#505a66] text-xs rounded-full">
                          +{study.tags.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Excerpt */}
                    <p className="text-sm text-[#505a66] mb-4 line-clamp-3">
                      {study.excerpt}
                    </p>

                    {/* Metrics Preview */}
                    {study.metrics && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {Object.entries(study.metrics).slice(0, 2).map(([key, value]) => (
                          <div key={key} className="bg-[#f6f8fc] rounded-lg p-3 text-center">
                            <div className="font-bold text-[#1f40af] text-lg">{value}</div>
                            <div className="text-xs text-[#505a66] capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 pb-6">
                    <Link
                      href={`/case-studies/${study.id}`}
                      className="w-full bg-[#1f40af] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
                    >
                      Read Full Case Study
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-[#505a66] mb-4">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No case studies found</h3>
                <p>Try adjusting your search criteria or clearing the filters.</p>
              </div>
              <button
                onClick={clearFilters}
                className="bg-[#1f40af] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}