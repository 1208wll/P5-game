// 元素
var container = document.getElementById('game');
var levelText = document.querySelector('.game-level');
var nextLevelText = document.querySelector('.game-next-level');
var scoreText = document.querySelector('.game-info .score');
var totalScoreText = document.querySelector('.game-info-text .score');;
/**
 * 整个游戏对象
 */
//画布
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
//更新画布信息
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;

var GAME = {
  /**
   * 初始化函数,这个函数只执行一次
   * @param  {object} opts 
   * @return {[type]}      [description]
   */
  init: function(opts) {
      //合并对象
    var opts = Object.assign({},CONFIG);
    var self = this;
    var padding = opts.canvasPadding;
    this.padding = padding;
    //怪兽对象相关坐标（极限横坐标，纵坐标）
    this.enemyLimitY = canvasHeight - padding - opts.planeSize.height;
    this.enemyMinX = padding;
    this.enemyMaxX = canvasWidth - padding - opts.enemySize;
    //飞机对象相关坐标（极限横坐标，位置）
    var planeWidth = opts.planeSize.width;
    this.planeMinX = padding;
    this.planeMaxX = canvasWidth - padding - planeWidth;
    this.planePosX = canvasWidth/2-planeWidth;
    this.planePosY = this.enemyLimitY;
    //更新
    this.status = opts.status || 'start';
    this.score = 0;
    this.keyBoard = new keyBoard();
    //this.bindEvent();
    var resources = [
        opts.enemyIcon,
        opts.enemyBoomIcon,
        opts.planeIcon
    ];
    //加载图片才开始点击
      util.resourceOnload(resources,function(images){
        opts.level = 1;
        //获取图片对象
          opts.enemyIcon = images[0];
          opts.enemyBoomIcon = images[1];
          opts.planeIcon = images[2];
          self.opts = opts;
          self.bindEvent();
      })
    this.bindEvent();

  },
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector('.js-play');
    // 开始游戏按钮绑定
      var replayBtns = document.querySelectorAll('.js-replay');
      var nextBtn = document.querySelector('.js-next');
      var back = document.querySelector('.back');
    playBtn.onclick = function() {
      self.play();
    };
    //重玩游戏按钮绑定
    replayBtns.forEach(function (btn) {
        btn.onclick = function () {
            self.opts.level = 1;
            self.play();
            self.score = 0;
            totalScoreText.innerText = self.score;
        };
    });
     //下一关按钮绑定
     nextBtn.onclick = function () {
         self.opts.level += 1;
         self.play();
     };
     window.onload = function () {
         back.onclick = function () {
             self.backhome();

         }
     }
  },
  /**
   * 更新游戏状态，分别有以下几种状态：
   * start  游戏前
   * playing 游戏中
   * failed 游戏失败
   * success 游戏成功
   * all-success 游戏通过
   * stop 游戏暂停（可选）
   */
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  play: function() {
  //获取游戏初始化(生成怪兽->更新怪兽->绘画怪兽)
    var self = this;
    var opts = this.opts;
    var padding = this.padding;
    var level = opts.level;
    var numPerLine = opts.numPerLine;
    var enemyGap = opts.enemyGap;
    var enemySize = opts.enemySize;
    var enemySpeed = opts.enemySpeed;
    var enemyIconImage = opts.enemyIcon;
    var enemyBoomIconImage = opts.enemyBoomIcon;
    var planeIconImage = opts.planeIcon;
    //清空射击目标对象数组
    this.enemies = [];
    for(var i=0;i<level;i++){
      for(var j=0;j<numPerLine;j++){
       //每个元素的信息
       var initOpt = {
         x: padding + j * (enemyGap+enemySize),
         y: padding + i * enemySize,
         size: enemySize,
         speed: enemySpeed,
         icon: enemyIconImage,
         boomIcon: enemyBoomIconImage,
       }
       this.enemies.push(new Enemy(initOpt));
      }
    }
    //创建主角元素
      this.plane = new Plane({
          x:this.planePosX,
          y:this.planePosY,
          size:opts.planeSize,
          speed:opts.planeSpeed,
          bulletSize:opts.bulletSize,
          bulletSpeed:opts.bulletSpeed,
          icon:planeIconImage

      });
    this.renderLevel();
    this.setStatus('playing');
    //开始动画循环
    this.update();
  },
  backhome:function () {
      self.close();

  },
  pause:function () {
      this.setStatus('pause');
    },
  end: function (type) {
      context.clearRect(0,0,canvasWidth,canvasHeight);
      this.setStatus(type);
  },
    //更新怪兽（判断是否需要向下移动->向左右移动->是否击中）
    /*更新操作
    动画循环（清除->更新->绘制）
    * */
    update: function () {
      var self = this;
      var opts = this.opts;
      var padding = opts.padding;
      var enemySize = opts.enemySize;
      var enemies = this.enemies;
      context.clearRect(0,0,canvasWidth,canvasHeight);
       //更新操作
        this.updatePanel();
        this.updateEnemies();
       //如果目标元素，则证明通关了
        if(enemies.length === 0){
            //判断是否全部关卡通过
            var endType = opts.level === opts.totalLevel ? 'all-success':'success';
            this.end(endType);
            //停止动画循环
            return;
        }
        //判断最后一个元素是否到达底部，是则游戏结束
        if(enemies[enemies.length-1].y >= this.enemyLimitY){
            this.end('failed');
            //停止动画下循坏
            return;
        }
       //绘制画布
      this.draw();
      //不断循环，递归
      requestAnimFrame(function () {
          self.update();
      });
    },
    //更新飞机，具体一下操作
   // 1.判断是否点击了键盘移动飞机
   // 2.判断是否需要子弹
    updatePanel:function () {
        var plane = this.plane;
        var keyBoard = this.keyBoard;
        if(keyBoard.pressedLeft && plane.x > this.planeMinX){
            plane.translate('left');
        }
        if(keyBoard.pressedRight && plane.x < this.planeMaxX){
            plane.translate('right');
        }
        //如果按上空格或者向上的键，则射击
        if(keyBoard.pressedUp || keyBoard.pressedSpace){
            plane.shoot();
            keyBoard.pressedUp = false;
            keyBoard.pressedSpace = false;
        }
        },
    updateEnemies:function(){
        var opts = this.opts;
        var padding = opts.padding;
        var enemySize = opts.enemySize;
         var enemies = this.enemies;
         var plane = this.plane;
        var enemyNeedDown = false;
        var i = enemies.length;
        var enemiesBoundary = util.getHorizontalBoundary(enemies);
        //判断目标是否到了水平边界，是的话更改方向向下移动
        if(enemiesBoundary.minX < this.enemyMinX ||
            enemiesBoundary.maxX > this.enemyMaxX){
            opts.enemyDirection = opts.enemyDirection === 'right'?'left':'right';
            enemyNeedDown = true;
        }
        while(i--){
            var enemy = enemies[i];
            if(enemyNeedDown){
                enemy.down();
            }
            enemy.translate(opts.enemyDirection);
            switch (enemy.status){
                case 'normal':
                    //判断是否击中未爆炸的敌人
                    if(plane.hasHit(enemy)){
                        enemy.booming();
                    }
                    break;
                case 'booming':
                    enemy.booming();
                    break;
                case 'boomed':
                    this.enemies.splice(i,1);
                    this.score +=1;
            }
        }
    },
    draw: function () {
        //所有怪兽重绘
        this.renderScore();
        this.plane.draw()//绘制飞机
        this.enemies.forEach(function (enemy) {
            enemy.draw();
        });
    },
    renderLevel: function() {
        levelText.innerText = '当前Level：' + this.opts.level;
        nextLevelText.innerText = '下一个Level： ' + (this.opts.level + 1);
    },
    renderScore: function() {
        scoreText.innerText = this.score;
        totalScoreText.innerText = this.score;
    }

};
// 初始化
GAME.init();
