const path = require('path');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

export function getDB(dbPath) {
    const adapter = new FileSync(dbPath);
    return low(adapter);
}
import { defaultDataDir } from '../common/all_path.js';

import { verifyPasswordTemplate } from './html_templates.js';

export function createShade(contentHtml) {
    const body = document.querySelector('body');
    const appShadeElement = document.createElement('div');
    const closeElement = document.createElement('span');
    const contentElement = document.createElement('div');

    appShadeElement.classList.add('app-shade');
    closeElement.classList.add('close', 'iconfont', 'icon-guanbi1');
    contentElement.classList.add('content');
    contentElement.innerHTML = contentHtml;

    appShadeElement.appendChild(closeElement);
    appShadeElement.appendChild(contentElement);
    body.appendChild(appShadeElement);

    closeElement.addEventListener('click', () => {
        body.removeChild(appShadeElement);
    });
    appShadeElement.addEventListener('click', () => {
        body.removeChild(appShadeElement);
    });
    contentElement.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    return appShadeElement;
}

export function verifyPassword(fn) {
    const settingsDBPath = path.join(defaultDataDir, 'settings-db.json');
    const settingsDB = getDB(settingsDBPath);
    const password = settingsDB.get('password').value();

    const body = document.querySelector('body');
    const appShadeElement = createShade(verifyPasswordTemplate);
    const verifyPasswordElement = appShadeElement.querySelector(
        '.verify-password'
    );
    const passwordInput = verifyPasswordElement.querySelector(
        '.form .password'
    );
    const passwordButton = verifyPasswordElement.querySelector(
        '.form .confirm'
    );
    const hint = verifyPasswordElement.querySelector('.hint');
    passwordInput.addEventListener('focus', () => {
        hint.style.display = 'none';
        hint.innerHTML = '';
    });
    passwordButton.addEventListener('click', () => {
        if (passwordInput.value === password) {
            body.removeChild(appShadeElement);
            fn();
            return true;
        } else {
            hint.style.display = 'block';
            hint.innerHTML = '密码输入错误！';
            return false;
        }
    });
}
