import { getDB } from '../common/tool.js';
const settingsDB = getDB.settings();
const password = settingsDB.get('password').value();

const lockoutButton = document.querySelector('.lockout');
lockoutButton.addEventListener('click', lockout);

function lockout() {
    const lockoutElement = document.createElement('div');
    lockoutElement.classList.add('lockout-wrapper');
    lockoutElement.innerHTML = `
        <div class="unlock-form">
            <input type="password" placeholder="输入密码解锁..." class="unlock-password">
            <button class="unlock-button iconfont icon-jiesuo"></button>
        </div>
        <p class="unlock-hint"></p>
    `;
    document.body.appendChild(lockoutElement);
    const unlockInput = lockoutElement.querySelector('.unlock-form input');
    const unlockButton = lockoutElement.querySelector('.unlock-form button');
    const unlockHint = lockoutElement.querySelector('.unlock-hint');

    unlockButton.addEventListener('click', function (e) {
        if (!unlockInput.value) {
            unlockInput.focus();
            unlockHint.innerHTML = '请输入密码';
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
    });
}
