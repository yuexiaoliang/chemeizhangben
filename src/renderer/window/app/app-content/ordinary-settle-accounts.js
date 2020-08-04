import { CreateSelect, getDB } from '../../../common/tool.js';
import { PopUp } from '../../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { ordinarySettleAccountsTemplate } from './contentTemplates.js';

new SwitchPage(
    {
        page: 'ordinary-settle-accounts',
        title: '普通用户账单结算',
        html: ordinarySettleAccountsTemplate,
    },
    function (mainOrdinarySettleAccountsElement) {
        const settingsDB = getDB.settings();
        const ordinaryDB = getDB.ordinary();

        const settleAccountsDateInput = mainOrdinarySettleAccountsElement.querySelector(
            '.settle-accounts-date'
        );
        const carElement = mainOrdinarySettleAccountsElement.querySelector(
            '.car'
        );
        const carLicenseTagprefixInput = carElement.querySelector(
            '.car-license-tag .prefix'
        );
        const carLicenseTagnumberInput = carElement.querySelector(
            '.car-license-tag .number'
        );
        const carTypeInput = carElement.querySelector('.car-type input');

        const serveElement = mainOrdinarySettleAccountsElement.querySelector(
            '.serve'
        );
        const commonServeOptionsElement = serveElement.querySelector(
            '.common-serve-options'
        );
        const addServeOptions = serveElement.querySelector(
            '.add-serve-options'
        );
        const addedServeOptions = serveElement.querySelector(
            '.added-serve-options'
        );

        const payElement = mainOrdinarySettleAccountsElement.querySelector(
            '.pay'
        );
        const totalElement = payElement.querySelector('.total');
        const submitButtom = mainOrdinarySettleAccountsElement.querySelector(
            '.submit'
        );
        let totalSum = 0;
        // 设置时间
        (function () {
            laydate.render({
                elem: settleAccountsDateInput,
                type: 'datetime',
                value: new Date(),
            });
        })();

        // 车辆信息
        (() => {
            // 从数据路获取默认牌照前缀
            const licensePlatePrefixOptionsDefault = settingsDB
                .get('licensePlatePrefixOptionsDefault')
                .value();

            // 牌照前缀下拉列表
            new CreateSelect({
                el: carLicenseTagprefixInput,
                data: settingsDB.get('licensePlatePrefixOptions').value(),
            });

            // 车辆配型下拉列表
            new CreateSelect({
                el: carTypeInput,
                data: settingsDB.get('carTypeOptions').value(),
            });

            // 如果设置数据中存在默认的牌照前缀，则进行设置
            if (licensePlatePrefixOptionsDefault) {
                carLicenseTagprefixInput.value = licensePlatePrefixOptionsDefault;
            }
        })();

        // 从数据库中获取普通用户服务项目，并渲染
        (() => {
            const commonServeOptions = settingsDB.value().commonServeOptions;
            let commonServeOptionsHtml = '';
            for (let i = 0; i < commonServeOptions.length; i++) {
                const item = commonServeOptions[i];
                commonServeOptionsHtml += `
            <div class="option">
                <span class="name">${item[0]}</span>
                <i class="fenge"></i>
                <span class="sum">${item[1]}</span>
            </div>
        `;
            }
            commonServeOptionsElement.innerHTML = commonServeOptionsHtml;
        })();

        // 选择服务项目
        (() => {
            commonServeOptionsElement.addEventListener('click', (e) => {
                const elementPath = e.path;
                for (let i = 0; i < elementPath.length; i++) {
                    const element = elementPath[i];
                    if (
                        element.nodeType === 1 &&
                        element.classList.contains('option')
                    ) {
                        const optionName = element.querySelector('.name')
                            .innerText;
                        const optionSum = element.querySelector('.sum')
                            .innerText;
                        addedServeOptions.innerHTML += `
                    <div class="item">
                        <span class="option">
                            <b class="name">${optionName}</b>
                            <b class="sum">${optionSum}</b>元
                        </span>
                        <span class="delete">删除</span>
                    </div>
                `;
                        totalSum += optionSum * 1;
                        rendererTotalHtml();
                    }
                }
            });
        })();

        // 手动添加服务项目
        (() => {
            const optionNameInput = addServeOptions.querySelector(
                '.option-name'
            );
            const optionSumInput = addServeOptions.querySelector('.option-sum');
            const addButton = addServeOptions.querySelector('.add');

            addButton.addEventListener('click', () => {
                const optionNameInputValue = addServeOptions
                    .querySelector('.option-name')
                    .value.trim();
                const optionSumInputValue = addServeOptions
                    .querySelector('.option-sum')
                    .value.trim();

                if (!optionNameInputValue) {
                    optionNameInput.focus();
                    return;
                }
                if (!optionSumInputValue) {
                    optionSumInput.focus();
                    return;
                }
                addedServeOptions.innerHTML += `
                    <div class="item">
                        <span class="option">
                            <b class="name">${optionNameInputValue}</b>
                            <b class="sum">${optionSumInputValue}</b>元
                        </span>
                        <span class="delete">删除</span>
                    </div>
                `;
                totalSum += optionSumInputValue * 1;
                rendererTotalHtml();
                optionNameInput.value = optionSumInput.value = '';
            });
        })();

        // 删除以添加的服务项目
        (() => {
            addedServeOptions.addEventListener('click', (e) => {
                const elementPath = e.path;
                for (let i = 0; i < elementPath.length; i++) {
                    const element = elementPath[i];
                    if (
                        element.nodeName === 'SPAN' &&
                        element.classList.contains('delete')
                    ) {
                        const optionElement = element.parentNode;
                        const optionSum = optionElement.querySelector('.sum')
                            .innerText;

                        optionElement.parentNode.removeChild(optionElement);
                        totalSum -= optionSum * 1;
                        rendererTotalHtml();
                    }
                }
            });
        })();

        // 保存数据
        (() => {
            submitButtom.addEventListener('click', () => {
                const settleAccountsDateInputValue = settleAccountsDateInput.value.trim();
                const carLicenseTagprefixInputValue = carLicenseTagprefixInput.value
                    .trim()
                    .toUpperCase();
                const carLicenseTagnumberInputValue = carLicenseTagnumberInput.value
                    .trim()
                    .toUpperCase();
                const carTypeInputValue = carTypeInput.value.trim();
                const payPlatformElement = mainOrdinarySettleAccountsElement.querySelector(
                    '.pay-platform input:checked'
                ).value;

                // 如果时间为空
                if (!settleAccountsDateInputValue) {
                    settleAccountsDateInput.focus();
                    return;
                }

                // 如果牌照前缀为空
                if (!carLicenseTagprefixInputValue) {
                    carLicenseTagprefixInput.focus();
                    return;
                }

                // 如果牌照号为空
                if (!carLicenseTagnumberInputValue) {
                    carLicenseTagnumberInput.focus();
                    return;
                }

                // 如果车型为空
                if (!carTypeInputValue) {
                    carTypeInput.focus();
                    return;
                }

                // 如果未添加任何结算项目
                if (!addedServeOptions.children.length) {
                    PopUp.open({
                        type: 'error',
                        title: '错误',
                        showShade: true,
                        msg: '未添加任何结算项目',
                    });
                    return;
                }

                // 要写入的数据
                const obj = {
                    car: `${carLicenseTagprefixInputValue}·${carLicenseTagnumberInputValue}`,
                    expensesRecord: [],
                };
                const expensesRecordItem = [
                    settleAccountsDateInputValue,
                    carTypeInputValue,
                    payPlatformElement,
                    [],
                ];
                for (let i = 0; i < addedServeOptions.children.length; i++) {
                    const option = addedServeOptions.children[i];
                    const optionName = option.querySelector('.name').innerText;
                    const optionSum =
                        option.querySelector('.sum').innerText * 1;
                    expensesRecordItem[3].push([optionName, optionSum]);
                }
                obj.expensesRecord.unshift(expensesRecordItem);

                // 写入数据
                if (ordinaryDB.has(obj.car).value()) {
                    ordinaryDB
                        .get(`${obj.car}.expensesRecord`)
                        .unshift(expensesRecordItem)
                        .write();
                } else {
                    ordinaryDB.set(`${obj.car}`, obj).write();
                }

                // 提示并清空以添加数据
                PopUp.hint({ msg: '结算成功' }, () => {
                    laydate.render({
                        elem: settleAccountsDateInput,
                        type: 'datetime',
                        value: new Date(),
                    });

                    carLicenseTagprefixInput.value = settingsDB
                        .get('licensePlatePrefixOptionsDefault')
                        .value();
                    settleAccountsDateInput.value = carLicenseTagnumberInput.value = carTypeInput.value = addedServeOptions.innerHTML =
                        '';
                    totalSum = 0;
                    rendererTotalHtml();
                    laydate.render({
                        elem: settleAccountsDateInput,
                        type: 'datetime',
                        value: new Date(),
                    });
                });
            });
        })();

        // 渲染合计金额
        function rendererTotalHtml() {
            totalElement.innerHTML = `合计：<span>${totalSum}</span> 元`;
        }
    }
);
