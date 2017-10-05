
var Plane = function(opts){
    var opts = opts || {};
    Element.call(this,opts);
    //特有属性
    this.icon = opts.icon;
    //子弹属性
    this.bullets = [];
    this.bulletSpeed = opts.bulletSpeed;
    this.bulletSize = opts.bulletSize;
    //控制射击频率
    this.lastShoot = Date.now();
}

//继承Element的方法
Plane.prototype = new Element();

//判断是否击中
Plane.prototype.hasHit = function (target) {
    var bullets = this.bullets;
    var hasHit = false;
    for(var j = bullets.length - 1;j >= 0;j--){
        //如果击中的是目标以外的东西则销毁子弹
        if(bullets[j].hasCrash(target)){
            this.bullets.splice(j,1);
            hasHit = true;
            break;
        }
    }
    return hasHit;
}

//左右移动飞机
Plane.prototype.translate = function (direction) {
    var speed = this.speed;
    var addX;
    if(direction === 'left'){
        this.move(-speed,0);
    }else{
        this.move(speed,0);
    }
    return this;
};

//shoot(发射子弹)
Plane.prototype.shoot = function () {
    //200ms可以射击一次
    if(Date.now() - this.lastShoot > 200){
    //创建子弹，子弹居中射出
        var x = this.x + this.size.width/2;
       this.bullets.push(new Bullet({
           x:x,
           y:this.y,
           size:this.bulletSize,
           speed:this.bulletSpeed,
       }));
       //更新上次射击时间
        this.lastShoot = new Date();
        return this;
    }
}

//画子弹
Plane.prototype.drawBullets = function () {
    var bullets = this.bullets;
    var i = bullets.length;
    while(i--){
        var bullet = bullets[i];
        //更新子弹的位置
        bullet.fly();//更新和绘制耦合在一起了
        //如果子弹超出边界则删除
        if(bullet.y <= 0) {
           bullets.splice(i,1);
        }else{
            //未超出边界则绘画子弹
            bullet.draw();
        }
    }
}

//draw方法
Plane.prototype.draw = function () {
    //绘制飞机
    context.drawImage(this.icon,this.x,this.y,this.size.width,this.size.height);
    this.drawBullets();
    return this;

}

