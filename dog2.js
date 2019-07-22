var config = {
    type: Phaser.AUTO,
    width: 750,
    height: 515,
    physics: {
   default: 'arcade',
   arcade: {
       gravity: { y: 50 },
       debug: false
   }
 },
    scene: {
        preload: preload,
        create: create,
        update:update
    }
};
var player;
var platforms;
var cursors;
var blocks;
var coin;
var blocked=true;
var score = 0;
var scoreText;
var score2 = 0;
var scoreText2;
var game = new Phaser.Game(config);
var punching=false;

function preload ()
{
  this.load.image('platform', 'assets/platform2.png');
  this.load.image('play_block', 'assets/play_block.jpg');
  this.load.spritesheet('dog','assets/dogsprites.png ', { frameWidth: 56, frameHeight: 41 });
  this.load.spritesheet('walk','assets/dog_walk2.png ', { frameWidth: 48, frameHeight: 43 });
  this.load.spritesheet('punch','assets/dog_punchsprite.png ', { frameWidth: 80, frameHeight: 42 });
  this.load.image('dud_block','assets/dud_block.jpg');
  this.load.image('sky','assets/sky.png');
  this.load.audio('brick','assets/brick.wav');
  this.load.audio('jump','assets/jump.ogg');
  this.load.audio('bgmusic','assets/bgmusic.ogg');
  this.load.audio('coin_sound','assets/coin.wav');
  this.load.image('coin','assets/coin.png');
}

function create ()
{
    var self = this;

    this.sound.add('brick');
    this.sound.add('jump');
    this.sound.add('bgmusic');
    this.sound.add('coin_sound');
    this.sound.play('bgmusic');
    this.add.image(400, 300, 'sky');
    this.sound.play('coin_sound')
    platforms = this.physics.add.staticGroup();
    blocks = this.physics.add.staticGroup();
    platforms.create(50, 490, 'platform')
    platforms.create(381, 490, 'platform')
    platforms.create(600, 490, 'platform')
    for (i=0;i<14;i++)
    {
    blocks.create(100+i*42, 350, 'play_block');
    blocks.create(100+i*42, 200, 'play_block');
    }
//player1
    player = this.physics.add.sprite(0, 0, 'dog'); 
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300)
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300)
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, blocks, changeBlock, null, this);

//
//player2
    player2 = this.physics.add.sprite(700,0,'dog');
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.body.setGravityY(300)
    player2.setBounce(0.2);
    player2.setCollideWorldBounds(true);
    player2.body.setGravityY(300)
    this.physics.add.collider(player2, platforms);
    this.physics.add.collider(player2, blocks, changeBlock, null, this);
    
    player2.flipX=true; 
//
this.physics.add.collider(player,player2, punchplayer2, null, this);
//player1
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'punch',
        frames: this.anims.generateFrameNumbers('punch', { start: 0, end: 7 }),
        frameRate: 15,
        repeat: -1
    });
   this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('walk', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    
 //
    scoreText = this.add.text(16, 16, 'player1: 0', { fontSize: '32px', fill: '#000' });
    scoreText2 = this.add.text(540, 16, 'player2: 0', { fontSize: '32px', fill: '#000' });
    cursors = this.input.keyboard.createCursorKeys();  
}



function update ()
{    
if (cursors.left.isDown)
{
player.setVelocityX(-160);
player.flipX=true;
player.anims.play('left',true);
punching=false;
}
else if (cursors.shift.isDown)
{
console.log("pressed down key");
player.setVelocityX(0);
player.anims.play('punch',true);
punching=true;
}
else if (cursors.right.isDown)
{
console.log("right");
player.setVelocityX(160);
player.flipX=false;
player.anims.play('right',true);
punching=false;
}
else
{
player.anims.play('turn',true);
player.setVelocityX(0);
punching=false;
}
if (cursors.up.isDown && player.body.touching.down)
{
player.setVelocityY(-430);
this.sound.play('jump');
punching=false;
}
this.physics.add.collider(player2, coin, collectCoin2, null, this);
}

function changeBlock (player, blocks)
    {
        var Random=Phaser.Math.Between(1,4);
    
        if (Random<3)
        if (player.y>blocks.y+40)
        if (blocks.texture.key=='play_block')
        {
            this.sound.play('brick');
            blocks.setTexture('dud_block');
            coin = this.physics.add.sprite(blocks.x, blocks.y-40, 'coin');
            coin.body.setGravityY(300);
            coin.setBounce(1);
            this.physics.add.collider(coin, platforms);
            this.physics.add.collider(player, coin, collectCoin, null, this);
            coin.setVelocityX(60);  
            coin.setVelocityY(-300);
            coin.setCollideWorldBounds(true);
        }
        if (Random==3)
        if (player.y>blocks.y+40)
        if (blocks.texture.key=='play_block')
        {
            this.sound.play('brick');
            coin = this.physics.add.sprite(blocks.x, blocks.y-40, 'coin');
            coin.setBounce(1);
            coin.body.setGravityY(300);
            this.physics.add.collider(coin, platforms);
            this.physics.add.collider(player, coin, collectCoin, null, this);
            coin.setVelocityX(60);  
            coin.setVelocityY(-300);
            coin.setCollideWorldBounds(true);
        }
        if (Random==4)
        if (player.y>blocks.y+40)
        if (blocks.texture.key=='play_block')
        {
            this.sound.play('brick');
            blocks.destroy();
        }
        else{
            this.sound.play('brick');
        }
    }
function collectCoin (player, coin)
    {
        scoreText.destroy();
        scoreText = this.add.text(16, 16, 'player1: 0', { fontSize: '32px', fill: '#000' });
        score += 10;
        scoreText.setText('player1: ' + score);
            this.sound.play('coin_sound');
             coin.destroy();
    }
    function collectCoin2 (player2, coin)
    {
        scoreText2.destroy();
        scoreText2 = this.add.text(540, 16, 'player2: 0', { fontSize: '32px', fill: '#000' });
        score2 += 10;
        scoreText2.setText('player2: ' + score2);
            this.sound.play('coin_sound');
             coin.destroy();
    }
function punchplayer2 (player,player2)
{
    if (punching==true)
    {
        player2.destroy();
    }
}