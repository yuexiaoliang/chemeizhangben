const { ipcRenderer } = require('electron');

import { getDB, CreateSelect, tab, verifyPassword } from '../../common/tool.js';
import { PopUp } from '../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { memberDetailsTemplate } from './contentTemplates.js';

class MemberDetailsSwitchPage extends SwitchPage {
    switchPage() {
        document.addEventListener('click', (e) => {
            for (let i = 0; i < e.path.length; i++) {
                const element = e.path[i];
                if (element.nodeType === 1) {
                    if (
                        element.hasAttribute('switch-page') &&
                        element.getAttribute('switch-page') ===
                            this.options.page
                    ) {
                        const appSide = document.querySelector('.app-side');
                        const appSideButtons = appSide.querySelectorAll(
                            '.button'
                        );
                        const appSideMemberButton = appSide.querySelector(
                            '.button.member'
                        );
                        for (let i = 0; i < appSideButtons.length; i++) {
                            const button = appSideButtons[i];
                            button.classList.remove('active');
                        }
                        appSideMemberButton.classList.add('active');

                        const headerTitleElement = document.querySelector(
                            '.app-header .header-title'
                        );
                        headerTitleElement.innerHTML = this.options.title;
                        document.querySelector(
                            '.app-main'
                        ).innerHTML = this.options.html;
                        this.callback(
                            document.querySelector('.app-main').children[0],
                            element.getAttribute('data-id')
                        );
                    }
                }
            }
        });
    }
}

