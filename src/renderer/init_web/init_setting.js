const path = require('path');
const fs = require('fs');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const { ipcRenderer } = require('electron');

import { defaultDataDir, appName, homePath } from '../common/all_path.js';
import passwordVerification from '../common/password_verification.js';

const app = document.getElementById('init_settings');
const setupCompletePath = app.querySelector(
    '.setup-complete-content .text-wrapper .path span'
);
const setupCompletePassword = app.querySelector(
    '.setup-complete-content .text-wrapper .password span'
);

// 初始化设置
const SETTINGS = {
    dataDir: defaultDataDir,
    password: 'admin888',
};

// 页面切换
(() => {
    const pagingNodes = app.querySelectorAll('.paging');
    const settingContentNodes = app.querySelectorAll('.section-content');

    app.style.width = settingContentNodes.length * 100 + 'vw';

    for (let i = 0; i < settingContentNodes.length; i++) {
        const contentNode = settingContentNodes[i];
        const pagingNodes = contentNode.querySelectorAll('.paging');
        for (let j = 0; j < pagingNodes.length; j++) {
            const pagingNode = pagingNodes[j];
            pagingNode.setAttribute('data-index', i);
        }
    }
    for (let i = 0; i < pagingNodes.length; i++) {
        const pagingNode = pagingNodes[i];
        pagingNode.addEventListener('click', (event) => {
            const target = event.target;
            const targetClassList = target.classList;
            const targetIndex = target.getAttribute('data-index') * 1;

            if (targetClassList.contains('next')) {
                app.style.transform = `translateX(-${
                    (targetIndex + 1) * 100
                }vw)`;
            } else if (targetClassList.contains('prev')) {
                app.style.transform = `translateX(-${
                    (targetIndex - 1) * 100
                }vw)`;
            }
        });
    }
})();

// 设置数据储存目录
(() => {
    const selectDirNode = app.querySelector(
        '.data-location-content .path-setting-wrapper .select'
    );
    const dataLocationPathNode = app.querySelector(
        '.data-location-content .path-setting-wrapper .data-location-path'
    );
    dataLocationPathNode.value = defaultDataDir;
    setupCompletePath.innerText = defaultDataDir;
    selectDirNode.addEventListener('click', () => {
        const dialogRest = ipcRenderer.sendSync('open-dir');
        if (!dialogRest.canceled) {
            const dataPath = path.join(dialogRest.filePaths[0], appName);
            dataLocationPathNode.value = setupCompletePath.innerHTML = SETTINGS[
                'dataDir'
            ] = dataPath;
        }
    });
    dataLocationPathNode.addEventListener('change', () => {
        setupCompletePath.innerHTML = SETTINGS['dataDir'] =
            dataLocationPathNode.value;
    });
})();

// 设置密码
(() => {
    const passwordInputBoxs = app.querySelectorAll(
        '.password-content .password-setting-wrapper .box'
    );
    const input_1 = passwordInputBoxs[0].querySelector('.password-input');
    const hint_1 = passwordInputBoxs[0].querySelector('.hint');
    const hint_1_html = hint_1.innerHTML;
    const input_2 = passwordInputBoxs[1].querySelector('.password-input');
    const hint_2 = passwordInputBoxs[1].querySelector('.hint');
    input_1.addEventListener('focusout', () => {
        const val1 = input_1.value;
        const val2 = input_2.value;
        if (!val1) {
            hint_1.innerHTML = hint_1_html;
            return;
        }
        if (!passwordVerification(val1)) {
            hint_1.innerHTML = '密码格式错误';
            return;
        } else {
            hint_1.innerHTML = 'ok';
            if (val1 !== val2 && val2) {
                hint_2.innerHTML = '两次密码不一致';
            } else if (val1 === val2) {
                hint_2.innerHTML = 'ok';
                setupCompletePassword.innerHTML = SETTINGS.password = val1;
            }
        }
    });
    input_2.addEventListener('focus', () => {
        if (!passwordVerification(input_1.value)) {
            hint_1.innerHTML = '密码格式错误';
            input_2.value = '';
            input_1.focus();
        }
    });
    input_2.addEventListener('focusout', () => {
        const val1 = input_1.value;
        const val2 = input_2.value;
        if (!val2) {
            hint_2.innerHTML = '';
            return;
        }
        if (passwordVerification(val1)) {
            if (val1 !== val2) {
                hint_2.innerHTML = '两次密码不一致';
            } else if (val1 === val2) {
                hint_2.innerHTML = 'ok';
                setupCompletePassword.innerHTML = SETTINGS.password = val2;
            }
        }
    });
})();

// 完成设置
(() => {
    const saveSettingsBtnNode = app.querySelector(
        '.setup-complete-content .save-settings-btn'
    );
    const saveSettingsHintNode = app.querySelector(
        '.setup-complete-content .text-wrapper .hint'
    );
    saveSettingsBtnNode.addEventListener('click', () => {
        const dataDirPath = setupCompletePath.innerHTML;
        const password = setupCompletePassword.innerHTML;
        if (!passwordVerification(password)) {
            saveSettingsHintNode.innerHTML = '密码设置有误！';
            saveSettingsHintNode.classList.add('show');
            return;
        }
        if (!fs.existsSync(dataDirPath)) {
            try {
                fs.mkdirSync(dataDirPath, { recursive: true });
            } catch (err) {
                saveSettingsHintNode.innerHTML = '程序目录选择有误！';
                saveSettingsHintNode.classList.add('show');
                return;
            }
        }

        const adapter = new FileSync(
            path.join(defaultDataDir, 'settings-db.json')
        );
        const db = low(adapter);
        for (const key in SETTINGS) {
            if (SETTINGS.hasOwnProperty(key)) {
                db.set(key, SETTINGS[key]).write();
            }
        }
        ipcRenderer.sendSync('relaunch-app');
    });
})();
