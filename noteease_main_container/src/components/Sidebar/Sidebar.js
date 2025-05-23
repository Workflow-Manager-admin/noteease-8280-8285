import React, { useState } from 'react';
import { useNotes } from '../NoteContext';
import './Sidebar.css';

// PUBLIC_INTERFACE
/**
 * Sidebar component displays categories and note management options.
 */
const Sidebar = () => {
  const { 
    notes, 
    categories, 
    createNote, 
    activeNoteId,
    setActiveNoteId,
    addCategory,
    deleteCategory
  } = useNotes();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Filter notes by category
  const filteredNotes = selectedCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === selectedCategory);

  // Handle adding a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  // Handle clicking on a note in the sidebar
  const handleNoteClick = (noteId) => {
    setActiveNoteId(noteId);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>NoteEase</h1>
        <button className="btn create-note-btn" onClick={() => createNote()}>
          + New Note
        </button>
      </div>

      <div className="categories-section">
        <div className="categories-header">
          <h3>Categories</h3>
          <button 
            className="category-action-btn"
            onClick={() => setShowCategoryInput(!showCategoryInput)}
          >
            +
          </button>
        </div>
        
        {showCategoryInput && (
          <form className="add-category-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        )}

        <ul className="categories-list">
          <li 
            className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`} 
            onClick={() => setSelectedCategory('All')}
          >
            All Notes
          </li>
          {categories.map(category => (
            <li 
              key={category}
              className={`category-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category !== 'Personal' && category !== 'Work' && category !== 'Study' && category !== 'Other' && (
                <button 
                  className="delete-category-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(category);
                    if (selectedCategory === category) {
                      setSelectedCategory('All');
                    }
                  }}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="notes-list-section">
        <h3>Notes ({filteredNotes.length})</h3>
        <ul className="notes-list-sidebar">
          {filteredNotes.map(note => (
            <li 
              key={note.id}
              className={`note-item-sidebar ${note.id === activeNoteId ? 'active' : ''}`}
              onClick={() => handleNoteClick(note.id)}
            >
              <div className="note-title">{note.title}</div>
              <div className="note-snippet">
                {note.content.replace(/<[^>]*>?/gm, '').substring(0, 30)}...
              </div>
              <div className="note-meta">
                <span className="note-category">{note.category}</span>
                <span className="note-date">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
          {filteredNotes.length === 0 && (
            <li className="empty-notes-message">
              No notes found in this category
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
