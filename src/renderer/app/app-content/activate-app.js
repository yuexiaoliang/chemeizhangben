const { ipcRenderer } = require('electron');

import { getDB, getMAC, activationCodeDecryption } from '../../common/tool.js';
import { PopUp } from '../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { activateAppTemplate } from './contentTemplates.js';

new SwitchPage(
    {
        page: 'activate-app',
        title: '激活程序',
        html: activateAppTemplate,
    },
    function (activateAppElement) {
        const identifier = activateAppElement.querySelector('.identifier');
        const keyBox = activateAppElement.querySelector('.key-box');
        const activateButton = activateAppElement.querySelector(
            '.activate-button'
        );
        const settingsDB = getDB.settings();
        const mac = getMAC();
        identifier.innerHTML = mac;
        activateButton.addEventListener('click', () => {
            const code = keyBox.value;
            try {
                if (activationCodeDecryption(code) !== mac) {
                    PopUp.hint({ msg: '激活码错误' });
                } else {
                    settingsDB.set('activationCode', code).write();
                    PopUp.hint({ msg: '激活成功！' }, () => {
                        ipcRenderer.send('win-reload');
                    });
                }
            } catch (error) {
                PopUp.hint({ msg: '激活失败' });
            }
        });
    }
);
