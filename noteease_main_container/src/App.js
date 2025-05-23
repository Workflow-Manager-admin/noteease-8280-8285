import React from 'react';
import './App.css';
import { NoteProvider } from './components/NoteContext';
import Sidebar from './components/Sidebar/Sidebar';
import NoteEditor from './components/NoteEditor/NoteEditor';

function App() {
  return (
    <NoteProvider>
      <div className="app">
        <div className="noteease-container">
          <Sidebar />
          <NoteEditor />
        </div>
      </div>
    </NoteProvider>
  );
}

export default App;
