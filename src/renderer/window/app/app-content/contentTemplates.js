export const settingTemplate = `
    <section class="main-section main-setting">
        <div class="setting-box setting-options setting-member-serve-options">
            <h3 class="box-title">会员结算项目：</h3>
            <div class="box-detail">
                <div class="describe"><b>会员用户</b>结算时默认可选的服务项目，可以简化反复的输入</div>
                <div class="form">
                    <input class="name" type="text" placeholder="项目名称">
                    <input class="price" type="number" min="0" placeholder="价格">
                    <button class="add">添加</button>
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-options setting-common-serve-options">
            <h3 class="box-title">普通结算项目：</h3>
            <div class="box-detail">
                <div class="describe"><b>普通用户</b>结算时默认可选的服务项目，可以简化反复的输入</div>
                <div class="form">
                    <input class="name" type="text" placeholder="项目名称">
                    <input class="price" type="number" min="0" placeholder="价格">
                    <button class="add">添加</button>
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-options setting-license-plate-prefix">
            <h3 class="box-title">车牌照前缀：</h3>
            <div class="box-detail">
                <div class="describe">结算时<b>车牌照前缀</b>默认可选的选项，可以简化反复的输入</div>
                <div class="form">
                    <input class="name" type="text" placeholder="车牌照前缀，如：冀G">
                    <button class="add">添加</button>
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-license-plate-prefix-default">
            <h3 class="box-title">自动牌照前缀：</h3>
            <div class="box-detail">
                <div class="describe">自动添加的车牌照前缀，省去每次都要手动选择的操作</div>
                <div class="form">
                    <input type="text">
                </div>
                <span class="save">保存</span>
            </div>
        </div>
        <div class="setting-box setting-options setting-car-type">
            <h3 class="box-title">车辆类型：</h3>
            <div class="box-detail">
                <div class="describe">结算时<b>车型</b>默认可选的前缀选项，可以简化反复的输入</div>
                <div class="form">
                    <input class="name" type="text" placeholder="车型，如：宝马">
                    <button class="add">添加</button>
                    <span class="hint"></span>
                </div>
                <ul class="list"></ul>
            </div>
        </div>
        <div class="setting-box setting-data-location">
            <h3 class="box-title">数据储存目录：</h3>
            <div class="box-detail">
                <div class="describe">您的数据保存在此文件夹中，<b>和软件初始设置中的数据储存目录一致</b></div>
                <div class="form">
                    <input class="location" type="text" readonly>
                    <button class="change">更改目录</button>
                    <button class="open">打开文件夹</button>
                </div>
                <span class="save">保存</span>
            </div>
        </div>
        <div class="setting-box setting-password">
            <h3 class="box-title">程序密码：</h3>
            <div class="box-detail">
                <div class="describe">在进行程序解锁，或者一些敏感操作的时候，需要验证密码，<b>和软件初始设置中的程序密码一致</b></div>
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
            <span>称呼</span>
            <span class="sort">车辆<i class="icon"></i></span>
            <span class="sort">共充值<i class="icon"></i></span>
            <span class="sort">共消费<i class="icon"></i></span>
            <span class="sort">余额<i class="icon"></i></span>
            <span>备注</span>
            <span>详情</span>
        </header>
        <ul class="main-member-list"></ul>
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
                    <label>称呼：</label>
                    <input type="text" placeholder="输入称呼...">
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
                    <label>牌照：</label>
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
                <h2>会员充值</h2>
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
                <span>称呼</span>
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
                <button class="button settle-accounts">结账</button>
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
            <input type="search" class="search-input" placeholder="搜索" autofocus>
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
