'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color as ColorExtension } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { Strike } from '@tiptap/extension-strike';
import { useCallback, useState } from 'react';
import FontSize from './extensions/FontSize';
import FontFamily from './extensions/FontFamily';
import { ImageUploadDialog } from './ImageUploadDialog';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
const fontFamilies = [
  'Calibri, sans-serif',
  'Arial, sans-serif',
  'Georgia, serif',
  'Times New Roman, serif',
  'Helvetica, sans-serif',
  'Verdana, sans-serif',
  'Cambria, serif',
  'Courier New, monospace',
  'Roboto, sans-serif',
];

const colors = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6B6B', '#FFA500', '#FFD700', '#32CD32', '#00CED1',
  '#1E90FF', '#8A2BE2', '#FF1493', '#00FF7F', '#FF6347', '#4169E1',
];

export function RichTextEditor({ content, onChange, placeholder, className = '' }: Readonly<RichTextEditorProps>) {
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Calibri, sans-serif');
  const [showImageDialog, setShowImageDialog] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        // Exclude link and strike from StarterKit since we're configuring them separately
        link: false,
        strike: false,
      }),
      TextStyle,
      FontSize,
      FontFamily,
      ColorExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
          loading: 'lazy',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: 'line-through',
        },
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: [
          'prose prose-sm sm:prose-base max-w-none min-h-[300px] p-4 border-0 focus:outline-none',
          'prose-headings:font-heading prose-headings:text-gray-900',
          'prose-img:max-w-full prose-img:h-auto prose-img:rounded prose-img:mx-auto',
          'prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-gray-300',
          'prose-th:border prose-th:border-gray-300 prose-th:p-2 prose-th:bg-gray-50',
          'prose-td:border prose-td:border-gray-300 prose-td:p-2',
          'prose-a:text-blue-600 prose-a:break-words',
          className
        ].filter(Boolean).join(' '),
        style: "font-family: 'Calibri', sans-serif;",
      },
    },
  });

  const insertImage = useCallback((url: string) => {
    if (url && editor) {
      editor.chain().focus().setImage({ src: url, alt: 'Blog image' }).run();
      console.log('🖼️ Image inserted into editor:', url.substring(0, 50) + '...');
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const setTextColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  }, [editor]);

  const applyFontSize = useCallback((size: string) => {
    if (editor) {
      editor.chain().focus().setFontSize(size).run();
      setFontSize(size);
    }
  }, [editor]);

  const applyFontFamily = useCallback((family: string) => {
    if (editor) {
      editor.chain().focus().setFontFamily(family).run();
      setFontFamily(family);
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1 items-center overflow-x-auto pb-1">
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => applyFontFamily(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          {fontFamilies.map((family) => (
            <option key={family} value={family} style={{ fontFamily: family }}>
              {family.split(',')[0]}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <select
          value={fontSize}
          onChange={(e) => applyFontSize(e.target.value)}
          className="text-xs border border-gray-300 rounded px-2 py-1 w-16"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Formatting */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Underline"
          >
            <span className="underline">U</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Strikethrough"
          >
            <span className="line-through">S</span>
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Text Colors */}
        <div className="flex gap-1">
          {colors.slice(0, 6).map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => setTextColor(color)}
              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={`Text color: ${color}`}
            />
          ))}
          <details className="relative">
            <summary className="w-6 h-6 rounded border border-gray-300 bg-linear-to-r from-red-500 via-yellow-500 to-blue-500 cursor-pointer hover:scale-110 transition-transform"></summary>
            <div className="absolute top-8 left-0 bg-white border border-gray-300 rounded-lg p-2 grid grid-cols-6 gap-1 z-10 shadow-lg">
              {colors.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setTextColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </details>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Align Left"
          >
            ⬅️
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Align Center"
          >
            ⬆️
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Align Right"
          >
            ➡️
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Lists */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Bullet List"
          >
            📝
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Numbered List"
          >
            🔢
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Headings */}
        <select
          value=""
          onChange={(e) => {
            const level = Number.parseInt(e.target.value);
            if (level) {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
            } else {
              editor.chain().focus().setParagraph().run();
            }
            e.target.value = '';
          }}
          className="text-xs border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Heading</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Advanced Features */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Quote"
          >
            💬
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Inline Code"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 text-xs rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
            title="Code Block"
          >
            📄
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Media & Table */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="p-1.5 text-xs rounded hover:bg-gray-200 text-gray-700"
            title="Insert Image"
          >
            🖼️
          </button>
          <button
            type="button"
            onClick={insertTable}
            className="p-1.5 text-xs rounded hover:bg-gray-200 text-gray-700"
            title="Insert Table"
          >
            📊
          </button>
        </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>

      {/* Enhanced Image Upload Dialog */}
      {showImageDialog && (
        <ImageUploadDialog
          onInsert={(url) => {
            insertImage(url);
            setShowImageDialog(false);
          }}
          onClose={() => setShowImageDialog(false)}
        />
      )}
    </div>
  );
}
