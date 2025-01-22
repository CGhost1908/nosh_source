const contextMenu = document.getElementById('context-menu');

let targetSave = null;

document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('save')) {
    targetSave = e.target.getAttribute('file-name');
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
  }else{
    contextMenu.style.display = 'none';
  }
});

document.addEventListener('click', () => {
  contextMenu.style.display = 'none';
});

document.getElementById('option1').addEventListener('click', () => {
  deleteSave(targetSave);
  contextMenu.style.display = 'none';
});

document.getElementById('option2').addEventListener('click', () => {
  renameSave(targetSave);
  contextMenu.style.display = 'none';
});

document.getElementById('option3').addEventListener('click', () => {
  openSavesDir();
  contextMenu.style.display = 'none';
});

