const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let win;

app.whenReady().then(() => {
    const documentsPath = app.getPath('documents');
    const appDocumentsPath = path.join(documentsPath, app.getName());
    const settingsPath = path.join(appDocumentsPath, 'settings.json');
    const ordinaryPath = path.join(appDocumentsPath, 'ordinary.json');
    const membersPath = path.join(appDocumentsPath, 'members.json');

    // 如果程序数据文件夹不存在，则创建
    if (!fs.existsSync(appDocumentsPath)) {
        try {
            fs.mkdirSync(appDocumentsPath, {
                recursive: true,
            });
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 如果程序设置数据文件不存在则创建，并初始化
    if (!fs.existsSync(settingsPath)) {
        try {
            const adapter = new FileSync(settingsPath);
            const db = low(adapter);
            db.defaults({
                password: '8888888',
            }).write();
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }
    // 如果程序设置数据文件存在
    else {
        try {
            const adapter = new FileSync(settingsPath);
            const db = low(adapter);
            // 检测密码设置
            if (
                !db.has('password').value() ||
                !db.get('password').value() ||
                typeof db.get('password').value() !== 'string'
            ) {
                db.set('password', '8888888').write();
            }
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 如果程序会员数据文件不存在则创建，并初始化
    if (!fs.existsSync(membersPath)) {
        try {
            const adapter = new FileSync(membersPath);
            const db = low(adapter);
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 如果程序普通数据文件不存在则创建，并初始化
    if (!fs.existsSync(ordinaryPath)) {
        try {
            const adapter = new FileSync(ordinaryPath);
            const db = low(adapter);
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 创建 BrowserWindow
    win = new BrowserWindow({
        width: 1524,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
        },
        backgroundColor: '#ffffff',
        resizable: false,
        frame: false,
        show: false,
    });

    win.loadFile('pages/index.html');

    // 取消打开时窗口闪烁
    win.once('ready-to-show', () => {
        setTimeout(() => {
            win.show();
        }, 500);
    });
    win.webContents.openDevTools();
});

//当所有窗口都被关闭后退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 程序退出前事件
app.on('before-quit', () => {});

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

// 获取用户目录路径
ipcMain.on('get-path', (event, path) => {
    event.returnValue = app.getPath(path);
});

// 选择文件夹
ipcMain.on('select-dir', (event) => {
    dialog
        .showOpenDialog({
            properties: ['openDirectory'],
        })
        .then((result) => {
            event.returnValue = result;
        })
        .catch((err) => {
            dialog.showErrorBox('出错啦！！！', err);
        });
});

// 打开文件夹
ipcMain.on('open-dir', (event, dirPath) => {
    shell.showItemInFolder(dirPath);
    event.returnValue = null;
});

// 弹出错误对话框
ipcMain.on('show-error-box', (event, options) => {
    dialog.showErrorBox(options.title, options.msg);
    event.returnValue = null;
});