new MemberDetailsSwitchPage(
    {
        page: 'member-details',
        title: '????????????',
        html: memberDetailsTemplate,
    },
    function (mainMemberDetailsElement, id) {
        const settingsDB = getDB.settings();
        const memberDB = getDB.members();
        const memberData = memberDB.get(id).value();
        // ????????????
        (() => {
            const memberInfoElement = mainMemberDetailsElement.querySelector(
                '.member-info'
            );
            const memberIdElement = memberInfoElement.querySelectorAll(
                '.id span'
            )[1];
            const memberDateElement = memberInfoElement.querySelectorAll(
                '.date span'
            )[1];
            const memberNameInput = memberInfoElement.querySelector(
                '.name input'
            );
            const memberBalanceElement = memberInfoElement.querySelectorAll(
                '.balance span'
            )[1];
            const memberWeixinInput = memberInfoElement.querySelector(
                '.weixin input'
            );
            const memberShoujiInput = memberInfoElement.querySelector(
                '.shouji input'
            );
            const memberRamarksElement = memberInfoElement.querySelector(
                '.ramarks textarea'
            );
            const settleAccountsButton = memberInfoElement.querySelector(
                '.settle-accounts'
            );
            const memberAlterButton = memberInfoElement.querySelector(
                '.buttons .alter'
            );
            const memberRechargeButton = memberInfoElement.querySelector(
                '.balance .recharge'
            );

            // ??????????????????
            memberIdElement.innerHTML = memberData.id;
            memberDateElement.innerHTML = memberData.date;
            memberNameInput.value = memberData.name;
            memberBalanceElement.innerHTML = '???' + memberData.balance;
            memberWeixinInput.value = memberData.contact.weixin;
            memberShoujiInput.value = memberData.contact.shouji;
            memberRamarksElement.value = memberData.ramarks;
            settleAccountsButton.setAttribute('data-id', memberData.id);

            // ??????????????????
            memberAlterButton.addEventListener('click', () => {
                if (!memberAlterButton.classList.contains('save')) {
                    memberAlterButton.classList.add('save');
                    memberAlterButton.innerHTML = '??????';
                    memberNameInput.removeAttribute('readonly');
                    memberWeixinInput.removeAttribute('readonly');
                    memberShoujiInput.removeAttribute('readonly');
                    memberRamarksElement.removeAttribute('readonly');
                } else {
                    if (!memberNameInput.value.trim()) {
                        memberNameInput.focus();
                        return;
                    }
                    try {
                        memberDB
                            .set(`${memberData.id}.name`, memberNameInput.value)
                            .write();
                        memberDB
                            .set(
                                `${memberData.id}.contact.weixin`,
                                memberWeixinInput.value
                            )
                            .write();
                        memberDB
                            .set(
                                `${memberData.id}.contact.shouji`,
                                memberShoujiInput.value
                            )
                            .write();
                        memberDB
                            .set(
                                `${memberData.id}.ramarks`,
                                memberRamarksElement.value
                            )
                            .write();
                        PopUp.hint({ msg: '????????????' }, () => {
                            memberAlterButton.classList.remove('save');
                            memberAlterButton.innerHTML = '??????';
                            memberNameInput.setAttribute(
                                'readonly',
                                'readonly'
                            );
                            memberWeixinInput.setAttribute(
                                'readonly',
                                'readonly'
                            );
                            memberShoujiInput.setAttribute(
                                'readonly',
                                'readonly'
                            );
                            memberRamarksElement.setAttribute(
                                'readonly',
                                'readonly'
                            );
                        });
                    } catch (error) {
                        PopUp.hint({ msg: '????????????' }, () => {
                            console.log(error);
                        });
                    }
                }
            });

            // ??????
            memberRechargeButton.addEventListener('click', () => {
                verifyPassword(() => {
                    const popUpMsgHtml = `
                        <input type="text" class="pay-date" readonly>
                        <div class="pay-amount">
                            <input type="number" min="0" placeholder="??????????????????">
                        </div>
                        <ul class="pay-platform">
                            <li>
                                <label for="pay-platform-weixin">??????</label>
                                <input type="radio" name="pay-platform" id="pay-platform-weixin" value="??????" checked>
                            </li>
                            <li>
                                <label for="pay-platform-zhifubao">?????????</label>
                                <input type="radio" name="pay-platform" id="pay-platform-zhifubao" value="?????????">
                            </li>
                            <li>
                                <label for="pay-platform-xianjin">??????</label>
                                <input type="radio" name="pay-platform" id="pay-platform-xianjin" value="??????">
                            </li>
                            <li>
                                <label for="pay-platform-qita">??????</label>
                                <input type="radio" name="pay-platform" id="pay-platform-qita" value="??????">
                            </li>
                        </ul>
                    `;
                    PopUp.open(
                        {
                            addClass: 'member-recharge-form',
                            showShade: true,
                            title: '????????????',
                            msg: popUpMsgHtml,
                            buttons: ['????????????'],
                        },
                        function () {
                            try {
                                const popUpMsg = this.getPopUp().querySelector(
                                    '.pop-up-msg'
                                );
                                const date = popUpMsg.querySelector(
                                    '.pay-date'
                                );
                                const money = popUpMsg.querySelector(
                                    '.pay-amount input'
                                );
                                const platform = popUpMsg.querySelector(
                                    '.pay-platform input:checked'
                                );

                                if (!money.value) {
                                    money.focus();
                                    return;
                                }
                                const rechargeRecord = [
                                    date.value,
                                    money.value * 1,
                                    platform.value,
                                ];
                                memberDB
                                    .get(`${memberData.id}.rechargeRecord`)
                                    .unshift(rechargeRecord)
                                    .write();
                                memberDB
                                    .set(
                                        `${memberData.id}.balance`,
                                        memberData.balance + money.value * 1
                                    )
                                    .write();
                                this.removePopUp();
                                PopUp.hint({ msg: '????????????' }, () => {
                                    memberBalanceElement.innerHTML = `???${memberDB
                                        .get(`${memberData.id}.balance`)
                                        .value()}`;
                                    rendererRechargeRecord();
                                });
                            } catch (error) {
                                this.removePopUp();
                                PopUp.hint({ msg: '????????????' }, () => {
                                    console.log(error);
                                });
                            }
                        }
                    );
                    const memberRechargeForm = document.querySelector(
                        '.member-recharge-form'
                    );
                    laydate.render({
                        elem: memberRechargeForm.querySelector('.pay-date'),
                        type: 'datetime',
                        trigger: null,
                        value: new Date(),
                    });
                });
            });
        })();

        // ????????????
        (() => {
            const carListElement = mainMemberDetailsElement.querySelector(
                '.member-car .car-list'
            );
            const addCar = mainMemberDetailsElement.querySelector(
                '.member-car .add-car'
            );
            const addCarPrefixInput = addCar.querySelector(
                '.car-license-tag .prefix'
            );
            const addCarNumberInput = addCar.querySelector(
                '.car-license-tag .number'
            );
            const addCarTypeInput = addCar.querySelector('.car-type input');
            const addCarButton = addCar.querySelector('.add');

            const carListData = memberData.carList;

            // ????????????????????????????????????
            const licensePlatePrefixOptionsDefault = settingsDB
                .get('licensePlatePrefixOptionsDefault')
                .value();

            // ????????????????????????
            new CreateSelect({
                el: addCarPrefixInput,
                data: settingsDB.get('licensePlatePrefixOptions').value(),
            });

            // ????????????????????????
            new CreateSelect({
                el: addCarTypeInput,
                data: settingsDB.get('carTypeOptions').value(),
            });

            // ??????????????????????????????????????????????????????????????????
            if (licensePlatePrefixOptionsDefault) {
                addCarPrefixInput.value = licensePlatePrefixOptionsDefault;
            }

            // ??????????????????
            rendererCarList();
            function rendererCarList() {
                let html = '';
                for (let i = 0; i < carListData.length; i++) {
                    const carData = carListData[i];
                    html += carTemplate(i, carData[0], carData[1]);
                }
                carListElement.innerHTML = html;
            }

            // ????????????
            addCarButton.addEventListener('click', () => {
                const carPrefix = addCarPrefixInput.value.toUpperCase().trim();
                const carNumber = addCarNumberInput.value.toUpperCase().trim();
                const carType = addCarTypeInput.value.trim();

                if (!carPrefix) {
                    addCarPrefixInput.focus();
                    return;
                }
                if (!carNumber) {
                    addCarNumberInput.focus();
                    return;
                }
                if (!carType) {
                    addCarTypeInput.focus();
                    return;
                }
                try {
                    memberDB
                        .get(`${memberData.id}.carList`)
                        .unshift([`${carPrefix}??${carNumber}`, carType])
                        .write();
                    rendererCarList();
                    addCarNumberInput.value = addCarTypeInput.value = '';
                    PopUp.hint(
                        {
                            msg: '????????????',
                        },
                        () => {
                            addCarPrefixInput.value = licensePlatePrefixOptionsDefault;
                        }
                    );
                } catch (error) {
                    PopUp.hint(
                        {
                            msg: '????????????',
                        },
                        () => {
                            console.log(error);
                        }
                    );
                }
            });

            // ????????????
            carListElement.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('delete')) {
                    verifyPassword(() => {
                        try {
                            const index = target.parentNode.getAttribute(
                                'data-index'
                            );
                            memberDB
                                .get(`${memberData.id}.carList`)
                                .splice(index, 1)
                                .write();
                            rendererCarList();
                            PopUp.hint({
                                msg: '????????????',
                            });
                        } catch (error) {
                            PopUp.hint({ msg: '????????????' }, () => {
                                console.log(error);
                            });
                        }
                    });
                }
            });

            // ??????HTML??????
            function carTemplate(id, license, type) {
                return `
            <div class="item" data-index="${id}">
                <span class="license">??????: ${license}</span>
                <span class="type">??????: ${type}</span>
                <span class="delete">??????</span>
            </div>
        `;
            }
        })();

        // ??????/?????????????????????
        (() => {
            const buttons = mainMemberDetailsElement.querySelectorAll(
                '.member-record .record-header span'
            );
            const contents = mainMemberDetailsElement.querySelectorAll(
                '.member-record .record-content ul'
            );
            tab(buttons, contents);
            rendererExpensesRecord();
            rendererRechargeRecord();
        })();

        // ????????????
        function rendererRechargeRecord() {
            let rechargeRecordHtml = ``;
            const rechargeRecord = mainMemberDetailsElement.querySelector(
                '.member-record .recharge-record'
            );
            for (let i = 0; i < memberData.rechargeRecord.length; i++) {
                const record = memberData.rechargeRecord[i];
                rechargeRecordHtml += `
            <li>
                <span class="time">${record[0]}</span>
                <p>??????<span class="method">${record[2]}</span>??????<span class="money">${record[1]}</span>???</p>
            </li>
        `;
            }
            rechargeRecord.innerHTML = rechargeRecordHtml;
        }

        // ????????????
        function rendererExpensesRecord() {
            let expensesRecordHtml = ``;
            const expensesRecord = mainMemberDetailsElement.querySelector(
                '.member-record .expenses-record'
            );
            for (let i = 0; i < memberData.expensesRecord.length; i++) {
                const record = memberData.expensesRecord[i];
                let sonsumerItem = ``;
                let total = 0;
                for (let j = 0; j < record[1].length; j++) {
                    const item = record[1][j];
                    sonsumerItem += `<span><i class="method">${item[0]}</i><i class="money">???${item[1]}</i></span>`;
                    total += item[1];
                }
                expensesRecordHtml += `
            <li>
                <span class="time">${record[0]}</span>
                <p class="consumer">${sonsumerItem}</p>
                <span class="total">??????: <b>${total}</b> ???</span>
            </li>
        `;
            }
            expensesRecord.innerHTML = expensesRecordHtml;
        }

        // ????????????
        (() => {
            const deleteMemberButton = mainMemberDetailsElement.querySelector(
                '.delete-member'
            );
            deleteMemberButton.addEventListener('click', () => {
                verifyPassword(() => {
                    try {
                        memberDB.unset(memberData.id).write();
                        PopUp.hint({ msg: '????????????' }, () => {
                            ipcRenderer.send('win-reload');
                        });
                    } catch (error) {
                        PopUp.hint({ msg: '????????????' }, () => {
                            console.log(error);
                        });
                    }
                });
            });
        })();
    }
);
