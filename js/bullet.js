var Bullet = function (opts) {
    var opts = opts || {};
    Element.call(this, opts);
}
Bullet.prototype = new Element();
//fly向上移动
Bullet.prototype.fly = function () {
    this.move(0, -this.speed);
    return this;
};
//判断是否碰撞
Bullet.prototype.hasCrash = function (target) {
    var crashX = target.x < this.x && this.x < (target.x + target.size);
    var crashY = target.y < this.y && this.y < (target.y + target.size);
//如果子弹击中目标则销毁子弹
    if (crashX && crashY) {
        return true;
    }
    return false;
};
//绘画子弹（线条）
Bullet.prototype.draw = function () {
    context.beginPath();
    context.strokeStyle = '#fff';
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y - this.size);//子弹尺寸不支持修改
    context.closePath();
    context.stroke();
    return this;
}