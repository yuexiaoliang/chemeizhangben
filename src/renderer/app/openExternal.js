const shell = require('electron').shell;

/**
 * 在浏览器中打开 a 标签的 href
 */
document.addEventListener('click', (e) => {
    for (let i = 0; i < e.path.length; i++) {
        const element = e.path[i];
        if (
            element.nodeType === 1 &&
            element.nodeName === 'A' &&
            element.href
        ) {
            e.preventDefault();
            shell.openExternal(element.href);
        }
    }
});
