const editorDiv = document.getElementById('content');

function highlightSearchText(searchTerm) {
    const content = editorDiv.innerText || editorDiv.innerText;

    if (!searchTerm) {
        editorDiv.innerHTML = content;
        return;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedContent = content.replace(regex, `<span class="highlight">$1</span>`);
    editorDiv.innerHTML = highlightedContent;
}

// Arama çubuğu dinleme
document.getElementById('searchBar').addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();
    highlightSearchText(searchTerm);
});

