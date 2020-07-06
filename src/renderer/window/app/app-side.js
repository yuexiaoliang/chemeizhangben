const appSideElement = document.querySelector('.app-side');
const appSideButtonWrapElement = appSideElement.querySelector('.button-wrap');
const appSideButtonElements = appSideButtonWrapElement.querySelectorAll(
    '.button'
);
const focusNode = appSideButtonWrapElement.querySelector('.focus');
const hintNode = appSideButtonWrapElement.querySelector('.hint');

setFocusNodePosition();
setHintNodePosition();

appSideButtonWrapElement.addEventListener('mouseover', (e) => {
    for (let i = 0; i < e.path.length; i++) {
        const element = e.path[i];
        if (element.nodeType === 1 && element.classList.contains('button')) {
            focusNode.style.top = element.offsetTop + 13 + 'px';
            focusNode.style.left = element.offsetLeft + 13 + 'px';
            hintNode.style.top = element.offsetTop + 13 + 'px';
            hintNode.innerHTML = element.getAttribute('data-title');
            hintNode.style.visibility = 'visible';
            hintNode.style.opacity = 1;
        }
    }
});

appSideButtonWrapElement.addEventListener('mouseleave', (e) => {
    setFocusNodePosition();
    setHintNodePosition();
    hintNode.style.visibility = 'hidden';
    hintNode.style.opacity = 0;
});

for (let i = 0; i < appSideButtonElements.length; i++) {
    const button = appSideButtonElements[i];
    button.addEventListener('click', () => {
        for (let j = 0; j < appSideButtonElements.length; j++) {
            const button = appSideButtonElements[j];
            button.classList.remove('active');
        }
        button.classList.add('active');
        setFocusNodePosition();
        setHintNodePosition();
    });
}

function setFocusNodePosition() {
    const appSideButtonActiveElement = appSideButtonWrapElement.querySelector(
        '.active'
    );
    focusNode.style.top = appSideButtonActiveElement.offsetTop + 13 + 'px';
    focusNode.style.left = appSideButtonActiveElement.offsetLeft + 13 + 'px';
    focusNode.style.opacity = 1;
}
function setHintNodePosition() {
    const appSideButtonActiveElement = appSideButtonWrapElement.querySelector(
        '.active'
    );

    hintNode.innerHTML = appSideButtonActiveElement.getAttribute('data-title');
    hintNode.style.top = appSideButtonActiveElement.offsetTop + 13 + 'px';
}
