import React, { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create context
export const NoteContext = createContext();

// PUBLIC_INTERFACE
/**
 * NoteProvider component provides the state management for notes.
 * This includes CRUD operations, categorization, and text formatting.
 */
export const NoteProvider = ({ children }) => {
  // State for notes and categories
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['Personal', 'Work', 'Study', 'Other']);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // Load saved notes from local storage on initial load
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Create a sample note if no notes exist
      const sampleNote = {
        id: uuidv4(),
        title: 'Welcome to NoteEase',
        content: '<p>Welcome to NoteEase! This is your first note. You can edit it or create a new one.</p>',
        category: 'Personal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([sampleNote]);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save notes to local storage when notes array changes
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  // Save categories to local storage when they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Get active note
  const getActiveNote = () => {
    return notes.find(note => note.id === activeNoteId) || null;
  };

  // Create a new note
  const createNote = (title = 'New Note') => {
    const newNote = {
      id: uuidv4(),
      title,
      content: '',
      category: 'Other',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    return newNote;
  };

  // Update a note
  const updateNote = (id, updatedFields) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { 
        ...note, 
        ...updatedFields, 
        updatedAt: new Date().toISOString() 
      } : note
    );
    
    setNotes(updatedNotes);
  };

  // Delete a note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    if (activeNoteId === id) {
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    }
  };

  // Add a new category
  const addCategory = (category) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Delete a category
  const deleteCategory = (category) => {
    // Update all notes with this category to 'Other'
    const updatedNotes = notes.map(note => 
      note.category === category ? { ...note, category: 'Other' } : note
    );
    
    setNotes(updatedNotes);
    setCategories(categories.filter(c => c !== category));
  };

  // Context value
  const contextValue = {
    notes,
    categories,
    activeNoteId,
    setActiveNoteId,
    getActiveNote,
    createNote,
    updateNote,
    deleteNote,
    addCategory,
    deleteCategory
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

// PUBLIC_INTERFACE
/**
 * Custom hook for using the note context.
 * @returns {Object} The note context values and methods
 */
export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
