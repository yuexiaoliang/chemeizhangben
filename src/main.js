const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let win;

// 阻止程序多开
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

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
                password: '888888',
                memberServeOptions: [['洗车', 30]],
                commonServeOptions: [['洗车', 35]],
                carTypeOptions: ['宝马'],
                licensePlatePrefixOptions: ['冀G'],
                licensePlatePrefixOptionsDefault: '冀G',
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
            detectionSetting(db, 'password', 'String', '888888');

            // 检测会员消费常用选项设置
            detectionSetting(db, 'memberServeOptions', 'Array', [['洗车', 30]]);

            // 检测普通用户消费常用选项设置
            detectionSetting(db, 'commonServeOptions', 'Array', [['洗车', 35]]);

            // 检测车辆类型常用选项设置
            detectionSetting(db, 'carTypeOptions', 'Array', ['宝马']);

            // 检测车牌号前缀常用选项设置
            detectionSetting(db, 'licensePlatePrefixOptions', 'Array', ['冀G']);

            // 检测车牌号前缀默认添加设置
            detectionSetting(
                db,
                'licensePlatePrefixOptionsDefault',
                'String',
                '冀G'
            );

            /**
             * 检测数据
             * @param {String} optionName 名称
             * @param {String} optionType 类型
             * @param {Type} optionVal 初始值
             */
            function detectionSetting(db, optionName, optionType, optionVal) {
                if (
                    !db.has(optionName).value() ||
                    !db.get(optionName).value() ||
                    getType(db.get(optionName).value()) !== optionType
                ) {
                    db.set(optionName, optionVal).write();
                    return;
                }
                if (
                    getType(db.get(optionName).value()) === 'Array' &&
                    !db.get(optionName).value().length
                ) {
                    db.set(optionName, optionVal).write();
                }
                function getType(data) {
                    return /^\[object\s(.*)\]$/.exec(
                        Object.prototype.toString.call(data)
                    )[1];
                }
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
            db.defaults({}).write();
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 如果程序普通数据文件不存在则创建，并初始化
    if (!fs.existsSync(ordinaryPath)) {
        try {
            const adapter = new FileSync(ordinaryPath);
            const db = low(adapter);
            db.defaults({}).write();
        } catch (err) {
            dialog.showErrorBox('出错啦！！！', err);
        }
    }

    // 创建 BrowserWindow
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
    });

    win.loadFile('pages/index.html');

    // 取消打开时窗口闪烁
    win.once('ready-to-show', () => {
        setTimeout(() => {
            win.show();
        }, 500);
    });
    // win.webContents.openDevTools();
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
