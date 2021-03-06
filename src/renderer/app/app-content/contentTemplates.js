export const settingTemplate = `
    <section class="main-section main-setting">
        <div class="setting-box setting-options setting-member-serve-options">
            <h3 class="box-title">会员用户服务：</h3>
            <div class="box-detail">
                <div class="describe"><b>会员用户</b>结账时可选的服务项目</div>
                <div class="form">
                    <input class="name" type="text" placeholder="输入项目名称，按Enter键">
                    <input class="price" type="number" min="0" placeholder="价格">
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-options setting-common-serve-options">
            <h3 class="box-title">普通用户服务：</h3>
            <div class="box-detail">
                <div class="describe"><b>普通用户</b>结账时可选的服务项目</div>
                <div class="form">
                    <input class="name" type="text" placeholder="输入项目名称，按Enter键">
                    <input class="price" type="number" min="0" placeholder="价格">
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-options setting-license-plate-prefix">
            <h3 class="box-title">车牌前缀：</h3>
            <div class="box-detail">
                <div class="describe">结账时<b>车牌照前缀</b>可选的选项</div>
                <div class="form">
                    <input class="name" type="text" placeholder="输入车牌照前缀，按Enter键添加">
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-license-plate-prefix-default">
            <h3 class="box-title">默认车牌前缀：</h3>
            <div class="box-detail">
                <div class="describe">自动添加的<b>车牌照前缀</b></div>
                <div class="form">
                    <input type="text">
                </div>
                <span class="save">保存</span>
            </div>
        </div>
        <div class="setting-box setting-options setting-car-type">
            <h3 class="box-title">车辆类型：</h3>
            <div class="box-detail">
                <div class="describe">结账时<b>车型</b>可选项</div>
                <div class="form">
                    <input class="name" type="text" placeholder="输入车型，按Enter键添加">
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-data-location">
            <h3 class="box-title">数据储存目录：</h3>
            <div class="box-detail">
                <div class="describe">您的数据保存在此文件夹中，<b>注意：千万别修改或删除此文件夹中的文件，否则会造成数据出错或者丢失</b></div>
                <div class="form">
                    <input class="location" type="text" readonly>
                    <button class="open">打开文件夹</button>
                </div>
            </div>
        </div>
        <div class="setting-box setting-password">
            <h3 class="box-title">程序密码：</h3>
            <div class="box-detail">
                <div class="describe">在进行程序解锁，或者一些敏感操作的时候，需要验证密码；<b>密码格式：长度 6 - 16 位，只能包含数字和字母</b></div>
                <div class="form">
                    <input class="password" type="password" placeholder="输入新密码">
                    <span class="look iconfont icon-icon_chakanmima_guan"></span>
                </div>
                <span class="save">保存</span>
                <span class="hint"></span>
            </div>
        </div>
    </section>
`;

export const memberTemplate = `
    <section class="main-section main-member">
        <header class="main-member-header">
            <span class="sort">ID<i class="icon"></i></span>
            <span>名称</span>
            <span class="sort">车辆<i class="icon"></i></span>
            <span class="sort">共充值<i class="icon"></i></span>
            <span class="sort">共消费<i class="icon"></i></span>
            <span class="sort">余额<i class="icon"></i></span>
            <span>备注</span>
            <span>详情</span>
        </header>
        <div class="main-member-list-wrap">
            <ul class="main-member-list"></ul>
        </div>
        <span class="add" title="增加会员"  switch-page="add-member"></span>
    </section>
`;

export const addMemberTemplate = `
    <section class="main-section main-add-member">
        <div class="wrapper">
            <input type="text" class="add-date" placeholder="选择时间">
            <div class="member">
                <h2>车主信息</h2>
                <div class="box member-name">
                    <label>名称：</label>
                    <input type="text" placeholder="输入名称...">
                </div>
                <div class="box member-contact">
                    <div class="item weixin">
                        <label>微信：</label>
                        <input type="text" class="weixin" placeholder="输入微信号...">
                    </div>
                    <div class="item shouji">
                        <label>手机：</label>
                        <input type="text" class="shouji" placeholder="输入手机号...">
                    </div>
                </div>
                <div class="box member-ramarks">
                    <label>备注：</label>
                    <textarea placeholder="输入备注信息..."></textarea>
                </div>
            </div>
            <div class="car">
                <h2>添加车辆</h2>
                <div class="car-license-tag">
                    <label>车牌：</label>
                    <input type="text" class="prefix" placeholder="冀G">
                    <i class="iconfont icon-dian"></i>
                    <input type="text" class="number" placeholder="88888">
                </div>
                <div class="car-type">
                    <label>车型：</label>
                    <input type="text" placeholder="宝马">
                </div>
                <button class="add iconfont icon-add"></button>
                <ul class="car-list"></ul>
            </div>
            <div class="pay">
                <h2>支付信息</h2>
                <div class="pay-amount">
                    <label>金额：</label>
                    <input type="number" min="0" placeholder="人名币">
                </div>
                <ul class="pay-platform">
                    <label>支付平台：</label>
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
            </div>
            <button class="save">保存</button>
        </div>
    </section>
`;

