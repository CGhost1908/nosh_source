

function minimizeWindow() {
    ipcRenderer.send("minimize");
}

async function closeWindow(){
    ipcRenderer.send('close');
}

ipcRenderer.on('confirm-close', async () => {
    if(textTitle.innerHTML.includes('<iconify-icon class="save-notice" icon="ic:twotone-data-saver-off"></iconify-icon>')){
        overlay.style.opacity = ".3";
        overlay.style.pointerEvents = "all";
        popupSection.style.opacity = "1";
        popupSection.style.pointerEvents = "all";
        saveWarningPopup.style.opacity = "1";
        saveWarningPopup.style.pointerEvents = "all";

        document.querySelector('.save-save-button').addEventListener('click', function(){
            saveFile();
            document.querySelector('.save-save-button').innerHTML = '<iconify-icon icon="eos-icons:three-dots-loading"></iconify-icon>';
            setTimeout(function(){
                ipcRenderer.send('proceed-close', true);
            }, 1000);
        });

        document.querySelector('.discard-save-button').addEventListener('click', function(){
            ipcRenderer.send('proceed-close', true);
        });

        document.querySelector('.cancel-save-button').addEventListener('click', function(){
            closeOverlay();
        });
    }else{
        ipcRenderer.send('proceed-close', true);
    }
});


function formatDoc(cmd, value=null) {
	if(value) {
		document.execCommand(cmd, false, value);
	} else {
		document.execCommand(cmd);
	}
}


function addLink(){
    document.querySelector('.overlay').style.opacity = "0";
    document.querySelector('.overlay').style.pointerEvents = "none";
    document.querySelector('.popup-section').style.opacity = "0";
    document.querySelector('.popup-section').style.pointerEvents = "none";

    const linkUrl = document.querySelector(".link-input").value.trim();

    if (linkUrl) {
        restoreSelection(savedRange);
        formatDoc('createLink', linkUrl);
    }
    document.querySelector('.link-input').value = ""
}

function saveSelection(){
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    return range;
}

function restoreSelection(range){
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

document.querySelector(".link-input").addEventListener('focus', function() {
    const selection = window.getSelection();
    if (!selection.toString()) {
      return;
    }
    selection.removeAllRanges();
});


const content = document.getElementById('content');

content.addEventListener('mouseenter', function(){
    const a = content.querySelectorAll('a');
    a.forEach(item=>{
        item.addEventListener('mouseenter', function(){
            content.setAttribute('contenteditable', false);
            item.target = 'blank';
        })
        item.addEventListener('mouseleave', function(){
            content.setAttribute('contenteditable', true);
        })
    })
})

const fileInput = document.getElementById('open-file')


function fileHandle(value){
    if(value == 'new'){
        createNewFile();
    }else if(value === 'open'){
        fileInput.click();
    }else if(value === 'save'){
        checkSaveType();
    }else if('save-to-drive'){
        sendSaveToDrive();
    }else if(value === 'save-as'){
        saveNewFile();
    }else if(value === 'pdf'){
        html2pdf(content);
    }
}


fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    const fileName = fileInput.files[0].name.slice(0, -4);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Read File and Open
            const content = document.getElementById('content');
            content.innerHTML = e.target.result;

            // Copy File
            const dosyaYolu = `${savesDir}/${fileName}.nsh`;
            fs.writeFile(dosyaYolu, e.target.result, (err) => {});
            
            // Check Saves
            const savesSection = document.querySelector('.saves');
            const saves = savesSection.children;

            // Create Save
            const createSave = document.createElement('button');
            createSave.id = `save${saves.length+1}`;
            createSave.classList.add('save');
            createSave.textContent = fileName;
            createSave.onclick = function(){
                openDesiredFile(fileName)
            }
            savesSection.insertBefore(createSave, savesSection.firstChild);
            updateButtonListeners();
        };
        reader.readAsText(file);
    }
});

const saveWarningPopup = document.querySelector('.save-warning-popup');

async function openDesiredFile(desiredFile){

    if(document.querySelector(`.save[file-name="${desiredFile}"]`).classList.contains('drive-save')){
        driveCheckbox.checked = true;
        toggleDriveCheckbox();
    }else{
        driveCheckbox.checked = false;
        toggleDriveCheckbox();
    }

    if(localStorage.getItem('autoSave') == 'true'){
        autoSave();
    }
    
    if(textTitle.innerHTML.includes('<iconify-icon class="save-notice" icon="ic:twotone-data-saver-off"></iconify-icon>')){
        warningSave(desiredFile);
    }else{
        console.log('openDesiredFilea gelen: ', desiredFile);
        const filePath = `${savesDir}/${desiredFile}.nsh`;
        fs.readFile(filePath, 'utf8', (err, data) => {
            document.getElementById('content').innerHTML = data;
            processCodeBlock();
        });

        const saveButtons = document.querySelectorAll('.save')
        saveButtons.forEach(button => button.classList.remove('active'));
        document.querySelector(`.save[file-name="${desiredFile}"]`).classList.add('active');
        document.querySelector('.text-title').textContent = desiredFile;
        // sortSaves();
    }

    checkDriveCheckbox();
}

