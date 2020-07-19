const { path, resolve } = require('path');
const fs = require('fs');

export class PopUp {
    constructor(options, fn) {
        this.options = {
            type: options.type || '', // 类型
            showShade: options.showShade || false, // 是否显示遮罩层
            align: options.align || 'center', // 对齐方式
            x: options.x || 0, // 左边距
            y: options.y || 0, // 上边距
            title: options.title || '', // 提示信息的Title
            msg: options.msg || '提示信息！', // 提示信息的内容
            buttons: options.buttons || [], // 按钮列表
        };
        this.fn = fn || false; // 回调函数
        // this.create();
    }
    /**
     * 创建弹出框
     */
    createPopUp() {
        // 如果已经创建过则返回已经创建的弹出框
        if (
            this.options.showShade &&
            document.body.querySelector('.pop-up-shade')
        ) {
            return document.body.querySelector('.pop-up-shade .pup-up');
        }
        if (document.body.querySelector('.pop-up')) {
            return document.body.querySelector('.pop-up');
        }

        // 创建弹出框元素
        const popUp = document.createElement('div');
        popUp.classList.add('pop-up');
        popUp.classList.add(this.options.align);

        // 如果要显示遮罩层，则创建遮罩层，并把弹出框添加到遮罩层元素中
        // 或者直接添加到body中
        if (this.options.showShade) {
            const shade = document.createElement('div');
            shade.classList.add('pop-up-shade');
            document.body.appendChild(shade);
            shade.appendChild(popUp);
        } else {
            document.body.appendChild(popUp);
        }

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
        closeButton.classList.add('close');
        headerElement.appendChild(closeButton);
        popUp.appendChild(headerElement);
        return headerElement;
    }

    /**
     * 创建弹出框的类型
     */
    createType() {
        // 如果没有设置类型或者类型为“hint”，则退出
        if (!this.options.type || 'hint') {
            return;
        }
        const header = this.createHeader();
        const typeElement = document.createElement('div');
        typeElement.classList.add('pop-up-header-type', this.options.type);
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
    // create() {
    //     if (this.options.type === 'hint') {
    //         this.msg();
    //     }
    //     this.type();
    //     this.title();
    //     this.msg();
    //     this.buttons();
    // }

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
                    document.body.removeChild(popUp);
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

    static getInstance(options, fn) {
        if (!this.instance) {
            this.instance = new PopUp(options, fn);
        }
        return this.instance;
    }
}
