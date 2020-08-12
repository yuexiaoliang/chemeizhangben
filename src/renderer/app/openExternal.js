const shell = require('electron').shell;
const QRCode = require('qrcode');

/**
 * 在浏览器中打开 a 标签的 href
 */
document.addEventListener('click', (e) => {
    for (let i = 0; i < e.path.length; i++) {
        const nodes = e.path[i];
        if (
            nodes.nodeType === 1 &&
            nodes.hasAttribute(':href') &&
            nodes.getAttribute(':href')
        ) {
            e.stopPropagation();
            const url = nodes.getAttribute(':href');
            const title = nodes.getAttribute('title');

            const websiteShadeElement = document.createElement('div');
            websiteShadeElement.classList.add('website-shade');
            websiteShadeElement.innerHTML = `
                <div class="box">
                    <h2 class="title">使用文档</h2>
                    <canvas class="erweima"></canvas>
                    <p>扫码或者点击链接</p>
                    <div class="url"></div>
                </div>
            `;
            document.body.appendChild(websiteShadeElement);

            const titleElement = websiteShadeElement.querySelector('.title');
            const urlElement = websiteShadeElement.querySelector('.url');
            const websiteErweimeCanvas = websiteShadeElement.querySelector(
                '.erweima'
            );
            titleElement.innerText = title;
            urlElement.innerHTML = url;

            QRCode.toCanvas(
                websiteErweimeCanvas,
                url,
                { width: 200, margin: 0 },
                (error) => {
                    if (error) console.error(error);
                }
            );

            urlElement.addEventListener('click', () => {
                shell.openExternal(url);
            });
            websiteShadeElement
                .querySelector('.box')
                .addEventListener('click', (e) => {
                    e.stopPropagation();
                });
        }
    }
});

document.addEventListener('click', (e) => {
    for (let i = 0; i < e.path.length; i++) {
        const nodes = e.path[i];
        if (nodes.nodeType === 1 && nodes.classList.contains('website-shade')) {
            document.body.removeChild(document.querySelector('.website-shade'));
        }
    }
});
