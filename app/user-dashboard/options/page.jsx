'use client';

import { useState } from 'react';
import { useOptions } from '@/hooks/useOptions';
import { Plus, Trash } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import Modal from '@/components/ui/modal';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';

export default function Page() {
  const { status, session, role } = useAuthWithRedirect();

  const {
    wikiOptions,
    tabOptionsMap,
    loading,
    error,
    addWiki,
    addTab,
    deleteWiki,
    deleteTab
  } = useOptions();

  const [selectedWiki, setSelectedWiki] = useState(null);
  const [newWiki, setNewWiki] = useState({ name: '', description: '' });
  const [newTab, setNewTab] = useState({ name: '', description: '' });
  const [wikiError, setWikiError] = useState('');
  const [tabError, setTabError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: '', id: null });
  const [deleting, setDeleting] = useState(false);

  const handleAddWiki = async () => {
    if (!newWiki.name.trim()) {
      setWikiError('Wiki name cannot be empty.');
      return;
    }
    setWikiError('');
    await addWiki(newWiki);
    setNewWiki({ name: '', description: '' });
  };

  const handleAddTab = async () => {
    if (!newTab.name.trim()) {
      setTabError('Tab name cannot be empty.');
      return;
    }
    if (!selectedWiki) {
      setTabError('Please select a wiki first.');
      return;
    }
    setTabError('');
    await addTab({ ...newTab, wiki_id: selectedWiki });
    setNewTab({ name: '', description: '' });
  };

  const handleDeleteWiki = (wikiId) => {
    setDeleteTarget({ type: 'wiki', id: wikiId });
    setIsModalOpen(true);
  };

  const handleDeleteTab = (tabId) => {
    setDeleteTarget({ type: 'tab', id: tabId });
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
      }
      setIsModalOpen(false);
      setDeleteTarget({ type: '', id: null });
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading' || loading) {
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
        <h1 className="text-3xl font-bold mb-8 text-center">Wiki & Tab Management</h1>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wikis List */}
          <section className="bg-white shadow rounded p-4 max-h-[70vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Wikis</h2>
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-200 text-slate-600">
                  <th className="p-3">Wiki Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(wikiOptions).map(([id, name]) => (
                  <tr
                    key={id}
                    className={`transition cursor-pointer ${
                      selectedWiki === Number(id) ? 'bg-slate-200' : 'hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedWiki((prev) => (prev === Number(id) ? null : Number(id)))}
                  >
                    <td className="p-3 font-medium">{name}</td>
                    <td className="p-3 text-gray-500">
                      {wikiOptions.descriptions?.[id] || 'No description'}
                    </td>
                    <td className="p-3 flex justify-end items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWiki(Number(id));
                        }}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Wiki */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <input
                type="text"
                placeholder="Wiki Name"
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
              <button
                onClick={handleAddWiki}
                className="flex items-center gap-1 bg-slate-500 text-gray-300 px-4 py-2 rounded hover:bg-slate-700 transition"
              >
                <Plus size={16} /> Add Wiki
              </button>
            </div>
            {wikiError && <p className="text-red-500 mt-2">{wikiError}</p>}
          </section>

          {/* Tabs */}
          <section className="bg-white shadow rounded p-4 h-fit sticky top-24 self-start">
            <h2 className="text-xl font-semibold mb-4">Tabs for Selected Wiki</h2>

            {!selectedWiki ? (
              <p className="text-gray-500 text-sm">No wiki is selected. Please select a wiki to manage its tabs.</p>
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
                    ).map(([key, name]) => (
                      <tr key={key} className="hover:bg-slate-100 transition">
                        <td className="p-3 font-medium">{name}</td>
                        <td className="p-3 text-gray-500">
                          {tabOptionsMap.descriptions?.[key] || 'No description'}
                        </td>
                        <td className="p-3 flex justify-end items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTab(Number(key));
                            }}
                            className="text-red-500 hover:text-red-600 transition"
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
                    className="flex items-center gap-1 bg-slate-500 text-gray-300 px-4 py-2 rounded hover:bg-slate-700 transition"
                  >
                    <Plus size={16} /> Add Tab
                  </button>
                </div>
                {tabError && <p className="text-red-500 mt-2">{tabError}</p>}
              </>
            )}
          </section>      </div>
    </div>
  </div>
  );
}
