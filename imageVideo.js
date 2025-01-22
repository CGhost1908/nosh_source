

function addImage(){
    const createImageDiv = document.createElement('div');
    const createDiv = document.createElement('div');
    const createText = document.createElement('p');
    const createLabel = document.createElement('label');
    const createImage = document.createElement('img');
    const createUploadIcon = document.createElement('iconify-icon');
    const createTickIcon = document.createElement('iconify-icon');
    const createFileInput = document.createElement('input');
    createFileInput.setAttribute('type', 'file');
    createFileInput.setAttribute('accept', 'image/*');
    const createTextInput = document.createElement('input');
    createTextInput.setAttribute('type', 'text');
    createDiv.setAttribute('contenteditable', false);
    createDiv.classList.add('create-image-section');
    createUploadIcon.setAttribute('icon', 'solar:add-square-bold');
    createLabel.appendChild(createUploadIcon);
    createLabel.setAttribute('for', 'image-file-input');
    createDiv.appendChild(createLabel);
    createFileInput.setAttribute('id', 'image-file-input');
    createDiv.appendChild(createFileInput);
    createText.textContent = 'or';
    createDiv.appendChild(createText);
    createTextInput.placeholder = 'enter link';
    createDiv.appendChild(createTextInput);
    createTickIcon.setAttribute('icon', 'teenyicons:tick-circle-outline');
    createTickIcon.classList.add('media-tick-icon');
    createTickIcon.onclick = function(){
        completeAdd();
    };
    createDiv.appendChild(createTickIcon);
    createImage.classList.add('image');
    createImageDiv.appendChild(createDiv);
    createImageDiv.appendChild(createImage);
    createImageDiv.classList.add('create-image-div');
    createImageDiv.contentEditable = false;
    content.appendChild(createImageDiv);
    
    const imageFileInput = document.getElementById('image-file-input');
        imageFileInput.addEventListener('change', function(event){
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            createImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    createTextInput.addEventListener('change', function(){
        createImage.src = createTextInput.value;
    });

    function completeAdd(){
        const sourceSelector = document.getElementById('image-file-input').parentElement;
        sourceSelector.remove();
        const emptyLine = document.createElement('div');
        emptyLine.style.height = '20px';
        emptyLine.className = 'empty-line';
        content.appendChild(emptyLine);
        createImageDiv.classList.add('resizable');
    }
}

function addVideo(){
    const createVideoDiv = document.createElement('div');
    const createDiv = document.createElement('div');
    const createText = document.createElement('p');
    const createLabel = document.createElement('label');
    const createVideo = document.createElement('video');
    const createUploadIcon = document.createElement('iconify-icon');
    const createTickIcon = document.createElement('iconify-icon');
    const createFileInput = document.createElement('input');
    createFileInput.setAttribute('type', 'file');
    const createTextInput = document.createElement('input');
    createTextInput.setAttribute('type', 'text');
    createDiv.setAttribute('contenteditable', false);
    createDiv.classList.add('create-video-section');
    createUploadIcon.setAttribute('icon', 'solar:add-square-bold');
    createLabel.appendChild(createUploadIcon);
    createLabel.setAttribute('for', 'video-file-input');
    createDiv.appendChild(createLabel);
    createFileInput.setAttribute('id', 'video-file-input');
    createFileInput.setAttribute('accept', 'video/*');
    createDiv.appendChild(createFileInput);
    createText.textContent = 'or';
    createDiv.appendChild(createText);
    createTextInput.placeholder = 'enter link';
    createDiv.appendChild(createTextInput);
    createTickIcon.setAttribute('icon', 'teenyicons:tick-circle-outline');
    createTickIcon.classList.add('media-tick-icon');
    createTickIcon.onclick = function(){
        completeAdd();
    };
    createDiv.appendChild(createTickIcon);
    createVideo.classList.add('video');
    createVideo.controls = true;
    createVideoDiv.appendChild(createDiv);
    createVideoDiv.appendChild(createVideo);
    createVideoDiv.classList.add('create-video-div');
    createVideoDiv.contentEditable = false;
    content.appendChild(createVideoDiv);
    
    const videoFileInput = document.getElementById('video-file-input');
        videoFileInput.addEventListener('change', function(event){
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            createVideo.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    createTextInput.addEventListener('change', function(){
        createVideo.src = createTextInput.value;
    });

    function completeAdd(){
        const sourceSelector = document.getElementById('video-file-input').parentElement;
        sourceSelector.remove();
        const emptyLine = document.createElement('div');
        emptyLine.style.height = '20px';
        emptyLine.className = 'empty-line';
        content.appendChild(emptyLine);
        createVideoDiv.classList.add('resizable');
    }
}


interact('.resizable')
.draggable({
    listeners: {
        move(event) {
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }
    }
});

interact('.resizable')
.resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
        move(event) {
            let { target } = event;
            let newWidth = event.rect.width;
            let newHeight = event.rect.height;
            const aspectRatio = target.offsetWidth / target.offsetHeight;
            const isCorner = (event.edges.left && event.edges.top) || 
                             (event.edges.right && event.edges.top) || 
                             (event.edges.left && event.edges.bottom) || 
                             (event.edges.right && event.edges.bottom);
            if (isCorner) {
                if (newWidth / newHeight > aspectRatio) {
                    newWidth = newHeight * aspectRatio;
                } else {
                    newHeight = newWidth / aspectRatio;
                }
            }
            target.style.width = `${newWidth}px`;
            target.style.height = `${newHeight}px`;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            target.style.transform = `translate(${x}px, ${y}px)`;
        }
    }
});