const { ipcRenderer } = require('electron');

const windowControlElement = document.querySelector(
    '.app-header .window-control'
);
const reloadBtn = windowControlElement.querySelector('.reload');
const closeBtn = windowControlElement.querySelector('.close');
const minimizeBtn = windowControlElement.querySelector('.minimize');

const appSide = document.querySelector('.app-side');

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('win-close');
});

reloadBtn.addEventListener('click', () => {
    ipcRenderer.send('win-reload');
});

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('win-minimize');
});
