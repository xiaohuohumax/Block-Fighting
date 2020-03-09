//工具类
class Tools {
    static probablyFunction(probably, callback) {// 概率调用函数 0-100% callback
        this.randomNumber(0, 100) < probably ? callback() : "";
    }
    static randomNumber(start, end) {// 获取范围内随机整数
        return Math.floor(Math.random() * (end - start + 1)) + start;
    }
    static isRectIntersect(x1, y1, x2, y2, ax1, ay1, ax2, ay2) {// 判断矩形是否相交
        if (x1 < ax1) {//选择左边的矩形
            if ((ax2 >= x1) && (ay2 >= y1) && (x2 >= ax1) && (y2 >= ay1)) {
                return true;
            }
        } else {//选择右边边的矩形
            if ((x2 >= ax1) && (y2 >= ay1) && (ax2 >= x1) && (ay2 >= y1)) {
                return true;
            }
        }
        return false;
    }
    static isRectIntersectByCoor(coor1, coor2) {// 判断矩形是否相交 [x1,y1,x2,y2],[x1,y1,x2,y2]
        return this.isRectIntersect(coor1[0], coor1[1], coor1[2], coor1[3], coor2[0], coor2[1], coor2[2], coor2[3]);
    }
    static isArcIntersect(x1, y1, r1, x2, y2, r2) {// 判断两圆是否相交
        return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)) <= (r1 + r2);
    }
    static isArcIntersectByCoor(x1, x2) {// 判断两圆是否相交 [x1,y1,r1],[x2,y2,r2]
        return this.isArcIntersect(x1[0], x1[1], x1[2], x2[0], x2[1], x2[2]);
    }
    static randomColor(opacity = 0.5) {// 获取随机颜色
        return "rgba(" + this.randomNumber(0, 255) + "," + this.randomNumber(0, 255) + "," + this.randomNumber(0, 255) + "," + opacity + ")";
    }
    static byDegGetXY(deg) {// 单位圆度数坐标
        return [Math.cos(deg * Math.PI / 180).toFixed(3), Math.sin(deg * Math.PI / 180).toFixed(3)];
    }
    static byXYGetDeg(x2, y2) {// 根据坐标得出关于x轴的度数 0-360
        let res = Math.atan2(x2, -y2) * 180 / Math.PI - 90;
        return res > 0 ? res : (360 + res);
    }
    static ByXYGetLen(lenx, leny) {// 直角边求斜边长
        return Math.sqrt(Math.pow(Math.abs(lenx), 2) + Math.pow(Math.abs(leny), 2));
    }
    static showInformation(text, time = 3000) {// 显示信息
        $("#informetion").css("display", "block");
        $("#informetion").text(text);
        setTimeout(() => {
            $("#informetion").css("display", "none");
        }, time);
    }
    static stringRepeat(str, num) {// 字符串重复
        return num > 0 ? str += this.stringRepeat(str, --num) : "";
    }
    static stringNumFormat(num, sum) {// 字符串整理输出前补零  数字-位数
        return this.stringRepeat("0", sum - (num + "").length) + num;
    }
    static stringToCode(str) {// 字母转ASCII码(忽略大小写,键盘码)
        return (str.toUpperCase()).charCodeAt();
    }
    static codeToString(num) {// ASCII码转字母
        return String.fromCharCode(num);
    }
}
// 键盘监视包装类
class KeydownList {
    constructor() {
        this.listKeyQuick = [];// 键盘事件序列
        this.listKeyOnly = [];// 键盘事件序列
        this.listKeyQuickFlag = {};// 按键按下序列
        this.rAFrame = "";// 帧
        this.init();
    }
    init() {
        let _this = this;
        $(document).keydown(function (event) {
            _this.listKeyQuickFlag[event.keyCode] = true;
            for (let x = 0; x < _this.listKeyOnly.length; x++) {
                _this.listKeyOnly[x](event.keyCode);
            }
        });
        $(document).keyup(function (event) {
            _this.listKeyQuickFlag[event.keyCode] = false;
        });
        (function keyFrame() {
            for (let value in _this.listKeyQuickFlag) {
                if (_this.listKeyQuickFlag[value]) {
                    for (let x = 0; x < _this.listKeyQuick.length; x++) {
                        _this.listKeyQuick[x](value);
                    }
                }
            }
            setTimeout(() => {
                requestAnimationFrame(keyFrame);
            }, 10);
        })();
    }
    addKeydownOnly(fun) {// 添加键盘事件 func(event)
        this.listKeyOnly.push(fun);
    }
    addKeydownQuick(fun) {// 添加键盘事件 func(event)
        this.listKeyQuick.push(fun);
    }
    deleteKeydown() {// 删除所有键盘序列
        this.listKeyQuick = [];
        this.listKeyOnly = [];
    }
}
// 画布包装类
class Canvas {
    constructor(canvasid) {// canvas绑定id
        this.canvas = document.getElementById(canvasid);
        this.requestList = [];// 当前帧缓存绘画
        this.canvasWidth = this.canvas.width;// 设置canvas封装宽度
        this.canvasHeight = this.canvas.height;
    }
    frameAdd(callBack) {// 添加当前帧内容 callback function(ctx){ctx.fillRect(0,0,100,100);}
        this.requestList.push(callBack);
    }
    changeSize() {// 重新设置canvas封装宽度
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    }
    frameDraw() {// 刷新并绘制当前帧
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let x = 0; x < this.requestList.length; x++) {
            ctx.beginPath();
            this.requestList[x](ctx);
            ctx.closePath();
        }
        this.requestList = [];// 清空请求队列
    }
}
// 模块
class Block {
    constructor(drawCanvas, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "") {
        this.drawCanvas = drawCanvas;// 绘制目标canvas对象
        this.centerX = centerX;// 起始坐标X
        this.centerY = centerY;// 起始坐标Y
        this.blockWidth = blockWidth;// 图像宽度
        this.blockHeight = blockHeight;// 图像高度
        this.maxWidth = this.drawCanvas.canvasWidth;// 图像X轴最大区间
        this.maxHeight = this.drawCanvas.canvasHeight;// 图像Y轴最大区间
        this.name = name;// 对象名称
        this.velocity = velocity;// 移动相对速度
        this.deg = deg;// 移动方向
        this.fontFillStye = "black";
        this.fillStyle = fillStyle;// 填充颜色
        this.font = "10px bold 黑体";
        this.textAlign = "center";
        this.textBaseline = "middle";
        this.frameNum = 0;//绘制帧的次数

        this.changeDegAndVelocity(deg, velocity);// 设置角度与移速
    }
    changeDegAndVelocity(deg, velocity) {// 变换角度
        this.velocity = velocity;// 移动相对速度
        this.deg = deg;// 移动方向
        let getXY = Tools.byDegGetXY(this.deg);
        this.addSizeX = getXY[0] * this.velocity;// 帧X轴偏移量
        this.addSizeY = getXY[1] * this.velocity;// 帧Y轴偏移量
    }
    getRectCoordinate() {// 获取对象矩形范围坐标 [x1,y1,x2,y2]
        return [this.centerX - this.blockWidth / 2,
        this.centerY - this.blockHeight / 2,
        this.centerX + this.blockWidth / 2,
        this.centerY + this.blockHeight / 2];
    }
    getArcCoordinate() {// 获取对象圆形范围坐标 [x1,y1,r1] r1=blockWidth/2
        return [this.centerX, this.centerY, this.blockWidth / 2];
    }
    addFrame() {// 添加帧
        this.moveRule();
        this.frameNum++;// 自动增长
        this.frame();
        let res = this.isOver();
        if (res) {
            this.end();
        }
        return res;
    }
    moveRule() {// 移动规则
        this.centerX += this.addSizeX;
        this.centerY += this.addSizeY;
    }
    isOver() {// 删除条件
        return this.centerY > this.maxHeight || this.centerY < 0 || this.centerX > this.maxWidth || this.centerX < 0;
    }
    end() { // 删除对象
        this.endDo();
    }
    frame() { }// 帧
    endDo() { }// 结束后调用
}
//背景
class Bckground extends Block {
    constructor(drawCanvas) {
        super(drawCanvas, Tools.randomNumber(0, drawCanvas.canvasWidth), 4, Tools.randomNumber(30, 70), 0, Tools.randomColor(0.3), 90, parseInt(Tools.randomNumber(6, 10)) / 10, "background");
    }

