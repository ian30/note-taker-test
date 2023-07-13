// setting the app width to 600px: 
document.getElementById("app_container").style.width = "600px";

const noteList = document.getElementById('note-list');
let draggingItem = null;

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
