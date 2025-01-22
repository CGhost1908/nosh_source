
const overlay = document.querySelector('.overlay');
const popupSection = document.querySelector('.popup-section');


const menuCheckBox = document.querySelector(".menu-checkbox");

menuCheckBox.addEventListener("change", function(){
    if(menuCheckBox.checked){
        document.querySelector('.left-side').style.width = '50px'; 
        document.querySelector('.title').style.width = '0px';
        document.querySelector('.right-side').style.width = 'calc(100% - 50px)';
        document.querySelector('.text-title').style.width = 'calc(100% - 120px)';
        document.querySelector('.organizer2').style.display = 'none';
        document.querySelector('.saves').style.display = 'none';
        document.querySelector('.spotify').style.display = 'none';
        
    }else{
        document.querySelector('.left-side').style.width = '200px'; 
        document.querySelector('.title').style.width = '90px';
        document.querySelector('.right-side').style.width = 'calc(100% - 200px)';
        document.querySelector('.text-title').style.width = 'calc(100% - 280px)';
        document.querySelector('.organizer2').style.display = 'flex';
        document.querySelector('.saves').style.display = 'flex';
        document.querySelector('.spotify').style.display = 'flex';
    }
})

function closeOverlay(){
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    popupSection.style.opacity = "0";
    popupSection.style.pointerEvents = "none";
    document.querySelectorAll('.popup').forEach(element=> {
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
    });

    document.querySelector('.remove-range').classList.add('no-range-event');
}

let savedRange;

function openLinkPopup(){
    overlay.style.opacity = ".3";
    overlay.style.pointerEvents = "all";
    popupSection.style.opacity = "1";
    popupSection.style.pointerEvents = "all";
    document.querySelector('.add-link-popup').style.opacity = "1";
    document.querySelector('.add-link-popup').style.pointerEvents = "all";

    savedRange = saveSelection();

    document.querySelector(".link-input").focus();

    const url = document.querySelector('.link-input').textContent;
}


const linkButton = document.querySelector('.link-button')

linkButton.addEventListener('mouseover', function(){
    
})


const changeThemeIcon = document.getElementById('change-theme-icon');
const inner = document.querySelector('.inner');

function changeTheme(){
    changeThemeIcon.classList.toggle('bxs-moon');
    changeThemeIcon.classList.toggle('bx-moon');
    content.classList.toggle('dark-content');
    content.classList.toggle('light-content');
}


const searchCheckbox = document.querySelector('.search-checkbox');
searchCheckbox.addEventListener("change", function(){
    const searchInput = document.querySelector('.search-input');
    const settingsButton = document.querySelector('.settings-button');
    const refreshButton = document.querySelector('.refresh');
    const search = document.querySelector('.search');

    if(searchCheckbox.checked){
        search.classList.remove('trio-hover');
        searchInput.style.opacity = '1';
        searchInput.style.width = '120px';
        searchInput.style.padding = '0px 10px 0px 35px';
        searchInput.style.pointerEvents = 'all';
        settingsButton.style.display = 'none';
        refreshButton.style.display = 'none';
    }else{
        searchInput.style.opacity = '0';
        searchInput.style.width = '30px';
        searchInput.style.padding = '0';
        searchInput.style.pointerEvents = 'none';
        settingsButton.style.display = 'flex';
        refreshButton.style.display = 'flex';
        search.classList.add('trio-hover');
        searchInput.value = '';
    }
})


function removePopup(){
    overlay.style.opacity = ".3";
    overlay.style.pointerEvents = "all";
    popupSection.style.opacity = "1";
    popupSection.style.pointerEvents = "all";
    document.querySelector('.remove-popup').style.opacity = "1";
    document.querySelector('.remove-popup').style.pointerEvents = "all";
    document.querySelector('.remove-range').classList.remove('no-range-event');
}

const codeBlockButton = document.querySelector('.code-block-button');
const codeBlockIcon = document.getElementById('code-block-icon');
codeBlockButton.addEventListener('mouseover', () => {
    codeBlockIcon.setAttribute('icon', 'ant-design:code-filled');
});

codeBlockButton.addEventListener('mouseout', () => {
    codeBlockIcon.setAttribute('icon', 'ant-design:code-outlined');
});




document.addEventListener('mouseover', (event) => {
    if (event.target.matches('.delete-code-button')) {
        event.target.setAttribute('icon', 'typcn:delete');
    }
});

document.addEventListener('mouseout', (event) => {
    if (event.target.matches('.delete-code-button')) {
        event.target.setAttribute('icon', 'typcn:delete-outline');
    }
});


const addImageButton = document.querySelector('.add-image-icon');
addImageButton.addEventListener('mouseover', () => {
    addImageButton.setAttribute('icon', 'ic:round-image');
});

addImageButton.addEventListener('mouseout', () => {
    addImageButton.setAttribute('icon', 'ic:outline-image');
});


