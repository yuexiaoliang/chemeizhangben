const { app, ipcMain, dialog } = require('electron');

// 重启程序
ipcMain.on('relaunch-app', (event) => {
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
