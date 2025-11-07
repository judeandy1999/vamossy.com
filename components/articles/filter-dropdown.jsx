'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Filter, Loader2 } from 'lucide-react';
import { useFilterOptions } from '@/hooks/frontend/useFilterOptions';

export default function FilterDropdown({ 
  selectedWikiIds = [], 
  selectedMainCategoryIds = [], 
  onFiltersChange 
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [wikiDropdownOpen, setWikiDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const filterRef = useRef(null);
  const wikiDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const { mainCategories, wikiOptions, loading, error } = useFilterOptions();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (wikiDropdownRef.current && !wikiDropdownRef.current.contains(event.target)) {
        setWikiDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWikiSelect = (wikiId) => {
    const newSelectedWikiIds = selectedWikiIds.includes(wikiId)
      ? selectedWikiIds.filter(id => id !== wikiId)
      : [...selectedWikiIds, wikiId];
    
    onFiltersChange({
      wikiIds: newSelectedWikiIds,
      mainCategoryIds: selectedMainCategoryIds
    });
  };

  const handleMainCategorySelect = (categoryId) => {
    const newSelectedCategoryIds = selectedMainCategoryIds.includes(categoryId)
      ? selectedMainCategoryIds.filter(id => id !== categoryId)
      : [...selectedMainCategoryIds, categoryId];
    
    onFiltersChange({
      wikiIds: selectedWikiIds,
      mainCategoryIds: newSelectedCategoryIds
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      wikiIds: [],
      mainCategoryIds: []
    });
  };

  const getActiveFilterCount = () => {
    return selectedWikiIds.length + selectedMainCategoryIds.length;
  };

  const getSelectedWikiNames = () => {
    return selectedWikiIds.map(id => {
      const wiki = wikiOptions.find(w => w.id === id);
      return wiki ? wiki.name : `Wiki ${id}`;
    });
  };

  const getSelectedCategoryNames = () => {
    return selectedMainCategoryIds.map(id => {
      if (id === 'uncategorized') return 'Uncategorized';
      const category = mainCategories.find(c => c.id === id);
      return category ? category.name : `Category ${id}`;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md">
        <Loader2 size={16} className="animate-spin" />
        <span className="text-sm text-gray-500">Loading filters...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-300 rounded-md">
        <span className="text-sm text-red-600">Failed to load filters</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Filter size={16} />
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
            {getActiveFilterCount()}
          </span>
        )}
        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[400px] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#032646]">Filter Articles</h3>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Categories Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Main Categories</label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {selectedMainCategoryIds.length === 0 
                        ? 'Select main categories...' 
                        : `${selectedMainCategoryIds.length} selected`
                      }
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
                    {/* Uncategorized option */}
                    <button
                      onClick={() => handleMainCategorySelect('uncategorized')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        selectedMainCategoryIds.includes('uncategorized') ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedMainCategoryIds.includes('uncategorized')}
                          onChange={() => {}}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Uncategorized</span>
                      </div>
                    </button>
                    
                    {mainCategories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => handleMainCategorySelect(category.id)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          selectedMainCategoryIds.includes(category.id) ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedMainCategoryIds.includes(category.id)}
                            onChange={() => {}}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected categories display */}
              {selectedMainCategoryIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {getSelectedCategoryNames().map((name, index) => (
                    <span key={selectedMainCategoryIds[index]} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {name}
                      <button 
                        onClick={() => handleMainCategorySelect(selectedMainCategoryIds[index])}
                        className="hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Wiki Categories Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Wiki Categories</label>
              <div className="relative" ref={wikiDropdownRef}>
                <button
                  onClick={() => setWikiDropdownOpen(!wikiDropdownOpen)}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {selectedWikiIds.length === 0 
                        ? 'Select wiki categories...' 
                        : `${selectedWikiIds.length} selected`
                      }
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${wikiDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {wikiDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
                    {wikiOptions.map(wiki => (
                      <button
                        key={wiki.id}
                        onClick={() => handleWikiSelect(wiki.id)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          selectedWikiIds.includes(wiki.id) ? 'bg-green-50 text-green-700' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedWikiIds.includes(wiki.id)}
                            onChange={() => {}}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div>{wiki.name}</div>
                            {wiki.main_category_name && (
                              <div className="text-xs text-gray-500">{wiki.main_category_name}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected wikis display */}
              {selectedWikiIds.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {getSelectedWikiNames().map((name, index) => (
                    <span key={selectedWikiIds[index]} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      {name}
                      <button 
                        onClick={() => handleWikiSelect(selectedWikiIds[index])}
                        className="hover:text-green-900"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}