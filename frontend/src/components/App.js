import React, { Component } from 'react';
import Header from './Header';
import NoteContainer from './NoteContainer';
// import ReactQuill from 'react-quill'


const NotesURL = 'http://localhost:3000/api/v1/notes'

class App extends Component {
  
  state = {
    notes: [],
    selectedNote: null,
    editNote: false,
    filteredNotes: ''
  }

  componentDidMount() {
    fetch(NotesURL)
    .then(res => res.json())
    .then(notes => {
      this.setState({notes})
    })
   }

   handleClickForNoteContent = (note) => {
     this.setState({
        selectedNote: note,
        editNote: false
     })
   }

   createNote = (e) => {
     let notePlaceholder = {
       title: 'Add a title',
       body: 'Add a note',
       user_id: 1
     }
     this.postNewNote(NotesURL, notePlaceholder)
     .then(notePlaceholder => this.setState({
       notes: [notePlaceholder, ...this.state.notes],
       selectedNote: notePlaceholder
     }))
   }

   postNewNote = (NotesURL, notePlaceholder) => {
    return fetch(NotesURL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
      body: JSON.stringify(notePlaceholder)
    }).then(res => res.json())
   
  }

  handleClickEdit = (note) => {
    this.setState({
      editNote: true
    })
  }

  handleCancelEdit = (note) => {
    this.setState({
      editNote: false,
      selectedNote: null
    })
  }

  handleEditSave = (e, selectedNote) => {
    e.preventDefault()
    return fetch(`http://localhost:3000/api/v1/notes/${selectedNote.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(selectedNote)
    }).then(res => res.json())
    .then(note => {
      const updatedNotes = this.state.notes.map(n => n.id === note.id ? note: n)
      this.setState({notes: updatedNotes, selectedNote: note, editNote: false})
    })
    
  }

  handleSearch = (value) => {
    this.setState({filteredNotes: value})
  }

  filteredNotes = () => {
    return this.state.notes.filter(note => note.title.toLowerCase().includes(this.state.filteredNotes.toLowerCase()))
  }

  handleRemoveNote = (note) => {
    this.setState((prevState) =>({
      selectedNote: prevState.notes.filter((n) => n !== note),
      notes: prevState.notes.filter((n) => n !== note)

    }))
    this.deleteNote(note.id)

  }

  deleteNote = (note) => {
    console.log(note)
    fetch(`http://localhost:3000/api/v1/notes/${note}`, {
      method: 'DELETE'
    }).then(res => res.json())
    .then(res => console.log(res))
    this.setState({selectedNote: null})
  }

  render() {
    // console.log(this.state.notes)
    const {notes, selectedNote, editNote} = this.state
    const {handleClickForNoteContent, createNote, handleClickEdit, handleEditSave, handleCancelEdit, handleSearch, filteredNotes, handleRemoveNote} = this
    return (
      <div className="app">
        <Header />
        <NoteContainer 
        notes = {notes}
        selectedNote = {selectedNote}
        editNote = {editNote}
        handleClickForNoteContent = {handleClickForNoteContent}
        createNote = {createNote}
        handleClickEdit = {handleClickEdit}
        handleEditSave = {handleEditSave}
        handleCancelEdit = {handleCancelEdit}
        handleSearch = {handleSearch}
        filteredNotes = {filteredNotes()}
        handleRemoveNote = {handleRemoveNote}

  
        />
      </div>
    );
  }
}

export default App;
