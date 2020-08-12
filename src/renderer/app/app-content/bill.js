import { getDB } from '../../common/tool.js';
import { SwitchPage } from './switchPage.js';
import { billTemplate } from './contentTemplates.js';
new SwitchPage(
    {
        page: 'bill',
        title: '账单查询',
        html: billTemplate,
    },
    function (mainBillElement) {
        const memberDB = getDB.members().value();
        const ordinaryDB = getDB.ordinary().value();

        const billTimeInput = mainBillElement.querySelector('.bill-time');
        const billTableListElement = mainBillElement.querySelector(
            '.bill-table .list'
        );

        // 设置时间
        (function () {
            laydate.render({
                elem: billTimeInput,
                type: 'month',
                value: new Date(),
                done: function (value) {
                    defaultSort(getData(value));
                },
            });
        })();

        // 渲染数据
        (() => {
            defaultSort(getData(billTimeInput.value));
            const billTableHeaderElement = mainBillElement.querySelector(
                '.bill-table .header'
            );
            const billTableHeaderItemElements = billTableHeaderElement.querySelectorAll(
                'span'
            );
            for (let i = 0; i < billTableHeaderItemElements.length; i++) {
                const item = billTableHeaderItemElements[i];
                item.onclick = () => {
                    if (item.classList.contains('sort')) {
                        const key = item.getAttribute('data-key');
                        for (
                            let j = 0;
                            j < billTableHeaderItemElements.length;
                            j++
                        ) {
                            const element = billTableHeaderItemElements[j];
                            if (element !== item) {
                                element.classList.remove('up', 'down');
                            }
                        }
                        if (item.classList.contains('up')) {
                            item.classList.remove('up');
                            item.classList.add('down');
                            downSort(getData(billTimeInput.value), key);
                            return;
                        }
                        if (item.classList.contains('down')) {
                            item.classList.remove('down');
                            defaultSort(getData(billTimeInput.value));
                            return;
                        }
                        item.classList.add('up');
                        upSort(getData(billTimeInput.value), key);
                    }
                };
            }
        })();

        /**
         * 正常顺序渲染会员列表HTML
         * @param {Array} data 会员数据
         */
        function defaultSort(data) {
            data.moneyData.sort((a, b) => {
                return b['date'].split('-')[2] - a['date'].split('-')[2];
            });
            rendererHtml(data);
        }

        /**
         * 升序排序
         * @param {Array} data 会员数据
         * @param {Number} i
         */
        function downSort(data, key) {
            data.moneyData.sort((a, b) => {
                if (key === 'date') {
                    return b['date'].split('-')[2] - a['date'].split('-')[2];
                } else {
                    return b[key] - a[key];
                }
            });
            rendererHtml(data);
        }

        /**
         * 降序排序
         * @param {Array} data 会员数据
         * @param {Number} i
         */
        function upSort(data, key) {
            data.moneyData.sort((a, b) => {
                if (key === 'date') {
                    return a['date'].split('-')[2] - b['date'].split('-')[2];
                } else {
                    return a[key] - b[key];
                }
            });
            rendererHtml(data);
        }

        /**
         * 渲染会员列表HTML
         * @param {Array} data 处理过的会员数据
         */
        function rendererHtml(data) {
            const billTableFooterElement = mainBillElement.querySelector(
                '.bill-table .footer'
            );
            let html = '';
            for (let i = 0; i < data.moneyData.length; i++) {
                const moneyData = data.moneyData[i];
                html += `
                    <li>
                        <span>${moneyData.date}</span>
                        <span>${moneyData.moneyTotal}</span>
                        <span>${moneyData.moneyMemberRecharge}</span>
                        <span>${moneyData.moneyOrdinaryConsumption}</span>
                        <span class="details-btn" data-date="${moneyData.date}">详情</span>
                    </li>
                `;
            }
            billTableListElement.innerHTML = html;
            billTableFooterElement.innerHTML = `
                <span>本月总收入<b>${data.dayData.dayTotal}</b>元</span>
                <span>会员充值<b>${data.dayData.dayMemberRecharge}</b>元</span>
                <span>普通消费<b>${data.dayData.dayOrdinaryConsumption}</b>元</span>
            `;
        }

        (() => {
            billTableListElement.addEventListener('click', function (e) {
                const target = e.target;
                if (target.classList.contains('details-btn')) {
                    const billMoneyDetailElement = document.createElement(
                        'div'
                    );
                    billMoneyDetailElement.classList.add('bill-money-detail');
                    const dateOptions = splitDate(
                        target.getAttribute('data-date')
                    );
                    const data = getData(
                        `${dateOptions.year}-${dateOptions.day}`
                    );
                    const date = target.getAttribute('data-date');
                    let detailContentHtml = '';
                    for (let i = 0; i < data.moneyData.length; i++) {
                        const moneyData = data.moneyData[i];
                        let list = '';
                        if (moneyData.date === date) {
                            moneyData.bill.sort((a, b) => {
                                return a.record[0] < b.record[0] ? 1 : -1;
                            });
                            for (let j = 0; j < moneyData.bill.length; j++) {
                                const item = moneyData.bill[j];
                                const time = item.record[0].split(' ')[1];
                                switch (item.type) {
                                    case 0:
                                        list += `
                                            <li class="member">
                                                <header>
                                                    <span class="time">${time}</span>
                                                    <span class="type">会员充值</span>
                                                    <span class="id" data-id="${item.id}" switch-page="member-details">${item.name}</span>
                                                </header>
                                                <div class="content">
                                                    <span>充值金额：<i class="hong sum">${item.record[1]}</i>元</span>
                                                    <span>充值方式：<i class="lan">${item.record[2]}</i></span>
                                                </div>
                                            </li>
                                        `;
                                        break;
                                    case 1:
                                        let conHtml = '';
                                        let total = 0;
                                        for (
                                            let x = 0;
                                            x < item.record[3].length;
                                            x++
                                        ) {
                                            const arr = item.record[3][x];
                                            conHtml += `<span><i class="lan">${arr[0]}</i><i class="hong">${arr[1]}</i></span>`;
                                            total += arr[1];
                                        }
                                        list += `
                                            <li class="ordinary">
                                                <header class="info">
                                                    <span class="time">${time}</span>
                                                    <span class="type">普通消费</span>
                                                    <span class="id">${item.id}<i>（${item.record[1]}）</i></span>
                                                </header>
                                                <div class="content">
                                                    ${conHtml}
                                                </div>
                                                <footer>
                                                    <span>合计：<i class="hong sum">${total}</i>元</span>
                                                    <span>支付方式：<i class="lan">${item.record[2]}</i></span>
                                                </footer>
                                            </li>
                                        `;
                                        break;
                                }
                            }
                            detailContentHtml += `
                                <h2 class="date">${moneyData.date}</h2>
                                <ul class="list">${list}</ul>
                            `;
                        }
                    }
                    billMoneyDetailElement.innerHTML = `
                        <span class="close iconfont icon-close"></span>
                        <div class="detail-content">${detailContentHtml}</div>
                    `;
                    mainBillElement.appendChild(billMoneyDetailElement);
                }
            });

            mainBillElement.addEventListener('click', function (e) {
                if (e.path[0].className === 'close iconfont icon-close') {
                    this.removeChild(this.querySelector('.bill-money-detail'));
                }
            });
        })();

        /**
         * 获取所需数据
         */
        function getData(dayDate) {
            const data = {};
            let rest = {
                dayData: {
                    dayTotal: 0,
                    dayMemberRecharge: 0,
                    dayOrdinaryConsumption: 0,
                },
                moneyData: [],
            };

            // 获取会员充值的数据;
            for (const key in memberDB) {
                if (memberDB.hasOwnProperty(key)) {
                    const member = memberDB[key];
                    for (let i = 0; i < member.rechargeRecord.length; i++) {
                        const item = member.rechargeRecord[i];
                        const dateOptions = splitDate(item[0]);
                        const key = `${dateOptions.year}-${dateOptions.day}`;
                        if (!data[key]) {
                            data[key] = {};
                        }
                        if (!data[key][dateOptions.month]) {
                            data[key][dateOptions.month] = [];
                        }

                        const obj = {
                            type: 0,
                            id: member.id,
                            name: member.name,
                            money: item[1],
                            record: member.rechargeRecord[i],
                        };
                        data[key][dateOptions.month].push(obj);
                    }
                }
            }

            // 获取普通会员消费的数据
            for (const key in ordinaryDB) {
                if (ordinaryDB.hasOwnProperty(key)) {
                    const car = ordinaryDB[key];
                    for (let i = 0; i < car.expensesRecord.length; i++) {
                        const item = car.expensesRecord[i];
                        const dateOptions = splitDate(item[0]);
                        const key = `${dateOptions.year}-${dateOptions.day}`;
                        let money = 0;
                        if (!data[key]) {
                            data[key] = {};
                        }
                        if (!data[key][dateOptions.month]) {
                            data[key][dateOptions.month] = [];
                        }

                        for (let j = 0; j < item[3].length; j++) {
                            money += item[3][j][1];
                        }
                        const obj = {
                            type: 1,
                            id: car.car,
                            money: money,
                            record: car.expensesRecord[i],
                        };
                        data[key][dateOptions.month].push(obj);
                    }
                }
            }

            // 整合数据
            const dayData = data[dayDate];
            for (const key in dayData) {
                const obj = {
                    date: `${dayDate}-${key}`,
                    moneyTotal: 0,
                    moneyMemberRecharge: 0,
                    moneyOrdinaryConsumption: 0,
                    bill: [],
                };
                if (dayData.hasOwnProperty(key)) {
                    const moneyData = dayData[key];
                    for (const itemKey in moneyData) {
                        if (moneyData.hasOwnProperty(itemKey)) {
                            const item = moneyData[itemKey];
                            switch (item.type) {
                                case 0:
                                    // 日会员充值
                                    obj.moneyMemberRecharge += item.money;
                                    obj.bill.push({
                                        type: item.type,
                                        id: item.id,
                                        name: item.name,
                                        record: item.record,
                                    });
                                    break;
                                case 1:
                                    // 日普通消费
                                    obj.moneyOrdinaryConsumption += item.money;
                                    obj.bill.push({
                                        type: 1,
                                        id: item.id,
                                        record: item.record,
                                    });
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    // 日收入总计
                    obj.moneyTotal =
                        obj.moneyMemberRecharge + obj.moneyOrdinaryConsumption;

                    // 月会员充值
                    rest.dayData.dayMemberRecharge += obj.moneyMemberRecharge;

                    // 月普通消费
                    rest.dayData.dayOrdinaryConsumption +=
                        obj.moneyOrdinaryConsumption;
                }
                rest.moneyData.push(obj);
            }

            // 月收入总计
            rest.dayData.dayTotal =
                rest.dayData.dayMemberRecharge +
                rest.dayData.dayOrdinaryConsumption;

            return rest;
        }

        /**
         * 分割时间
         * @param {date string}} date 时间
         * @return {Object} year day month
         */
        function splitDate(date) {
            const time = date.match(
                /(?<year>\d\d\d\d)-(?<day>\d\d)-(?<month>\d\d)/i
            );
            return {
                year: time.groups.year,
                day: time.groups.day,
                month: time.groups.month,
            };
        }
    }
);
