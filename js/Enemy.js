var Enemy = function (opts) {
    var opts = opts || {};
    Element.call(this,opts);
    //持有属性状态和图标
    this.status = 'normal';//可为 normal booming boomed
    this.icon = opts.icon;
 //持有属性爆炸相关
    this.boomIcon = opts.boomIcon;
    this.boomCount = 0;
};

//继承Element的方法
Enemy.prototype = new Element();

//down向下移动一个身位
Enemy.prototype.down = function () {
 this.move(0,this.size);
 return this;
};

Enemy.prototype.booming = function(){
    this.status = 'booming';
    this.boomCount += 1;
    if(this.boomCount> 10){
        this.status = 'boomed';
    }
    return this;
}

Enemy.prototype.translate = function (direction) {
    if(direction === 'left'){
        this.move(-this.speed,0);
    }else{
        this.move(this.speed,0);
    }
    return this;
};
Enemy.prototype.draw=function () {
    switch (this.status){
        case 'normal':
            context.drawImage(this.icon,this.x,this.y,this.size,this.size);
            break;
        case 'booming':
            context.drawImage(this.boomIcon,this.x,this.y,this.size,this.size);
            break;
    }
return this;
};
