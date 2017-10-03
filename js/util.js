//requestAnimationFrame告诉浏览器希望执行动画，
// 并希望浏览器调用指定的的函数一次重绘之前更新动画
//util工具对象
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
    window.setTimeout(callback,1000/30);
    };

/*获取目标对象实例中最小横坐标和最大横坐标
* */
 function getHorizontalBoundary (arrs) {
     var minX, maxX;
     arrs.forEach(function (item) {
         if (!minX && !maxX) {
             minX = item.x;
             maxX = item.x;
         } else {
             if (item.x < minX) {
                 minX = item.x;
             }
             if (item.x > maxX) {
                 maxX = item.x;
             }
         }
     });
     return {
         minX: minX,
         maxX: maxX
     }
 }

//resource资源列表
function resourceOnload(resources,callback) {
    var total = resources.length;
    var finish = 0;
    var images = [];
    for(var i=0;i<total;i++){
        images[i] = new Image();
        images[i].src = resources[i];
        images[i].onload = function () {
            finish++;
            if(finish == total){
                callback(images);
            }
        }
    }
};
var util = {
    getHorizontalBoundary: getHorizontalBoundary,
    resourceOnload: resourceOnload
};