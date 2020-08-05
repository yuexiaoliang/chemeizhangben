import { getDB } from '../../common/tool.js';
import { SwitchPage } from './switchPage.js';
import { memberTemplate } from './contentTemplates.js';

new SwitchPage(
    {
        page: 'member',
        title: '会员管理',
        html: memberTemplate,
    },
    (mainMemberElement) => {
        const memberDB = getDB.members().value();
        const mainMemberHeaderItemElements = mainMemberElement.querySelectorAll(
            '.main-member-header span'
        );
        const mainMemberListElement = mainMemberElement.querySelector(
            '.main-member-list'
        );
        if (memberDB) {
            defaultSort(getData());
            /**
             * 排序
             */
            for (let i = 0; i < mainMemberHeaderItemElements.length; i++) {
                const item = mainMemberHeaderItemElements[i];
                item.onclick = () => {
                    if (item.classList.contains('sort')) {
                        for (
                            let j = 0;
                            j < mainMemberHeaderItemElements.length;
                            j++
                        ) {
                            const element = mainMemberHeaderItemElements[j];
                            if (element !== item) {
                                element.classList.remove('up', 'down');
                            }
                        }
                        if (item.classList.contains('up')) {
                            item.classList.remove('up');
                            item.classList.add('down');
                            downSort(getData(), i);
                            return;
                        }
                        if (item.classList.contains('down')) {
                            item.classList.remove('down');
                            defaultSort(getData());
                            return;
                        }
                        item.classList.add('up');
                        upSort(getData(), i);
                    }
                };
            }

            /**
             * 正常顺序渲染会员列表HTML
             * @param {Array} data 会员数据
             */
            function defaultSort(data) {
                downSort(data, 0);
                rendererHtml(data);
            }

            /**
             * 升序排序
             * @param {Array} data 会员数据
             * @param {Number} i
             */
            function upSort(data, i) {
                data.sort((a, b) => {
                    return a[i] - b[i];
                });
                rendererHtml(data);
            }

            /**
             * 降序排序
             * @param {Array} data 会员数据
             * @param {Number} i
             */
            function downSort(data, i) {
                data.sort((a, b) => {
                    return b[i] - a[i];
                });
                rendererHtml(data);
            }

            /**
             * 渲染会员列表HTML
             * @param {Array} data 处理过的会员数据
             */
            function rendererHtml(data) {
                let html = '';
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    html += `
                        <li>
                            <span class="id">${item[0]}</span>
                            <span class="name">${item[1]}</span>
                            <span class="car-number">${item[2]}</span>
                            <span class="total-recharge">${item[3]}</span>
                            <span class="total-consumption">${item[4]}</span>
                            <span class="balance">${item[5]}</span>
                            <span class="ramarks"><p title="${item[6]}">${item[6]}</p></span>
                            <span class="details" data-id="${item[0]}" switch-page="member-details">查看</span>
                        </li>
                    `;
                }
                mainMemberListElement.innerHTML = html;
            }

            /**
             * 获取所需数据
             */
            function getData() {
                const memberListData = [];
                for (const key in memberDB) {
                    if (memberDB.hasOwnProperty(key)) {
                        const member = memberDB[key];
                        let totalRecharge = 0;
                        let totalConsumption = 0;
                        for (let j = 0; j < member.rechargeRecord.length; j++) {
                            totalRecharge += member.rechargeRecord[j][1];
                        }
                        for (let j = 0; j < member.expensesRecord.length; j++) {
                            for (
                                let n = 0;
                                n < member.expensesRecord[j][1].length;
                                n++
                            ) {
                                totalConsumption +=
                                    member.expensesRecord[j][1][n][1];
                            }
                        }
                        memberListData.push([
                            member.id,
                            member.name,
                            member.carList.length,
                            totalRecharge,
                            totalConsumption,
                            member.balance,
                            member.ramarks,
                        ]);
                    }
                }
                return memberListData;
            }
        }
    }
);
