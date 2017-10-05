/**
 * 键盘操作对象
 */

var keyBoard = function () {
    document.onkeydown = this.keydown.bind(this);
    document.onkeyup = this.keyup.bind(this);
}

keyBoard.prototype = {
    pressedLeft:false,//是否点击了左边
    pressedRight:false,//是否点击了右边
    pressedUp:false,//是否点击了上边
    pressedSpace:false,//是否点击了空格
    keydown:function (event) {
        //获取键位
        var key = event.keyCode;
        switch(key){
            //点击空格
            case 32:
                this.pressedSpace = true;
                break;
             //点击向左
            case 37:
                this.pressedLeft = true;
                this.pressedRight = false;
                break;
             //点击向上
            case 38:
                this.pressedUp = true;
                break;
            //点击向右
            case 39:
                this.pressedLeft = false;
                this.pressedRight = true;
                break;
        }
    },

    keyup:function (event) {
        var key = event.keyCode;
        switch (key){
            case 32:
                this.pressedSpace = false;
                break;
            //点击向左
            case 37:
                this.pressedLeft = false;
                break;
            //点击向上
            case 38:
                this.pressedUp = false;
                break;
            //点击向右
            case 39:
                this.pressedRight = false;
                break;
        }
    }
};