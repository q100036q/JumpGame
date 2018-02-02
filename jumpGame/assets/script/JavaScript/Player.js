// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        jumpMaxMoveSpeed: 0,
        accel: 0,
        jumpAudio:{
            default: null,
            url: cc.AudioClip,
        },
    },
    setJumpAction:function()
    {
        var jumpUp = cc.moveBy(this.jumpDuration,cc.p(0,this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration,cc.p(0,-this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound,this);
        return cc.repeatForever(cc.sequence(jumpUp,jumpDown,callback));

    },
    playJumpSound: function(){
        cc.audioEngine.playEffect(this.jumpAudio,false);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        this.accRight = false;
        this.accLeft = false;
        this.xSpeed = 0;
        this.setInputControl();
    },

    setInputControl: function(){
        var self = this;
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                    self.accLeft = true;
                    self.accRight = false;
                        break;
                    case cc.KEY.d:
                    self.accLeft = false;
                    self.accRight = true;
                        break;
                }
            },
            onKeyReleased: function(keyCode,event){
                switch(keyCode){
                    case cc.KEY.a:
                    self.accLeft = false;
                        break;
                    case cc.KEY.d:
                    self.accRight = false;
                        break;
                }
            }
        },self.node);
    },
    removeKeyBoardEvent: function(){
        cc.eventManager.removeAllListeners();
        //cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
    },
    start () {

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
    },
});
