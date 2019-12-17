import { $ } from "./module_tool.js";
function Tab(options) { //配置参数
    this.settings = { //默认参数
        selector: '#tab', //选择器
        etype: 'onclick', //事件类型
        autoplay: false, //自动切换
        invoke: 1 //一开始默认第几项为激活状态
    };
    this.options = options;
    this.init();
}
//初始化
Tab.prototype.init = function () {
    let _this = this;
    Object.assign(this.settings, this.options); //配置取代默认参数

    this.tab = $(this.settings.selector); //获取tab元素
    this.tab_title = this.tab.querySelector('.tab_title'); //切换按钮的父框
    this.tab_content = this.tab.querySelector('.tab_content'); //切换内容的父框

    if (this.tab_title.children.length > 1) {
        this.tab_btns = this.tab_title.children;
    } else if (this.tab_title.children.length === 1) {
        this.tab_btns = this.tab_title.children[0].children;
    }

    this.tab_items = this.tab_content.querySelectorAll('.item'); //切换内容
    this.timer = null;
    this.num = 0;

    //添加事件
    for (let i = 0; i < this.tab_btns.length; i++) {
        if (this.settings.etype === 'onclick' || this.settings.etype !== 'onmouseover') {
            this.tab_btns[i]['onclick'] = function () {
                _this.num = i;
                _this.tabswitch(i)
            }
        } else {
            this.tab_btns[i][this.settings.etype] = function () {
                _this.timer = setTimeout(function () {
                    _this.num = i;
                    _this.tabswitch(i)
                }, 300);
            }
            this.tab_btns[i]['onmouseout'] = function () {
                clearTimeout(_this.timer);
            }
        }

    }

    //自动切换
    if (this.settings.autoplay) {
        let t = null;
        t = setInterval(function () {
            _this.autopaly();
        }, 2000);
        this.tab.onmouseover = function () {
            clearInterval(t);
        };
        this.tab.onmouseout = function () {
            t = setInterval(function () {
                _this.autopaly();
            }, 2000);
        }
    }

    //默认的激活状态
    if (typeof this.settings.invoke === 'number' && this.settings.invoke <= this.tab_btns.length && this.settings.invoke >= 1) {
        this.activeinvoke();
    }

};
//切换过程
Tab.prototype.tabswitch = function (i) {
    for (let j = 0; j < this.tab_btns.length; j++) {
        this.removeclass(this.tab_btns[j], 'active');
        this.removeclass(this.tab_items[j], 'show');
    }
    this.addclass(this.tab_btns[i], 'active');
    this.addclass(this.tab_items[i], 'show');
};

//自动切换
Tab.prototype.autopaly = function () {
    this.num++;
    if (this.num > this.tab_btns.length - 1) {
        this.num = 0;
    }
    this.tabswitch(this.num);
}

//默认的激活状态
Tab.prototype.activeinvoke = function () {
    this.num = this.settings.invoke - 1;
    this.tabswitch(this.num);
}

//类选择器的添加和删除
Tab.prototype.addclass = function (ele, classname) {
    if (ele instanceof NodeList) {
        for (let i = 0; i < ele.length; i++) {
            ele[i].nodeType === 1 && (ele[i].className += ' ' + classname + ' ');
        }
    } else if (ele instanceof Node) {
        ele.nodeType === 1 && (ele.className += ' ' + classname + ' ');
    }
};

Tab.prototype.removeclass = function (ele, classname) {
    //获取当前元素的类名  <div class='box1 box2 box3'></div>
    let arrclass = ele.className.split(' ');
    let index = arrclass.indexOf(classname);
    if (index !== -1) {
        arrclass.splice(index, 1);
    }
    //[box1,box3]
    ele.className = arrclass.join(' '); //赋值类名
};

export { Tab };