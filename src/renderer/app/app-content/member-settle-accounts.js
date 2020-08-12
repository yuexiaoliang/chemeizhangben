import { getDB } from '../../common/tool.js';
import { PopUp } from '../../common/pop_up/pop_up.js';
import { SwitchPage } from './switchPage.js';
import { memberSettleAccountsTemplate } from './contentTemplates.js';
class MemberSettleAccountsSwitchPage extends SwitchPage {
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
new MemberSettleAccountsSwitchPage(
    {
        page: 'member-settle-accounts',
        title: '会员用户账单结算',
        html: memberSettleAccountsTemplate,
    },
    function (mainMemberSettleAccountsElement, id) {
        const settingsDB = getDB.settings();
        const memberDB = getDB.members();
        const memberId = id;

        const settleAccountsDateInput = mainMemberSettleAccountsElement.querySelector(
            '.settle-accounts-date'
        );
        const memberInfoElement = mainMemberSettleAccountsElement.querySelector(
            '.member .member-info'
        );
        const serveElement = mainMemberSettleAccountsElement.querySelector(
            '.serve'
        );
        const memberServeOptionsElement = serveElement.querySelector(
            '.member-serve-options'
        );
        const addServeOptions = serveElement.querySelector(
            '.add-serve-options'
        );
        const addedServeOptions = serveElement.querySelector(
            '.added-serve-options'
        );

        const payElement = mainMemberSettleAccountsElement.querySelector(
            '.pay'
        );
        const totalElement = payElement.querySelector('.total');
        const submitButtom = mainMemberSettleAccountsElement.querySelector(
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

        // 渲染会员信息
        rendererMemberInfo();
        function rendererMemberInfo() {
            const memberData = memberDB.get(memberId).value();
            memberInfoElement.innerHTML = `
                <span class="id">编号：<b>${memberData.id}</b></span>
                <span class="name">名称：<b data-id="${
                    memberData.id
                }" switch-page="member-details">${memberData.name}</b></span>
                <span class="balance">余额：<b>${
                    memberData.balance
                }</b>元</span>
                <span class="ramarks">备注：<b>${
                    memberData.ramarks || '无'
                }</b></span>
            `;
        }

        // 从数据库中获取会员用户服务项目，并渲染
        (() => {
            const memberServeOptions = settingsDB.value().memberServeOptions;
            let memberServeOptionsHtml = '';
            for (let i = 0; i < memberServeOptions.length; i++) {
                const item = memberServeOptions[i];
                memberServeOptionsHtml += `
                    <div class="option">
                        <span class="name">${item[0]}</span>
                        <i class="fenge"></i>
                        <span class="sum">￥${item[1]}</span>
                    </div>
                `;
            }
            memberServeOptionsElement.innerHTML = memberServeOptionsHtml;
        })();

        // 选择服务项目
        (() => {
            memberServeOptionsElement.addEventListener('click', (e) => {
                const elementPath = e.path;
                for (let i = 0; i < elementPath.length; i++) {
                    const element = elementPath[i];
                    if (
                        element.nodeType === 1 &&
                        element.classList.contains('option')
                    ) {
                        const optionName = element.querySelector('.name')
                            .innerText;
                        const optionSum = element
                            .querySelector('.sum')
                            .innerText.replace('￥', '');
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

            optionNameInput.addEventListener('keypress', (e) => {
                if (e.charCode === 13) {
                    const optionNameInputValue = addServeOptions
                        .querySelector('.option-name')
                        .value.trim();
                    if (!optionNameInputValue) {
                        optionNameInput.focus();
                        return;
                    }
                    optionSumInput.focus();
                }
            });
            optionSumInput.addEventListener('keypress', (e) => {
                if (e.charCode === 13) {
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
                }
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

                // 如果时间为空
                if (!settleAccountsDateInputValue) {
                    settleAccountsDateInput.focus();
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
                const expensesRecordItem = [settleAccountsDateInputValue, []];
                const balance =
                    memberDB.get(`${memberId}.balance`).value() -
                    totalElement.querySelector('span').innerText * 1;

                for (let i = 0; i < addedServeOptions.children.length; i++) {
                    const option = addedServeOptions.children[i];
                    const optionName = option.querySelector('.name').innerText;
                    const optionSum =
                        option.querySelector('.sum').innerText * 1;
                    expensesRecordItem[1].push([optionName, optionSum]);
                }
                // 写入数据
                memberDB
                    .get(`${memberId}.expensesRecord`)
                    .unshift(expensesRecordItem)
                    .write();
                memberDB.set(`${memberId}.balance`, balance).write();

                // 提示并清空以添加数据
                PopUp.hint({ msg: '结算成功' }, () => {
                    laydate.render({
                        elem: settleAccountsDateInput,
                        type: 'datetime',
                        value: new Date(),
                    });
                    addedServeOptions.innerHTML = '';
                    totalSum = 0;
                    rendererMemberInfo();
                    rendererTotalHtml();
                });
            });
        })();

        // 渲染合计金额
        function rendererTotalHtml() {
            totalElement.innerHTML = `合计：<span>${totalSum}</span> 元`;
        }
    }
);
