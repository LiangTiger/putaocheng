var Puzzle = function (option) {
    this._init(option)
}
Puzzle.prototype = {
    _init: function (option) {
        //当前等级
        this.leverNow = option.leverNow <= 2 ? 2 : option.leverNow || 2;
        //游戏等级（行列储存）
        this.leverArr = [this.leverNow, this.leverNow];
        //图片原始索引数组
        this.imgOrigArr = [];
        //打乱后索引值
        this.imgRandomArr = [];
        //获取按钮的DOM元素
        this.btnObj = document.getElementById("btn");
        // 获取input的DOM元素
        this.inputObj = document.getElementById("file");
        // 获取到图片存放区域
        this.imgArea = document.getElementById("imgArea")
        // 获取点击开始的按钮的DOM元素
        this.gameStartBtnObj = document.getElementById("gameStart");
        // 获取游戏区域的DOM元素
        this.gameAreaObj = document.getElementById('gameArea');
        //获取每一小格子的DOM元素
        this.imgCells = '';
        //获取游戏区域的宽度，最小值为400
        this.imgAreaWidth = option.imgAreaSize <= 400 ? 400 : option.imgAreaSize || 400;
        //获取游戏区域的高度，最小值为400
        this.imgAreaHeight = option.imgAreaSize <= 400 ? 400 : option.imgAreaSize || 400;
        //改变游戏区域的大小
        this.gameAreaObj.style.width = this.imgAreaWidth + "px";
        this.gameAreaObj.style.height = this.imgAreaHeight + "px";
        //计算出每个格子的宽高
        this.cellWidth = this.imgAreaWidth / this.leverArr[1];
        this.cellHeight = this.imgAreaHeight / this.leverArr[0];
        //定义一把锁，让开始游戏的按钮只能点击一次
        this.hasStart = 0;
        //定义第一次点击图片的索引
        this.sel = null;
        //获取图片的地址
        this.imgUrl = "";
    },
    //游戏开始
    gameStart: function () {
        this.getImageUrl()
    },
    getImageUrl: function () {
        // 拿到当前的this
        var self = this;
        // 让按钮点击模拟input点击
        this.btnObj.onclick = function () {
            self.inputObj.click();
        }
        // 监听input的改变事件
        this.inputObj.onchange = function () {
            var Url = window.URL.createObjectURL(this.files[0]);
            // 获取图片路径
            self.imgUrl = Url;
            // 切割图片
            self.imgSplit();
        };
    },
    imgSplit: function () {
        this.imgArea.innerHTML = '';
        var _cell = '';
        for (var i = 0, l = this.leverArr[0]; i < l; i++) {
            for (var j = 0, len = this.leverArr[1]; j < len; j++) {
                this.imgOrigArr.push(i * this.leverArr[0] + j);
                _cell = document.createElement("div");
                _cell.className = "imgCell";
                _cell.index = i * this.leverArr[0] + j;
                _cell.style.width = this.cellWidth + "px";
                _cell.style.height = this.cellHeight + "px";
                _cell.style.left = j * this.cellWidth + "px";
                _cell.style.top = i * this.cellHeight + "px";
                _cell.style.backgroundImage = "url(" + this.imgUrl + ")";
                _cell.style.backgroundSize = this.leverArr[1] + '00% ' + this.leverArr[1] + '00%';
                _cell.style.backgroundPosition = (-j) * this.cellWidth + 'px ' + (-i) * this.cellHeight + 'px';
                _cell.style.backgroundOrigin = "border-box";
                _cell.style.backgroundRepeat = "no-repeat";
                this.imgArea.appendChild(_cell);
            }
        }
        this.imgCells = document.querySelectorAll('.imgCell');
        console.log(this.btnObj.offsetWidth)
        this.btnObj.style.left = -this.btnObj.offsetWidth + 'px';
        this.gameAreaObj.style.left = "50%";
        this.gameAreaObj.style.transform = "translateX(-50%)";
        document.body.style.overflowY = "auto";
        this.gameStartBtnObj.onclick = this.clickHandle();
    },
    clickHandle: function () {
        var _self = this;
        return function () {
            if (_self.hasStart == 0) {
                _self.hasStart = 1;
                _self.randomArr();
                _self.cellOrder();
                _self.imgArea.onclick = function (ev) {
                    var target = ev.target
                    if (target.nodeName.toLowerCase() == "div") {
                        if (_self.sel === null) {
                            _self.sel = target.index;
                            target.style.border = "2px solid red";
                        } else {
                            _self.imgCells.forEach(function (element) {
                                element.style.border = "1px solid #fff";
                            })
                            if (target.index === _self.sel) {
                                _self.sel = null;
                                return
                            } else {
                                _self.cellExchange(_self.sel, target.index);
                            }
                            _self.sel = null;
                        }
                    }
                }
            }
        }
    },
    randomArr: function () {
        // 清空乱序数组
        this.imgRandomArr = [];
        // 判断原来的数组是否和乱序数组一样
        var _flag = true;
        // 遍历原始索引
        for (var i = 0, l = this.imgOrigArr.length; i < l; i++) {
            // 获取从0到数组长度之间的一个索引值
            var order = Math.floor(Math.random() * this.imgOrigArr.length);
            // 如果乱序数组中没有值就直接添加
            // 否则就在这个乱序数组中找对应的随机数的索引，找不到就添加,找到就继续随机
            if (this.imgRandomArr.length > 0) {
                while (this.imgRandomArr.indexOf(order) > -1) {
                    order = Math.floor(Math.random() * this.imgOrigArr.length);
                }
            }
            this.imgRandomArr.push(order);
        }

        // 判断乱序数组和原始数组是否一样
        if (this.imgRandomArr.length === this.imgOrigArr.length) {
            // 遍历数组
            for (var i = 0, l = this.imgOrigArr.length; i < l; i++) {
                if (this.imgRandomArr[i] != this.imgOrigArr[i]) {
                    _flag = false;
                    break;
                } else {
                    _flag = true;
                }
            }
        } else {
            _flag = true;
        }

        // 返回值为true的话 就代表原始数组和乱序数组一致，重新打乱数组
        if (_flag) {
            this.randomArr();
        }
    },
    cellOrder: function () {
        var _self = this;
        this.imgCells.forEach(function (element, index) {
            element.style.left = _self.imgRandomArr[index] % _self.leverArr[1] * _self.cellWidth + "px";
            element.style.top = Math.floor(_self.imgRandomArr[index] / _self.leverArr[1]) * _self.cellHeight + 'px';
        })
    },
    cellExchange: function (from, to) {
        var _fromRow = Math.floor(this.imgRandomArr[from] / this.leverArr[1]);
        var _fromCol = this.imgRandomArr[from] % this.leverArr[1];
        var _toRow = Math.floor(this.imgRandomArr[to] / this.leverArr[1]);
        var _toCol = this.imgRandomArr[to] % this.leverArr[1];
        this.imgCells[from].style.left = _toCol * this.cellWidth + "px";
        this.imgCells[from].style.top = _toRow * this.cellHeight + "px";
        this.imgCells[to].style.left = _fromCol * this.cellWidth + "px";
        this.imgCells[to].style.top = _fromRow * this.cellHeight + "px";
        var _temp = this.imgRandomArr[from];
        this.imgRandomArr[from] = this.imgRandomArr[to];
        this.imgRandomArr[to] = _temp;
        if (this.imgOrigArr.toString() === this.imgRandomArr.toString()) {
            this.success();
        }
    },
    success: function () {
        this.hasStart = 0;
        setTimeout(function () {
            alert("已完成")
        }, 500);
    }
}