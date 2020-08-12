import { getDB, throttle, fuzzyQuery } from '../../common/tool.js';
import { SwitchPage } from './switchPage.js';
import { searchTemplate } from './contentTemplates.js';

new SwitchPage(
    {
        page: 'search',
        title: '搜索',
        html: searchTemplate,
    },
    function (mainSearchElement) {
        mainSearch(mainSearchElement);
    }
);
mainSearch();
function mainSearch(ele) {
    const settingsDB = getDB.settings();
    const memberDB = getDB.members();
    const memberData = {};
    let mainSearchElement;
    if (ele) {
        mainSearchElement = ele;
    } else {
        document.querySelector('.app-main').innerHTML = searchTemplate;
        mainSearchElement = document
            .querySelector('.app-main')
            .querySelector('.main-search');
    }
    const searchRestElement = mainSearchElement.querySelector('.search-rest');
    // 筛选出所需数据
    for (const key in memberDB.value()) {
        if (memberDB.value().hasOwnProperty(key)) {
            const member = memberDB.value()[key];
            memberData[key] = {
                id: member.id,
                name: member.name,
                balance: member.balance,
                carList: member.carList,
            };
        }
    }

    // 渲染会员列表
    rendererMemberList();
    function rendererMemberList() {
        let html = '';
        for (const key in memberDB.value()) {
            if (memberData.hasOwnProperty(key)) {
                const member = memberData[key];
                let carList = '';
                for (let i = 0; i < member.carList.length; i++) {
                    const car = member.carList[i];
                    carList += `<li>${car[0]}<i></i>${car[1]}</li>`;
                }
                html += memberListItemTemplate({
                    id: member.id,
                    name: member.name,
                    balance: member.balance,
                    carList: carList,
                });
            }
        }
        searchRestElement.innerHTML = html;
    }

    // 搜索框下拉选项
    (() => {
        const searchInput = mainSearchElement.querySelector(
            '.search-form .search-input'
        );
        const searchSelectElement = mainSearchElement.querySelector(
            '.search-form .search-select'
        );
        const searchSelectChosenElement = searchSelectElement.querySelector(
            '.chosen'
        );
        const searchSelectOptionsElement = searchSelectElement.querySelector(
            '.options'
        );

        // 点击searchSelectChosenElement切换searchSelectOptionsElement状态
        searchSelectChosenElement.addEventListener('click', (e) => {
            e.stopPropagation();
            searchSelectOptionsElement.classList.toggle('show');
            if (searchSelectOptionsElement.classList.contains('show')) {
                searchSelectChosenElement.style.borderRadius = '0 2px 0 0';
            } else {
                searchSelectChosenElement.style.borderRadius = '0 2px 2px 0';
            }
        });

        // 点击非searchSelectChosenElement处，隐藏searchSelectOptionsElement
        document.addEventListener('click', () => {
            if (searchSelectOptionsElement.classList.contains('show')) {
                searchSelectOptionsElement.classList.remove('show');
                searchSelectChosenElement.style.borderRadius = '0 2px 0 0';
            }
        });

        // 选择searchSelectOptionsElement的Item
        searchSelectOptionsElement.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('item')) {
                searchSelectChosenElement.innerText = target.innerText;
                searchSelectOptionsElement.classList.remove('show');
                searchSelectChosenElement.style.borderRadius = '0 2px 2px 0';
                searchInput.value = '';
                rendererMemberList();
            }
            searchInput.focus();
        });
    })();

    // 搜索
    (() => {
        const searchInput = mainSearchElement.querySelector(
            '.search-form .search-input'
        );

        const searchIds = []; // 根据Id搜索的元数据
        const searchNames = []; // 根据会员名搜索的元数据
        const searchCarLicense = []; // 根据车牌号搜索的元数据
        const searchCarTypes = []; // 根据车型号搜索的元数据
        for (const key in memberData) {
            if (memberData.hasOwnProperty(key)) {
                searchIds.push([memberData[key].id, memberData[key].id]);
                searchNames.push([memberData[key].name, memberData[key].id]);
                for (let i = 0; i < memberData[key].carList.length; i++) {
                    const car = memberData[key].carList[i];
                    searchCarLicense.push([car[0], memberData[key].id]);
                    searchCarTypes.push([car[1], memberData[key].id]);
                }
            }
        }

        searchInput.addEventListener(
            'input',
            throttle(function (e) {
                const searchSelectChosenText = mainSearchElement.querySelector(
                    '.search-form .search-select .chosen'
                ).innerText;
                const val = e.target.value;
                let rest,
                    html = '';
                switch (searchSelectChosenText) {
                    case '编号':
                        rest = fuzzyQuery(searchIds, val);
                        break;
                    case '会员名':
                        rest = fuzzyQuery(searchNames, val);
                        break;
                    case '车牌号':
                        rest = fuzzyQuery(searchCarLicense, val);
                        break;
                    case '车型号':
                        rest = fuzzyQuery(searchCarTypes, val);
                        break;
                    default:
                        rest = [];
                        break;
                }
                for (let i = 0; i < rest.length; i++) {
                    const member = rest[i];
                    let carList = '';
                    for (
                        let i = 0;
                        i < memberData[member[1]].carList.length;
                        i++
                    ) {
                        const car = memberData[member[1]].carList[i];
                        carList += `<li>${car[0]}<i></i>${car[1]}</li>`;
                    }
                    html += memberListItemTemplate({
                        id: memberData[member[1]].id,
                        name: memberData[member[1]].name,
                        balance: memberData[member[1]].balance,
                        carList: carList,
                    });
                }
                searchRestElement.innerHTML = html;
            }, 260)
        );
    })();

    // 会员列表Item模板
    function memberListItemTemplate(obj) {
        return `
            <div class="member">
                <header class="header id">编号：${obj.id}</header>
                <div class="content">
                    <div class="name box"><span>名称：</span>${obj.name}</div>
                    <div class="balance box"><span>余额：</span><b>${obj.balance} 元</b></div>
                    <ul class="car-list">${obj.carList}</ul>
                </div>
                <div class="buttons">
                    <button class="settle-accounts" data-id="${obj.id}" switch-page="member-settle-accounts">结账</button>
                    <button class="details" data-id="${obj.id}" switch-page="member-details">详情</button>
                </div>
            </div>
        `;
    }
}
