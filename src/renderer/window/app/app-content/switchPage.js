const path = require('path');

import { defaultDataDir } from '../../../common/all_path.js';
import { getDB } from '../../../common/tool.js';
import { settingTemplate } from './contentTemplates.js';

class SwitchPage {
    constructor(html, dbPath) {
        this.html = html;
        this.dbPath = dbPath;
    }
    getDB() {
        return getDB(this.dbPath);
    }
    createHtml() {
        const appMain = document.querySelector('.app-main');
        appMain.innerHTML = this.html;
        return appMain.children[0];
    }
}

// 设置页

const settingsDBPath = path.join(defaultDataDir, 'settings-db.json');
export const setting = new SwitchPage(settingTemplate, settingsDBPath);
