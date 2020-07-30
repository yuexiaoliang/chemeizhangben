const path = require('path');
const fs = require('fs');

const { ipcRenderer } = require('electron');

import { defaultDataDir } from '../../../common/all_path.js';
import { settingTemplate } from './contentTemplates.js';
import { appName } from '../../../common/all_path.js';
import passwordVerification from '../../../common/password_verification.js';
import { SwitchPage } from './switchPage.js';
import { verifyPassword, getDB, createDir } from '../../../common/tool.js';

class SwithSetting extends SwitchPage {
    switchPage() {
        document.addEventListener('click', (e) => {
            for (let i = 0; i < e.path.length; i++) {
                const element = e.path[i];
                if (element.nodeType === 1) {
                    if (
                        element.hasAttribute('switch-page') &&
                        element.getAttribute('switch-page') ===
                            this.options.page
                    ) {
                        verifyPassword(() => {
                            const headerTitleElement = document.querySelector(
                                '.app-header .header-title'
                            );
                            headerTitleElement.innerHTML = this.options.title;
                            document.querySelector(
                                '.app-main'
                            ).innerHTML = this.options.html;
                            this.callback(
                                document.querySelector('.app-main').children[0]
                            );
                        });
                    }
                }
            }
        });
    }
}
new SwithSetting(
    {
        page: 'setting',
        title: '设置',
        html: settingTemplate,
    },
    (settingElement) => {
        const settingsDBPath = path.join(defaultDataDir, 'settings-db.json');
        const settingsDB = getDB(settingsDBPath);

        class SettingOptions {
            constructor(options) {
                this.options = options;
                this.data = null;
                this.init();
                this.createHtml();
                this.addOptions();
                this.deleteOptions();
            }
            init() {
                if (!settingsDB.has(this.options.dataKey).value()) {
                    settingsDB.set(this.options.dataKey, []).write();
                } else {
                    if (
                        !Array.isArray(
                            settingsDB.get(this.options.dataKey).value()
                        )
                    ) {
                        settingsDB.set(this.options.dataKey, []).write();
                    }
                }
            }
            createHtml() {
                this.data = settingsDB.get(this.options.dataKey).value();
            }
            addOptions() {
                // 所有 input 失去焦点
                for (
                    let i = 0;
                    i < this.options.nodes.inputElement.length;
                    i++
                ) {
                    const input = this.options.nodes.inputElement[i];
                    input.addEventListener('blur', () => {
                        this.options.nodes.hintElement.style.display = 'none';
                        this.options.nodes.hintElement.innerHTML = '';
                    });
                }

                // name输入框失去焦点
                this.options.nodes.nameElement.addEventListener('blur', (e) => {
                    if (!this.options.nodes.nameElement.value.trim()) {
                        this.options.nodes.nameElement.value = '';
                    }
                });
            }
            deleteOptions() {
                const listElement = this.options.nodes.listElement;
                listElement.addEventListener('click', (e) => {
                    const target = e.target;
                    const lis = listElement.querySelectorAll('li');
                    for (let i = 0; i < lis.length; i++) {
                        const li = lis[i];
                        li.setAttribute('data-index', i);
                    }
                    if (target.classList.contains('delete')) {
                        const li = target.parentNode;
                        const liIndex = li.getAttribute('data-index') * 1;
                        settingsDB
                            .get(this.options.dataKey)
                            .splice(liIndex, 1)
                            .write();
                        listElement.removeChild(li);
                    }
                });
            }
        }
        class SettingServeOptions extends SettingOptions {
            createHtml() {
                super.createHtml();
                let html = '';
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    html += `
                <li>
                    <span class="item name">${item[0]}</span>
                    <span class="item price">￥${item[1]}</span>
                    <span class="item delete iconfont icon-shanchu"></span>
                </li>
            `;
                }
                this.options.nodes.listElement.innerHTML = html;
            }
            addOptions() {
                super.addOptions();
                // 添加按钮点击事件
                this.options.nodes.addElement.addEventListener('click', () => {
                    const nameElementValue = this.options.nodes.nameElement.value.trim();
                    const priceElementValue = this.options.nodes.priceElement
                        .value;

                    // 如果名称为空
                    if (!nameElementValue) {
                        this.options.nodes.hintElement.style.display = 'flex';
                        this.options.nodes.hintElement.innerHTML =
                            '请输入项目名称';
                        this.options.nodes.nameElement.value = '';
                        this.options.nodes.nameElement.focus();
                        return;
                    }

                    // 如果价格为空
                    if (!priceElementValue) {
                        this.options.nodes.hintElement.style.display = 'flex';
                        this.options.nodes.hintElement.innerHTML = '请输入价格';
                        this.options.nodes.priceElement.value = '';
                        this.options.nodes.priceElement.focus();
                        return;
                    }

                    // 清空名称和价格输入框
                    this.options.nodes.nameElement.value = this.options.nodes.priceElement.value =
                        '';

                    // 更新数据库
                    settingsDB
                        .get(this.options.dataKey)
                        .push([nameElementValue, priceElementValue])
                        .write();

                    // 更新HTML
                    this.options.nodes.listElement.innerHTML += `
                        <li>
                            <span class="item name">${nameElementValue}</span>
                            <span class="item price">￥${priceElementValue}</span>
                            <span class="item delete iconfont icon-shanchu"></span>
                        </li>
                    `;
                });
            }
        }
        class SettingTypeOptions extends SettingOptions {
            createHtml() {
                super.createHtml();
                let html = '';
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    html += `
                <li>
                    <span class="item name">${item}</span>
                    <span class="item delete iconfont icon-shanchu"></span>
                </li>
            `;
                }
                this.options.nodes.listElement.innerHTML = html;
            }
            addOptions() {
                super.addOptions();
                // 添加按钮点击事件
                this.options.nodes.addElement.addEventListener('click', () => {
                    const nameElementValue = this.options.nodes.nameElement.value.trim();

                    // 如果名称为空
                    if (!nameElementValue) {
                        this.options.nodes.hintElement.style.display = 'flex';
                        this.options.nodes.hintElement.innerHTML = '车牌照前缀';
                        this.options.nodes.nameElement.value = '';
                        this.options.nodes.nameElement.focus();
                        return;
                    }

                    // 清空名称和价格输入框
                    this.options.nodes.nameElement.value = '';

                    // 更新数据库
                    settingsDB
                        .get(this.options.dataKey)
                        .push(nameElementValue)
                        .write();

                    // 更新HTML
                    this.options.nodes.listElement.innerHTML += `
                        <li>
                            <span class="item name">${nameElementValue}</span>
                            <span class="item delete iconfont icon-shanchu"></span>
                        </li>
                    `;
                });
            }
        }

        // 会员用户结算项目
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-member-serve-options .box-detail'
            );
            const formElement = optionsElement.querySelector('.form');

            new SettingServeOptions({
                dataKey: 'memberServeOptions',
                nodes: {
                    addElement: formElement.querySelector('.add'),
                    inputElement: formElement.querySelectorAll('input'),
                    nameElement: formElement.querySelector('.name'),
                    priceElement: formElement.querySelector('.price'),
                    hintElement: formElement.querySelector('.hint'),
                    listElement: optionsElement.querySelector('.list'),
                },
            });
        })();

        // 普通用户结算项目
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-common-serve-options .box-detail'
            );
            const formElement = optionsElement.querySelector('.form');

            new SettingServeOptions({
                dataKey: 'commonServeOptions',
                nodes: {
                    addElement: formElement.querySelector('.add'),
                    inputElement: formElement.querySelectorAll('input'),
                    nameElement: formElement.querySelector('.name'),
                    priceElement: formElement.querySelector('.price'),
                    hintElement: formElement.querySelector('.hint'),
                    listElement: optionsElement.querySelector('.list'),
                },
            });
        })();

        // 车牌照前缀
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-license-plate-prefix .box-detail'
            );
            const formElement = optionsElement.querySelector('.form');

            new SettingTypeOptions({
                dataKey: 'licensePlatePrefixOptions',
                nodes: {
                    addElement: formElement.querySelector('.add'),
                    inputElement: formElement.querySelectorAll('input'),
                    nameElement: formElement.querySelector('.name'),
                    hintElement: formElement.querySelector('.hint'),
                    listElement: optionsElement.querySelector('.list'),
                },
            });
        })();

        // 默认车牌照前缀
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-license-plate-prefix-default .box-detail'
            );
            const inputElement = optionsElement.querySelector('.form input');
            const saveElement = optionsElement.querySelector('.save');
            const licensePlatePrefixOptionsDefault = settingsDB
                .get('licensePlatePrefixOptionsDefault')
                .value();
            if (licensePlatePrefixOptionsDefault) {
                inputElement.value = licensePlatePrefixOptionsDefault;
            }
            inputElement.addEventListener('input', () => {
                const inputVal = inputElement.value;
                if (inputVal !== licensePlatePrefixOptionsDefault) {
                    saveElement.classList.add('true');
                } else {
                    saveElement.classList.remove('true');
                }
            });
            saveElement.addEventListener('click', () => {
                if (saveElement.classList.contains('true')) {
                    settingsDB
                        .set(
                            'licensePlatePrefixOptionsDefault',
                            inputElement.value
                        )
                        .write();
                    saveElement.classList.remove('true');
                }
            });
        })();

        // 车辆类型
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-car-type .box-detail'
            );
            const formElement = optionsElement.querySelector('.form');

            new SettingTypeOptions({
                dataKey: 'carTypeOptions',
                nodes: {
                    addElement: formElement.querySelector('.add'),
                    inputElement: formElement.querySelectorAll('input'),
                    nameElement: formElement.querySelector('.name'),
                    hintElement: formElement.querySelector('.hint'),
                    listElement: optionsElement.querySelector('.list'),
                },
            });
        })();

        // 数据储存目录
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-data-location .box-detail'
            );
            const saveElement = optionsElement.querySelector('.save');
            const locationElement = optionsElement.querySelector(
                '.form .location'
            );
            const changeElement = optionsElement.querySelector('.form .change');
            const openElement = optionsElement.querySelector('.form .open');

            locationElement.value = settingsDB.get('dataDir').value();
            changeElement.addEventListener('click', () => {
                const dialogRest = ipcRenderer.sendSync('select-dir');
                if (!dialogRest.canceled) {
                    locationElement.value = path.join(
                        dialogRest.filePaths[0],
                        appName
                    );
                    saveElement.classList.add('true');
                }
            });
            saveElement.addEventListener('click', () => {
                if (saveElement.classList.contains('true')) {
                    const dataDir = locationElement.value;
                    settingsDB.set('dataDir', dataDir).write();
                    const dataDirPath = createDir(
                        path.join(dataDir, 'database')
                    ); // 数据保存的文件夹路径
                    getDB(path.join(dataDirPath, 'member.json'));
                    getDB(path.join(dataDirPath, 'ordinary.json'));
                    saveElement.classList.remove('true');
                }
            });
            openElement.addEventListener('click', () => {
                ipcRenderer.sendSync('open-dir', locationElement.value);
            });
        })();

        // 程序密码
        (() => {
            const optionsElement = settingElement.querySelector(
                '.setting-password .box-detail'
            );
            const saveElement = optionsElement.querySelector('.save');
            const hintElement = optionsElement.querySelector('.hint');
            const passwordElement = optionsElement.querySelector(
                '.form .password'
            );
            const lookElement = optionsElement.querySelector('.form .look');

            passwordElement.value = settingsDB.get('password').value();
            lookElement.addEventListener('click', () => {
                if (passwordElement.getAttribute('type') === 'password') {
                    passwordElement.setAttribute('type', 'text');
                    lookElement.classList.remove('icon-icon_chakanmima_guan');
                    lookElement.classList.add('icon-icon_chakanmima_kai');
                } else {
                    passwordElement.setAttribute('type', 'password');
                    lookElement.classList.remove('icon-icon_chakanmima_kai');
                    lookElement.classList.add('icon-icon_chakanmima_guan');
                }
            });
            passwordElement.addEventListener('input', () => {
                const passwordVal = passwordElement.value;
                if (passwordVal !== settingsDB.get('password').value()) {
                    saveElement.classList.add('true');
                } else {
                    saveElement.classList.remove('true');
                }
            });
            passwordElement.addEventListener('focus', () => {
                hintElement.innerHTML = '';
            });
            saveElement.addEventListener('click', () => {
                if (saveElement.classList.contains('true')) {
                    const passwordVal = passwordElement.value;
                    if (!passwordVerification(passwordVal)) {
                        hintElement.innerHTML = '密码格式错误';
                    } else {
                        passwordElement.value = settingsDB
                            .set('password', passwordVal)
                            .write();
                        passwordElement.value = settingsDB
                            .get('password')
                            .value();
                        passwordElement.setAttribute('type', 'password');
                        lookElement.classList.remove(
                            'icon-icon_chakanmima_kai'
                        );
                        lookElement.classList.add('icon-icon_chakanmima_guan');
                        saveElement.classList.remove('true');
                    }
                }
            });
        })();
    }
);
