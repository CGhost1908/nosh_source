const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require("http");
const os = require('os');
const { spawn } = require('child_process');
const fetch = require('node-fetch');
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const appServer = express();
const { google } = require("googleapis");
const url = require("url");
const port = 2222;

let loadingWindow;
let win;

function createWindow() {
    loadingWindow = new BrowserWindow({
        width: 1000,
        height: 680,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        plugins: true
    })

    loadingWindow.loadFile('loading.html');

    win = new BrowserWindow({
        icon: path.join(__dirname, 'icon.ico'),
        webSecurity: false,
        minWidth: 1000,
        minHeight: 680,
        autoHideMenuBar: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            plugins: true,
        },
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        loadingWindow.close();
        win.show();
    });

    ipcMain.on('minimize', () => {
        win.minimize();
    });

    ipcMain.on('close', () => {
        win.close();
    });

    ipcMain.on('start-server', (event, arg) => {
        startServer();
    });

    win.on('close', async (event) => {
        event.preventDefault();
        win.webContents.send('confirm-close');
    });

    ipcMain.on('proceed-close', (event, shouldClose) => {
        if(shouldClose){
            win.destroy();
        }
    });
    
    //win.webContents.openDevTools({ mode: 'detach' });

    //spotify-callback
    appServer.get('/callback', async (req, res) => {
        const code = req.query.code;

        if (!code) {
            return res.send('Authorization failed.');
        }

        const clientId = '';
        const clientSecret = '';
        const redirectUri = `http://localhost:${port}/callback`;

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        try{
            const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            }), {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, refresh_token } = response.data;

            win.webContents.send('spotify-token', {
                access_token: access_token,
                refresh_token: refresh_token
            });
        
            res.send(
                `<style>
                    body{
                        width: 100vw;
                        height: 100vh;
                        background-color: #1b1b1b;
                        color: #1db954;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                        overflow: hidden;
                        font-family: Arial, sans-serif;
                        margin: 0;
                    }
                    .spotify-connected{
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        font-size: 32px;
                        color: #1db954;
                        margin-bottom: 0;
                    }
                    .spotify-connected iconify-icon{
                        font-size: 48px;
                        margin: 10px 10px 10px 0;
                    }
                    h3{
                        font-size: 18px;
                        color:rgb(101, 104, 102);
                        margin: 0;
                    }
                    .spotify-logo{
                        margin-top: -35px;
                    }
                </style>
                <iconify-icon class="spotify-logo" width="128px" icon="logos:spotify-icon"></iconify-icon>
                <h1 class="spotify-connected">
                    <div style="display: flex; align-items: center; justify-content: center;"><iconify-icon icon="mdi:tick-circle"></iconify-icon>Spotify account linked.</div>
                </h1>
                <h3>You can close this window.</h3>
                <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
                `
            );
        }catch (error){
            console.log('Error fetching access token:', error);
            res.send('Error fetching access token.');
        }
    });


    //drive callback
    const oAuth2Client = new google.auth.OAuth2(
        "",
        "",
        `http://localhost:${port}/drive-callback`
    );

    appServer.get("/drive-callback", (req, res) => {
        const code = req.query.code;
    
        oAuth2Client.getToken(code, (err, tokens) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return;
            }
        
            oAuth2Client.setCredentials(tokens);
            
            const { access_token, refresh_token } = tokens;
            
            //setup nosh to drive
            const drive_access_token = tokens.access_token;

            oAuth2Client.setCredentials({
                access_token: drive_access_token,
            });

            const successMessage = `
                            <title>Google Drive linked.</title>
                            <style>
                                body{
                                    width: 100vw;
                                    height: 100vh;
                                    background-color: #1b1b1b;
                                    color: #fff;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex-direction: column;
                                    overflow: hidden;
                                    font-family: Arial, sans-serif;
                                    margin: 0;
                                }
                                .drive-connected{
                                    align-items: center;
                                    justify-content: center;
                                    width: 100%;
                                    font-size: 32px;
                                    margin-bottom: 0;
                                }
                                .drive-connected iconify-icon{
                                    font-size: 48px;
                                    margin: 10px 10px 10px 0;
                                }
                                h3{
                                    font-size: 18px;
                                    color:rgb(101, 104, 102);
                                    margin: 0;
                                }
                                .drive-logo{
                                    margin-top: -35px;
                                }
                            </style>
                            <iconify-icon class="drive-logo" width="128px" icon="logos:google-drive"></iconify-icon>
                            <h1 class="drive-connected">
                                <div style="display: flex; align-items: center; justify-content: center;"><iconify-icon icon="mdi:tick-circle"></iconify-icon>Google Drive linked succesfully.</div>
                            </h1>
                            <h3>You can close this window.</h3>
                            <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
                            `
        
            const drive = google.drive({ version: "v3", auth: oAuth2Client });
        
            drive.files.list({
                q: "name = 'noshTheNotepad' and mimeType = 'application/vnd.google-apps.folder'",
                fields: "files(id, name)",
            }, (err, response) => {
                if(err){
                    console.log("Folder couldnt create: " + err);
                    return;
                }
        
                const files = response.data.files;
                if(files.length){
                    console.log('noshTheNotepad already exist.');
                    win.webContents.send('drive-token', {
                        access_token: access_token,
                        refresh_token: refresh_token
                    });
                    res.send(successMessage);
                    
                }else{
                    console.log("nosh folder not exist, creating...");
                    const fileMetadata = {
                        name: "noshTheNotepad",
                        mimeType: "application/vnd.google-apps.folder",
                    };
                
                    drive.files.create({
                        resource: fileMetadata,
                        fields: "id",
                    }, (err, file) => {
                        if(err){
                            console.log("Error creating folder: " + err);
                            res.send(
                                `
                                <title>Google Drive linked.</title>
                                <style>
                                    body{
                                        width: 100vw;
                                        height: 100vh;
                                        background-color: #1b1b1b;
                                        color: #fff;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        flex-direction: column;
                                        overflow: hidden;
                                        font-family: Arial, sans-serif;
                                        margin: 0;
                                    }
                                    .drive-connected{
                                        align-items: center;
                                        justify-content: center;
                                        width: 100%;
                                        font-size: 32px;
                                        margin-bottom: 0;
                                    }
                                    .drive-connected iconify-icon{
                                        font-size: 48px;
                                        margin: 10px 10px 10px 0;
                                    }
                                    h3{
                                        font-size: 18px;
                                        color:rgb(101, 104, 102);
                                        margin: 0;
                                    }
                                    .drive-logo{
                                        margin-top: -35px;
                                    }
                                </style>
                                <iconify-icon class="drive-logo" width="128px" icon="logos:google-drive"></iconify-icon>
                                <h1 class="drive-connected">
                                    <div style="display: flex; align-items: center; justify-content: center;"><iconify-icon icon="mdi:tick-circle"></iconify-icon>Google Drive link is incomplete.</div>
                                </h1>
                                    <h3>Google Drive linked, but folder couldn't be created.</h3>
                                    <p>Please try again later.</p>
                                <script src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script>
                                `
                            );
                            return;
                        }
                        win.webContents.send('drive-token', {
                            access_token: access_token,
                            refresh_token: refresh_token
                        });

                        res.send(successMessage);
                    });
                }
            });
        });
    });


    //server
    appServer.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });


    process.on('uncaughtException', (error) => {
        if (error.message.includes('Object has been destroyed')) {
            console.error(error);
        } else {
            throw error;
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('copy-file', (event, sourcePath, destPath) => {
    fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
            event.reply('copy-result', 'Dosya kopyalanamadı: ' + err);
        } else {
            event.reply('copy-result', 'Dosya başarıyla kopyalandı!');
        }
    });
});


ipcMain.handle('save-file', async (event, data) => {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: './saves',
    });

    if (!canceled && filePath) {
      fs.writeFileSync(filePath, data);
      return filePath;
    }
    return null;
});


const savesDir = path.join(app.getPath('userData'), 'Saves');
ipcMain.handle('get-save-path', () => {
    return savesDir;
});

let saveFolder;

app.on('ready', () => {
    const roamingPath = app.getPath('userData');

    saveFolder = path.join(roamingPath, 'Saves');

    if (!fs.existsSync(saveFolder)) {
        fs.mkdirSync(saveFolder);
        console.log(`Folder created: ${saveFolder}`);
    } else {
        console.log(`Folder already exist: ${saveFolder}`);
    }
});


ipcMain.on('create-file', (event, fileName, content) => {
    const filePath = `${saveFolder}/${fileName}`;

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            event.reply('file-created', 'Error creating file');
        } else {
            event.reply('file-created', `File "${fileName}" created successfully at ${filePath}`);
        }
    });
});


//Spotify
function startServer() {
    const server = spawn('node', [path.join(__dirname, 'server.js')]);
  
    server.stdout.on('data', (data) => {
      console.log(`Server output: ${data}`);
    });
  
    server.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
    });
  
    server.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
}


