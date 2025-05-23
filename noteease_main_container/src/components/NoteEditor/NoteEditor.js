import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNotes } from '../NoteContext';
import './NoteEditor.css';

// Quill editor formats
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'link', 'color', 'background'
];

// Quill editor modules (toolbar options)
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

// PUBLIC_INTERFACE
/**
 * NoteEditor component for editing note content with formatting capabilities.
 */
const NoteEditor = () => {
  const { 
    getActiveNote, 
    updateNote, 
    deleteNote,
    categories
  } = useNotes();
  
  const activeNote = getActiveNote();

  // Handle title change
  const handleTitleChange = (e) => {
    if (activeNote) {
      updateNote(activeNote.id, { title: e.target.value });
    }
  };

  // Handle content change
  const handleContentChange = (content) => {
    if (activeNote) {
      updateNote(activeNote.id, { content });
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    if (activeNote) {
      updateNote(activeNote.id, { category: e.target.value });
    }
  };

  // Handle delete note
  const handleDeleteNote = () => {
    if (activeNote && window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(activeNote.id);
    }
  };

  // Auto-focus title input when active note changes
  useEffect(() => {
    if (activeNote) {
      const titleInput = document.getElementById('note-title-input');
      if (titleInput) {
        titleInput.focus();
      }
    }
  }, [activeNote?.id]);

  if (!activeNote) {
    return (
      <div className="note-editor empty-editor">
        <div className="empty-editor-content">
          <h2>No Note Selected</h2>
          <p>Select a note from the sidebar or create a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="note-toolbar">
        <input
          id="note-title-input"
          type="text"
          className="note-title-input"
          value={activeNote.title}
          onChange={handleTitleChange}
          placeholder="Note title"
        />
        
        <div className="note-actions">
          <div className="category-selector">
            <select value={activeNote.category} onChange={handleCategoryChange}>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="delete-note-btn" 
            onClick={handleDeleteNote}
            title="Delete note"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="note-content-editor">
        <ReactQuill
          theme="snow"
          value={activeNote.content}
          onChange={handleContentChange}
          formats={formats}
          modules={modules}
          placeholder="Start typing your note here..."
        />
      </div>
      
      <div className="note-footer">
        <div className="note-meta-info">
          <span>Created: {new Date(activeNote.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(activeNote.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
