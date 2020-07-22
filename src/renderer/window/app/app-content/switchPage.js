import { getDB } from '../../../common/tool.js';

export class SwitchPage {
    constructor(options, fn) {
        this.options = options;
        this.callback = fn;
        this.switchPage();
    }
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
                        const headerTitleElement = document.querySelector(
                            '.app-header .header-title'
                        );
                        headerTitleElement.innerHTML = this.options.title;
                        document.querySelector(
                            '.app-main'
                        ).innerHTML = this.options.html;
                        this.callback(
                            document.querySelector('.app-main').children[0],
                            element.getAttribute('data-id')
                        );
                    }
                }
            }
        });
    }
}
