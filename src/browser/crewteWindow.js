const path = require('path');
const fs = require('fs');

const { app, BrowserWindow } = require('electron');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let win;

app.whenReady().then(() => {
    const appSettingsPath = path.join(
        app.getPath('home'),
        app.getName(),
        'settings-db.json'
    );
    if (!fs.existsSync(appSettingsPath)) {
        createInitWindow();
    } else {
        const adapter = new FileSync(appSettingsPath);
        const db = low(adapter);
        const password = db.get('password').value();
        const dataDir = db.get('dataDir').value();
        if (!password || !dataDir) {
            createInitWindow();
            return;
        }
        if (dataDir) {
            if (!fs.existsSync(dataDir)) {
                try {
                    fs.mkdirSync(dataDir, {
                        recursive: true,
                    });
                } catch (err) {
                    createInitWindow();
                    return;
                }
            }
        }
        createMainWindow();
    }
});

function createMainWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('pages/index.html');
    win.webContents.openDevTools();
}

function createInitWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 500,
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('pages/init_setting.html');
    win.webContents.openDevTools();
}
