cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,
        game:{
            default: null,
            serializable: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},
    init: function(game){
        this.game = game;
        this.node.opacity = 255;
    },
    reuse(game){
        this.init(game);
    },
    getPlayerDistance:function(){
        var playerPos = this.game.player.getComponent('Player').getCenterPos();
        var dist = cc.pDistance(this.node.position,playerPos);
        return dist;
    },
    onPicked: function(){
        this.game.gainScore();
        this.game.despawnStar(this.node);
    },

    start () {

    },

    update (dt) {
        if(this.getPlayerDistance()<this.pickRadius){
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio*(255 - minOpacity));
    },
});
