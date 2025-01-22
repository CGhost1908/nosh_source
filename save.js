
async function invokeSavesDir(){
    savesDir = await ipcRenderer.invoke('get-save-path');
}

async function readDatabase(fileName){
    
    await invokeSavesDir();

    const files = await fsPromises.readdir(savesDir);
    const nshFiles = files.filter(file => path.extname(file) === '.nsh');

    for(const file of nshFiles){
        const filePath = path.join(savesDir, file);
        try{
            const data = await fsPromises.readFile(filePath, 'utf8');
            createElement(file);
        }catch (err){
            console.error('Dosya okuma hatası:', err);
        }
    }
    // sortSaves();

    if(document.querySelector(`[file-name='${fileName}']`)){
        document.querySelector(`[file-name='${fileName}']`).classList.add('active');
    }else{
        //CHANGE HERE IN EVERY PATCH
        content.innerHTML = home;
        document.querySelector('.text-title').textContent = '';
    }

    if(localStorage.getItem('google_drive_access_token') && localStorage.getItem('google_drive_access_token') !== 'null'){
        await getNoshFilesFromDrive();
    }
}

function createElement(file, isDriveFile){
    const fileName = file.slice(0, -4);
    const savesSection = document.querySelector('.saves');
    const saves = savesSection.children;

    //createsave
    const createSave = document.createElement('p');
    createSave.id = `save${saves.length+1}`;
    createSave.classList.add('save');
    createSave.classList.add('text-overflow');
    createSave.setAttribute('file-name', fileName);
    createSave.textContent = fileName;
    createSave.onclick = function(){
        openDesiredFile(fileName)
    }
    savesSection.insertBefore(createSave, savesSection.firstChild);
    updateButtonListeners();
}


//START PROGRAM
readDatabase();


function refreshDatabase(fileName){

    // document.getElementById('content').innerHTML = '';
    // document.querySelector('.text-title').textContent = '';
    // const title = document.querySelector('.text-title').textContent;
    // const save = document.querySelector(`[file-name="${title}"]`);
    // save.classList.add('active');
    
    const allSaves = document.querySelectorAll('.save');
    allSaves.forEach(save => {
        save.remove();
    });

    readDatabase(fileName);
}


function refreshElement(file){
    const fileName = file.slice(0, -4);
    const savesSection = document.querySelector('.saves');
    const saves = savesSection.children;
    let thisFileAlreadyExist = false;

    for(let i = 0; i < saves.length; i++){
        if(saves[i].getAttribute('file-name') === fileName){
            thisFileAlreadyExist = true;
        }
    }
    if(!thisFileAlreadyExist){
        createElement(file);
    }
}



function deleteSave(saveName){
    if(saveName){
        const filePath = `${savesDir}/${saveName}.nsh`;
        fs.unlink(filePath, (err) => {});
        refreshDatabase(document.querySelector('.active')?.getAttribute('file-name') || undefined);
    }
    // }else{
    //     if(document.querySelector('.active')){
    //         const filePath = `${savesDir}/${document.querySelector('.active').getAttribute('file-name')}.nsh`;
    //         fs.unlink(filePath, (err) => {});
    //         refreshDatabase(document.querySelector('.active')?.getAttribute('file-name') || undefined);
    //     }else{
    //         document.getElementById('content').innerHTML = '';
    //         document.querySelectorAll('.save').forEach(btn => btn.classList.remove('active'));
    //     }
    // }
}

const removeRange = document.querySelector('.remove-range');
removeRange.addEventListener('change', function(){
    if(removeRange.value == 100){
        removeRange.value = 50;
        closeOverlay();
        deleteSave(document.querySelector('.active').getAttribute('file-name'));
    }else if(removeRange.value == 0){
        removeRange.value = 50;
        closeOverlay();
    }else{
        removeRange.value = 50;
    }
})

function renameSave(saveName){
    const filePath = `${savesDir}/${saveName}.nsh`;
    
    const currentSave = document.querySelector(`[file-name="${saveName}"]`);

    currentSave.setAttribute('contenteditable', true);
    currentSave.setAttribute('spellcheck', true);
    currentSave.classList.remove('text-overflow');
    currentSave.style.display = 'flex'
    // currentSave.focus();

    const range = document.createRange();
    range.selectNodeContents(currentSave);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}


document.addEventListener('click', handleEndRename);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleEndRename(event);
    }
});
document.addEventListener('contextmenu', handleEndRename);

function handleEndRename(event) {
    const contextMenu = document.getElementById('context-menu');
    const saveElements = document.querySelectorAll('.save');
    const isRenaming = Array.from(saveElements).some(save => save.getAttribute('contenteditable') === 'true');
    const editableSave = Array.from(saveElements).find(save => save.getAttribute('contenteditable') === 'true');
    const fileName = editableSave ? editableSave.getAttribute('file-name') : null;
    
    if (isRenaming && (!contextMenu || !contextMenu.contains(event.target))) {
        endRename(fileName);
    }
}


function endRename(saveName){
    const currentSave = document.querySelector(`[file-name="${saveName}"]`);

    // Return default CSS
    currentSave.setAttribute('contenteditable', false);
    currentSave.setAttribute('spellcheck', false);
    currentSave.style.display = 'grid';

    //Rename File
    const newName = currentSave.textContent;
    const nameSyntax = /^[A-Za-z0-9 _\-+()&@!%$#]{2,30}$/;
    const oldPath = `${savesDir}/${saveName}.nsh`;
    const newPath = `${savesDir}/${newName}.nsh`;
    if(nameSyntax.test(newName) && !fs.existsSync(newPath)){
        fs.rename(oldPath, newPath, (err) => {});
        currentSave.setAttribute('file-name', newName);
        currentSave.onclick = function(){
            openDesiredFile(newName)
        }
        checkTitle();

        //Rename in Drive
        renameFileDrive(saveName, newName);
    }else{
        showInvalidNameNotification();
        currentSave.textContent = saveName;
    }
}

async function sortSaves(){
    console.log('Sıralama yapılıyor...');

    const savesElement = document.querySelector('.saves');
    const itemsArray = Array.from(savesElement.children);

    const filePromises = itemsArray.map(item => {
        const filePath = path.join(savesDir, item.textContent + '.nsh');
        return fs.promises.stat(filePath).then(stat => ({
            item,
            mtime: stat.mtime
        }));
    });

    const fileStats = await Promise.all(filePromises);

    fileStats.sort((a, b) => b.mtime - a.mtime);

    savesElement.innerHTML = '';
    fileStats.forEach(fileStat => savesElement.appendChild(fileStat.item));
}

