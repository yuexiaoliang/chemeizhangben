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
