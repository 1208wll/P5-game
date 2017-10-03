/*父类*/
var Element = function (opts) {
    var opts = opts || {};
    this.x = opts.x;
    this.y = opts.y;
    this.size = opts.size;
    this.speed = opts.speed;
}
//子弹对象原型
Element.prototype = {
    /*相对于当前对象做了什么,向左向右向上向下移动*/
    move: function (x,y) {
        var addX = x || 0;
        var addY = y || 0;
        this.x += x;
        this.y += y;
    },
    draw:function () {

    }
};