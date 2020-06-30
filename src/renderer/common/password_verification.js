export default function (val) {
    const pwdRegex = /^([0-9a-zA-Z]){6,16}$/;
    return pwdRegex.test(val);
}
