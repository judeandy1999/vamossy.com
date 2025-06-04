import { useState } from 'react';
import RichTextEditor from '@/components/rich-text-editor';

export default function CollapsibleTabs({ currentTabOptions, tabContents, handleTabContentChange, contentChanged, selectedArticle }) {
  return (
    <div className="space-y-4">
      {Object.entries(currentTabOptions).map(([key, label]) => {
        const [isExpanded, setIsExpanded] = useState(true); // State to track if the tab is expanded

        return (
          <div key={key}>
            {/* Tab Header */}
            <div
              className="flex items-center justify-between cursor-pointer bg-gray-100 p-2 rounded"
              onClick={() => setIsExpanded(!isExpanded)} // Toggle expand/collapse
            >
              <h3 className="text-lg font-medium">{label}</h3>
              <span className="text-gray-500">
                {isExpanded ? 'Collapse' : 'Expand'}
              </span>
            </div>

            {/* Tab Content (Editor) */}
            {isExpanded && (
              <div className="mt-2">
                <RichTextEditor
                  contentChanged={contentChanged}
                  selectedArticle={selectedArticle?.id}
                  key={`tab-${key}`}
                  content={tabContents[key] || ''}
                  onContentChange={(content) => handleTabContentChange(key, content)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}