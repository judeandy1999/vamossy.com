'use client';

import { useState } from 'react';
import { useOptions } from '@/hooks/useOptions';
import { Plus, Trash, ChevronDown } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';

export default function Page() {
  const {
    wikiOptions,
    tabOptionsMap,
    mainCategories,
    loading,
    error,
    addWiki,
    addTab,
    deleteWiki,
    deleteTab,
    addMainCategory,
    deleteMainCategory,
    updateWikiMainCategory
  } = useOptions();

  const [selectedWiki, setSelectedWiki] = useState(null);
  const [newWiki, setNewWiki] = useState({ name: '', description: '', main_category_id: null });
  const [newTab, setNewTab] = useState({ name: '', description: '' });
  const [newMainCategory, setNewMainCategory] = useState({ name: '', description: '' });
  const [wikiError, setWikiError] = useState('');
  const [tabError, setTabError] = useState('');
  const [mainCategoryError, setMainCategoryError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null });
  const [deleting, setDeleting] = useState(false);
  const [showMainCategoryForm, setShowMainCategoryForm] = useState(false);

  const handleAddMainCategory = async () => {
    if (!newMainCategory.name.trim()) {
      setMainCategoryError('Main category name cannot be empty.');
      return;
    }
    setMainCategoryError('');
    
    try {
      await addMainCategory(newMainCategory);
      setNewMainCategory({ name: '', description: '' });
      setShowMainCategoryForm(false);
    } catch (error) {
      setMainCategoryError('Failed to add main category: ' + error.message);
    }
  };

  const handleAddWiki = async () => {
    if (!newWiki.name.trim()) {
      setWikiError('Category name cannot be empty.');
      return;
    }
    setWikiError('');
    
    try {
      await addWiki(newWiki);
      setNewWiki({ name: '', description: '', main_category_id: null });
    } catch (error) {
      setWikiError('Failed to add category: ' + error.message);
    }
  };

  const handleAddTab = async () => {
    if (!newTab.name.trim()) {
      setTabError('Tab name cannot be empty.');
      return;
    }
    if (!selectedWiki) {
      setTabError('Please select a category first.');
      return;
    }
    setTabError('');
    
    try {
      await addTab({ ...newTab, wiki_id: selectedWiki });
      setNewTab({ name: '', description: '' });
    } catch (error) {
      setTabError('Failed to add tab: ' + error.message);
    }
  };

  const handleDeleteWiki = (wikiId) => {
    setDeleteTarget({ type: 'wiki', id: wikiId });
    setIsModalOpen(true);
  };

  const handleDeleteTab = (tabId) => {
    setDeleteTarget({ type: 'tab', id: tabId });
    setIsModalOpen(true);
  };

  const handleDeleteMainCategory = (mainCategoryId) => {
    setDeleteTarget({ type: 'mainCategory', id: mainCategoryId });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      if (deleteTarget.type === 'wiki') {
        await deleteWiki(deleteTarget.id);
        if (selectedWiki === deleteTarget.id) setSelectedWiki(null);
      } else if (deleteTarget.type === 'tab') {
        await deleteTab(deleteTarget.id, selectedWiki);
      } else if (deleteTarget.type === 'mainCategory') {
        await deleteMainCategory(deleteTarget.id);
      }
      setIsModalOpen(false);
      setDeleteTarget({ type: '', id: null });
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleWikiMainCategoryChange = async (wikiId, mainCategoryId) => {
    try {
      await updateWikiMainCategory(wikiId, mainCategoryId);
    } catch (error) {
      console.error('Failed to update wiki main category:', error);
    }
  };

  // Group wikis by main category
  const groupedWikis = Object.entries(wikiOptions).reduce((acc, [wikiId, wiki]) => {
    const mainCategoryId = wiki.main_category_id || 'uncategorized';
    if (!acc[mainCategoryId]) {
      acc[mainCategoryId] = [];
    }
    acc[mainCategoryId].push([wikiId, wiki]);
    return acc;
  }, {});

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        target={deleteTarget}
        isLoading={deleting}
      />

      <div className="max-w-6xl mx-auto px-4 text-slate-800">
        <h1 className="text-3xl font-bold mb-8 text-center">Options Management</h1>

        {/* Main Categories Management */}
        <section className="bg-white shadow rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Wikis</h2>
            <button
              onClick={() => setShowMainCategoryForm(!showMainCategoryForm)}
              className="cursor-pointer flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
            >
              <Plus size={14} /> Add Wiki
            </button>
          </div>

          {/* Main Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {Object.entries(mainCategories).map(([id, category]) => (
              <div key={id} className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{category.description || 'No description'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMainCategory(Number(id))}
                    className="cursor-pointer text-red-500 hover:text-red-600 transition ml-2"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Main Category Form */}
          {showMainCategoryForm && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Wiki Name"
                  value={newMainCategory.name}
                  onChange={(e) => setNewMainCategory({ ...newMainCategory, name: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                  onClick={handleAddMainCategory}
                  className="cursor-pointer flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
                >
                  <Plus size={14} /> Add
                </button>
                <button
                  onClick={() => setShowMainCategoryForm(false)}
                  className="cursor-pointer px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
              {mainCategoryError && <p className="text-red-500 mt-2 text-sm">{mainCategoryError}</p>}
            </div>
          )}
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Categories List */}
          <section className="bg-white shadow rounded p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            
            {/* Grouped by Main Category */}
            <div className="space-y-6">
              {/* Uncategorized */}
              {groupedWikis.uncategorized && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Uncategorized</h3>
                  <div className="space-y-1">
                    {groupedWikis.uncategorized.map(([wikiId, wiki]) => (
                      <WikiRow
                        key={wikiId}
                        wikiId={wikiId}
                        wiki={wiki}
                        selectedWiki={selectedWiki}
                        setSelectedWiki={setSelectedWiki}
                        handleDeleteWiki={handleDeleteWiki}
                        mainCategories={mainCategories}
                        onMainCategoryChange={handleWikiMainCategoryChange}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Main Categories */}
              {Object.entries(mainCategories).map(([mainCategoryId, mainCategory]) => {
                const wikisInCategory = groupedWikis[mainCategoryId] || [];
                return (
                  <div key={mainCategoryId}>
                    <h3 className="text-sm font-medium text-blue-600 mb-2">{mainCategory.name}</h3>
                    <div className="space-y-1">
                      {wikisInCategory.map(([wikiId, wiki]) => (
                        <WikiRow
                          key={wikiId}
                          wikiId={wikiId}
                          wiki={wiki}
                          selectedWiki={selectedWiki}
                          setSelectedWiki={setSelectedWiki}
                          handleDeleteWiki={handleDeleteWiki}
                          mainCategories={mainCategories}
                          onMainCategoryChange={handleWikiMainCategoryChange}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Category */}
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newWiki.name}
                    onChange={(e) => setNewWiki({ ...newWiki, name: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newWiki.description}
                    onChange={(e) => setNewWiki({ ...newWiki, description: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-slate-400"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={newWiki.main_category_id || ''}
                    onChange={(e) => setNewWiki({ ...newWiki, main_category_id: e.target.value ? Number(e.target.value) : null })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-slate-400"
                  >
                    <option value="">Select Wiki (Optional)</option>
                    {Object.entries(mainCategories).map(([id, category]) => (
                      <option key={id} value={id}>{category.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddWiki}
                    className="cursor-pointer flex items-center gap-1 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
                  >
                    <Plus size={16} /> Add Category
                  </button>
                </div>
              </div>
              {wikiError && <p className="text-red-500 mt-2">{wikiError}</p>}
            </div>
          </section>

          {/* Tabs */}
          <section className="bg-white shadow rounded p-4 h-fit sticky top-24 self-start">
            <h2 className="text-xl font-semibold mb-4">Tabs for Selected Category</h2>

            {!selectedWiki ? (
              <p className="text-gray-500 text-sm">No Category is selected. Please select a Category to manage its tabs.</p>
            ) : (
              <>
                <table className="min-w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-slate-600">
                      <th className="p-3">Tab Name</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tabOptionsMap[selectedWiki]
                      ? Object.entries(tabOptionsMap[selectedWiki])
                      : []
                    ).map(([key, tab]) => (
                      <tr key={key} className="hover:bg-slate-100 transition">
                        <td className="p-3 font-medium">{tab.name}</td>
                        <td className="p-3 text-gray-500">
                          {tab.description || 'No description'}
                        </td>
                        <td className="p-3 flex justify-end items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTab(Number(key));
                            }}
                            className="cursor-pointer text-red-500 hover:text-red-600 transition"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add Tab */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="Tab Name"
                    value={newTab.name}
                    onChange={(e) => setNewTab({ ...newTab, name: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTab.description}
                    onChange={(e) => setNewTab({ ...newTab, description: e.target.value })}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-slate-400"
                  />
                  <button
                    onClick={handleAddTab}
                    className="cursor-pointer flex items-center gap-1 bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
                  >
                    <Plus size={16} /> Add Tab
                  </button>
                </div>
                {tabError && <p className="text-red-500 mt-2">{tabError}</p>}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// WikiRow component for individual wiki items
function WikiRow({ wikiId, wiki, selectedWiki, setSelectedWiki, handleDeleteWiki, mainCategories, onMainCategoryChange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      className={`border border-gray-200 rounded p-3 transition cursor-pointer ${
        selectedWiki === Number(wikiId) ? 'bg-slate-200 border-slate-300' : 'hover:bg-slate-100'
      }`}
      onClick={() => setSelectedWiki((prev) => (prev === Number(wikiId) ? null : Number(wikiId)))}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-sm">{wiki.name}</h4>
          <p className="text-xs text-gray-500 mt-1">{wiki.description || 'No description'}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Main Category Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="cursor-pointer flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
            >
              <span className="text-gray-600">
                {wiki.main_category_id ? mainCategories[wiki.main_category_id]?.name : 'No Category'}
              </span>
              <ChevronDown size={12} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMainCategoryChange(wikiId, null);
                    setIsDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition"
                >
                  No Category
                </button>
                {Object.entries(mainCategories).map(([id, category]) => (
                  <button
                    key={id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMainCategoryChange(wikiId, Number(id));
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteWiki(Number(wikiId));
            }}
            className="cursor-pointer text-red-500 hover:text-red-600 transition"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
