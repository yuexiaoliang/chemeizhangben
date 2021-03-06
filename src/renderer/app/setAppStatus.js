import { getDB, getMAC, activationCodeDecryption } from '../common/tool.js';

const settingsDB = getDB.settings();
const mac = getMAC();
const activationCode = settingsDB.get('activationCode').value();
const reg = /\s/gi;

(() => {
    if (!activationCode || typeof activationCode !== 'string') {
        setStatus();
        return;
    }
    try {
        if (activationCodeDecryption(activationCode) !== mac.replace(reg, '')) {
            setStatus();
        }
    } catch (error) {
        setStatus();
    }
})();

function setStatus() {
    document.body.setAttribute('data-status', 'no');
}
