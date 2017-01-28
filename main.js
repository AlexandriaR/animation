var AM = new AssetManager();
var dir = true;


function Animation(spritesheets, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.change = function(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    //this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheets) {
    this.animation = new Animation(spritesheets, 600, 320, 2, 0.4, 2, true, 2.17);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

Background.prototype.update = function () {
};

function Block(game, spritesheets) {
    this.spritesheet = spritesheets[0];
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Block.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Block.prototype.update = function () {
};
function Koopa(game, spritesheets) {
    this.animation = new Animation(spritesheets, 32, 36, 37, 0.4, 37, true, 20);
    this.x = 300;
    this.y = 655;
    this.speed = 125;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
};

Koopa.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
};

Koopa.prototype.update = function () {
    if (this.x <= 0) {
	this.dir = false;
    }
    if (this.x >= 1300 -(32*this.animation.scale) ) {
	this.dir = true;
	   
    }
if(this.animation.elapsedTime < this.animation.totalTime*8/37 ||(this.animation.elapsedTime > this.animation.totalTime*21/37 && this.animation.elapsedTime < this.animation.totalTime*31/37)){	
    if(this.dir) {
        
        this.animation.change(this.animation.spritesheets[0], 32, 36, 37, 0.2, 37, true, 1.25);// facing right
	this.x -= this.game.clockTick * this.speed;		// walking/moving to the right
    } else{
        this.animation.change(this.animation.spritesheets[1], 32, 36, 37, 0.2, 37, true, 1.25);
        this.x += this.game.clockTick * this.speed;
    }
}
 };

AM.queueDownload("./koopasprites.png");
AM.queueDownload("./koopamirror.png");
AM.queueDownload("./Level 2.png");

AM.downloadAll(function () {
    console.log("hello");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    backgroundSprites = [AM.getAsset("./Level 2.png")];
    koopaSprites = [AM.getAsset("./koopasprites.png"), AM.getAsset("./koopamirror.png")];

    gameEngine.addEntity(new Background(gameEngine, backgroundSprites));
    gameEngine.addEntity(new Koopa(gameEngine, koopaSprites));
    
   // gameEngine.addEntity(new Fireball(gameEngine, fireballSprites));

    console.log("All Done!");
});

