const path = require('path');

const { ipcRenderer } = require('electron');

import { defaultDataDir } from '../../../common/all_path.js';
import {
    getDB,
    CreateSelect,
    tab,
    verifyPassword,
} from '../../../common/tool.js';
import { PopUp } from '../../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { memberDetailsTemplate } from './contentTemplates.js';

new SwitchPage(
    {
        page: 'member-details',
        title: '会员详情',
        html: memberDetailsTemplate,
    },
    function (mainMemberDetailsElement, id) {
        const settingsDBPath = path.join(defaultDataDir, 'settings-db.json'); // 设置数据文件的路径
        const settingsDB = getDB(settingsDBPath); // 获取设置数据文件的数据
        const memberDBPath = path.join(
            settingsDB.get('dataDir').value(),
            'database/member.json'
        );
        const memberDB = getDB(memberDBPath);
        const memberData = memberDB.get(id).value();
        // 会员信息
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

            // 渲染会员信息
            memberIdElement.innerHTML = memberData.id;
            memberDateElement.innerHTML = memberData.date;
            memberNameInput.value = memberData.name;
            memberBalanceElement.innerHTML = memberData.balance;
            memberWeixinInput.value = memberData.contact.weixin;
            memberShoujiInput.value = memberData.contact.shouji;
            memberRamarksElement.value = memberData.ramarks;
            settleAccountsButton.setAttribute('data-id', memberData.id);

            // 修改会员信息
            memberAlterButton.addEventListener('click', () => {
                if (!memberAlterButton.classList.contains('save')) {
                    memberAlterButton.classList.add('save');
                    memberAlterButton.innerHTML = '保存';
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
                        PopUp.hint({ msg: '修改成功' }, () => {
                            memberAlterButton.classList.remove('save');
                            memberAlterButton.innerHTML = '修改';
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
                        PopUp.hint({ msg: '修改失败' }, () => {
                            console.log(error);
                        });
                    }
                }
            });

            // 充值
            memberRechargeButton.addEventListener('click', () => {
                verifyPassword(() => {
                    const popUpMsgHtml = `
                        <input type="text" class="pay-date" readonly>
                        <div class="pay-amount">
                            <input type="number" min="0" placeholder="填写充值金额">
                        </div>
                        <ul class="pay-platform">
                            <li>
                                <label for="pay-platform-weixin">微信</label>
                                <input type="radio" name="pay-platform" id="pay-platform-weixin" value="微信" checked>
                            </li>
                            <li>
                                <label for="pay-platform-zhifubao">支付宝</label>
                                <input type="radio" name="pay-platform" id="pay-platform-zhifubao" value="支付宝">
                            </li>
                            <li>
                                <label for="pay-platform-xianjin">现金</label>
                                <input type="radio" name="pay-platform" id="pay-platform-xianjin" value="现金">
                            </li>
                            <li>
                                <label for="pay-platform-qita">其他</label>
                                <input type="radio" name="pay-platform" id="pay-platform-qita" value="其他">
                            </li>
                        </ul>
                    `;
                    PopUp.open(
                        {
                            addClass: 'member-recharge-form',
                            showShade: true,
                            title: '会员充值',
                            msg: popUpMsgHtml,
                            buttons: ['确认充值'],
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
                                PopUp.hint({ msg: '充值成功' }, () => {
                                    memberBalanceElement.innerHTML = memberDB
                                        .get(`${memberData.id}.balance`)
                                        .value();
                                    rendererRechargeRecord();
                                });
                            } catch (error) {
                                this.removePopUp();
                                PopUp.hint({ msg: '充值失败' }, () => {
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

        // 车辆信息
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

            // 从数据路获取默认牌照前缀
            const licensePlatePrefixOptionsDefault = settingsDB
                .get('licensePlatePrefixOptionsDefault')
                .value();

            // 牌照前缀下拉列表
            new CreateSelect({
                el: addCarPrefixInput,
                data: settingsDB.get('licensePlatePrefixOptions').value(),
            });

            // 车辆配型下拉列表
            new CreateSelect({
                el: addCarTypeInput,
                data: settingsDB.get('carTypeOptions').value(),
            });

            // 如果设置数据中存在默认的牌照前缀，则进行设置
            if (licensePlatePrefixOptionsDefault) {
                addCarPrefixInput.value = licensePlatePrefixOptionsDefault;
            }

            // 渲染车辆列表
            rendererCarList();
            function rendererCarList() {
                let html = '';
                for (let i = 0; i < carListData.length; i++) {
                    const carData = carListData[i];
                    html += carTemplate(i, carData[0], carData[1]);
                }
                carListElement.innerHTML = html;
            }

            // 添加车辆
            addCarButton.addEventListener('click', () => {
                const carPrefix = addCarPrefixInput.value.trim();
                const carNumber = addCarNumberInput.value.trim();
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
                verifyPassword(() => {
                    try {
                        memberDB
                            .get(`${memberData.id}.carList`)
                            .unshift([`${carPrefix}·${carNumber}`, carType])
                            .write();
                        rendererCarList();
                        addCarPrefixInput.value = addCarNumberInput.value = addCarTypeInput.value =
                            '';
                        PopUp.hint(
                            {
                                msg: '添加成功',
                            },
                            () => {
                                addCarPrefixInput.value = licensePlatePrefixOptionsDefault;
                            }
                        );
                    } catch (error) {
                        PopUp.hint(
                            {
                                msg: '添加失败',
                            },
                            () => {
                                console.log(error);
                            }
                        );
                    }
                });
            });

            // 删除车辆
            carListElement.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('delete')) {
                    verifyPassword(() => {
                        try {
                            const index = target.parentNode.getAttribute(
                                'data-index'
                            );
                            console.log(index);
                            memberDB
                                .get(`${memberData.id}.carList`)
                                .splice(index, 1)
                                .write();
                            rendererCarList();
                            PopUp.hint({
                                msg: '删除成功',
                            });
                        } catch (error) {
                            PopUp.hint({ msg: '删除失败' }, () => {
                                console.log(error);
                            });
                        }
                    });
                }
            });

            // 车辆HTML模板
            function carTemplate(id, license, type) {
                return `
            <div class="item" data-index="${id}">
                <span class="license">车牌: ${license}</span>
                <span class="type">车型: ${type}</span>
                <span class="delete">删除</span>
            </div>
        `;
            }
        })();

        // 充值/消费记录选项卡
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

        // 充值记录
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
                <p>使用<span class="method">${record[2]}</span>充值<span class="money">${record[1]}</span>元</p>
            </li>
        `;
            }
            rechargeRecord.innerHTML = rechargeRecordHtml;
        }

        // 消费记录
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
                    sonsumerItem += `<span><i class="method">${item[0]}</i><i class="money">${item[1]}</i></span>`;
                    total += item[1];
                }
                expensesRecordHtml += `
            <li>
                <span class="time">${record[0]}</span>
                <p class="consumer">${sonsumerItem}</p>
                <span class="total">合计: <b>${total}</b> 元</span>
            </li>
        `;
            }
            expensesRecord.innerHTML = expensesRecordHtml;
        }

        // 删除会员
        (() => {
            const deleteMemberButton = mainMemberDetailsElement.querySelector(
                '.delete-member'
            );
            deleteMemberButton.addEventListener('click', () => {
                verifyPassword(() => {
                    try {
                        memberDB.unset(memberData.id).write();
                        PopUp.hint({ msg: '删除成功' }, () => {
                            ipcRenderer.send('win-reload');
                        });
                    } catch (error) {
                        PopUp.hint({ msg: '删除失败' }, () => {
                            console.log(error);
                        });
                    }
                });
            });
        })();
    }
);