async function warningSave(saveName){
    overlay.style.opacity = ".3";
    overlay.style.pointerEvents = "all";
    popupSection.style.opacity = "1";
    popupSection.style.pointerEvents = "all";
    saveWarningPopup.style.opacity = "1";
    saveWarningPopup.style.pointerEvents = "all";

    document.querySelector('.save-save-button').addEventListener('click', function(){
        saveFile();
        document.querySelector('.save-save-button').innerHTML = '<iconify-icon icon="eos-icons:three-dots-loading"></iconify-icon>';
        setTimeout(function(){
            openDesiredFile(saveName);
            closeOverlay();
            document.querySelector('.save-save-button').innerHTML = 'Save';
        }, 1000);
    });

    document.querySelector('.discard-save-button').addEventListener('click', function(){
        textTitle.innerHTML = '';
        openDesiredFile(saveName);
        closeOverlay();
    });

    document.querySelector('.cancel-save-button').addEventListener('click', function(){
        closeOverlay();
    });
}

function checkTitle(){
    const activeSave = document.querySelector('.active');
    if(activeSave){
        document.querySelector('.text-title').textContent = activeSave.getAttribute('file-name');
    }
}


function updateButtonListeners(){
    
}


function saveFile(save){
    const activeFile = document.querySelector('.active').getAttribute('file-name');
    let activePath = `${savesDir}/${activeFile}.nsh`;
    if(save){
        activePath = `${savesDir}/${save}.nsh`;
    }
    const contentHTML = content.innerHTML;
    fs.writeFile(activePath, contentHTML, (err) => {});

    if(document.querySelector('.save-drive-checkbox').checked){
        uploadFileToDrive(activePath, contentHTML);
    }

    textTitle.innerHTML = textTitle.innerHTML.replace('<iconify-icon class="save-notice" icon="ic:twotone-data-saver-off"></iconify-icon>', '');
    //Notification
    showSavedNotification();
}

function autoSave(){
    if(document.querySelector('.active')){
        const activeFile = document.querySelector('.active').getAttribute('file-name');
        const activePath = `${savesDir}/${activeFile}.nsh`;
        const contentHTML = content.innerHTML;
        fs.writeFile(activePath, contentHTML, (err) => {});
    }
}


function showSavedNotification(){
    const saveNotification = document.getElementById('saved-notification');
    saveNotification.style.transform = 'translateX(0)';
    setTimeout(function() {
        saveNotification.style.cssText = '';
    }, 2000);
}

function showInvalidNameNotification(){
    const saveNotification = document.getElementById('invalid-name-notification');
    saveNotification.style.transform = 'translateX(0)';
    setTimeout(function() {
        saveNotification.style.cssText = '';
    }, 2000);
}


function saveNewFile(){
    const content = document.getElementById('content');
    const contentHTML = content.innerHTML;

    const blob = new Blob([contentHTML], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    if(document.querySelector('.active')){
        a.download = `${document.querySelector('.active').getAttribute('file-name')}.nsh`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }else{
        createNewFile();
    }
}


function checkSaveType(){
    if(document.querySelector('.active')){
        saveFile();
    }else{
        saveNewFile();
    }
}


document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      if(document.querySelector('.active')){
        checkSaveType();
      }
    }
    // if (event.key === ' ') {
    //     const activeElement = document.activeElement;

    //     if (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A') {
    //         event.preventDefault(); // Tıklamayı engeller
    //     }
    // }
});


function createNewFile(){

    const contentHTML = content.innerHTML;
    content.setAttribute('contenteditable', true);
    document.querySelectorAll('.save').forEach(btn => btn.classList.remove('active'));

    let untitledFiles;
    //Tum dosyalari oku
    fs.readdir(savesDir, (err, files) => {
        if (err) {
            console.error('Klasörü okurken hata:', err);
            return;
        }
    
        untitledFiles = files.filter(file => file.startsWith('untitled') && path.extname(file) === '.nsh');
    
        // Kullanılabilir en düşük numarayı bul
        let fileNumbers = untitledFiles.map(file => {
            const match = file.match(/untitled(\d+)\.nsh/);
            return match ? parseInt(match[1]) : null;
        }).filter(num => num !== null);

        // Dosya adını belirle
        let newFileName;
        if (fileNumbers.length === 0) {
            newFileName = 'untitled1.nsh';
        } else {
            const maxNumber = Math.max(...fileNumbers);
            newFileName = `untitled${maxNumber + 1}.nsh`;
        }

        ipcRenderer.invoke('create-file', newFileName, '');
        const filePath = path.join(savesDir, newFileName);

        fs.writeFile(filePath, `<h1 class="content-title">${newFileName.split('.')[0]}</h1>\n<p></p>`, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
        });
        refreshDatabase(newFileName);

        if (document.querySelector(`[file-name="${newFileName.split('.')[0]}"]`)) {
            document.querySelector(`[file-name="${newFileName.split('.')[0]}"]`).classList.add('active');
        }
    });
}

function openSavesDir(){
    exec(`start "" "${savesDir}"`, (err) => {
        if (err) {
          console.error('Klasör açılamadı:', err);
        }
      });
}

const textTitle = document.querySelector('.text-title');

content.addEventListener('input', () => {
    if(!textTitle.innerHTML.includes('<iconify-icon class="save-notice" icon="ic:twotone-data-saver-off"></iconify-icon>') && document.querySelector('.active')){
        textTitle.innerHTML += '<iconify-icon class="save-notice" icon="ic:twotone-data-saver-off"></iconify-icon>';
    }
});