import React, { useState, useRef, useEffect } from "react";
import SavedNotes from "./SavedNotes";
import "./NoteEditor.css";

const NoteEditor = ({ onSave, playerRef, videoId }) => {
  const [content, setContent] = useState("");
  const [timestamps, setTimestamps] = useState([]);
  const [savedNotes, setSavedNotes] = useState([]);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    orderedList: false,
    unorderedList: false
  });
  const editorRef = useRef(null);

  useEffect(() => {
    const checkFormatting = () => {
      if (document.queryCommandState) {
        setActiveFormats({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline'),
          orderedList: document.queryCommandState('insertOrderedList'),
          unorderedList: document.queryCommandState('insertUnorderedList')
        });
      }
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('input', checkFormatting);
      editor.addEventListener('mouseup', checkFormatting);
      editor.addEventListener('keyup', checkFormatting);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('input', checkFormatting);
        editor.removeEventListener('mouseup', checkFormatting);
        editor.removeEventListener('keyup', checkFormatting);
      }
    };
  }, []);

  const insertTimestamp = () => {
    if (!playerRef?.current?.getCurrentTime) return;
  
    const currentTime = Math.floor(playerRef.current.getCurrentTime());
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    const timestampText = `[${minutes}:${seconds.toString().padStart(2, '0')}]`;
  
    // Create the timestamp element
    const timestampEl = document.createElement("span");
    timestampEl.textContent = timestampText;
    timestampEl.className = "timestamp";
    timestampEl.style.cursor = "pointer";
    timestampEl.setAttribute("data-time", currentTime.toString());
  
    // Add click handler
    timestampEl.addEventListener("click", (e) => {
      e.preventDefault();
      const timeStr = timestampEl.getAttribute('data-time');
      const timeInSeconds = parseInt(timeStr, 10);
      if (!isNaN(timeInSeconds)) {
        playerRef.current.seekTo(timeInSeconds, true);
      }
    });
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
  
    // Insert the timestamp span
    range.insertNode(timestampEl);
  
    // Insert a space (or zero-width space if needed)
    const spacer = document.createTextNode('\u00A0'); // non-breaking space
    const postSpacer = document.createTextNode(''); // placeholder to put cursor after
  
    range.setStartAfter(timestampEl);
    range.setEndAfter(timestampEl);
    range.insertNode(spacer);
    range.insertNode(postSpacer);
  
    // Move cursor after the spacer
    const newRange = document.createRange();
    newRange.setStartAfter(spacer);
    newRange.setEndAfter(spacer);
    selection.removeAllRanges();
    selection.addRange(newRange);
  };
  
  
  

  const handleSaveNote = () => {
    const timestamp = playerRef.current?.getCurrentTime?.() || 0;
  
    const newNote = {
      content,
      timestamp,
      videoId,
    };
  
    console.log('Saving note:', newNote);
    onSave(newNote); 
  
    // Clear editor
    editorRef.current.innerHTML = '';
    setContent('');
  };
  
  
  

  const handleEditorClick = (e) => {
    const target = e.target;
    if (target.classList.contains('timestamp')) {
      const timeStr = target.getAttribute('data-time');
      const timeInSeconds = parseInt(timeStr, 10);
  
      // Debug log to verify the data-time value
      console.log("Clicked timestamp data-time:", timeStr);
      console.log("Seeking to timestamp time:", timeInSeconds);
  
      if (!isNaN(timeInSeconds)) {
        playerRef?.current?.seekTo(timeInSeconds, true);
      } else {
        console.warn("Invalid timestamp data:", timeStr);
      }
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const insertList = (type) => {
    document.execCommand('insert' + (type === 'ordered' ? 'OrderedList' : 'UnorderedList'), false, null);
  };

  return (
    <div className="note-editor">
      <div className="editor-toolbar">
        <button 
          onClick={() => formatText('bold')} 
          className={`format-button ${activeFormats.bold ? 'active' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <span className="button-icon">B</span>
        </button>
        <button 
          onClick={() => formatText('italic')} 
          className={`format-button ${activeFormats.italic ? 'active' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <span className="button-icon"><i>I</i></span>
        </button>
        <button 
          onClick={() => formatText('underline')} 
          className={`format-button ${activeFormats.underline ? 'active' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <span className="button-icon"><u>U</u></span>
        </button>
        <div className="toolbar-separator" />
        <button 
          onClick={() => insertList('unordered')} 
          className={`format-button ${activeFormats.unorderedList ? 'active' : ''}`}
          title="Bullet List"
        >
          <span className="button-icon">•</span>
        </button>
        <button 
          onClick={() => insertList('ordered')} 
          className={`format-button ${activeFormats.orderedList ? 'active' : ''}`}
          title="Numbered List"
        >
          <span className="button-icon">1.</span>
        </button>
        <div className="toolbar-separator" />
        <button 
          onClick={insertTimestamp} 
          className="timestamp-button"
          title="Insert Timestamp"
        >
          <span className="button-icon">[00:00]</span>
        </button>
        <button 
          onClick={handleSaveNote} 
          className="save-button"
          title="Save Note"
        >
          <span className="button-icon">💾</span>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="editor-content"
        onClick={handleEditorClick}
        onInput={(e) => setContent(e.target.innerHTML)}
        placeholder="Write your notes here..."
      />


    </div>
  );
};

export default NoteEditor;
