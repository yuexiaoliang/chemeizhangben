import { getDB } from '../../../common/tool.js';

export class SwitchPage {
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
