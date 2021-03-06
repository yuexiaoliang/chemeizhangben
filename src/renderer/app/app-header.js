const { ipcRenderer } = require('electron');

import { getAppStatus } from '../common/tool.js';

const appHeader = document.querySelector('.app-header');
const windowControlElement = appHeader.querySelector('.window-control');
const reloadBtn = windowControlElement.querySelector('.reload');
const closeBtn = windowControlElement.querySelector('.close');
const minimizeBtn = windowControlElement.querySelector('.minimize');
const moreButton = windowControlElement.querySelector('.more > .iconfont');
const moreList = windowControlElement.querySelector('.more > .list');

// 如果程序是未激活状态，添加未激活按钮
if (!getAppStatus()) {
    const unregisteredElement = document.createElement('div');
    unregisteredElement.classList.add('unregistered');
    unregisteredElement.setAttribute('switch-page', 'activate-app');
    appHeader.insertBefore(unregisteredElement, appHeader.children[1]);
}

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('win-close');
});

reloadBtn.addEventListener('click', () => {
    ipcRenderer.send('win-reload');
});

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('win-minimize');
});

moreButton.addEventListener('click', (e) => {
    e.stopPropagation();
    moreList.classList.toggle('show');
});
document.addEventListener('click', () => {
    if (moreList.classList.contains('show')) {
        moreList.classList.remove('show');
    }
});
