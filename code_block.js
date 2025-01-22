
function createCodeBlock(language){
    //close overlay
	closeOverlay();

    //create main
    const main = document.createElement('div');

    //create code block
	const content = document.getElementById('content');
    const createCodeBlock = document.createElement('textarea');

    //create top layer
    const createCodeBlockLayer = document.createElement('div');
    createCodeBlockLayer.classList.add('code-block-layer');
    createCodeBlockLayer.setAttribute('contenteditable', false);
    const createDeleteCodeButton = document.createElement('iconify-icon');
    createDeleteCodeButton.setAttribute('icon', 'typcn:delete-outline');
    createDeleteCodeButton.classList.add('delete-code-button');
    const languageText = document.createElement('p');
    languageText.style.color = '#fff';
    languageText.textContent = language;
    createCodeBlockLayer.appendChild(languageText);
    createCodeBlockLayer.appendChild(createDeleteCodeButton);
    main.appendChild(createCodeBlockLayer);

	//Dili ekle
	createCodeBlock.setAttribute('language', language);
	createCodeBlock.setAttribute('name', 'code');
	createCodeBlock.classList.add('code');
    main.appendChild(createCodeBlock);
    
    content.appendChild(main);

    //Kod blogunu isle
    processCodeBlock();

    //fazladan textarea ekle

}

function selectLanguage(){
	//CSS
	document.querySelector('.overlay').style.opacity = ".3";
    document.querySelector('.overlay').style.pointerEvents = "all";
    document.querySelector('.popup-section').style.opacity = "1";
    document.querySelector('.popup-section').style.pointerEvents = "all";
    document.querySelector('.language-popup').style.opacity = "1";
    document.querySelector('.language-popup').style.pointerEvents = "all";
    document.querySelector('.search-language').value = '';
    searchLanguage();
}

//Code mirror

function processCodeBlock(){

    removeAllCodeMirrors();

    const codeBlocks = document.querySelectorAll('.code');

    codeBlocks.forEach((textarea) => {
        const language = textarea.getAttribute('language');

        const codeBlock = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            mode: language,
            theme: "dracula",
            autoCloseBrackets: true,
            indentUnit: 4,
            smartIndent: true,
            indentWithTabs: true,
            matchBrackets: true,
            fixedGutter: true,
            keyMap: "sublime",
            extraKeys: {
                "Shift-Tab": "autocomplete",
                "Shift-Enter": function(){
                    const emptyLine = document.createElement('p');
                    //BUNU DUZELT JAVSCRIPT ILE CSS UZERINE YAZDIR BURDAN YAPINCA ESKI BELGELERE ETKI ETMIYOR
                    // emptyLine.style.minHeight = `${localStorage.getItem('defaultFontSize')}px`;
                    emptyLine.className = 'empty-line';
                    emptyLine.tabIndex = '0';
                    content.insertBefore(emptyLine, textarea.nextSibling.nextSibling);
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(emptyLine);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    // emptyLine.focus();
                }
            },
            extensions: [
                basicSetup,
                autocompletion()
              ],
        });

        codeBlock.setSize("100%", "auto");
        
        // const createLayer = document.createElement('div');
        // createLayer.classList.add('code-block-layer');

        // const createDeleteButton = document.createElement('button');
        // createDeleteButton.classList.add('delete-code-block-button');

        // createLayer.appendChild(createDeleteButton);
        // codeBlock.getWrapperElement().appendChild(createLayer);

        codeBlock.on('change', function(instance) {
            let content = instance.getValue();
            textarea.textContent = content;
        });
    });
}



function removeAllCodeMirrors() {
    const codeMirrors = document.querySelectorAll('.CodeMirror');
    codeMirrors.forEach(function(codeMirror) {
        codeMirror.remove();
    });
}


document.addEventListener('click', function(event) {

    const deleteCodeButtons = document.querySelectorAll('.delete-code-button');

    deleteCodeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // const topLayer = button.parentElement;
            // const codeTextarea = topLayer.nextSibling;
            // const codeBlock = codeTextarea.nextSibling;
            const main = button.parentElement.parentElement;

            const range = document.createRange();
            const selection = window.getSelection();

            range.selectNodeContents(main);

            selection.removeAllRanges();
            selection.addRange(range);

            document.execCommand('delete');
        });
    });
})

document.addEventListener('keydown', function(event) {

    if (event.shiftKey && event.key === 'Enter') {
        event.preventDefault();
    }
});

//START PROGRAM
//  processCodeBlock();