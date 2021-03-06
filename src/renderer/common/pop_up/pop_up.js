export class PopUp {
    constructor(options, fn) {
        this.options = {
            addClass: options.addClass || false,
            type: options.type || '', // 类型
            showShade: options.showShade || true, // 是否显示遮罩层
            align: options.align || 'center', // 对齐方式
            x: options.x || 0, // 左边距
            y: options.y || 0, // 上边距
            title: options.title || '', // 提示信息的Title
            msg: options.msg || '提示信息！', // 提示信息的内容
            buttons: options.buttons || [], // 按钮列表
        };
        this.fn = fn || function () {}; // 回调函数
    }
    /**
     * 创建弹出框
     */
    createPopUp() {
        // 如果已经创建过则返回已经创建的弹出框
        if (document.body.querySelector('.pop-up-shade')) {
            return document.body.querySelector('.pop-up-shade .pop-up');
        }
        if (document.body.querySelector('.pop-up')) {
            return document.body.querySelector('.pop-up');
        }

        // 创建遮罩层

        const shade = document.createElement('div');
        shade.classList.add('pop-up-shade');
        if (this.options.showShade) {
            shade.classList.add('show');
        }
        document.body.appendChild(shade);

        // 创建弹出框元素
        const popUp = document.createElement('div');
        popUp.classList.add('pop-up', this.options.align);
        if (this.options.addClass) {
            popUp.classList.add(this.options.addClass);
        }

        shade.appendChild(popUp);

        // 如果设置了左边距，则进行设置
        if (this.options.x) {
            popUp.style.marginLeft = this.options.x + 'px';
        }

        // 如果设置了上边距，则进行设置
        if (this.options.y) {
            popUp.style.marginTop = this.options.y + 'px';
        }

        // 返回创建的弹出框
        return popUp;
    }

    /**
     * 获取 pop-up 元素
     */
    getPopUp() {
        return this.createPopUp();
    }

    /**
     * 删除 pop-up 元素
     */
    removePopUp() {
        if (document.body.querySelector('.pop-up-shade')) {
            document.body.removeChild(
                document.body.querySelector('.pop-up-shade')
            );
        }
    }

    /**
     * 创建弹出框的Header区域
     */
    createHeader() {
        const popUp = this.createPopUp();
        if (popUp.querySelector('.pop-up-header')) {
            return popUp.querySelector('.pop-up-header');
        }
        const headerElement = document.createElement('header');
        headerElement.classList.add('pop-up-header');
        const closeButton = document.createElement('span');
        closeButton.classList.add('close', 'iconfont', 'icon-close');
        headerElement.appendChild(closeButton);
        popUp.appendChild(headerElement);

        closeButton.onclick = () => {
            this.removePopUp();
        };
        return headerElement;
    }

    /**
     * 创建弹出框的类型
     */
    createType() {
        // 如果没有设置类型或者类型为“hint”，则退出
        if (!this.options.type || this.options.type === 'hint') {
            return;
        }
        const header = this.createHeader();
        const typeElement = document.createElement('div');
        typeElement.classList.add(
            'pop-up-header-type',
            'iconfont',
            this.options.type
        );
        header.appendChild(typeElement);
    }

    /**
     * 创建弹出框的Title
     */
    createTitle() {
        if (!this.options.title) {
            return;
        }
        const header = this.createHeader();
        const titleElement = document.createElement('div');
        titleElement.classList.add('pop-up-header-title');
        titleElement.innerHTML = this.options.title;
        header.appendChild(titleElement);
    }

    /**
     * 创建弹出框的提示信息
     */
    createMsg() {
        const popUp = this.createPopUp();
        const msgElement = document.createElement('div');
        msgElement.classList.add('pop-up-msg');
        msgElement.innerHTML = this.options.msg;
        popUp.appendChild(msgElement);
    }

    /**
     * 创建弹出框按钮
     */
    createButtons() {
        if (!this.options.buttons.length) {
            return;
        }
        const popUp = this.createPopUp();
        const buttonsElement = document.createElement('div');
        buttonsElement.classList.add('pop-up-buttons');
        for (let i = 0; i < this.options.buttons.length; i++) {
            const buttonElement = document.createElement('button');
            buttonElement.classList.add('button');
            buttonElement.innerHTML = this.options.buttons[i];
            buttonsElement.appendChild(buttonElement);
            buttonElement.addEventListener('click', () => {
                this.fn(i);
            });
        }
        popUp.appendChild(buttonsElement);
    }

    /**
     * 只创建一个提示信息框
     * @param {Object} options 实例的选项列表
     * @param {Function} fn 实例的回调
     */
    static hint(options, fn) {
        const hint = new PopUp(options, fn);
        const popUp = hint.createPopUp();
        let timer,
            popUpOpacity = 0;
        popUp.classList.add('hint');
        popUp.innerHTML = options.msg;

        popUp.style.opacity = popUpOpacity;

        // 显示提示框的动画
        timer = setInterval(function () {
            popUpOpacity += 0.1;
            if (popUpOpacity >= 1) {
                popUp.style.opacity = 1;
                clearInterval(timer);
                return;
            }
            popUp.style.opacity = popUpOpacity;
        }, 26);

        // 2秒后删除提示框
        setTimeout(() => {
            // 隐藏提示框的动画
            timer = setInterval(function () {
                popUpOpacity -= 0.1;
                if (popUpOpacity <= 0) {
                    clearInterval(timer);
                    hint.removePopUp();
                }
                popUp.style.opacity = popUpOpacity;
            }, 26);

            // 260毫秒后执行回调函数
            if (
                Object.prototype.toString.call(hint.fn) === '[object Function]'
            ) {
                setTimeout(() => {
                    hint.fn();
                }, 260);
            } else {
                console.error('第二个参数只能是function');
            }
        }, 2000);
    }

    static open(options, fn) {
        const hint = new PopUp(options, fn);
        hint.createType();
        hint.createTitle();
        hint.createMsg();
        hint.createButtons();
        hint.getPopUp().classList.add('open');
    }
}
