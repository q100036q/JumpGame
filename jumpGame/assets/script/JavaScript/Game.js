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
        starPrefab:{
            default: null,
            type: cc.Prefab,
        },
        maxStarDuration: 0,
        minStarDuration: 0,

        ground:{
            default: null,
            type: cc.Node,
        },

        player:{
            default: null,
            type: cc.Node,
        },

        scoreDisplay:{
            default: null,
            type: cc.Label,
        },

        scoreAduio:{
            default: null,
            url: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.groundY = this.ground.y + this.ground.height/2;

        this.timer = 0;
        this.starDuration = 0;
        this.newStarFunc();
        this.score = 0;
    },
    newStarFunc: function(){
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;

        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function(){
        var randomX = 0;
        var randomY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight+50;
        var maxX = this.node.width/2;
        randomX = cc.randomMinus1To1()*maxX;
        return cc.p(randomX,randomY);
    },
    gainScore: function(){
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAduio,false);
    },
    start () {

    },
    gameOver: function(){
        this.player.stopAllActions();
        //this.player.removeKeyBoardEvent();
        cc.director.loadScene('JumpGame');
    },
    update: function(dt) {
        if(this.timer > this.starDuration)
        {
            this.gameOver();
            return;
        }
        this.timer += dt; 
    },
});
