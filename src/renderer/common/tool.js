const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const { ipcRenderer } = require('electron');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const getmac = require('getmac');

// 获取常用路径
export const getPath = {
    userDocuments() {
        return ipcRenderer.sendSync('get-path', 'documents');
    },
    appDocuments() {
        return path.join(
            this.userDocuments(),
            ipcRenderer.sendSync('get-app-name')
        );
    },
    settings() {
        return path.join(this.appDocuments(), 'settings.json');
    },
    members() {
        return path.join(this.appDocuments(), 'members.json');
    },
    ordinary() {
        return path.join(this.appDocuments(), 'ordinary.json');
    },
};

// 获取数据
export const getDB = {
    settings() {
        let adapter = new FileSync(getPath.settings());
        return low(adapter);
    },
    members() {
        let adapter = new FileSync(getPath.members());
        return low(adapter);
    },
    ordinary() {
        let adapter = new FileSync(getPath.ordinary());
        return low(adapter);
    },
};

/**
 * 获取数据库中的 MAC 地址
 */
export function getDBMAC() {
    const settingsDB = getDB.settings();
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

/**
 * 检测激活码
 * @param {String} str 激活码
 */
export function activationCodeDecryption(str) {
    const rsaPubKey = fs
        .readFileSync(path.join(__dirname, '../rsa_public_key.pem'))
        .toString();
    let code = crypto
        .publicDecrypt(rsaPubKey, Buffer.from(str, 'hex'))
        .toString('utf8');
    const reg = /\s/gi;
    return code.replace(reg, '');
}

/**
 * 验证密码格式是否符合
 * @param {String} val 密码
 */
export function passwordVerification(val) {
    const pwdRegex = /^([0-9a-zA-Z]){6,16}$/;
    return pwdRegex.test(val);
}

/**
 * 验证密码弹出框
 * @param {Function} fn 回调函数
 */
export function verifyPassword(callback) {
    const settingsDB = getDB.settings();
    const password = settingsDB.get('password').value();
    const verifyPasswordElement = document.createElement('div');
    verifyPasswordElement.classList.add('verify-password');
    verifyPasswordElement.innerHTML = `
        <input type="password" placeholder="输入密码，按Enter键确认">
        <p class="hint"></p> 
    `;
    document.body.appendChild(verifyPasswordElement);

    const passwordInput = verifyPasswordElement.querySelector('input');
    const passwordHint = verifyPasswordElement.querySelector('.hint');

    passwordInput.focus();
    passwordInput.addEventListener('keypress', (e) => {
        if (e.charCode === 13) {
            const val = passwordInput.value;
            if (!val && password !== '') {
                passwordHint.innerHTML = '请输入密码';
                return;
            }
            if (val !== password) {
                passwordHint.innerHTML = '密码错误';
                return;
            }
            if (val === password) {
                callback && callback();
                document.body.removeChild(verifyPasswordElement);
            }
        }
    });
    passwordInput.addEventListener('input', () => {
        if (passwordHint.innerHTML) {
            passwordHint.innerHTML = '';
        }
    });
    passwordInput.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    verifyPasswordElement.addEventListener('click', () => {
        document.body.removeChild(verifyPasswordElement);
    });
}

/**
 * 创建下拉选项
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

/**
 * 创建目录
 * @param {String} dirPath 目录路径
 */
export function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        } catch (err) {
            ipcRenderer.sendSync('show-error-box', {
                title: '出错啦！！！',
                msg: err,
            });
        }
    }
    return dirPath;
}
