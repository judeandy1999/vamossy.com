import {
  Bold, Italic, Link as LinkIcon, X, AArrowUp, AArrowDown, List, ListOrdered,
  FileCode2, TextQuote, Redo, Undo, Underline, Strikethrough, Check, Code, ChevronDown,
  ListPlus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
} from 'lucide-react';
import { useState } from 'react';

const ToolbarButton = ({ onClick, icon: Icon, label, iconSize, isActive }) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center justify-center p-2 rounded transition-colors
      ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200 focus:bg-gray-200'}`}
    aria-label={label}
    title={label}
  >
    <Icon size={iconSize ?? 18} />
  </button>
);

export default function EditorToolbar({ editor }) {
  if (!editor) return null;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showListDropdown, setShowListDropdown] = useState(false);

  const handleLinkButtonClick = () => {
    if (editor.isActive('link')) {
      const currentLink = editor.getAttributes('link').href || '';
      setLinkUrl(currentLink);
    } else {
      setLinkUrl('');
    }
    setShowLinkInput(!showLinkInput);
  };

  const applyLink = () => {
    if (linkUrl.trim() === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
  };

  const adjustFontSize = (delta) => {
    const { state, commands } = editor;
    const { from, to, empty } = state.selection;
    let currentFontSize = null;

    state.doc.nodesBetween(from, to, (node) => {
      const mark = node.marks?.find(mark => mark.attrs?.fontSize);
      if (mark && mark.attrs?.fontSize) {
        currentFontSize = mark.attrs.fontSize;
      }
    });

    if (empty && !currentFontSize) {
      const storedMarks = state.storedMarks || state.selection.$from.marks();
      const mark = storedMarks.find(mark => mark.attrs?.fontSize);
      if (mark && mark.attrs?.fontSize) {
        currentFontSize = mark.attrs.fontSize;
      }
    }

    const numericSize = parseInt(currentFontSize || '16', 10);
    const newSize = numericSize + delta;

    editor.chain().focus().setMark('textStyle', { fontSize: `${newSize}px` }).run();
  };

  return (
    <>
      {showLinkInput ? (
        <div className="relative z-20 flex items-center px-6">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 p-2 focus:outline-none mt-2 animate-fade-in"
          />
          <button
            onClick={applyLink}
            className="p-2 pt-4 rounded hover:bg-green-100 focus:bg-green-200 transition-colors"
          >
            <Check size={18} className="text-green-600" />
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="p-2 pt-4 rounded hover:bg-red-100 focus:bg-red-200 transition-colors"
          >
            <X size={18} className="text-red-600" />
          </button>
        </div>
      ) : (
        <div className="flex z-10 items-end justify-between flex-wrap gap-2 p-2 border bg-white shadow mb-4 sticky top-0 z-10 animate-fade-in">
          <div className='flex gap-1'>
            <ToolbarButton
              onClick={() => adjustFontSize(-2)}
              icon={AArrowDown}
              iconSize={20}
              label="Smaller Font"
            />
            <ToolbarButton
              onClick={() => adjustFontSize(2)}
              icon={AArrowUp}
              iconSize={20}
              label="Larger Font"
            />
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} label="Bold" isActive={editor.isActive('bold')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} label="Italic" isActive={editor.isActive('italic')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} icon={Underline} label="Underline" isActive={editor.isActive('underline')} />
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} label="Strikethrough" isActive={editor.isActive('strike')} />
            {/* Dropdown for Lists */}
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowListDropdown(!showListDropdown)}
                icon={ListPlus}
                label="Lists"
              >
                <ChevronDown size={12} />
              </ToolbarButton>
              {showListDropdown && (
                <div className="absolute mt-1 min-w-[9rem] bg-white border rounded shadow flex flex-col z-20">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleBulletList().run();
                      setShowListDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100"
                  >
                    <List size={22} /> <span className='text-sm'>Bullet List</span>
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault();
                      editor.chain().focus().toggleOrderedList().run();
                      setShowListDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-gray-100"
                  >
                    <ListOrdered size={22} /> <span className='text-sm'>Ordered List</span>
                  </button>
                  {/* Optional Task List */}
                </div>
              )}
            </div>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={TextQuote} label="Blockquote" />
            <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} icon={Code} label="Inline Code" />
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} icon={FileCode2} label="Code Block" />
            <ToolbarButton
              onClick={handleLinkButtonClick}
              icon={LinkIcon}
              label="Add/Edit Link"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              icon={AlignLeft}
              label="Align Left"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              icon={AlignCenter}
              label="Align Center"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              icon={AlignRight}
              label="Align Right"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              icon={AlignJustify}
              label="Justify"
            />
          </div>
          <div className='flex'>
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} label="Undo" />
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} label="Redo" />
          </div>
        </div>
      )}
    </>
  );
};
