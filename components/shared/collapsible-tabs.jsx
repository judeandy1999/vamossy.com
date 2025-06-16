import { useState } from 'react';
import RichTextEditor from '@/components/shared/rich-text-editor';
import { Plus, Minus } from 'lucide-react';

export default function CollapsibleTabs({
  currentTabOptions,
  tabContents,
  initialTabContents,
  handleTabContentChange,
  contentChanged,
  selectedArticle
}) {
  const [expandedTabs, setExpandedTabs] = useState(() =>
    Object.keys(currentTabOptions).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  );

  const toggleTab = (key) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(currentTabOptions).map(([key, label]) => (
        <div key={key} className="rounded shadow bg-white">
          {/* Tab Header */}
          <div
            className={`flex items-center justify-between cursor-pointer p-3 ${
              expandedTabs[key] ? 'bg-slate-200' : 'bg-slate-100'
            } hover:bg-slate-200 transition rounded-t`}
            onClick={() => toggleTab(key)}
          >
            <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
            <span className="text-slate-600">
              {expandedTabs[key] ? (
                <Minus size={18} />
              ) : (
                <Plus size={18} />
              )}
            </span>
          </div>

          {/* Tab Content */}
          <div
            className={`p-3 bg-white rounded-b ${
              expandedTabs[key] ? 'block' : 'hidden'
            }`}
          >
            <RichTextEditor
              contentChanged={contentChanged}
              selectedArticle={selectedArticle?.id}
              key={`tab-${key}`}
              content={tabContents[key] || ''}
              initialContent={initialTabContents[key] || ''}
              onContentChange={(content) => handleTabContentChange(key, content)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
