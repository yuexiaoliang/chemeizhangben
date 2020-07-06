const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require('electron');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let win, tray;

app.whenReady().then(() => {
    const appSettingsPath = path.join(
        app.getPath('home'),
        app.getName(),
        'settings-db.json'
    );
    if (!fs.existsSync(appSettingsPath)) {
        createInitWindow();
    } else {
        try {
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
        } catch (error) {
            createInitWindow();
            return;
        }
        createMainWindow();
    }
});

// 完成初始化时被触发
app.on('ready', () => {
    createTray();
});
//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 程序退出前事件
app.on('before-quit', () => {
    // 销毁托盘图标
    tray.destroy();
});

// -------- ipc -------- //
// 关闭窗口
ipcMain.on('win-close', () => {
    win.close();
});

// 刷新窗口
ipcMain.on('win-reload', () => {
    win.reload();
});

// 最小化窗口
ipcMain.on('win-minimize', () => {
    win.minimize();
});

// 重启程序
ipcMain.on('relaunch-app', () => {
    app.relaunch();
    app.exit(0);
});

// 获取用户家目录
ipcMain.on('get-home-path', (event) => {
    event.returnValue = app.getPath('home');
});

// 获取程序名
ipcMain.on('get-app-name', (event) => {
    event.returnValue = app.getName();
});

// 选择文件夹
ipcMain.on('open-dir', (event) => {
    dialog
        .showOpenDialog({
            properties: ['openDirectory'],
        })
        .then((result) => {
            event.returnValue = result;
        })
        .catch((err) => {
            console.log(err);
        });
});

function createMainWindow() {
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
        },
        backgroundColor: '#ffffff',
        resizable: false,
        frame: false,
        show: false,
        icon: 'resources/tray.png',
    });

    win.loadFile('pages/index.html');

    // 取消打开时窗口闪烁
    win.once('ready-to-show', () => {
        setTimeout(() => {
            win.show();
        }, 500);
    });
    win.webContents.openDevTools();
}

function createInitWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        },
        center: true,
        backgroundColor: '#ffffff',
        resizable: false,
        frame: false,
        show: false,
        icon: 'resources/tray.png',
    });

    win.loadFile('pages/init.html');

    // 取消打开时窗口闪烁
    win.once('ready-to-show', () => {
        setTimeout(() => {
            win.show();
        }, 500);
    });

    // 打开控制台
    win.webContents.openDevTools();
}

function createTray() {
    tray = new Tray('resources/tray48X48.ico');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' },
    ]);
    tray.setToolTip('车美账本');
    tray.setContextMenu(contextMenu);
}
