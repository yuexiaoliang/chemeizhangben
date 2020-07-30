const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const getmac = require('getmac');

import { defaultDataDir } from '../common/all_path.js';
import { verifyPasswordTemplate } from './html_templates.js';
import { PopUp } from './pop_up/pop_up.js';

/**
 * 获取数据
 * @param {String} dbPath 数据的路径
 */
export function getDB(dbPath) {
    const dirPath = path.dirname(dbPath);
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
            PopUp.hint({ msg: `程序出错了: ${err}` });
        }
    }
    let adapter = new FileSync(dbPath);
    return low(adapter);
}

/**
 * 获取设置数据
 */
export function getSettingsDB() {
    return getDB(path.join(defaultDataDir, 'settings-db.json'));
}

/**
 * 获取会员数据
 */
export function getMemberDB() {
    const settingsDB = getSettingsDB();
    const memberDBPath = path.join(
        settingsDB.get('dataDir').value(),
        'database/member.json'
    );
    return getDB(memberDBPath);
}

/**
 * 获取普通消费数据
 */
export function getOrdinaryDB() {
    const settingsDB = getSettingsDB();
    const ordinaryDBPath = path.join(
        settingsDB.get('dataDir').value(),
        'database/ordinary.json'
    );
    return getDB(ordinaryDBPath);
}

/**
 * 获取数据库中的 MAC 地址
 */
export function getDBMAC() {
    const settingsDB = getSettingsDB();
    const mac = getMAC();
    if (!settingsDB.has('mac').value() || !testMAC()) {
        settingsDB.set('mac', mac).write();
        return mac;
    }

    return settingsDB.get('mac').value();

    function testMAC() {
        return settingsDB.get('mac').value() === mac ? true : false;
    }
}

/**
 * 获取本机的 MAC 地址
 */
export function getMAC() {
    return getmac.default().replace(/:/gi, ' ');
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
 * 获取程序激活状态
 */
export function getAppStatus() {
    const body = document.body;
    if (
        body.hasAttribute('data-status') &&
        body.getAttribute('data-status') === 'no'
    ) {
        return false;
    }
    return true;
}

export function activationCodeDecryption(str) {
    const rsaPubKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAocNEOd8Qx+c2nda5dzEc
yMaToinVAwqK1mxZC0LELsLP8VKApPmAgJ0qB3xArg0Gfo0Y7efnruAfM6blyDKO
SpUdx+3SAlIvQKC8a6zslC8h0TcKyPtrcONPXSJMkIAotoGzaXkaAUTBLqjkmoru
9DBQYewIP6VXa8ZqH40NMBT2YL/FmZfAYhv7pUTVKJJGOVMC6jcsVvHiH6xHMeAQ
7ft3RPCRYYGvmxVIiEdMW2p89fZPZZ4X6S/y0xhjl5ql3z3ezPj/tLKp1QUBWdrK
ynJ97tHYt7M01lJh8bGdntUIV82VcQK27kcIlpZr3J7G+4xQ3kYwFn7RXvBcXGsU
KQIDAQAB
-----END PUBLIC KEY-----`;
    return crypto
        .publicDecrypt(rsaPubKey, Buffer.from(str, 'hex'))
        .toString('utf8');
}

/**
 * 创建遮罩层
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
    PopUp.open(
        {
            addClass: 'verify-password',
            type: 'warn',
            title: '验证密码',
            msg:
                '<input class="password-input" type="password" placeholder="请输入密码"><p class="hint"></p>',
            buttons: ['确定', '取消'],
        },
        function (index) {
            if (index === 1) {
                this.removePopUp();
                return;
            }
            const popUpElement = this.getPopUp();
            const passwordInput = popUpElement.querySelector(
                '.pop-up-msg .password-input'
            );
            const hintElement = popUpElement.querySelector('.pop-up-msg .hint');
            if (passwordInput.value === password) {
                this.removePopUp();
                fn();
            } else {
                hintElement.innerHTML = '密码输入错误！';
            }
        }
    );
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

/**
 * 选项卡
 * @param {Elements} buttons 选项卡的所有切换按钮
 * @param {Elements} contents 选项卡的所有内容块
 */
export function tab(buttons, contents) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            for (let j = 0; j < buttons.length; j++) {
                buttons[j].classList.remove('active');
                contents[j].classList.remove('show');
            }
            buttons[i].classList.add('active');
            contents[i].classList.add('show');
        });
    }
}

/**
 * 模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQuery(list, keyWord) {
    const reg = new RegExp(keyWord.trim(), 'i');
    const arr = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        (() => {
            if (reg.test(item[0])) {
                for (let j = 0; j < arr.length; j++) {
                    if (item[1] === arr[j][1]) {
                        return;
                    }
                }
                arr.push(item);
            }
        })();
    }
    return arr;
}

/**
 * 节流函数
 * @param {function} fn   要运行的函数
 * @param {number}   delay 等待时间
 */
export function throttle(fn, delay) {
    let canRun = true;
    return function () {
        const context = this;
        let args = arguments;
        if (!canRun) return; // 注意，这里不能用timer来做标记，因为setTimeout会返回一个定时器id
        canRun = false;
        setTimeout(() => {
            fn.apply(context, args);
            canRun = true;
        }, delay);
    };
}
