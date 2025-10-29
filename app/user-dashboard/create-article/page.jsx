'use client';

import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useAllArticles } from '@/hooks/useAllArticles';
import { useOptions } from '@/hooks/useOptions';
import RichTextEditor from '@/components/shared/rich-text-editor';
import { Save, ChevronDown, X } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import EditorSidebar from '@/components/shared/editor-sidebar';
import { createArticle, updateArticle, deleteArticle } from '@/utils/articles';
import CollapsibleTabs from '@/components/shared/collapsible-tabs';
import { useArticleTabs } from '@/hooks/useArticleTabs';
import { useToast } from '@/contexts/toast-context';

export default function Page() {
  const { status, session } = useAuthWithRedirect();
  const [currentPage, setCurrentPage] = useState(1);
  const { articles, loading, error, totalPages, totalCount, hasNextPage, hasPrevPage, addNewArticle, updateArticleInSidebar, deleteArticleFromSidebar } = useAllArticles(currentPage);
  const { wikiOptions, tabOptionsMap, mainCategories, loading: optionsLoading, error: optionsError } = useOptions();
  const { showToast } = useToast();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newlyCreatedId, setNewlyCreatedId] = useState(null);
  const [contentChanged, setContentChanged] = useState(false);
  
  // Changed from single category to array of categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [hasTabs, setHasTabs] = useState(false);

  console.log('Selected Categories:', selectedCategories);
  console.log('wikiOptions:', wikiOptions);

  const { initialTabContents, tabContents, setTabContents, loading: tabsLoading } = useArticleTabs(selectedArticle?.id);

  const isEditing = !!selectedArticle;

  useEffect(() => {
    if (selectedArticle) {
      const { title, content, categories, has_tabs } = selectedArticle;
      setTitle(title);
      
      // Handle existing articles - use categories array if available, fallback to single wiki_id
      if (categories && Array.isArray(categories) && categories.length > 0) {
        setSelectedCategories(categories);
      } else if (selectedArticle.wiki_id) {
        // Handle legacy single wiki_id or if categories is empty
        setSelectedCategories(Array.isArray(selectedArticle.wiki_id) ? selectedArticle.wiki_id : [selectedArticle.wiki_id]);
      } else {
        setSelectedCategories([]);
      }

      if (has_tabs) {
        setHasTabs(true);
        setContent('');
        setInitialContent('');
      } else {
        setHasTabs(false);
        setContent(content || '');
        setInitialContent(content || '');
      }
    } else {
      refreshContent();
    }
  }, [selectedArticle?.id]);

  const refreshContent = () => {
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setHasTabs(false);
    setInitialContent('');
    setShowCategoryDropdown(false);
  };

  // Group wikis by main category for checkbox display
  const groupedWikis = Object.entries(wikiOptions).reduce((acc, [wikiId, wiki]) => {
    const mainCategoryId = wiki.main_category_id || 'uncategorized';
    const mainCategoryName = wiki.main_category_id 
      ? mainCategories[wiki.main_category_id]?.name 
      : 'Uncategorized';
    
    if (!acc[mainCategoryId]) {
      acc[mainCategoryId] = {
        name: mainCategoryName,
        wikis: []
      };
    }
    acc[mainCategoryId].wikis.push([wikiId, wiki]);
    return acc;
  }, {});

  // Handle category selection
  const handleCategoryToggle = (categoryId) => {
    const numCategoryId = Number(categoryId);
    setSelectedCategories(prev => {
      if (prev.includes(numCategoryId)) {
        return prev.filter(id => id !== numCategoryId);
      } else {
        return [...prev, numCategoryId];
      }
    });
  };

  // Remove individual category
  const removeCategory = (categoryId) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  // Get selected category names for display
  const getSelectedCategoryNames = () => {
    return selectedCategories.map(id => {
      const wiki = wikiOptions[id];
      if (!wiki) return `Category ${id}`;
      
      const mainCategory = wiki.main_category_id 
        ? mainCategories[wiki.main_category_id]?.name 
        : 'Uncategorized';
      
      return `${mainCategory}: ${wiki.name}`;
    });
  };

  // Helper function to check individual tab sizes
  const validateTabSizes = (tabs) => {
    const maxSize = 900 * 1024; // 900KB limit
    const oversizedTabs = [];

    for (const [tabId, tabContent] of Object.entries(tabs)) {
      if (tabContent && tabContent.trim()) {
        try {
          const contentSize = new Blob([tabContent]).size;
          if (contentSize > maxSize) {
            oversizedTabs.push({
              tabId,
              size: contentSize,
              sizeInKB: (contentSize / 1024).toFixed(1)
            });
          }
        } catch (error) {
          console.error(`Error calculating size for tab ${tabId}:`, error);
          // If we can't calculate size, assume it's fine to avoid blocking saves
        }
      }
    }

    return oversizedTabs;
  };

  const saveArticle = async () => {
    // Validation checks
    if (!title.trim()) {
      showToast('Title cannot be empty!', 'error');
      return;
    }

    if (selectedCategories.length === 0) {
      showToast('Please select at least one category!', 'error');
      return;
    }

    if (!hasTabs && !content.trim()) {
      showToast('Content cannot be empty!', 'error');
      return;
    }

    if (hasTabs && Object.keys(tabContents).length === 0) {
      showToast('Please add content to at least one tab!', 'error');
      return;
    }

    // Size validation for tabs
    if (hasTabs && Object.keys(tabContents).length > 0) {
      const oversizedTabs = validateTabSizes(tabContents);
      if (oversizedTabs.length > 0) {
        const tabNames = oversizedTabs.map(tab => {
          // Find tab name from any category that has this tab
          let tabName = `Tab ${tab.tabId}`;
          for (const categoryId of selectedCategories) {
            const tabOption = tabOptionsMap[categoryId]?.[tab.tabId];
            if (tabOption?.name) {
              tabName = tabOption.name;
              break;
            }
          }
          return `${tabName} (${tab.sizeInKB}KB)`;
        }).join(', ');
        
        showToast(
          `Cannot save article. The following tabs exceed the 900KB limit: ${tabNames}. Please reduce content size or remove large images before saving.`,
          'error'
        );
        return;
      }
    }

    // Size validation for regular content
    if (!hasTabs) {
      const contentSize = new Blob([content]).size;
      const maxSize = 900 * 1024;
      
      if (contentSize > maxSize) {
        const sizeInKB = (contentSize / 1024).toFixed(1);
        showToast(
          `Cannot save article. Content is too large (${sizeInKB}KB). Maximum allowed is 900KB. Please reduce content size or remove large images.`,
          'error'
        );
        return;
      }
    }

    setIsSaving(true);

    try {
      const sanitizedContent = DOMPurify.sanitize(content);

      if (isEditing) {
        showToast('Updating article...', 'info', true);
        
        const updatedArticle = await updateArticle({
          id: selectedArticle.id,
          title,
          content: sanitizedContent,
          wiki_id: selectedCategories, // Pass all selected categories as array
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Updating tabs...', 'info', true);
          await updateTabsIndividually(selectedArticle.id, tabContents);
        }

        showToast('Article updated successfully!', 'success');
        
        // Update with categories array to match expected structure
        updateArticleInSidebar({
          ...updatedArticle,
          categories: selectedCategories, // Ensure categories are included
          updated_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      } else {
        showToast('Creating article...', 'info', true);
        
        // Create single article with multiple categories
        const newArticle = await createArticle({
          title,
          content: sanitizedContent,
          wiki_id: selectedCategories, // All selected categories as array
          has_tabs: hasTabs,
          user_email: session.user.email,
        });

        // Save tabs if enabled - merge tabs from all selected categories
        if (hasTabs && Object.keys(tabContents).length > 0) {
          showToast('Saving tabs...', 'info', true);
          await saveTabsIndividually(newArticle.id, tabContents);
        }
        
        setNewlyCreatedId(newArticle.id);
        showToast('Article created successfully!', 'success');
        
        // Add the categories array to match the structure expected by the UI
        addNewArticle({
          ...newArticle,
          categories: selectedCategories, // Add the categories array
          created_at: new Date().toISOString(),
        });
        setSelectedArticle(null);
      }
      
      refreshContent();
      setContentChanged(!contentChanged);
    } catch (error) {
      console.error('Error saving article:', error);
      const errorMessage = error.message || 'Failed to save article!';
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const saveTabsIndividually = async (articleId, tabs) => {
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const accessToken = session.access_token;
    const tabEntries = Object.entries(tabs).filter(([, content]) => content && content.trim());

    if (tabEntries.length === 0) {
      return; // No tabs to save
    }

    for (const [tabId, tabContent] of tabEntries) {
      try {
        const res = await fetch('/api/tab-articles/create-tab', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          },
          body: JSON.stringify({
            article_id: articleId,
            tab_id: Number(tabId),
            content: tabContent
          })
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to save tab ${tabId}: ${errorText}`);
        }
      } catch (error) {
        console.error(`Error saving tab ${tabId}:`, error);
        throw error; // Re-throw to be caught by main try-catch
      }
    }
  };

  const updateTabsIndividually = async (articleId, tabs) => {
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }

    const accessToken = session.access_token;

    try {
      // Delete all existing tabs first
      const deleteRes = await fetch(`/api/tab-articles/${articleId}/delete-all`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (!deleteRes.ok) {
        throw new Error('Failed to delete existing tabs');
      }

      // Then save new tabs
      await saveTabsIndividually(articleId, tabs);
    } catch (error) {
      console.error('Error updating tabs:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      deleteArticleFromSidebar(id);
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
        refreshContent();
      }
      showToast('Article deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete article:', error.message);
      showToast('Failed to delete article!', 'error');
    }
  };

  useEffect(() => {
    if (newlyCreatedId) {
      const timer = setTimeout(() => setNewlyCreatedId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [newlyCreatedId]);

  const startNewArticle = () => {
    setSelectedArticle(null);
    refreshContent();
    setContentChanged(!contentChanged);
  };

  const handleTabContentChange = (tabId, newContent) => {
    setTabContents((prev) => ({
      ...prev,
      [tabId]: newContent,
    }));

    // Debounced size validation to avoid too many warnings
    if (newContent && newContent.trim()) {
      try {
        const contentSize = new Blob([newContent]).size;
        const maxSize = 900 * 1024;
        
        if (contentSize > maxSize) {
          const sizeInKB = (contentSize / 1024).toFixed(1);
          
          // Find tab name from any selected category that has this tab
          let tabName = `Tab ${tabId}`;
          for (const categoryId of selectedCategories) {
            const tabOption = tabOptionsMap[categoryId]?.[tabId];
            if (tabOption?.name) {
              tabName = tabOption.name;
              break;
            }
          }
          
          // Only show warning if content is significantly over limit
          if (contentSize > maxSize * 1.1) { // 10% buffer
            showToast(
              `Warning: ${tabName} content is ${sizeInKB}KB (exceeds 900KB limit). Article cannot be saved until this is reduced.`,
              'warning'
            );
          }
        }
      } catch (error) {
        console.error('Error calculating content size:', error);
      }
    }
  };

  // Pagination functions for sidebar
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    // Reset to first page when starting a new article
    if (!selectedArticle) {
      setCurrentPage(1);
    }
  }, [selectedArticle]);

  if (status === 'loading' || optionsLoading) {
    return <Spinner />;
  }

  if (optionsError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Failed to load options: {optionsError}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <EditorSidebar
        articles={articles}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        goToPage={goToPage}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
        startNewArticle={startNewArticle}
        setSelectedArticle={setSelectedArticle}
        selectedArticleId={selectedArticle?.id}
        handleDelete={handleDelete}
        error={error}
        newlyCreatedId={newlyCreatedId}
      />

      {/* Content Editor */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">{isEditing ? 'Edit Article' : 'New Article'}</h1>
            <button
              onClick={saveArticle}
              disabled={isSaving || !title.trim() || selectedCategories.length === 0}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded text-white transition ${
                isSaving || !title.trim() || selectedCategories.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-slate-500 hover:bg-slate-700'
              }`}
            >
              <Save size={16} /> 
              {isEditing ? 'Save' : 'Create Article'}
            </button>
          </div>

          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-slate-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Categories Section */}
          <label className="block mb-3 text-sm text-slate-600 font-medium">Categories</label>
          
          {/* Selected Categories Display */}
          {selectedCategories.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {getSelectedCategoryNames().map((categoryName, index) => (
                <span
                  key={selectedCategories[index]}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {categoryName}
                  <button
                    onClick={() => removeCategory(selectedCategories[index])}
                    className="cursor-pointer hover:bg-slate-200 rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown Toggle */}
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <span className="text-slate-700">
              {selectedCategories.length === 0 
                ? 'Select categories...' 
                : `${selectedCategories.length} categories selected`
              }
            </span>
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-80 overflow-y-auto">
              <div className="p-3">
                {Object.entries(groupedWikis).map(([mainCategoryId, categoryGroup]) => (
                  <div key={mainCategoryId} className="mb-4 last:mb-0">
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 border-b border-gray-300 pb-1">
                      {categoryGroup.name}
                    </h3>
                    <div className="space-y-2 pl-2">
                      {categoryGroup.wikis.map(([wikiId, wiki]) => (
                        <label key={wikiId} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(Number(wikiId))}
                            onChange={() => handleCategoryToggle(wikiId)}
                            className="accent-slate-600"
                          />
                          <span className="text-sm text-slate-700">{wiki.name}</span>
                          {wiki.description && (
                            <span className="text-xs text-gray-500">- {wiki.description}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(groupedWikis).length === 0 && (
                  <p className="text-gray-500 text-sm">No categories available</p>
                )}
              </div>
            </div>
          )}

          {/* Clear all categories button */}
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="cursor-pointer mt-2 text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Clear all categories
            </button>
          )}

          {/* Tabs Checkbox */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 mb-4">
              <label className="flex items-center gap-2 text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={hasTabs}
                  onChange={(e) => setHasTabs(e.target.checked)}
                  className="accent-slate-600"
                />
                This article has tabs
              </label>
            </div>
          )}

          {/* Content/Tabs Section */}
          {hasTabs && selectedCategories.length > 0 && (
            <div className="space-y-6">
              {selectedCategories.map(categoryId => {
                const category = wikiOptions[categoryId];
                const categoryTabs = tabOptionsMap[categoryId] || {};
                const hasCategoryTabs = Object.keys(categoryTabs).length > 0;
                
                if (!hasCategoryTabs) return null;
                
                // Get main category name
                const mainCategoryName = category?.main_category_id 
                  ? mainCategories[category.main_category_id]?.name 
                  : 'Uncategorized';
                
                return (
                  <div key={categoryId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {/* Category Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-700">
                        <span className="text-slate-500">{mainCategoryName}:</span> {category?.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {Object.keys(categoryTabs).length} tabs available
                      </p>
                    </div>
                    
                    {/* Collapsible Tabs for this category */}
                    <CollapsibleTabs
                      currentTabOptions={categoryTabs}
                      tabContents={tabContents}
                      initialTabContents={initialTabContents}
                      handleTabContentChange={handleTabContentChange}
                      contentChanged={contentChanged}
                      selectedArticle={selectedArticle}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {!hasTabs && selectedCategories.length > 0 && (
            <RichTextEditor
              contentChanged={contentChanged}
              selectedArticle={selectedArticle?.id}
              key={selectedArticle?.id || 'new'}
              content={content}
              initialContent={initialContent}
              onContentChange={setContent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
