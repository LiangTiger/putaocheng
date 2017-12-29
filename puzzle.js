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
            this.gameAreaObj = document.getElementById('ganmeArea');
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
            //获取图片的base64编码的地址
            this.imgUrl = "";
        },
        //游戏开始
        gameStart: function () {
            this.getImageUrl()
        },
        getImageUrl: function () {
            var self = this;
            this.btnObj.onclick = function () {
                    self.inputObj.click();
                },
                this.inputObj.onchange = function () {
                    var files = this.files;
                    var reader = new FileReader();
                    reader.readAsDataURL(files[0]);
                    reader.onload = function () {
                        self.imgUrl = reader.result;
                        self.imgSplit();
                    }
                }

        },
        imgSplit: function () {
            this.imgArea.innerHTML = '';
            var _cell = '';
            for (var i = 0, l = this.leverArr[0]; i < l; i++) {
                for (var j = 0, l = this.leverArr[1]; j < l; j++) {
                    this.imgOrigArr.push(i * this.leverArr[0] + j);
                    _cell = document.createElement("div");
                    _cell.className = "imgCell";
                    _cell.index = i * this.leverArr[0] + j;
                    _cell.style.width = this.cellWidth + "px";
                    _cell.style.height = this.cellHeight + "px";
                    _cell.style.left = j * this.cellwidth + "px";
                    _cell.style.top = i * this.cellWidth + "px";
                    _cell.style.backgroundPosition = (-j) * this.cellWidth + "px " + (-i) * this.cellHeight + "px";
                    _cell.style.backgroundOrigin = "border-box";
                    this.imgArea.appendChild(_cell);
                }
            }
            this.imgCells = document.querySelectorAll('.imgCell');
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
                    for(var i=0,l=_self.imgCells.length;i<l;i++){
                        _self.imgCells[i].onclick=function(){
                            if(_self.sel===null){
                                _self.sel=this.index;
                                this.style.border="2px solid red";
                            }else{
                                _self.imgCells.forEach(function(element){
                                    element.style.border="1px solid #fff";
                                })
                                if(this.index===_self.sel){
                                    _self.sel=null;
                                    return
                                }else{
                                    _self.cellExchange(_self.sel,this.index);
                                }
                                _self.sel=null;
                            }
                        }
                    }

                }
            }
        },
        randomArr:function(){
            this.imgRandomArr=[];
            var _flag=ture;
            for(var i=0,l=this.imgOrigArr.length;i<l;i++){
                var order=Math.floor(Math.random()*this.imgOrigArr.length);
                if(this.imgRandomArr.length>0){
                    while(this.imgRandomArr.indexOf(order)>-1){
                        order=Math.floor(Math.random()*this.imgOrigArr.length)
                    }
                }
                this.imgRandomArr.push(order);
            }
            if(this.imgRandomArr.length=this.imgOrigArr.length){
                for(var i=0,l=this.imgOrigArr.length;i<l;i++){
                    if(this.imgRandomArr[i]!=this.imgOrigArr[i]){
                        _flag=false;
                        break;
                    }else{
                        _flas=ture;
                    }
                }
            }else{
                _flag=ture;
            }
            if(_flag){
                this.randomArr();
            }
        }
    }