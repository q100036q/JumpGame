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

        btnNode:{
            default: null,
            type: cc.Node,
        },

        gameOverNode:{
            default: null,
            type: cc.Node,
        },

        controlLabel:{
            default: null,
            type: cc.Label,
        },

        keyboardHint:{
            default:'',
            multiline: true,
        },
        touchHint:{
            default: '',
            multiline: true,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function() {
        this.groundY = this.ground.y + this.ground.height/2;

        this.timer = 0;
        this.starDuration = 0;

        this.isRunning = false;
        var hintText = cc.sys.isMobile ? this.touchHint:this.keyboardHint;
        this.controlLabel.string = hintText;

        this.starPool = new cc.NodePool('Star');
    },
    newStarFunc: function(){
        var newStar = null;
        if (this.starPool.size()>0){
            newStar = this.starPool.get(this);
        }else{
            newStar = cc.instantiate(this.starPrefab);
        }
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').init(this);

        this.startTimer();
        this.currentStar = newStar;
    },
    despawnStar(star){
        this.starPool.put(star);
        this.newStarFunc();
    },
    startTimer: function(){
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    getNewStarPosition: function(){
        if(!this.currentStar){
            //记录上一次星星的位置，为了让星星每次显示的位置中央对齐分布
            this.currentStarX = this.node.width/2 * cc.randomMinus1To1();
        }
        var randomX = 0;
        var randomY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight+50;
        var maxX = this.node.width/2;
        if (this.currentStarX >= 0){
            randomX = - cc.random0To1() * maxX;
        }else{
            randomX = cc.random0To1()*maxX;
        }
        this.currentStarX = randomX;
        return cc.p(randomX,randomY);
    },
    gainScore: function(){
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAduio,false);
    },
    onStartGame: function() {
        this.resetScore();
        this.isRunning = true;
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        this.player.getComponent('Player').startMoveAt(cc.p(0,this.groundY));
        this.newStarFunc();
    },
    resetScore: function(){
        this.score = 0;
        this.scoreDisplay.string = 'Score:' + this.score.toString();
    },
    gameOver: function(){
        this.player.getComponent('Player').stopMove();
        this.gameOverNode.active = true;
        this.isRunning = false;
        this.btnNode.setPositionX(0);
        this.currentStar.destroy();
    },
    update: function(dt) {
        if (!this.isRunning) return;
        if(this.timer > this.starDuration)
        {
            this.gameOver();
            return;
        }
        this.timer += dt; 
    },
});
