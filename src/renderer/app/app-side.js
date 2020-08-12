const appSideElement = document.querySelector('.app-side');
const appSideButtonElements = appSideElement.querySelectorAll('.button');

for (let i = 0; i < appSideButtonElements.length; i++) {
    const button = appSideButtonElements[i];
    button.addEventListener('click', () => {
        for (let j = 0; j < appSideButtonElements.length; j++) {
            const button = appSideButtonElements[j];
            button.classList.remove('active');
        }
        button.classList.add('active');
    });
}
