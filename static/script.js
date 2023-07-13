// setting the app width to 600px: 
document.getElementById("app_container").style.width = "600px";

const addNoteForm = document.getElementById('add-note-form');
const noteInput = document.getElementById('note-input');
const noteList = document.getElementById('note-list');
let draggingItem = null;
addNoteForm.addEventListener('submit', addNote);
// Save notes to a cookie
function saveNotesToCookie() {
  const notes = Array.from(noteList.querySelectorAll('.draggable-item')).map((noteItem) => noteItem.innerHTML);
  document.cookie = `notes=${encodeURIComponent(JSON.stringify(notes))}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
}
// Load notes from a cookie
function loadNotesFromCookie() {
  const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)notes\s*=\s*([^;]*).*$)|^.*$/, '$1');
  if (cookieValue) {
    const notes = JSON.parse(decodeURIComponent(cookieValue));
    notes.forEach((noteText) => {
      const newNoteItem = createNoteItem(noteText);
      noteList.appendChild(newNoteItem);
    });
  }
}
// Add event listener for page load event to load notes from cookie
window.addEventListener('load', loadNotesFromCookie);

// Handle form submission to add a new note
function addNote(event) {
  event.preventDefault();
  const noteText = noteInput.value.trim();
  if (noteText !== '') {
    const newNoteItem = createNoteItem(noteText);
    noteList.appendChild(newNoteItem);
    noteInput.value = '';
    saveNotesToCookie(); // Save notes to cookie after adding a new note
  }
}

// Create a new note item element
function createNoteItem(noteText) {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'draggable-item');
  li.innerHTML = `
    <span>${noteText}</span>
    <button class="btn btn-danger delete-button">Delete</button>
  `;
  li.setAttribute('draggable', true);
  li.addEventListener('dragstart', dragStart);

  const deleteButton = li.querySelector('.delete-button');
  deleteButton.addEventListener('click', () => {
    li.remove();
    saveNotesToCookie(); // Save notes to cookie after deleting a note
  });

  return li;
}

// Add event listeners for drag and drop events
noteList.addEventListener('dragstart', dragStart);
noteList.addEventListener('dragover', dragOver);
noteList.addEventListener('drop', drop);

// Handle drag start event
function dragStart(event) {
  draggingItem = event.target;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggingItem.innerHTML);
}

// Handle drag over event
function dragOver(event) {
  event.preventDefault();
  noteList.classList.add('drag-over');
}

// Handle drop event
function drop(event) {
  event.preventDefault();
  const targetItem = event.target;
  const sourceItem = draggingItem;

  if (targetItem.classList.contains('draggable-item')) {
    targetItem.innerHTML = sourceItem.innerHTML;
    sourceItem.innerHTML = event.dataTransfer.getData('text/plain');
  }

  noteList.classList.remove('drag-over');
}
