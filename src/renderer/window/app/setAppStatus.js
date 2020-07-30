import {
    getSettingsDB,
    getDBMAC,
    activationCodeDecryption,
} from '../../common/tool.js';

const settingsDB = getSettingsDB();
const mac = getDBMAC();
const activationCode = settingsDB.get('activationCode').value();
let decryptedString;

(() => {
    if (!activationCode || typeof activationCode !== 'string') {
        setStatus();
        return;
    }
    try {
        decryptedString = activationCodeDecryption(activationCode);
        if (decryptedString !== mac) {
            setStatus();
        }
    } catch (error) {
        setStatus();
    }
})();

function setStatus() {
    document.body.setAttribute('data-status', 'no');
}
