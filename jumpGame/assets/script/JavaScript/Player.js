cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        jumpMaxMoveSpeed: 0,
        accel: 0,
        squashDuration: 0,
        jumpAudio:{
            default: null,
            url: cc.AudioClip,
        },
    },
    setJumpAction:function()
    { 
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 形变
        var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback));

    },
    playJumpSound: function(){
        cc.audioEngine.playEffect(this.jumpAudio,false);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.jumpAction = this.setJumpAction();

        this.accRight = false;
        this.accLeft = false;
        this.setInputControl();
    },

    setInputControl: function(){
        var self = this;
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode,event){
                cc.log("112121");
                switch(keyCode){
                    case cc.KEY.a:
                    case cc.KEY.left:
                    self.accLeft = true;
                    self.accRight = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                    self.accLeft = false;
                    self.accRight = true;
                        break;
                }
            },
            onKeyReleased: function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                    case cc.KEY.left:
                    self.accLeft = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                    self.accRight = false;
                        break;
                }
            }
        },self.node);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x >= cc.winSize.width/2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                // don't capture the event
                return true;
            },
            onTouchEnded: function(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    },
    getCenterPos: function(){
        var centerPos = cc.p(this.node.x,this.node.y+this.node.height/2);
        return centerPos;
    },

    startMoveAt: function (pos) {
        this.setInputControl()
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.jumpAction);
    },

    stopMove: function () {
        cc.eventManager.removeListeners(this.node);
        this.node.stopAllActions();
    },
    
    update: function(dt) {
        if (this.accRight){
            this.xSpeed += this.accel * dt;
        }
        if (this.accLeft){
            this.xSpeed -= this.accel * dt;
        }
        if (Math.abs(this.xSpeed)> this.jumpMaxMoveSpeed){
            this.xSpeed = this.jumpMaxMoveSpeed * Math.abs(this.xSpeed) / this.xSpeed;
        }

        this.node.x += this.xSpeed * dt;
        if(this.node.x > this.node.parent.width/2){
            this.xSpeed = 0;
            this.node.x = this.node.parent.width/2;
        }else if(this.node.x < -this.node.parent.width/2){
            this.xSpeed = 0;
            this.node.x = -this.node.parent.width/2;
        }
    },
});