    frame() {
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
// 移动总类
class Plane extends Block {
    constructor(game, drawCanvas, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 200) {
        super(drawCanvas, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name);
        this.bloodVolume = bloodVolume;// 血量
        this.game = game;// 游戏控制对象
    }
    changeBloodVolume(num, flag = true) {// 血量操作 相对-绝对
        flag ? this.bloodVolume += num : this.bloodVolume = num;
        this.changeBVDo(num, flag);
    }
    frameBloodVolume(ctx) {
        ctx.font = this.font;
        ctx.fillStyle = this.fontFillStye;
        ctx.textAlign = this.textAlign;
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(this.bloodVolume, this.centerX, this.centerY);
    }
    changeBVDo(num, flag) { }// 血量改变之后操作
    isOver() {
        return super.isOver() || this.bloodVolume <= 0;
    }
}
// 敌人
class Enemy extends Plane {
    constructor(game, fireFrame, fireProb, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 200) {
        super(game, game.CEmenty, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
        this.user = game.user;
        this.fireFrame = fireFrame < 10 ? 10 : fireFrame;// 限制发射帧数间隔
        this.fireProb = fireProb > 70 ? 70 : fireProb;// 限制发射概率
    }
    moveRule() {
        super.moveRule();
        let user = this.user;
        if (Tools.isRectIntersectByCoor(user.getRectCoordinate(), this.getRectCoordinate())) {
            user.changeBloodVolume(- this.bloodVolume);
            this.changeBloodVolume(0, false);
        }
    }
    frame() {
        if (this.frameNum % this.fireFrame == 0) {
            Tools.probablyFunction(this.fireProb, () => {
                this.fireBullet();
            });
        }
    }
    fireBullet() { }
    endDo() {
        this.game.randomAddBuff(this.centerX, this.centerY, 5);// 死亡随机掉落buff
    }
}
// 敌人level001 自山而下 发射自上而下的子弹
class Enemy_level001 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 20, 20, "tomato", 90, 1, "enemy001", Tools.randomNumber(100, 150));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.fillRect(_this.centerX - _this.blockWidth / 2, _this.centerY - _this.blockHeight / 2, _this.blockWidth, _this.blockHeight);
            _this.frameBloodVolume(ctx);
        });
    }
    fireBullet() {
        this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, 90));
    }
}
// 敌人level002 自上而下 发射随机角度的子弹 
class Enemy_level002 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 20, 20, "yellow", 90, 1, "enemy001", Tools.randomNumber(200, 250));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2);
            ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY);
            ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
            ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY);
            ctx.fill();
            _this.frameBloodVolume(ctx);
        });
    }
    fireBullet() {
        this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, Tools.randomNumber(2, 178), 3));
    }
}
// 敌人level003 自上而下 发射12个方向的子弹
class Enemy_level003 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 26, 26, "tomato", 90, 1, "enemy001", Tools.randomNumber(80, 100));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            let deleteSize = 5;
            ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2);
            ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY);
            ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
            ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = Tools.randomColor(1);
            ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2 + deleteSize);
            ctx.lineTo(_this.centerX + _this.blockWidth / 2 - deleteSize, _this.centerY);
            ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2 - deleteSize);
            ctx.lineTo(_this.centerX - _this.blockWidth / 2 + deleteSize, _this.centerY);
            ctx.fill();
            _this.frameBloodVolume(ctx);
        });
    }
    fireBullet() {
        for (let x = 1; x <= 12; x++) {
            this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, x * 30, 3, 30000));
        }
    }
}
// 敌人level004 自上而下 发射八个横向定时子弹
class Enemy_level004 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 25, 25, "tomato", 90, 1, "enemy001", Tools.randomNumber(250, 300));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            let deleteSize = 8;
            ctx.fillRect(_this.centerX - _this.blockWidth / 2, _this.centerY + deleteSize - _this.blockHeight / 2, _this.blockWidth, _this.blockHeight - 2 * deleteSize);
            _this.frameBloodVolume(ctx);
        });
    }
    fireBullet() {
        for (let x = 1; x <= 5; x++) {
            let addV = 0.25;
            this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, 0, 3 + x * addV, 1000));
            this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, 180, 3 + x * addV, 1000));
        }
    }
}
// 敌人level005 自上而下 无子弹 消灭后生成四个Enemy_level003
class Enemy_level005 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 25, 25, "tomato", 90, 1, "enemy001", Tools.randomNumber(300, 350));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            let deleteSize = 4;
            ctx.fillStyle = Tools.randomColor(1);
            ctx.fillRect(_this.centerX - _this.blockWidth / 2 + deleteSize, _this.centerY - _this.blockHeight / 2 + deleteSize, _this.blockWidth - 2 * deleteSize, _this.blockHeight - 2 * deleteSize);
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = _this.fillStyle;
            ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2);
            ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY);
            ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
            ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY);
            ctx.fill();
            _this.frameBloodVolume(ctx);
        });
    }
    endDo() {
        if (this.bloodVolume <= 0) {// 掉血致死才分裂
            this.game.listEnemy.push(new Enemy_level003(this.game, this.centerX - 20, this.centerY));
            this.game.listEnemy.push(new Enemy_level003(this.game, this.centerX + 20, this.centerY));
            this.game.listEnemy.push(new Enemy_level003(this.game, this.centerX, this.centerY + 20));
            this.game.listEnemy.push(new Enemy_level003(this.game, this.centerX, this.centerY - 20));
        }
        super.endDo();
    }
}
// 敌人level006 自上而下 发射定时炸弹10s内线性变大10s后爆炸
class Enemy_level006 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 25, 25, "tomato", 90, 1, "enemy001", 200, 380);
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            let deleteSize = 4;
            ctx.strokeStyle = _this.fillStyle;
            ctx.lineWidth = deleteSize;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2 - deleteSize, 0, Math.PI * 2);
            ctx.stroke();
            _this.frameBloodVolume(ctx);
        });
    }
    fireBullet() {
        this.game.listEnemyBullet.push(new EnemyBullet_level002(this.game, this.centerX, this.centerY));
    }
}
// 敌人level007 自上而下 运动时不发射子弹 血量掉到阈值时,停止移动,发射只想玩家的子弹
class Enemy_level007 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 25, 25, "tomato", 90, 1, "enemy001", Tools.randomNumber(300, 350));
        this.flagStop = false;// 敌人停止标志
        this.stopBloodVolume = parseInt(this.bloodVolume * 0.8);// 停止阈值
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            let deleteSize = 6;
            ctx.fillRect(_this.centerX - _this.blockWidth / 2 + deleteSize, _this.centerY - _this.blockHeight / 2 + deleteSize, _this.blockWidth - 2 * deleteSize, _this.blockHeight - 2 * deleteSize);
            ctx.fillStyle = "red";
            ctx.fillRect(_this.centerX - _this.blockWidth / 2, _this.centerY - _this.blockHeight / 2, deleteSize, deleteSize);
            ctx.fillRect(_this.centerX + _this.blockWidth / 2 - deleteSize, _this.centerY - _this.blockHeight / 2, deleteSize, deleteSize);
            ctx.fillRect(_this.centerX - _this.blockWidth / 2, _this.centerY + _this.blockHeight / 2 - deleteSize, deleteSize, deleteSize);
            ctx.fillRect(_this.centerX + _this.blockWidth / 2 - deleteSize, _this.centerY + _this.blockHeight / 2 - deleteSize, deleteSize, deleteSize);
            _this.frameBloodVolume(ctx);
        });
    }
    moveRule() {
        super.moveRule();
        // 血线低于阈值时停止移动,并发射子弹
        if (!this.flagStop && this.bloodVolume < this.stopBloodVolume) {
            this.flagStop = true;
            this.changeDegAndVelocity(this.deg, 0);
        }
    }
    fireBullet() {
        if (this.flagStop) {// 是否停下
            let user = this.user;
            let deg = Tools.byXYGetDeg(user.centerX - this.centerX, user.centerY - this.centerY);
            for (let x = 0; x < Tools.randomNumber(3, 5); x++) {
                let deeee = 0.3;
                this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, deg, 2 + x * deeee, 20000));
            }
        }
    }
}
// 敌人level008 自上而下 不发射子弹,在其范围产生吸引力场,使玩家与其相撞
class Enemy_level008 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 30, 30, "green", 90, 1, "enemy001", Tools.randomNumber(500, 750));
        this.bian = Tools.randomNumber(3, 6);
        this.attractRadius = this.blockWidth * this.bian;// 吸引半径
        this.attractStrength = 0.8;// 吸引强度 (0-2) 之间
        this.strokeStyle = 'red';

    }
    moveRule() {
        super.moveRule();
        // 进入范围开始吸引玩家
        let user = this.user;
        if (Tools.isArcIntersectByCoor(user.getArcCoordinate(), [this.centerX, this.centerY, this.attractRadius])) {
            user.centerX > this.centerX ? user.centerX -= this.attractStrength : user.centerX += this.attractStrength;
            user.centerY > this.centerY ? user.centerY -= this.attractStrength : user.centerY += this.attractStrength * 2;
        }
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            _this.frameNum++;
            ctx.fillStyle = _this.fillStyle;
            for (let x = 0; x < _this.bian; x++) {
                ctx.closePath();
                let row = Tools.byDegGetXY(_this.frameNum + x * (360 / _this.bian));
                ctx.moveTo((_this.centerX + row[0] * (_this.blockWidth / 4)), (_this.centerY + row[1] * (_this.blockHeight / 4)));
                ctx.arc((_this.centerX + row[0] * (_this.blockWidth / 4)), (_this.centerY + row[1] * (_this.blockHeight / 4)), _this.blockWidth / 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
            }
            ctx.setLineDash([5]);
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = 1;
            ctx.arc(_this.centerX, _this.centerY, _this.attractRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([0]);
            _this.frameBloodVolume(ctx);
        });
    }
}
// 敌人level009 自山而下 不发射子弹 追踪玩家,在玩家之下则放弃追踪
class Enemy_level009 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 26, 26, "green", 90, 1, "enemy001", Tools.randomNumber(600, 650));
    }
    moveRule() {
        super.moveRule();
        let user = this.user;
        if (user.centerY > this.centerY) {// 自动追踪
            this.changeDegAndVelocity(Tools.byXYGetDeg(user.centerX - this.centerX, user.centerY - this.centerY), this.velocity);// 越靠近玩家吸引越强
        } else {
            this.changeDegAndVelocity(90, this.velocity);// 在玩家下面放弃追踪
        }
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            let user = _this.user;
            if (user.centerY < _this.centerY) {
                let deleteSize = 3;
                ctx.moveTo(_this.centerX, _this.centerY - deleteSize);
                ctx.lineTo(_this.centerX + _this.blockWidth / 2 - deleteSize, _this.centerY - _this.blockHeight / 2);
                ctx.lineTo(_this.centerX + _this.blockWidth / 2 - deleteSize, _this.centerY + deleteSize);
                ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
                ctx.lineTo(_this.centerX - _this.blockWidth / 2 + deleteSize, _this.centerY + deleteSize);
                ctx.lineTo(_this.centerX - _this.blockWidth / 2 + deleteSize, _this.centerY - _this.blockHeight / 2);
                ctx.fill();
            }
            else if ((user.centerY > _this.centerY) && (user.centerX > _this.centerX)) {
                ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2);
                ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY);
                ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY + _this.blockHeight / 2);
                ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
                ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY);
                ctx.lineTo(_this.centerX, _this.centerY);
                ctx.fill();
            }
            else if ((user.centerY > _this.centerY) && (user.centerX < _this.centerX)) {
                ctx.moveTo(_this.centerX, _this.centerY - _this.blockHeight / 2);
                ctx.lineTo(_this.centerX, _this.centerY);
                ctx.lineTo(_this.centerX + _this.blockWidth / 2, _this.centerY);
                ctx.lineTo(_this.centerX, _this.centerY + _this.blockHeight / 2);
                ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY + _this.blockHeight / 2);
                ctx.lineTo(_this.centerX - _this.blockWidth / 2, _this.centerY);
                ctx.fill();
            }
            _this.frameBloodVolume(ctx);
        });
    }
}
// 敌人level010 自上而下 发射八个纵向定时子弹
class Enemy_level010 extends Enemy {
    constructor(game, centerX, centerY, fireFrame = 50, fireProb = 30) {
        super(game, fireFrame, fireProb, centerX, centerY, 25, 25, "green", 90, 1, "enemy001", Tools.randomNumber(200, 250));
    }
    frame() {
        super.frame();
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            let deleteSize = 8;
            ctx.fillRect(_this.centerX + deleteSize - _this.blockWidth / 2, _this.centerY - _this.blockHeight / 2, _this.blockWidth - 2 * deleteSize, _this.blockHeight);
            _this.frameBloodVolume(ctx);
        });
    }

    fireBullet() {
        for (let x = 1; x <= 7; x++) {
            let addV = 0.25;
            this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, 90, 3 + x * addV, 15000));
            this.game.listEnemyBullet.push(new EnemyBullet_level001(this.game, this.centerX, this.centerY, 270, 3 + x * addV, 15000));
        }
    }
}
// 玩家总类
class User extends Plane {
    constructor(game, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 300) {
        super(game, game.CPlayer, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
        this.fontFillStye = "yellow";
    }
    moveRule() { }// 去除自动移动
    isOver() {
        return this.bloodVolume <= 0;
    }
}
// 玩家level001
class User_level001 extends User {
    constructor(game, centerX, centerY) {
        super(game, centerX, centerY, 25, 25, "#008080", 45, 3, "user", 1000);
        this.bloodVolume = 200;// 血量
        this.bloodVolumeMax = 1000;// 血量上限
        this.nowDeg = 90;// 子弹旋转度数
        this.fireLevel = 0;// 子弹等级
        this.fireLevelMax = 4;// 子弹等级上线
        this.shieldBulletRadius = this.blockWidth * 1.3;// 子弹护盾防御半径
        this.shieldBulletMax = 300;// 吸收值
        this.shieldBulletNow = 300;// 现在剩余值
        this.shieldEnemyRadius = this.blockWidth * 1;// 敌人护盾防御半径
        this.shieldEnemytMax = 1000;// 吸收值
        this.shieldEnemyNow = 1000;// 现在剩余值
        this.shockWaveMax = Tools.ByXYGetLen(this.maxHeight, this.maxWidth);// 冲击波范围
        this.shockWaveVel = 3// 冲击波速度
        this.shockWaveNow = 0;// 现在值
        this.shockWaveRadius = this.blockWidth * 0.7// 冲击波显示半径
        this.flagShockWave = false;// 是否开启一次冲击波
        this.shockWaveSumNow = 8;// 剩余冲击波次数
        this.shockWaveSumMax = 10;// 冲击波最大存储次数
        this.rakeSumNow = 8;// 剩余扫射次数
        this.rakeSumMax = 10;// 剩余扫射次数
        this.velocityMax = 6;// 速度上限
        this.velocityMin = 3;// 速度下限
        this.cheatCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 66, 65];// 作弊码 上 上 下 下 左 右 左 右 B A B A
        this.cheatOpen = false;// 是否打开作弊
        this.cheatCodeNum = 0;// 下一次尝试匹配n位作弊码
        this.deCheatCode = [69, 88, 73, 84];// 解除码 e x i t
        this.deCheatCodeNum = 0;// 下一次尝试匹配n位解除码
        this.teammateDeg = 0;// 护航旋转度数
        this.teammateOpen = false;// 会否打开护航
        this.teammateTimeMax = 60;// 护航时间
        this.teammateTimeNow = 0;// 已护航时间
        this.teammateSumMax = 10;// 护航最大次数
        this.teammateSumNow = 10;// 护航剩余
        this.fireTeammateSet = null;
        this.skillOpen = false;// 是否打开技能图标
        this.flagShowInformation = false;// 是否显示额外信息
        this.beginCenterX = 2;// 辅助信息x轴初始位置
        this.beginCenterY = 2;// y轴初始位置
        this.init();
    }
    init() {
        let _this = this;
        _this.game.keydownList.addKeydownOnly(function (keycodes) {
            if (_this.game.nowState == 2) { return }// 暂停
            if (keycodes == Tools.stringToCode("j")) {// J 冲击波
                _this.fireShockWave();
            } else if (keycodes == Tools.stringToCode("k")) {// k 扫荡
                _this.fireRake();
            } else if (keycodes == Tools.stringToCode("l")) {// l 护航
                _this.fireTeammate();
            } else if (keycodes == Tools.stringToCode("o")) {// 0 图标
                _this.fireSkill();
            } else if (keycodes == Tools.stringToCode("i")) {// i 详细信息
                _this.flagShowInformation = !_this.flagShowInformation;
            }
            if (!_this.cheatOpen) {// 是否填写作弊码
                if (keycodes == _this.cheatCode[_this.cheatCodeNum]) {
                    _this.cheatCodeNum++;
                    if (_this.cheatCodeNum == _this.cheatCode.length) {
                        _this.cheatOpen = true;
                        Tools.showInformation("魂斗罗模式已开启", 1000);
                        // 补满技能
                        _this.teammateSumNow = _this.teammateSumMax;
                        _this.rakeSumNow = _this.rakeSumMax;
                        _this.shockWaveSumNow = _this.shockWaveSumMax;
                        _this.velocity = _this.velocityMax;
                        _this.bloodVolume = _this.bloodVolumeMax;
                        _this.fireLevel = _this.fireLevelMax;
                        _this.shieldBulletNow = _this.shieldBulletMax;
                        _this.shieldEnemyNow = _this.shieldEnemytMax;
                    }
                } else {
                    _this.cheatCodeNum = 0;
                }
            } else {// 填写解除码
                if (keycodes == _this.deCheatCode[_this.deCheatCodeNum]) {
                    _this.deCheatCodeNum++;
                    if (_this.deCheatCodeNum == _this.deCheatCode.length) {
                        _this.cheatOpen = false;
                        Tools.showInformation("魂斗罗模式已关闭", 1000);
                    }
                } else {
                    _this.deCheatCodeNum = 0;
                }
            }
        });
        _this.game.keydownList.addKeydownQuick(function (keycodes) {
            if (_this.game.nowState == 2) { return }// 暂停
            // let keycodes = event.keyCode;
            if (keycodes == Tools.stringToCode("w")) {// 上
                _this.centerY -= _this.addSizeY;
            } else if (keycodes == Tools.stringToCode("d")) {// 右
                _this.centerX += _this.addSizeX;
            } else if (keycodes == Tools.stringToCode("s")) {// 下
                _this.centerY += _this.addSizeY;
            } else if (keycodes == Tools.stringToCode("a")) {// 左
                _this.centerX -= _this.addSizeX;
            }
        })
    }
    changeBloodVolume(num, flag = true) {
        super.changeBloodVolume(num, flag);
        this.bloodVolume = this.bloodVolume > this.bloodVolumeMax ? this.bloodVolumeMax : this.bloodVolume;
    }
    isOver() {
        if (this.cheatOpen) {
            return false;
        } else {
            return super.isOver();
        }
    }
    setFireLevel(num) {
        this.fireLevel += num;
        this.fireLevel = this.fireLevel < 0 ? 0 : (this.fireLevel > this.fireLevelMax ? this.fireLevelMax : this.fireLevel);
    }
    setVelocity(num) {
        this.velocity += num;
        this.velocity = this.velocity < this.velocityMin ? this.velocityMin : (this.velocity > this.velocityMax ? this.velocityMax : this.velocity);
        this.changeDegAndVelocity(this.deg, this.velocity);
    }
    changeBVDo(num, flag) {
        // 掉血之后子弹等级下降
        if (!this.cheatOpen) {
            num > 0 ? "" : this.setFireLevel(-1);
            num > 0 ? "" : this.setVelocity(-1);
        } else {
            num < 0 ? this.changeBloodVolume(-num) : "";
        }
    }
    openBulletShield() {// 打开子弹护盾
        this.shieldBulletMax += 100;
        this.shieldBulletNow = this.shieldBulletMax;
    }
    openEnemyShield() {// 打开敌人护盾
        this.shieldEnemytMax += 100;
        this.shieldEnemyNow = this.shieldEnemytMax;
    }
    openShockWave() {// 添加一次冲击波
        this.shockWaveSumNow++;
        this.shockWaveSumNow = this.shockWaveSumNow > this.shockWaveSumMax ? this.shockWaveSumMax : this.shockWaveSumNow;
    }
    openRake() {// 添加一次扫射
        this.rakeSumNow++;
        this.rakeSumNow = this.rakeSumNow > this.rakeSumMax ? this.rakeSumMax : this.rakeSumNow;
    }
    openFireLevel() {// 子弹升级
        this.setFireLevel(1);
    }
    openVelocity() {// 移速升级
        this.setVelocity(1);
    }
    fireShockWave() {// 发射冲击波
        if (!this.flagShockWave && this.shockWaveSumNow > 0) {
            this.flagShockWave = true;
            this.cheatOpen ? "" : this.shockWaveSumNow--;// 冲击波无限
        }
    }
    fireRake() {// 发射扫荡
        let emeny = this.game.listEnemy;
        if (this.rakeSumNow > 0) {
            if (emeny.length > 0) {
                this.cheatOpen ? "" : this.rakeSumNow--;
                for (let x = 0; x < emeny.length; x++) {
                    for (let y = 1; y <= Tools.randomNumber(5, 10); y++) {
                        this.game.listUserBullet.push(new UserBullet_level002(this.game, emeny[x], this.centerX, this.centerY, 2 + y * 0.25, 40));
                    }
                }
            }
        }
    }
    fireTeammate() {// 发射护航
        if (!this.teammateOpen && this.teammateSumNow > 0) {
            this.teammateOpen = true;
            this.cheatOpen ? "" : this.teammateSumNow--;// 护航无限
        }
    }
    fireSkill() {// 打开技能图标
        this.skillOpen = !this.skillOpen;
    }
    moveRule() {
        // 冲击波
        if (this.flagShockWave) {
            this.shockWaveNow += this.shockWaveVel;
            if (this.shockWaveNow > this.shockWaveMax) {
                this.flagShockWave = false;
                this.shockWaveNow = 0;
            }
        }
        if ((this.shieldBulletNow > 0) || (this.flagShockWave)) {
            let emenyBullet = this.game.listEnemyBullet;
            for (let x = emenyBullet.length - 1; x >= 0; x--) {
                // 子弹护盾
                if ((this.shieldBulletNow > 0) && Tools.isArcIntersectByCoor([this.centerX, this.centerY, this.shieldBulletRadius], emenyBullet[x].getArcCoordinate())) {
                    this.cheatOpen ? "" : this.shieldBulletNow -= emenyBullet[x].bloodVolume;// 作弊不掉甲
                    this.game.addScore(emenyBullet[x].bloodVolume);
                    this.shieldBulletNow < 0 ? this.shieldBulletNow = 0 : "";
                    emenyBullet[x].bloodVolume = 0;
                }
                // 冲击波
                if ((this.flagShockWave) && Tools.isArcIntersectByCoor([this.centerX, this.centerY, this.shockWaveNow], emenyBullet[x].getArcCoordinate())) {
                    this.game.addScore(emenyBullet[x].bloodVolume);
                    emenyBullet[x].bloodVolume = 0;
                }
            }
        }
        if ((this.shieldEnemyNow > 0) || (this.flagShockWave)) {
            let emeny = this.game.listEnemy;
            for (let x = emeny.length - 1; x >= 0; x--) {
                // 敌人护盾
                if ((this.shieldEnemyNow > 0) && Tools.isArcIntersectByCoor([this.centerX, this.centerY, this.shieldEnemyRadius], emeny[x].getArcCoordinate())) {
                    this.cheatOpen ? "" : this.shieldEnemyNow -= emeny[x].bloodVolume;// 作弊不掉甲
                    this.game.addScore(emeny[x].bloodVolume);
                    this.shieldEnemyNow < 0 ? this.shieldEnemyNow = 0 : "";
                    emeny[x].bloodVolume = 0;
                }
                // 冲击波
                if ((this.flagShockWave) && Tools.isArcIntersectByCoor([this.centerX, this.centerY, this.shockWaveNow], emeny[x].getArcCoordinate())) {
                    this.game.addScore(emeny[x].bloodVolume);
                    emeny[x].bloodVolume = 0;
                }
            }
        }
    }
    fireBullet() {
        let _this = this;
        for (let x = 0; x < 3; x++) {
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 270 + x, 4, 6000));
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 270 - x, 4, 6000));
        }
        let emeny = _this.game.listEnemy;
        if (_this.teammateOpen && emeny.length > 0) {
            for (let x = 0; x < 6; x++) {
                let size = Tools.byDegGetXY((_this.teammateDeg + 60 * (x + 1)) % 360);
                this.game.listUserBullet.push(new UserBullet_level002(this.game, emeny[Tools.randomNumber(0, emeny.length - 1)], _this.centerX + size[0] * 50, _this.centerY + size[1] * 20, 5));
            }
        }
        if (_this.fireLevel == 1) {
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 273, 4, 6000));
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 267, 4, 6000));
        } else if (_this.fireLevel == 2) {
            _this.nowDeg += 11;
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, _this.nowDeg % 360 - 90, 4, 2000));
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, -_this.nowDeg % 360 - 90, 4, 2000));
        } else if (_this.fireLevel == 3) {
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 0, 4, 10000));
            _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, 180, 4, 10000));
        } else if (_this.fireLevel == 4) {
            _this.nowDeg += 11;
            for (let x = 0; x < 16; x++) {
                _this.game.listUserBullet.push(new UserBullet_level001(_this.game, _this.centerX, _this.centerY, (x + 1) * 22.5 + _this.nowDeg, 4, 50));
            }
        }
    }
    // 绘制技能图标
    drawSkill(ctx, centerX, centerY, radius1, radius2, text = "", fillStyle = "#00755E", strokeStyle = "#00755E", textStyle = "red") {
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, 10, 0, radius1);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.arc(centerX, centerY, 12, 0, radius2);
        ctx.stroke();
        ctx.fillStyle = textStyle;
        ctx.fillText(text, centerX, centerY);
        ctx.closePath();
    }
    // 绘制护盾
    drawArc(ctx, centerX, centerY, radius, radius1, strokeStyle) {
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.arc(centerX, centerY, radius, 0, radius1);
        ctx.stroke();
        ctx.closePath();
    }
    frame() {
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            _this.frameNum++;
            if (_this.teammateOpen && _this.frameNum % 100 == 0) {// 开启护航
                _this.teammateTimeNow++
                if (_this.teammateTimeNow == _this.teammateTimeMax) {
                    this.teammateTimeNow = 0;
                    this.teammateOpen = false;
                }
            }
            ctx.fillStyle = _this.fillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            if (this.shieldBulletNow > 0) {
                _this.drawArc(ctx, _this.centerX, _this.centerY, _this.shieldBulletRadius, (Math.PI * 2) * _this.shieldBulletNow / _this.shieldBulletMax, "#495A80");
            }
            if (_this.shieldEnemyNow > 0) {
                _this.drawArc(ctx, _this.centerX, _this.centerY, _this.shieldEnemyRadius, (Math.PI * 2) * _this.shieldEnemyNow / _this.shieldEnemytMax, "#FE4C40");
            }
            if (_this.flagShockWave) {
                _this.drawArc(ctx, _this.centerX, _this.centerY, _this.shockWaveNow, Math.PI * 2, "#00755E");
            }
            if (_this.shockWaveNow > 0) {
                _this.drawArc(ctx, _this.centerX, _this.centerY, _this.shockWaveRadius, (Math.PI * 2) * _this.shockWaveNow / _this.shockWaveMax, "#00755E");
            }
            if (_this.teammateOpen) {
                _this.teammateDeg++;
                for (let x = 0; x < 6; x++) {
                    let size = Tools.byDegGetXY((_this.teammateDeg + 60 * (x + 1)) % 360);
                    _this.drawArc(ctx, _this.centerX + size[0] * 50, _this.centerY + size[1] * 20, 6, (Math.PI * 2), "#347474");
                }
            }
            ctx.fillStyle = "red";
            _this.frameBloodVolume(ctx);
            let Bian = 15;
            if (_this.skillOpen) {
                // 技能1 j
                _this.drawSkill(ctx, Bian, _this.maxHeight - Bian, (Math.PI * 2) * _this.shockWaveSumNow / _this.shockWaveSumMax, Math.PI * 2, "J", "#4dd599", "#4dd599", "red");
                // 技能2 k
                _this.drawSkill(ctx, Bian * 3, _this.maxHeight - Bian, (Math.PI * 2) * _this.rakeSumNow / _this.rakeSumMax, Math.PI * 2, "K", "#015668", "#015668", "red");
                // 技能3 l
                _this.drawSkill(ctx, Bian * 5, _this.maxHeight - Bian, (Math.PI * 2) * _this.teammateSumNow / _this.teammateSumMax, (Math.PI * 2) - ((Math.PI * 2) * _this.teammateTimeNow / _this.teammateTimeMax), "L", "#347474", "#347474", "red");
                // 外甲
                _this.drawSkill(ctx, Bian * 7, _this.maxHeight - Bian, (Math.PI * 2) * _this.shieldBulletNow / _this.shieldBulletMax, Math.PI * 2, "外", "#f67280", "#f67280", "red");
                // 血量
                _this.drawSkill(ctx, _this.maxWidth - Bian, _this.maxHeight - Bian, (Math.PI * 2) * _this.bloodVolume / _this.bloodVolumeMax, Math.PI * 2, "血", "#db3056", "#db3056", "yellow");
                // 子弹
                _this.drawSkill(ctx, _this.maxWidth - Bian * 3, _this.maxHeight - Bian, (Math.PI * 2) * _this.fireLevel / _this.fireLevelMax, Math.PI * 2, "弹", "#745097", "#745097", "red");
                // 速度
                _this.drawSkill(ctx, _this.maxWidth - Bian * 5, _this.maxHeight - Bian, (Math.PI * 2) * (_this.velocity - _this.velocityMin) / (_this.velocityMax - _this.velocityMin), Math.PI * 2, "速", "#8f4426", "#8f4426", "red");
                // 内甲
                _this.drawSkill(ctx, _this.maxWidth - Bian * 7, _this.maxHeight - Bian, (Math.PI * 2) * _this.shieldEnemyNow / _this.shieldEnemytMax, Math.PI * 2, "内", "tomato", "tomato", "red");
            }

            let user = _this;
            ctx.font = "14px bold 微软雅黑";
            ctx.fillStyle = "red";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(
                "游戏得分:" + Tools.stringNumFormat(_this.game.score, 30), _this.beginCenterX, _this.beginCenterY);
            if (_this.flagShowInformation) {
                ctx.fillStyle = "#234";
                ctx.fillText("关数:" + Tools.stringNumFormat(_this.game.nowLevel, 3) + "-" + Tools.stringNumFormat(_this.game.levelMax, 3) +
                    " 计时:" + Tools.stringNumFormat(parseInt((_this.game.changeLevelTime - (_this.game.animationFrameNum % _this.game.changeLevelTime)) / 100), 2) + "-" + Tools.stringNumFormat(parseInt(_this.game.changeLevelTime / 100), 2) +
                    " 冲击波束[按键J]:" + Tools.stringNumFormat(user.shockWaveSumNow, 2) + "-" + Tools.stringNumFormat(user.shockWaveSumMax, 2), _this.beginCenterX, _this.beginCenterY + 20)
                ctx.fillText("外盾:" + Tools.stringNumFormat(user.shieldBulletNow, 5) + "-" + Tools.stringNumFormat(user.shieldBulletMax, 5) +
                    " 内盾:" + Tools.stringNumFormat(user.shieldEnemyNow, 5) + "-" + Tools.stringNumFormat(user.shieldEnemytMax, 5) +
                    " 速度:" + (user.velocity - user.velocityMin + 1) + "-" + (user.velocityMax - user.velocityMin + 1), _this.beginCenterX, _this.beginCenterY + 40);
                ctx.fillText("追踪扫荡[按键K]:" + Tools.stringNumFormat(user.rakeSumNow, 3) + "-" + Tools.stringNumFormat(user.rakeSumMax, 3) +
                    " 保驾护航:[按键L]:" + Tools.stringNumFormat(user.teammateSumNow, 2) + "-" + Tools.stringNumFormat(user.teammateSumMax, 2), _this.beginCenterX, _this.beginCenterY + 60);
                ctx.fillText("玩家血量:" + Tools.stringNumFormat(user.bloodVolume, 5) + "-" + Tools.stringNumFormat(user.bloodVolumeMax, 5) +
                    " 子弹等级:" + Tools.stringNumFormat(user.fireLevel, 2) + "-" + Tools.stringNumFormat(user.fireLevelMax, 2) +
                    " 作弊:" + (user.cheatOpen ? "是" : "否"), _this.beginCenterX, _this.beginCenterY + 80);
            }
        });
    }
    endDo() {
        this.game.keydownList.deleteKeydown();
    }
}
// 子弹总类
class Bullet extends Plane {
    constructor(game, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 200) {
        super(game, game.CBullet, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
        this.user = game.user;
    }
    moveRule() {// 移动规则
        ((this.centerX <= 0 + this.blockWidth / 2) || (this.centerX >= this.maxWidth - this.blockWidth / 2)) ? this.addSizeX *= -1 : "";
        (this.centerY <= 0) ? this.addSizeY *= -1 : "";
        super.moveRule();
    }
}
// 敌人子弹
class EnemyBullet extends Bullet {
    constructor(game, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 10) {
        super(game, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
    }
    moveRule() {
        super.moveRule();
        let user = this.game.user;
        if (Tools.isRectIntersectByCoor(user.getRectCoordinate(), this.getRectCoordinate())) {
            user.changeBloodVolume(-this.bloodVolume);
            this.changeBloodVolume(0, false);
        }
    }
}
// 定时删除子弹
class EnemyBullet_level001 extends EnemyBullet {
    constructor(game, centerX, centerY, deg = 90, velocity = 2, deleteTime = 40000) {
        super(game, centerX, centerY, 8, 8, Tools.randomColor(1), deg, velocity, 'emenybullet001', 10);
        this.deleteTime = deleteTime;// 定时删除
    }
    frame() {
        let _this = this;
        if (_this.frameNum >= _this.deleteTime) {// 到点消亡
            _this.bloodVolume = 0;
        }
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.fillStyle = _this.fillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
// 定时删除地雷
class EnemyBullet_level002 extends EnemyBullet {
    constructor(game, centerX, centerY, deg = 90, velocity = 0, deleteTime = 1000) {
        super(game, centerX, centerY, 30, 30, Tools.randomColor(1), deg, velocity, 'emenybullet001', 50);
        // this.frameNum = deleteTime;// 定时删除
        this.deleteTime = deleteTime;
        this.addBlockWidth = this.blockWidth / deleteTime;
        this.addBlockHeight = this.blockHeight / deleteTime;
        this.blockWidth = 0;
        this.blockHeight = 0;
        this.fontFillStye = 'red';
        this.lastFillStyle = '';
    }
    frame() {
        let _this = this;
        _this.blockWidth += _this.addBlockWidth;
        _this.blockHeight += _this.addBlockHeight;
        if (_this.frameNum >= _this.deleteTime) {// 到点消亡
            _this.bloodVolume = 0;
        } else if (_this.frameNum % 10 == 0) {// 结束闪烁
            _this.lastFillStyle = Tools.randomColor(1);
        }
        _this.drawCanvas.frameAdd((ctx) => {
            let nowTime = parseInt((_this.deleteTime - _this.frameNum) / 100) + 1;// 近似换成秒数
            ctx.fillStyle = nowTime > 3 ? _this.fillStyle : _this.lastFillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2 + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = _this.font;
            ctx.fillStyle = _this.fontFillStye;
            ctx.textAlign = _this.textAlign;
            ctx.textBaseline = _this.textBaseline;
            ctx.fillText(nowTime, _this.centerX, _this.centerY);
        });
    }
}
// 用户子弹
class UserBullet extends Bullet {
    constructor(game, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = 40) {
        super(game, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
    }
    moveRule() {
        super.moveRule();
        let emeny = this.game.listEnemy;
        for (let x = emeny.length - 1; x >= 0; x--) {
            if (Tools.isRectIntersectByCoor(this.getRectCoordinate(), emeny[x].getRectCoordinate())) {
                emeny[x].bloodVolume -= this.bloodVolume;
                this.game.addScore(this.bloodVolume);
                this.changeBloodVolume(0, false);
            }
        }
    }
}
// 定时删除子弹
class UserBullet_level001 extends UserBullet {
    constructor(game, centerX, centerY, deg = 90, velocity = 2, deleteTime = 40000) {
        super(game, centerX, centerY, 8, 8, Tools.randomColor(1), deg, velocity, 'emenybullet001', 20);
        this.deleteTime = deleteTime;// 定时删除
    }
    frame() {
        let _this = this;
        if (_this.frameNum >= _this.deleteTime) {// 到点消亡
            _this.bloodVolume = 0;
        }
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.fillStyle = _this.fillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
// 指定追踪子弹 必中
class UserBullet_level002 extends UserBullet {
    constructor(game, target, centerX, centerY, velocity = 2, bloodVolume = 10) {
        super(game, centerX, centerY, 8, 8, Tools.randomColor(1), 270, velocity, 'emenybullet001', 30);
        this.target = target;
    }
    moveRule() {
        // super.moveRule();
        this.centerX += this.addSizeX;
        this.centerY += this.addSizeY;
        let target = this.target;
        if (Tools.isRectIntersectByCoor(this.getRectCoordinate(), target.getRectCoordinate())) {
            target.bloodVolume -= this.bloodVolume;
            this.game.addScore(this.bloodVolume);
            this.changeBloodVolume(0, false);
        }
        if (this.target.bloodVolume <= 0) {
            this.changeBloodVolume(0, false);
        }
        this.changeDegAndVelocity(Tools.byXYGetDeg(target.centerX - this.centerX, target.centerY - this.centerY), this.velocity);// 越靠近玩家吸引越强
    }
    frame() {
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.fillStyle = _this.fillStyle;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
// BUFF总类
class Buff extends Plane {
    constructor(game, text, centerX = 0, centerY = 0, blockWidth = 0, blockHeight = 0, fillStyle = "", deg = 90, velocity = 1, name = "", bloodVolume = Tools.randomNumber(30, 60)) {
        super(game, game.CBuff, centerX, centerY, blockWidth, blockHeight, fillStyle, deg, velocity, name, bloodVolume);
        this.text = text;
    }
    moveRule() {// 移动规则
        ((this.centerX <= 0 + this.blockWidth / 2) || (this.centerX >= this.maxWidth - this.blockWidth / 2)) ? this.addSizeX *= -1 : "";
        (this.centerY <= 0) ? this.addSizeY *= -1 : "";
        super.moveRule();
        let user = this.game.user;
        if (Tools.isRectIntersectByCoor(user.getRectCoordinate(), this.getRectCoordinate())) {
            this.collideUserDo(user);
            this.game.addScore(this.bloodVolume);
            this.changeBloodVolume(0, false);
        }
    }
    collideUserDo(user) { }// 得到BUFF之后做
    frame() {
        let _this = this;
        _this.drawCanvas.frameAdd((ctx) => {
            ctx.strokeStyle = _this.fillStyle;
            ctx.lineWidth = 4;
            ctx.arc(_this.centerX, _this.centerY, _this.blockWidth / 2, -Math.PI / 6, Math.PI / 6 * 10);
            ctx.stroke();
            ctx.closePath();
            ctx.font = this.font;
            ctx.fillStyle = this.fontFillStye;
            ctx.textAlign = this.textAlign;
            ctx.textBaseline = this.textBaseline;
            ctx.fillText(_this.text, _this.centerX, _this.centerY);
        });
    }
}
// BUFFlevel001 回血(30,60)
class Buff_level001 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "血", centerX, centerY, 20, 20, "#C70851", 90, 1.2, "Buff_level001");
    }
    collideUserDo(user) {
        user.changeBloodVolume(this.bloodVolume);
    }
}
// BUFFlevel002 子弹升级
class Buff_level002 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "弹", centerX, centerY, 20, 20, "#344069", 90, 1.2, "Buff_level002");
    }
    collideUserDo(user) {
        user.openFireLevel();
    }
}
// BUFFlevel003 子弹护盾加强并恢复
class Buff_level003 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "外", centerX, centerY, 20, 20, "#495A80", 90, 1.2, "Buff_level003");
    }
    collideUserDo(user) {
        user.openBulletShield();
    }
}
// BUFFlevel004 敌人护盾加强并恢复
class Buff_level004 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "内", centerX, centerY, 20, 20, "#FE4C40", 90, 1.2, "Buff_level004");
    }
    collideUserDo(user) {
        user.openEnemyShield();
    }
}
// BUFFlevel005 添加冲击波束
class Buff_level005 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "波", centerX, centerY, 20, 20, "#00755E", 90, 1.2, "Buff_level005");
    }
    collideUserDo(user) {
        user.openShockWave();
    }
}
// BUFFlevel006 移速升级
class Buff_level006 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "速", centerX, centerY, 20, 20, "green", 90, 1.2, "Buff_level006");
    }
    collideUserDo(user) {
        user.openVelocity();
    }
}
// BUFFlevel007 添加追踪扫荡
class Buff_level007 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "扫", centerX, centerY, 20, 20, "#d15a7c", 90, 1.2, "Buff_level007");
    }
    collideUserDo(user) {
        user.openRake();
    }
}
// BUFFlevel008 添加护航
class Buff_level008 extends Buff {
    constructor(game, centerX, centerY) {
        super(game, "护", centerX, centerY, 20, 20, "#d15a7c", 90, 1.2, "Buff_level008");
    }
    collideUserDo(user) {
        user.openRake();
    }
}
// 游戏
class Game {
    constructor() {
        this.nowState = 0;// 现在所处状态 0 end 1 play 2 pause 3 begin 
        this.palyOpen = false;// 是否掉过play()过

        this.CBackground = new Canvas("CBackground");
        this.CEmenty = new Canvas("CEmenty");
        this.CBullet = new Canvas("CBullet");
        this.CPlayer = new Canvas("CPlayer");
        this.CBuff = new Canvas("CBuff");

        this.user = "";// 玩家
        this.listBackground = [];// 背景列表
        this.listEnemy = [];// 敌人列表
        this.listEnemyBullet = [];// 敌人子弹列表
        this.listUserBullet = [];// 敌人子弹列表
        this.listUserBuff = [];// 增益列表`

        this.nowLevel = 1;// 现在关卡数
        this.levelMax = 100;// 关卡总数

        this.changeLevelTime = 6000;// 每一关切换标志

        this.keydownList = new KeydownList();// 键盘事件对象

        this.score = 0;// 得分
        this.animationFrameNum = 0;// 总帧数

        this.requestAFrameAdd = null;// 帧对象
        this.requestAFrameButt = null;// 帧对象

        this.blockRuleCopy = {// 关卡升级规则
            "enemy": [
                // name 敌人类名 addFrameFunction 发射帧数间隔 addProbFunction 发射概率 fireFrameFunction 子弹发射帧数间隔 fireProbFunction 子弹发射概率
                { "name": Enemy_level001, "addFrameFunction": (level) => { return 10 + level * 2; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level002, "addFrameFunction": (level) => { return 8 + level * 2; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level003, "addFrameFunction": (level) => { return 7 + level * 2; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level004, "addFrameFunction": (level) => { return 6 + level * 2;; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level005, "addFrameFunction": (level) => { return 5 + level * 2;; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level006, "addFrameFunction": (level) => { return 200 - level; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level007, "addFrameFunction": (level) => { return 210 - level; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level008, "addFrameFunction": (level) => { return 220 - level; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level009, "addFrameFunction": (level) => { return 230 - level; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } },
                { "name": Enemy_level010, "addFrameFunction": (level) => { return 240 - level; }, "addProbFunction": (level) => { return 30 + level / 10 }, "fireFrameFunction": (level) => { return 200 - level; }, "fireProbFunction": (level) => { return 30 + level / 10 } }
            ], "buff": [
                // name buff类名 addProbFunction 发射概率 
                { "name": Buff_level001, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level002, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level003, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level004, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level005, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level006, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level007, "addProbFunction": (level) => { return 10 + level / 10 } },
                { "name": Buff_level008, "addProbFunction": (level) => { return 10 + level / 10 } }
            ]
        }
        this.init();// 初始化
    }
    init() {
        let _this = this;
        _this.changeCanvasSize();
        // 监视窗口变化
        $(window).resize(function () {
            _this.changeCanvasSize();
        });
        // 背景
        let aFrameNum = 0;
        (function backgroundMove() {
            for (let x = _this.listBackground.length - 1; x >= 0; x--) {
                if (_this.listBackground[x].addFrame()) {
                    _this.listBackground.splice(x, 1)
                }
            }
            if (aFrameNum % 10 == 0) {// 发射背景
                Tools.probablyFunction(70, () => {
                    _this.listBackground.push(new Bckground(_this.CBackground));
                })
            }
            _this.CBackground.frameDraw();
            aFrameNum++;// 帧总数
            window.requestAnimationFrame(backgroundMove);
        })();
        // 按键
        _this.blockScroll(
            function () { // 开始
                _this.play();
            }, function () {// 结束
                _this.end();
            }, function () {// 暂停
                _this.pause();
            }, function () {// 继续
                _this.begin();
            }, function () {// 重开
                _this.end();
                _this.play();
            }
        )
    }
    // 改变canvas的size
    changeCanvasSize() {
        let html = $("html");
        let blockBody = $("#blockBody");
        $("#CBackground").attr({ "width": html.css("width"), "height": html.css("height") });
        $("#blockBody > .blockCanvas").attr({ "width": blockBody.css("width"), "height": blockBody.css("height") });
        this.CBackground.changeSize();
        this.CEmenty.changeSize();
        this.CBullet.changeSize();
        this.CPlayer.changeSize();
        this.CBuff.changeSize();
    }
    // 按钮
    blockScroll(playCallback, endCallback, pauseCallback, beginCallback, againCallback) {
        let blockSatrtOrPause = $("#blockSatrtOrPause");
        let blockAgain = $("#blockAgain");
        let blockTitle = $("#blockTitle");
        let blockHelp = $("#blockHelp");
        let blockPlay = $("#blockPlay");
        let blockEnd = $("#blockEnd");
        let userPause = false;// 是否是用户点的暂停
        let flag = false;
        function changCss(flag) {
            blockSatrtOrPause.css("display", flag ? "block" : "none");
            blockAgain.css("display", flag ? "block" : "none");
            blockEnd.css("display", flag ? "block" : "none");
            blockTitle.css("display", !flag ? "block" : "none");
            blockHelp.css("display", !flag ? "block" : "none");
            blockPlay.css("display", !flag ? "block" : "none");
        }
        blockPlay.click(() => {
            changCss(true);
            playCallback();
        });
        blockEnd.click(() => {
            changCss(false);
            endCallback();
        });
        function pauseAndBegin() {
            flag ? pauseCallback() : beginCallback();
            blockSatrtOrPause.text(!flag ? "暂停" : "继续");
        }
        // 监听是否在当前页
        document.addEventListener("visibilitychange", function () {
            if (userPause) { return; }// 用户点了暂停则不触发
            flag = document.hidden;// 判断是否在浏览当前页面,依次暂停或重新开始
            pauseAndBegin();
            userPause = false;
        });
        blockSatrtOrPause.click(() => {
            flag = !flag;
            userPause = flag;// 用户点了暂停
            pauseAndBegin();
        });
        blockAgain.click(() => {
            flag = false;
            blockSatrtOrPause.text("暂停");
            againCallback();
        });
    }
    addScore(num) {// 加分
        this.score += num;
    }
    // 添加敌人
    addEnemy() {
        let enemy = this.blockRuleCopy["enemy"];
        for (let x = 0; x < enemy.length; x++) {
            if (x <= (this.nowLevel - 1) / 10) {
                if (this.animationFrameNum % enemy[x]["addFrameFunction"](this.nowLevel) == 0) {
                    Tools.probablyFunction(enemy[x]["addProbFunction"](this.nowLevel), () => {
                        this.listEnemy.push(new enemy[x]["name"](this, Tools.randomNumber(0, this.CEmenty.canvasWidth), 4, enemy[x]["fireFrameFunction"](this.nowLevel), enemy[x]["fireProbFunction"](this.nowLevel)));
                    });
                }
            }
        }
    }
    // 添加buff
    addBuff() {
        let buff = this.blockRuleCopy["buff"];
        for (let x = 0; x < buff.length; x++) {
            Tools.probablyFunction(buff[x]["addProbFunction"](this.nowLevel), () => {
                this.listUserBuff.push(new buff[x]["name"](this, Tools.randomNumber(0, this.CBuff.canvasWidth), 4));
            });
        }
    }
    // 随机概率添加buff
    randomAddBuff(centerX, centerY, fireProb) {
        let buff = this.blockRuleCopy["buff"];
        let num = Tools.randomNumber(0, buff.length - 1);
        Tools.probablyFunction(fireProb, () => {
            this.listUserBuff.push(new buff[num]["name"](this, centerX, centerY));
        });
    }
    play() {
        if (this.palyOpen) { return }// 防止重复调用
        this.palyOpen = true;
        this.nowState = 1;
        let _this = this;
        _this.user = new User_level001(this, this.CPlayer.canvasWidth / 2, this.CPlayer.canvasHeight - 30);// 玩家
        // 绘制图形
        // 删除失效对象
        (function move() {
            if (_this.nowState != 2) {// 暂停
                for (let x = _this.listEnemy.length - 1; x >= 0; x--) {
                    if (_this.listEnemy[x].addFrame()) {
                        _this.listEnemy.splice(x, 1);
                    }
                }
                for (let x = _this.listEnemyBullet.length - 1; x >= 0; x--) {
                    if (_this.listEnemyBullet[x].addFrame()) {
                        _this.listEnemyBullet.splice(x, 1);
                    }
                }
                for (let x = _this.listUserBullet.length - 1; x >= 0; x--) {
                    if (_this.listUserBullet[x].addFrame()) {
                        _this.listUserBullet.splice(x, 1);
                    }
                }
                for (let x = _this.listUserBuff.length - 1; x >= 0; x--) {
                    if (_this.listUserBuff[x].addFrame()) {
                        _this.listUserBuff.splice(x, 1);
                    }
                }
                _this.user.addFrame();
                _this.CEmenty.frameDraw();
                _this.CBullet.frameDraw();
                _this.CPlayer.frameDraw();
                _this.CBuff.frameDraw();
                _this.animationFrameNum++;// 帧总数
            }
            _this.requestAFrameAdd = window.requestAnimationFrame(move);
        })();

        // 发射子弹
        // 创建敌人
        (function moves() {
            if (_this.nowState != 2) {// 暂停

                _this.addEnemy();

                if (_this.animationFrameNum % 5 == 0) {
                    _this.user.fireBullet();
                }
                if (_this.animationFrameNum % _this.changeLevelTime == 0) {
                    _this.nowLevel++;
                    Tools.showInformation("第" + _this.nowLevel + "关", 1500);
                    _this.addBuff();
                }
                if (_this.user.isOver()) {
                    Tools.showInformation("游戏结束", 10000);
                    _this.end();
                    return;
                }
                if (_this.nowLevel >= _this.levelMax + 1) {
                    Tools.showInformation("恭喜通关", 10000);
                    _this.end();
                    return;
                }
            }
            _this.requestAFrameButt = window.requestAnimationFrame(moves);
        })();
    }
    pause() {
        if (!this.palyOpen) { return; }// 没有play()不得调用
        this.nowState = 2;
    }
    begin() {
        if (!this.palyOpen) { return; }
        this.nowState = 3;
    }
    end() {
        if (!this.palyOpen) { return; }
        this.palyOpen = false
        this.nowState = 0;
        // 清除操作
        cancelAnimationFrame(this.requestAFrameButt);
        cancelAnimationFrame(this.requestAFrameAdd);
        this.animationFrameNum = 1;
        this.listEnemy = [];
        this.listEnemyBullet = [];
        this.listUserBuff = [];
        this.listUserBullet = [];
        this.keydownList.deleteKeydown();// 清除玩家按键遗留
        this.user.end();// 清除玩家
        this.score = 0;
        this.nowLevel = 1;
        // 清除画布
        this.CEmenty.frameDraw();
        this.CBullet.frameDraw();
        // this.CPlayer.frameDraw();
        this.CBuff.frameDraw();
    }
}
$(window).ready(() => {
    let game = new Game();
})