const addVideoButton = document.querySelector('.add-video-icon');
addVideoButton.addEventListener('mouseover', () => {
    addVideoButton.setAttribute('icon', 'ri:video-add-fill');
});

addVideoButton.addEventListener('mouseout', () => {
    addVideoButton.setAttribute('icon', 'ri:video-add-line');
});


const settingsButton = document.querySelector('.settings-button');
const settings = document.querySelector('.settings');
settingsButton.addEventListener('click', function(){
    overlay.style.opacity = ".3";
    overlay.style.pointerEvents = "all";
    popupSection.style.opacity = "1";
    popupSection.style.pointerEvents = "all";
    settings.style.opacity = "1";
    settings.style.pointerEvents = "all";

});


function searchLanguage() {
    const searchInput = document.querySelector('.search-language');
    const filter = searchInput.value.toLowerCase();
    const buttons = document.querySelectorAll('.languages .language');

    buttons.forEach(button => {
        const buttonText = button.innerText.toLowerCase();
        if (buttonText.includes(filter)) {
            button.style.display = '';
        } else {
            button.style.display = 'none';
        }
    });
}

function closeDropdown(element) {
    element.style.display = 'none';
    setTimeout(function() {
        element.style.display = '';
    }, 100);
}


document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('mousedown', function(event){
      event.preventDefault();
    });
});

// document.querySelectorAll('.link-input').forEach(function(item) {
//     item.addEventListener('mousedown', function(event){
//       event.preventDefault();
//     });
// });

const toolbarColors = document.querySelectorAll('.toolbar-color');
const colorPicker = document.querySelector('.toolbar-color input[type="color"]');


toolbarColors.forEach(toolbarColor => {
    const colorPicker = toolbarColor.querySelector('input[type="color"]');

    toolbarColor.addEventListener('mouseenter', () => {
        colorPicker.setAttribute('type','color');
        colorPicker.click();
    });

    toolbarColor.addEventListener('mouseleave', () => {
        colorPicker.setAttribute('type','text');
    });
});

// colorPicker.addEventListener('input', () => {
//     toolbarColor.style.backgroundColor = colorPicker.value;
// });


function minimizeSpotify(){
    document.querySelector('.spotify-volume').style.marginRight = "0";
    document.querySelector('.spotify-volume').style.pointerEvents = "none";
    document.querySelector('.spotify-volume').style.opacity = "0";
    document.querySelector('.spotify').style.height = "50px";
    document.querySelector('.controls').style.height = "30px";
    document.querySelector('.controls').style.margin = "0 0 10px 0";
    document.querySelector('.controls').style.borderRadius = "10px 10px 0 0";
    document.querySelector('.track-info').style.display = "none";
}

document.querySelector('.spotify').addEventListener('mouseenter', function(){
    document.querySelector('.spotify').setAttribute('style', '');
    document.querySelector('.controls').setAttribute('style', '');
    document.querySelector('.controls').setAttribute('style', '');
    document.querySelector('.track-info').setAttribute('style', '');
    setTimeout(() => {
        document.querySelector('.spotify-volume').setAttribute('style', '')
    }, 300);
})


function toggleDriveCheckbox(){
    const icon1 = document.getElementById('drive-enable-icon');
    const icon2 = document.getElementById('drive-disable-icon');
    if(driveCheckbox.checked){
        icon1.classList.add('visible');
        icon2.classList.remove('visible');
        showDriveNotification();
    }else{
        icon1.classList.remove('visible');
        icon2.classList.add('visible');
    }
}

function drivePopup(){
    overlay.style.opacity = ".3";
    overlay.style.pointerEvents = "all";
    popupSection.style.opacity = "1";
    popupSection.style.pointerEvents = "all";
    document.querySelector('.drive-popup').style.opacity = "1";
    document.querySelector('.drive-popup').style.pointerEvents = "all";
}


function showDriveNotification(){
    document.querySelector('.drive-notification').style.opacity = '1';
    document.querySelector('.drive-notification').style.transform = 'translateY(0)';
    setTimeout(() => {
        document.querySelector('.drive-notification').style.opacity = '0';
        document.querySelector('.drive-notification').style.transform = 'translateY(55px)';
        setTimeout(() => {
            document.querySelector('.drive-notification').style.transform = 'translateY(-55px)';
        }, 500);
    }, 5000);
}

let driveImportedFile, driveErrorFile = 0;

function updateImportDrivePopup(isSuccess){
    if(isSuccess){
        document.querySelector('.imported-file-number').textContent += 1;
    }else{
        document.querySelector('.not-imported-file-number').textContent += 1;
    }
}

function exitDriveFilesPopup(){
    document.querySelector('.drive-saves-popup').style.opacity = '0';
    document.querySelector('.drive-saves-popup').style.pointerEvents = 'none';
}