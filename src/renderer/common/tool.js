const path = require('path');
const fs = require('fs');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

import { defaultDataDir } from '../common/all_path.js';
import { verifyPasswordTemplate } from './html_templates.js';

/**
 * 获取数据
 * @param {String} dbPath 数据的路径
 */
export function getDB(dbPath) {
    const adapter = new FileSync(dbPath);
    return low(adapter);
}

/**
 * 创建目录
 * @param {String} dirPath 目录路径
 */
export function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
            console.error(err);
        }
    }
    return dirPath;
}

/**
 *
 * @param {*} contentHtml
 */
export function createShade(contentHtml) {
    const body = document.querySelector('body');
    const appShadeElement = document.createElement('div');
    const closeElement = document.createElement('span');
    const contentElement = document.createElement('div');

    appShadeElement.classList.add('app-shade');
    closeElement.classList.add('close', 'iconfont', 'icon-close');
    contentElement.classList.add('content');
    contentElement.innerHTML = contentHtml;

    appShadeElement.appendChild(closeElement);
    appShadeElement.appendChild(contentElement);
    body.appendChild(appShadeElement);

    closeElement.addEventListener('click', () => {
        body.removeChild(appShadeElement);
    });

    return appShadeElement;
}

/**
 * 验证密码弹出框
 * @param {Function} fn 回调函数
 */
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
        hint.innerHTML = '';
    });
    passwordButton.addEventListener('click', () => {
        if (passwordInput.value === password) {
            body.removeChild(appShadeElement);
            fn();
            return true;
        } else {
            hint.innerHTML = '密码输入错误！';
            return false;
        }
    });
}

/**
 * 创建选项
 */
export class CreateSelect {
    constructor(opsions) {
        this.el = opsions.el;
        this.data = opsions.data;
        this.elOffsetTop = this.el.offsetTop;
        this.elOffsetLeft = this.el.offsetLeft;
        this.elParentNode = this.el.parentNode;
        this.elWidth = this.el.offsetWidth;
        this.elHeight = this.el.offsetHeight;
        this.selectElement = null;
        this.create();
        this.createNode();
        this.deleteNode();
        this.select();
    }
    create() {
        this.selectElement = document.createElement('div');
        this.selectElement.classList.add('select');
        let selectHtml = '';
        for (let i = 0; i < this.data.length; i++) {
            const item = this.data[i];
            selectHtml += `<div class="item">${item}</div>`;
        }
        this.selectElement.innerHTML = selectHtml;
        this.selectElement.style.position = 'absolute';
        this.selectElement.style.top =
            this.elOffsetTop + this.elHeight + 2 + 'px';
        this.selectElement.style.left = this.elOffsetLeft + 'px';
        this.selectElement.style.zIndex = 999;
        this.selectElement.style.width = this.elWidth + 'px';
    }
    createNode() {
        this.el.addEventListener('focus', () => {
            if (this.elParentNode.contains(this.selectElement)) {
                return;
            }
            this.elParentNode.insertBefore(
                this.selectElement,
                this.el.nextSibling
            );
        });
    }
    deleteNode() {
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (this.el.nextSibling === this.selectElement) {
                if (target !== this.el) {
                    this.elParentNode.removeChild(this.selectElement);
                }
            }
        });
    }
    select() {
        this.selectElement.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('item')) {
                this.el.value = target.innerText.trim();
                this.elParentNode.removeChild(this.selectElement);
            }
        });
    }
}