export const memberDetailsTemplate = `
    <section class="main-section main-member-details">
        <div class="member-info member-box">
            <div class="item id">
                <span>编号</span>
                <span></span>
            </div>
            <div class="item date">
                <span>时间</span>
                <span></span>
            </div>
            <div class="item name">
                <span>名称</span>
                <input type="text" value="" readonly>
            </div>
            <div class="item balance">
                <span>余额</span>
                <span></span>
                <span class="recharge">充值</span>
            </div>
            <div class="item weixin">
                <span>微信</span>
                <input type="text" value="" readonly>
            </div>
            <div class="item shouji">
                <span>手机</span>
                <input type="text" value="" readonly>
            </div>
            <div class="item ramarks">
                <span>备注</span>
                <textarea readonly></textarea>
            </div>
            <div class="item buttons">
                <button class="button settle-accounts" switch-page="member-settle-accounts">结账</button>
                <button class="button alter">修改</button>
            </div>
        </div>
        <div class="member-car member-box">
            <div class="car-list"></div>
            <div class="add-car">
                <div class="car-license-tag">
                    <label>牌照：</label>
                    <input type="text" class="prefix" placeholder="冀G">
                    <i class="iconfont icon-dian"></i>
                    <input type="text" class="number" placeholder="88888">
                </div>
                <div class="car-type">
                    <label>车型：</label>
                    <input type="text" placeholder="宝马">
                </div>
                <button class="add iconfont icon-add" title="添加新车辆"></button>
            </div>
        </div>
        <div class="member-record member-box">
            <header class="record-header">
                <span class="active">消费记录</span>
                <span>充值记录</span>
            </header>
            <div class="record-content">
                <ul class="expenses-record show"></ul>
                <ul class="recharge-record"></ul>
            </div>
        </div>
        <button class="delete-member member-box">删除会员</button>
    </section>
`;

export const searchTemplate = `
    <section class="main-section main-search">
        <div class="search-form">
            <i class="search-icon iconfont icon-sousuo1"></i>
            <input type="search" class="search-input" placeholder="搜索会员" autofocus>
            <div class="search-select">
                <div class="chosen">车牌号</div>
                <div class="options">
                    <div class="item">车牌号</div>
                    <div class="item">车型号</div>
                    <div class="item">编号</div>
                    <div class="item">会员名</div>
                </div>
            </div>
        </div>
        <div class="search-rest"></div>
    </section>
`;

export const billTemplate = `
    <section class="main-section main-bill">
        <input type="text" class="bill-time">
        <div class="bill-table">
            <header class="header">
                <span class="sort" data-key="date">日期<i class="icon"></i></span>
                <span class="sort" data-key="moneyTotal">总收入<i class="icon"></i></span>
                <span class="sort" data-key="moneyMemberRecharge">会员充值<i class="icon"></i></span>
                <span class="sort" data-key="moneyOrdinaryConsumption">普通消费<i class="icon"></i></span>
                <span>详情</span>
            </header>
            <div class="list-wrap">
                <ul class="list"></ul>
            </div>
            <footer class="footer"></footer>
        </div>
    </section>
`;

export const ordinarySettleAccountsTemplate = `
    <section class="main-section main-ordinary-settle-accounts">
        <input type="text" class="settle-accounts-date">
        <div class="car section">
            <h2>车辆信息</h2>
            <div class="car-license-tag">
                <input type="text" class="prefix" placeholder="冀G">
                <i class="iconfont icon-dian"></i>
                <input type="text" class="number" placeholder="88888">
            </div>
            <div class="car-type">
                <label>车型：</label>
                <input type="text" placeholder="宝马">
            </div>
        </div>
        <div class="serve section">
            <h2>服务项目</h2>
            <div class="common-serve-options box"></div>
            <div class="add-serve-options box">
                <input type="text" class="option-name" placeholder="输入项目名称，按Enter键">
                <input type="number" class="option-sum" placeholder="价格">
            </div>
            <div class="added-serve-options box"></div>
        </div>
        <div class="pay section">
            <div class="total">合计：<span>0</span> 元</div>
            <ul class="pay-platform box">
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
            <button class="submit">提交</button>
        </div>
    </section>
`;

export const memberSettleAccountsTemplate = `
    <section class="main-section main-member-settle-accounts">
        <input type="text" class="settle-accounts-date">
        <div class="member section">
            <h2>会员信息</h2>
            <div class="member-info"></div>
        </div>
        <div class="serve section">
            <h2>服务项目</h2>
            <div class="member-serve-options box"></div>
            <div class="add-serve-options box">
                <input type="text" class="option-name" placeholder="输入项目名称，按Enter键">
                <input type="number" class="option-sum" placeholder="价格">
            </div>
            <div class="added-serve-options box"></div>
        </div>
        <div class="pay section">
            <div class="total">合计：<span>0</span> 元</div>
            <button class="submit">提交</button>
        </div>
    </section>
`;

export const activateAppTemplate = `
    <section class="main-section activate-app">
        <div class="step first-step">
            <h3>第一步</h3>
            <img class="weixinerweima" src="../resources/weixinerweima.png">
            <p>扫码添加微信好友，并发送下列代码</p>
            <span class="identifier"></span>
        </div>
        <div class="step second-step">
            <h3>第二步</h3>
            <p>将收到的激活码粘贴到输入框内，然后点击激活即可</p>
            <textarea class="key-box" placeholder="输入激活码..."></textarea>
        </div>
        <button class="activate-button">激活</button>
    </section>
`;
