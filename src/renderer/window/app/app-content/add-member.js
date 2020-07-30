import {
    CreateSelect,
    getSettingsDB,
    getMemberDB,
    getAppStatus,
} from '../../../common/tool.js';
import { PopUp } from '../../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { addMemberTemplate } from './contentTemplates.js';

class SwitchAddMemberPage extends SwitchPage {
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
                        if (
                            !getAppStatus() &&
                            getMemberDB().size().value() >= 10
                        ) {
                            PopUp.open(
                                {
                                    title: '未激活',
                                    type: 'warn',
                                    msg: '程序还未激活，最多只能添加 10 个会员',
                                    buttons: ['关闭'],
                                },
                                function () {
                                    this.removePopUp();
                                }
                            );
                        } else {
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
            }
        });
    }
}

new SwitchAddMemberPage(
    {
        page: 'add-member',
        title: '添加会员',
        html: addMemberTemplate,
    },
    (mainAddMemberElement) => {
        const settingsDB = getSettingsDB();
        const memberDB = getMemberDB();
        const addDateElement = mainAddMemberElement.querySelector('.add-date'); // 时间
        const memberNameInput = mainAddMemberElement.querySelector(
            '.member .member-name input'
        ); // 会员名
        const memberContactWeixinInput = mainAddMemberElement.querySelector(
            '.member .member-contact .weixin input'
        ); // 微信号
        const memberContactShoujiInput = mainAddMemberElement.querySelector(
            '.member .member-contact .shouji input'
        ); // 手机号
        const memberRamarksTextarea = mainAddMemberElement.querySelector(
            '.member .member-ramarks textarea'
        ); // 备注
        const carLicenseTagPrefixInput = mainAddMemberElement.querySelector(
            '.car .car-license-tag .prefix'
        ); // 车牌照前缀
        const carLicenseTagNumberInput = mainAddMemberElement.querySelector(
            '.car .car-license-tag .number'
        ); // 车牌照号码
        const carTypeInput = mainAddMemberElement.querySelector(
            '.car .car-type input'
        ); // 车辆类型
        const addButton = mainAddMemberElement.querySelector('.car .add'); // 添加车辆按钮
        const carList = mainAddMemberElement.querySelector('.car .car-list'); // 以添加的车辆列表
        const payAmountNumberInput = mainAddMemberElement.querySelector(
            '.pay .pay-amount input'
        ); // 充值金额
        const saveButton = mainAddMemberElement.querySelector('.save'); // 保存按钮

        // 保存数据
        (function () {
            // 保存数据
            saveButton.addEventListener('click', () => {
                const payAmountPlatformChecked = mainAddMemberElement.querySelector(
                    '.pay .pay-platform input:checked'
                ); // 充值方式
                const addDate = addDateElement.value.trim(); // 添加时间Value
                const memberNameInputValue = memberNameInput.value.trim(); // 会员名称Value
                const payAmountNumberInputValue = payAmountNumberInput.value.trim(); // 支付金额Value

                // 如果添加时间没有填写
                if (!addDate) {
                    addDateElement.value = '';
                    addDateElement.focus();
                    return;
                }

                // 如果会员名称没有填写
                if (!memberNameInputValue) {
                    memberNameInput.value = '';
                    memberNameInput.focus();
                    return;
                }

                // 如果没有添加车辆信息
                if (!carList.querySelectorAll('li').length) {
                    carLicenseTagNumberInput.value = '';
                    carLicenseTagNumberInput.focus();
                    return;
                }

                // 如果支付金额没有填写
                if (!payAmountNumberInputValue) {
                    payAmountNumberInput.value = '';
                    payAmountNumberInput.focus();
                    return;
                }

                // 要添加的数据对象
                const member = {
                    id: null, // 唯一ID
                    date: addDateElement.value.trim(), // 添加事件
                    name: memberNameInput.value.trim(), // 会员名
                    contact: {
                        weixin: memberContactWeixinInput.value.trim(),
                        shouji: memberContactShoujiInput.value.trim(),
                    }, // 联系方式
                    ramarks: memberRamarksTextarea.value.trim(), // 备注
                    carList: [], // 车辆信息
                    balance: payAmountNumberInput.value * 1, // 余额
                    rechargeRecord: [
                        [
                            addDateElement.value.trim(),
                            payAmountNumberInput.value * 1,
                            payAmountPlatformChecked.value,
                        ],
                    ], // 充值记录
                    expensesRecord: [], // 消费记录
                };
                if (memberDB.size().value() === 0) {
                    member['id'] = 0;
                } else {
                    const arr = [];
                    for (let i = 0; i < memberDB.keys().value().length; i++) {
                        const key = memberDB.keys().value()[i];
                        arr.push(key * 1);
                    }
                    member['id'] = Math.max(...arr) + 1;
                }

                // 往数据对象中的车辆信息中添加数据
                for (
                    let i = 0;
                    i < carList.querySelectorAll('li').length;
                    i++
                ) {
                    const item = carList.querySelectorAll('li')[i];
                    member.carList.push([
                        item.querySelector('.number').innerHTML,
                        item.querySelector('.type').innerHTML,
                    ]);
                }

                // 写入数据
                memberDB.set(member.id, member).write();

                // 写入成功的提示
                PopUp.hint(
                    {
                        msg: '添加成功',
                    },
                    () => {
                        // 把已经填写的信息置空
                        memberNameInput.value = memberContactWeixinInput.value = memberContactShoujiInput.value = memberRamarksTextarea.value = payAmountNumberInput.value = carList.innerHTML =
                            '';

                        // 重新设置时间
                        laydate.render({
                            elem: addDateElement,
                            type: 'datetime',
                            value: new Date(),
                        });
                    }
                );
            });
        })();

        // 时间
        (function () {
            // 设置时间
            laydate.render({
                elem: addDateElement,
                type: 'datetime',
                value: new Date(),
            });
        })();

        // 添加车辆
        (function () {
            // 从数据路获取默认牌照前缀
            const licensePlatePrefixOptionsDefault = settingsDB
                .get('licensePlatePrefixOptionsDefault')
                .value();

            // 牌照前缀下拉列表
            new CreateSelect({
                el: carLicenseTagPrefixInput,
                data: settingsDB.get('licensePlatePrefixOptions').value(),
            });

            // 车辆配型下拉列表
            new CreateSelect({
                el: carTypeInput,
                data: settingsDB.get('carTypeOptions').value(),
            });

            // 如果设置数据中存在默认的牌照前缀，则进行设置
            if (licensePlatePrefixOptionsDefault) {
                carLicenseTagPrefixInput.value = licensePlatePrefixOptionsDefault;
            }

            // 添加车辆
            addButton.addEventListener('click', () => {
                const carListItem = document.createElement('li');
                const carLicenseTagPrefixInputValue = carLicenseTagPrefixInput.value.trim(); // 牌照前缀Value
                const carLicenseTagNumberInputValue = carLicenseTagNumberInput.value.trim(); // 牌照号码Value
                const carTypeInputValue = carTypeInput.value.trim(); // 车辆类型Value

                // 如果没有填写牌照前缀
                if (!carLicenseTagPrefixInputValue) {
                    carLicenseTagPrefixInput.value = '';
                    carLicenseTagPrefixInput.focus();
                    return;
                }

                // 如果没有填写牌照号码
                if (!carLicenseTagNumberInputValue) {
                    carLicenseTagNumberInput.value = '';
                    carLicenseTagNumberInput.focus();
                    return;
                }

                // 如果没有填写车辆类型
                if (!carTypeInputValue) {
                    carTypeInput.value = '';
                    carTypeInput.focus();
                    return;
                }

                // 添加车辆显示到列表的HTML中
                carListItem.innerHTML = `
                    <span class="number">${carLicenseTagPrefixInputValue.toUpperCase()}·${carLicenseTagNumberInputValue.toUpperCase()}</span>
                    <i class="fenge"></i>
                    <span class="type">${carTypeInputValue}</span>
                    <span class="delete">删除</span>
                `;
                carList.appendChild(carListItem);

                // 添加完成表单置空
                carLicenseTagPrefixInput.value = licensePlatePrefixOptionsDefault;
                carLicenseTagNumberInput.value = '';
                carTypeInput.value = '';
            });

            // 删除以添加的车辆
            carList.addEventListener('click', (e) => {
                const target = e.target;
                if (target.classList.contains('delete')) {
                    carList.removeChild(target.parentNode);
                }
            });
        })();
    }
);
