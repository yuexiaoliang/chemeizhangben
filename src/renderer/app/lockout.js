import { getDB } from '../common/tool.js';
const settingsDB = getDB.settings();
const password = settingsDB.get('password').value();

const lockoutButton = document.querySelector('.lockout');
lockoutButton.addEventListener('click', lockout);

// lockout();
function lockout() {
    const lockoutElement = document.createElement('div');
    lockoutElement.classList.add('lockout-wrapper');
    lockoutElement.innerHTML = `
        <input type="password" placeholder="输入密码，按Enter键解锁" class="unlock-password">
        <p class="unlock-hint"></p>
    `;
    document.body.appendChild(lockoutElement);
    const unlockInput = lockoutElement.querySelector('.unlock-password');
    const unlockHint = lockoutElement.querySelector('.unlock-hint');

    unlockInput.addEventListener('keypress', (e) => {
        if (e.charCode === 13) {
            if (!unlockInput.value) {
                unlockInput.focus();
                return;
            }
            if (unlockInput.value !== password) {
                unlockInput.focus();
                unlockHint.innerHTML = '密码输入错误';
                return;
            }
            if (unlockInput.value === password) {
                document.body.removeChild(lockoutElement);
            }
        }
    });
    unlockInput.addEventListener('input', () => {
        if (!unlockInput.value) {
            unlockHint.innerHTML = '';
        }
    });
}
