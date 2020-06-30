const { ipcRenderer } = require('electron');
const path = require('path');
const fs = require('fs');

const homePath = ipcRenderer.sendSync('get-home-path'); // 用户家目录
const appName = ipcRenderer.sendSync('get-app-name'); // 程序名称
const defaultDataDir = path.join(homePath, appName); // 默认数据储存目录

export { homePath, appName, defaultDataDir };
