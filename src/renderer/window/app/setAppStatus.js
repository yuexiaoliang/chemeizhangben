import { getDB, getMAC, activationCodeDecryption } from '../../common/tool.js';

const settingsDB = getDB.settings();
const mac = getMAC();
const activationCode = settingsDB.get('activationCode').value();

(() => {
    if (!activationCode || typeof activationCode !== 'string') {
        setStatus();
        return;
    }
    try {
        if (activationCodeDecryption(activationCode) !== mac) {
            setStatus();
        }
    } catch (error) {
        setStatus();
    }
})();

function setStatus() {
    document.body.setAttribute('data-status', 'no');
}
