var thisClient = io();
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
// var canvasWidth = 0.7*window.innerWidth;		
// var canvasWidth = 1000;		
// var canvasWidth = 1000;		
// var canvasHeight = 0.56*canvasWidth; //16:9
ctx.canvas.height = canvasHeight;
ctx.canvas.width = canvasWidth;
// var playerSpeed = 0.7*canvasWidth/3;
// var shipSize = canvasWidth/21;
var playerSpeed = 300;
var shipSize = 60;



//all info required of other player
//		needs to be within tank class
var moveKeysHeld = 0;
var leftDown = false;
var upDown = false;
var rightDown = false;
var downDown = false;

var randX;
var randY;

var tankImageOne = new Image();
tankImageOne.src = "tank.png";
var tankImageTwo = new Image();
tankImageTwo.src = "tank2.png";
var brokenTankImage = new Image();
brokenTankImage.src = "tankDead.png";
var tankTurretImage = new Image();
tankTurretImage.src = "tankTurret.png";

var ufoImage = new Image();
ufoImage.src = "ship.png";
var ufoImage2 = new Image();
ufoImage2.src = "ship2.png";
var brokenUfoImage = new Image();
brokenUfoImage.src = "shipDead.png";
var ufoTurretImage = new Image();
ufoTurretImage.src = "turret.png";

var alienImage = new Image();
alienImage.src = "zombie.png";
var alienImage2 = new Image();
alienImage2.src = "zombie2.png";
var brokenAlienImage = new Image();
brokenAlienImage.src = "zombieDead.png";
var alienTurretImage = new Image();
alienTurretImage.src = "eye.png";

var truckImage = new Image();
truckImage.src = "ship21.png";
var truckImage2 = new Image();
truckImage2.src = "ship22.png";
var brokenTruckImage = new Image();
brokenTruckImage.src = "truckDead.png";
var truckTurretImage = new Image();
truckTurretImage.src = "turret2.png";
// var opponentsTank;//for debugging
var tankImageList;
var ufoImageList;
var alienImageList;
var truckImageList;

var playerImageList;//dont need


var playersTank;
var playersArrayIndex;

var mouseX;
var mouseY;

// var ROTATE_SPEED = 10; //Multiples of 5 and 10 to avoid jiggle
var ROTATE_SPEED = 600; //Multiples of 5 and 10 to avoid jiggle

//todo change to allPlayersJSON, allPlayersObjects
var allPlayers = {};
var playerObjectsList;

var allBullets;

var canBoost = true;
var heldDown = false;

var TANK_BULLET_IMAGE = new Image;	
TANK_BULLET_IMAGE.src = "bullet.png";
var UFO_BULLET_IMAGE = new Image;	
UFO_BULLET_IMAGE.src = "bullet2.png";
var ALIEN_BULLET_IMAGE = new Image;	
ALIEN_BULLET_IMAGE.src = "bullet3.png";
var TRUCK_BULLET_IMAGE = new Image;	
TRUCK_BULLET_IMAGE.src = "bullet4.png";
var NORMAL_BULLET_SIZE = 0.3*shipSize;
var NORMAL_BULLET_DAMAGE = 51;
var EXPLOSION_TIME = 300;
var EXPLOSION_SPEED = 0.2;
var healthImage = new Image();
healthImage.src = 'health.png';
var healthImage2 = new Image();
healthImage2.src = 'health2.png';
var healthImageList = [healthImage, healthImage2];

var speedImage = new Image();
speedImage.src = 'speed.png';
var speedImage2 = new Image();
speedImage2.src = 'speed2.png';
var speedImage3 = new Image();
speedImage3.src = 'speed3.png';	
var speedImageList = [speedImage, speedImage2, speedImage3];

var activePickups = [];
var pickupAnimations;//timer
var pickupsFrame = 0;

//CS mode: bullets faster/less damage/no bounce. Can't see past walls
var gameModes = ['normal', 'cs'];
var gameMode = gameModes[0];
var globalBulletSpeed;
// var SHOT_RATE = 1;//seconds between shots, should be in tank/currentWeapon
// var SHOT_RATE = 0.3;//seconds between shots, should be in tank/currentWeapon
var SHOT_RATE//seconds between shots, should be in tank/currentWeapon
//could change to /s by having 1000/shotrate e.g. 1000/10 = 100ms between

var allExplosions;

var camera;
var screen;
//could have map class, width height walls, mode
var mapWidth;
var mapHeight;

var taunts = ['Ez Pz', 'First game?','??','Maybe next one', 'Soz', 'Stop holding back...', 
			'L2p', 'GG no Re', 'One hand', 'You blind?', 'You OK?', 'Why you mad?', 'Zzz', 
			':o', 'xo', ':D!', 'Calm down', 'Relax', "What's the matter", 'Cat got your mouse?',
			'Play for real please', 'Y u no dodge?', "I'm eating even..", 'That was my little sis',
			'how to turn off easy mode?', 'ez game ez life'];
var tankTypeList = ['tank', 'ufo', 'alien', 'truck']; //add zombie
//dont need to keep sending: tankType, index?, clientID?, imageList, 
var playerData = {};

//need to send camera position to know where to draw player
//otherplayerx = difference in cameras + xpos
//or just send game x/y: = x + cameraX
//updates playerData to send based on playersTank
function refreshPlayerData()
{	
	playerData.gameX = playersTank.gameX;
	playerData.gameY = playersTank.gameY;
	// playerData.x = playersTank.xPosition;
	// playerData.y = playersTank.yPosition;
	// playerData.xOnMyScreen = playersTank.xOnScreen;
	// playerData.yOnMyScreen = playersTank.yOnScreen;
	
	playerData.isMoving = playersTank.isMoving;
	playerData.moveAngle = playersTank.moveAngle;
	playerData.turretAngle = playersTank.turretAngle;
	playerData.mouseX = mouseX;
	playerData.mouseY = mouseY;
	playerData.currentHealth = playersTank.currentHealth;
	// playerData.cameraX = camera[0];
	// playerData.cameraY = camera[1];	
}

// function Tank(id, startX, startY, baseImages, turretImageUrl, moveSpeed, bulletUrl, bulletSpeed)
//base images are base1 base2 basebroken turret bullet
// function Tank(id, startX, startY, baseImages, moveSpeed, bulletSpeed)
function Tank(id, startX, startY, tankType, moveSpeed, bulletSpeed)
{
	this.id = id;
	this.xPosition = startX;
    this.yPosition = startY;
	this.gameX = startX;
	this.gameY = startY;	
	
	this.xOnScreen = this.gameX;
	this.yOnScreen = this.gameY;
	this.size = shipSize;
	this.centerX = this.gameX+0.5*this.size;
	this.centerY = this.gameY+0.5*this.size;
	this.baseImages = [];
	this.tankType = tankType;
	if(tankType == 'tank')
	{
		this.baseImages = tankImageList;
		this.shootSound = kickSound;
	}
	else if(tankType == 'ufo')
	{
		this.baseImages = ufoImageList;
		this.shootSound = hatSound;
	}
	else if(tankType == 'alien')
	{
		this.baseImages = alienImageList;
		this.shootSound = snareSound;
	}
	else if(tankType == 'truck')
	{
		this.baseImages = truckImageList;
		this.shootSound = hatSound2;
	}
	this.baseImage = new Image();
	this.baseImage = this.baseImages[0];
	this.currentFrame = 0;
	this.turretImage = this.baseImages[3];
	// this.turretImage.src = turretImageUrl;
	this.moveAngle = 0;
	this.newAngle = 0;
	this.turretAngle = 0;
	this.bullets = [];
	this.bulletImage = this.baseImages[4];
	// this.bulletImage.src = bulletUrl;
	this.bulletSpeed = bulletSpeed;
	this.isMoving = false;
	this.alive = true;
	this.speed = moveSpeed;
	this.shootTimer;
	this.moveTimer;
	this.isTank = true; //use instanceOf(tank)
	
	this.moveKeysHeld = 0;
	this.leftDown = false;
	this.upDown = false;
	this.rightDown = false;
	this.downDown = false;
	
	this.clientID = thisClient.id;
	
	this.maxHealth = 1000;
	this.currentHealth = this.maxHealth;
	
	this.messageToSend = "";
	this.showingMessage = false;
	this.hideLabelTimer;
	
	this.canShoot = true;
	this.currentFrame = 1;
	
	this.cameraX = 0;
	this.cameraY = 0;
	
	// camera pos + screen pos
	
	// this.draw();
	// this.leftPressed();
}

Tank.prototype.draw = function(context)
{ 
		
    //translate canvas back to 0,0 so can draw all at gameX/Y
	context.save();
	if(this.id == 'player')//dont need
	{
		context.translate(-camera[0], -camera[1]);		
	}
	else
	{
		context.translate(-camera[0], -camera[1]);	
	}
	var screenCenterX = (this.gameX)+0.5*this.size;
	var screenCenterY = (this.gameY)+0.5*this.size;	
	drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
	drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	// drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
	// drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
	context.restore();
	
	
	
	
	// if(this.id != 'player') //to draw opponents
	// {
		// var screenCenterX = (camera[0]-this.gameX)+0.5*this.size;
		// var screenCenterY = (camera[1]-this.gameY)+0.5*this.size;	
		// var screenCenterX = (this.gameX-camera[0])+0.5*this.size;
		// var screenCenterY = (this.gameY+camera[1])+0.5*this.size;	
		// drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
		// drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	// }
	// else //to draw yourself
	// {
		
		// var screenCenterX = (this.gameX-camera[0])+0.5*this.size;
		// var screenCenterY = (this.gameY-camera[1])+0.5*this.size;	
		// drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
		// drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	// }
	// drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
	// drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	
	// drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
		// drawRotated(this.baseImage, this.moveAngle, this.xPosition, this.yPosition, shipSize);
	// drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
	
	
	/* if(this.id != 'player')
	{
		drawRotated(this.baseImage, this.moveAngle, this.centerX+this.cameraX, this.centerY-this.cameraY, shipSize);
		drawRotated(this.turretImage, this.turretAngle, this.centerX+this.cameraX, this.centerY-this.cameraY, shipSize);
	}
	else
	{
		drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
		// drawRotated(this.baseImage, this.moveAngle, this.xPosition, this.yPosition, shipSize);
		drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
	} */
	
	if(this.alive)
	{
		drawHealthbar(this, context);		
	}
	
}
//Check if hit by bullet
Tank.prototype.collides = function(object)
{	
	//will be this.gameX < object.gameX
	// if (this.xPosition < object.xPosition + object.size &&
		// this.xPosition + this.size > object.xPosition &&
		// this.yPosition < object.yPosition + object.size &&
		// this.yPosition + this.size > object.yPosition) 
	if (this.xOnScreen < object.xPosition + object.size &&
		this.xOnScreen + this.size > object.xPosition &&
		this.yOnScreen < object.yPosition + object.size &&
		this.yOnScreen + this.size > object.yPosition) 
		return true;
	/* {
		this.alive = false;
	} */
}
Tank.prototype.keyPressed = function(keyCode) 
{    
	// this.leftPressed();
	// console.log(this.instanceOf);
	switch(keyCode) {
		case 71:
			//g key pressed			
			// clearInterval(beatTimer);
			break
		case 69://e 
		console.log("index ",playerObjectsList.indexOf(playersTank));
		
			// chatMessage(playerObjectsList.indexOf(playersTank), "Ez");
			// chatMessage(playerObjectsList.indexOf(playersTank), message);
	
			// chatMessage(playersTank, "Ez");
			break
		case 70://f
			// chatMessage(playerObjectsList.indexOf(playersTank), "get rekt");
			break
		// case 72://h
		case 82://r
			
			break
		case 32: //space bar
			break
        case 37:
		case 65:
            // left key pressed			
			this.leftPressed();
            break;
        case 38:		
		case 87:
            // up key pressed
			this.upPressed();
            break;
        case 39:
        case 68:
            // right key pressed			
			this.rightPressed();
			break;
        case 40:
        case 83://s
            // down key pressed			
			this.downPressed();
			break;  
			
			
    }
		// this.newAngle = Math.ceil(this.newAngle/ROTATE_SPEED)*ROTATE_SPEED;

}

//all of these need to be able to be run on all other player objects
//      will recieve event when opponent presses their keys
// add upDown rightDown etc to tank
// or just return the angle
Tank.prototype.rightPressed = function()
{
	//prevent more than one added per key to keysHeld;
		// if(!this.rightDown)
		// {
			newAngle = 90;
			this.newAngle = 90;
			if(this.upDown)
			{
				newAngle = 45;
				this.newAngle = 45;
			}
			else if(this.downDown)
			{
				newAngle = 135;
				this.newAngle = 135;
			}
			
			if(!this.rightDown)
			{				
				this.moveKeysHeld++;
			}
			if(!this.isMoving)
			{					
				this.isMoving = true;
			}
			this.rightDown = true;	
		// }
		
}
// function downPressed()
Tank.prototype.downPressed = function()
{		
		
		// if(!this.downDown)
		// {
			newAngle = 180;
			this.newAngle = 180;
			if(this.rightDown)
			{
				newAngle = 135;
				this.newAngle = 135;
				// playersTank.newAngle = 135;
			}
			else if(this.leftDown)
			{
				newAngle = 225;
				this.newAngle = 225;
				// playersTank.newAngle = 225;
			}
			if(!this.downDown)
			{				
				this.moveKeysHeld++;
			}
			
			this.downDown = true;
			if(!this.isMoving)
			{					
				this.isMoving = true;
			}
		// }
		
}
Tank.prototype.leftPressed = function()
{				
		// if(!this.leftDown)
		// {
			newAngle = 270;
			this.newAngle = 270;		
			if(this.upDown)
			{
				newAngle = 315;
				this.newAngle = 315;
			}
			if(this.downDown)
			{
				newAngle = 225;
				this.newAngle = 225;
			}
			
			if(!this.leftDown)
			{				
				this.moveKeysHeld++;
			}
			this.leftDown = true;
			if(!this.isMoving)
			{					
				this.isMoving = true;
			}
		// }
		
}
Tank.prototype.upPressed = function()
{		
		// if(!this.upDown)
		// {	
			newAngle = 0;
			this.newAngle = 0;		
			if(this.leftDown)
			{
				newAngle = 315;
				this.newAngle = 315;
			}
			else if(this.rightDown)
			{
				newAngle = 45;
				this.newAngle = 45;
			}
			// if(this.moveKeysHeld < 3 && !this.upDown)
			if(!this.upDown)
			{				
				this.moveKeysHeld++;
			}			
			this.upDown = true;	
			if(!this.isMoving)
			{					
				this.isMoving = true;
			}
		// }
}
Tank.prototype.keyReleased = function(keyCode)
{
	switch(keyCode) {
		case 37:
		case 65:
            // left key pressed			
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
			}
			this.leftDown = false;
            break;
        case 38:		
		case 87:
            // up key pressed
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
			}
			this.upDown = false;
            break;
        case 39:
        case 68:
            // right key pressed
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
			}
			this.rightDown = false;
            break;
        case 40:
        case 83:
            // down key pressed
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
			}
			this.downDown = false;
            break; 
	}	
	this.isMoving = false;
	//from diagonal to straight
	if(this.upDown)
	{
		this.upPressed();
	}
	else if(this.leftDown)
	{
		this.leftPressed();
	}
	else if(this.downDown)
	{
		this.downPressed();
	}
	else if(this.rightDown)
	{
		this.rightPressed();
	}
}
Tank.prototype.drawChatBubble = function(context)
{
	//white square with triangle at bottom side
	// messageToSend;
	var bubbleX = this.xOnScreen+1.3*shipSize;
	var bubbleY = this.yOnScreen-1.2*shipSize;
	var bubbleWidth = 2*shipSize; //should be this.size
	var bubbleHeight = 1.5*shipSize;
	context.fillStyle='rgba(255,255,255,0.6)';
	context.font = 0.5*bubbleHeight+'px Righteous';
	var wordWidth = context.measureText(this.messageToSend).width;	
	//if on right side of screen, draw bubble on other side of tank
	var triangleStartX = this.xOnScreen+this.size;
	var triangleSecondX = bubbleX;
	if(this.xOnScreen > 0.5*canvasWidth)
	{
		bubbleX -= wordWidth + this.size+1.8*shipSize;
		triangleStartX = this.xOnScreen;
		triangleSecondX = bubbleX + wordWidth+shipSize;
	}
	context.fillRect(bubbleX,bubbleY,wordWidth+shipSize,bubbleHeight);
	//draw triangle
	
	context.beginPath();
	context.moveTo(triangleStartX, this.yOnScreen+0.5*this.size);
	context.lineTo(triangleSecondX, bubbleY+0.5*bubbleHeight);
	context.lineTo(triangleSecondX, bubbleY+bubbleHeight);
	context.closePath();
	context.fill();
	//draw text (font set earlier to get measureText())
	context.fillStyle='black';
	// ctx.fillText(messageToSend, bubbleX+(0.25*width), bubbleY+(0.75*height));
	context.fillText(this.messageToSend, bubbleX+(0.25*bubbleWidth), bubbleY+(0.75*bubbleHeight));
}
//should be split to randomise position and respawn
//      reusable for other objects (zombies, pickups)
Tank.prototype.randomRespawn = function()
{
	//respawn tank
	this.alive = true;
	this.baseImage = this.baseImages[0];
	this.currentHealth = this.maxHealth;
	
	//randomise position
	var respawnX;
	var respawnY;
	var safeSpawn = false;
	//needs to not include a wall
	//    checks new random position with collidesWithAnyWall
	while(!safeSpawn)
	{
		//these values need to be given to server 
		//BUG: each client calculating a their own random position then
				//updating when server says
		// respawnX = Math.random() * (canvasWidth*0.2)+0.2*canvasWidth;
		// respawnY = Math.random() * (canvasHeight*0.2)+0.2*canvasHeight;
		//needs to be screen size - camera change distance from side
		respawnX = (Math.random() * (canvasWidth-4*this.size))+2*this.size;
		respawnY = (Math.random() * (canvasHeight-4*this.size))+2*this.size;
		// respawnX = 0.5*mapWidth;
		// respawnY = 0.5*mapHeight;
		
		var doesCollide = collidesWithAnyWall(respawnX, respawnY, this.size)[0] == 'true';
		if(!doesCollide)
		{
			safeSpawn = true;
		}
	}
		
	// this.xPosition = respawnX;
	// this.yPosition = respawnY;	
	
	this.gameX = respawnX;
	this.gameY = respawnY;	
	this.xOnScreen = respawnX;
	this.yOnScreen = respawnY;	
	
	refreshPlayerData();
	// thisClient.emit('clientPlayerData', playerData);	
	//resends all data to all clients, should just send new position
	thisClient.emit('playerRespawn', playerData);	
}
Tank.prototype.stopMoving = function()
{
	//stop all keypresses
	this.moveKeysHeld = 0;
	this.isMoving = false;
	this.leftDown = false;
	this.upDown = false;
	this.rightDown = false;
	this.downDown = false;					
}
Tank.prototype.boost = function()
{
	// this.speed = this.speed*4;
	// setTimeout(function()
	// {
		// this.speed= this.speed/4;
	// }, 250);			
}
function Pickup(x, y, size, id)
{
	this.xPosition = x;
	this.yPosition = y;
	this.size = size;
	this.id = id;
	this.pickupImage;
	this.imageList = [];
	if(id == 'health')
	{
		this.pickupImage = healthImage;
		this.imageList = healthImageList;
	}
	else if(id == 'speed')
	{
		this.pickupImage = speedImage;
		this.imageList = speedImageList;
	}
	else if(id == 'shotgun')
	{
		this.pickupImage = healthImage;
		this.imageList = healthImageList;
	}
	if(activePickups.length == 0)
	{		
		clearInterval(pickupAnimations);
		pickupAnimations = setInterval(function(){animatePickups()}, 500);	
	}
}
var toRespawnList = [];

function drawHealthbar(object, context)
{
	var healthPercent = object.currentHealth/object.maxHealth;
	var healthBarY = object.gameY-camera[1] + object.size;
	var barHeight = object.size/5;
	var barWidth = object.size;
	context.fillStyle='#ff0000';//red
	context.fillRect(object.gameX-camera[0],healthBarY,barWidth,barHeight);
	context.fillStyle='#5aff00';//bright green
	//x and y same, width = barWidth * healthPercent;
	var greenWidth = barWidth * healthPercent;
	context.fillRect(object.gameX-camera[0],healthBarY,greenWidth,barHeight);
}

function keyPressed(e)
{	
	if(e.keyCode === 13)
	{			
		chatInput.focus();		
		chatInput.value = "";
		chatInput.style.left = playersTank.centerX-canvasWidth*0.05+'px';		
		chatInput.style.top = playersTank.yPosition+playersTank.size+20+'px';
		chatInput.style.opacity = '0.6';
		/* console.log('sentIndex', playersArrayIndex); */
		playersTank.stopMoving();
		thisClient.emit('stopMoving', playerObjectsList.indexOf(playersTank));
		// thisClient.emit('stopMoving', playersArrayIndex);
		
		// canvasUnFocus();
	}
	else if(e.keyCode == 82)//r
	{
		var randomMessage = taunts[Math.floor(Math.random() * taunts.length)];
		// chatMessage(playerObjectsList.indexOf(playersTank), "Ez Pz");
		chatMessage(playerObjectsList.indexOf(playersTank), randomMessage);
	}
	else if(e.keyCode == 32)//space
	{
		if(canBoost)
		{
			boost(playersTank);
			thisClient.emit('boostMe', playerObjectsList.indexOf(playersTank));
		
			canBoost = false;
			setTimeout(function()
			{
				canBoost = true;			
			}, 2000);//boost cooldown
		}		
	}
	else //maybe else if and keycode all movekeys?
	{
		if(playersTank.alive)
		{
			//move your tank on screen
			playersTank.keyPressed(e.keyCode);
		}
		
	}
	
			
	//need to only do this when movekey++
		//or if newAngle != moveAngle
	//   sends many messages if one direction held
	// var cliendIDandKeyCode = 
	if(playersTank.alive)
	{
		var arrayIndexAndKeyCode = 
		{
			index: playerObjectsList.indexOf(playersTank),
			keyCode: e.keyCode
		}
		thisClient.emit('moveKeyPressed',arrayIndexAndKeyCode);
	}
	
}

function keyReleased(e)
{
	playersTank.keyReleased(e.keyCode);
	var clientIndexAndKeyCode = 
	{
		index: playerObjectsList.indexOf(playersTank),
		keyCode: e.keyCode
	}
	// also need to send ismoving, or set when recieved
	thisClient.emit('keyReleased',clientIndexAndKeyCode);
}

function Bullet(bulletImage, shooter, direction, speed, size, damage) 
{	
	//(direction, tankFrom)
	this.xPosition = shooter.centerX;
    this.yPosition = shooter.centerY;
	this.bulletImg = bulletImage;
	this.travelAngle = direction;
	this.size = size;
	this.width = this.size;
	this.height = this.size;
	this.timeCreated = (new Date()).getTime();
	//for max bounces
	this.bounceCount = 0;
	this.alive = true;
	this.shooter = shooter;
	this.speed = speed;
	this.justBounced = false;
	this.damage = damage;
	drawRotated(this.bulletImg, direction*(180/Math.PI), this.xPosition, this.yPosition, this.size);
}

Bullet.prototype.draw = function(context) 
{
	drawRotated(this.bulletImg, this.travelAngle*(180/Math.PI), this.xPosition, this.yPosition, this.size);	
}

var allWalls;
var wallColour = "#C59900";
var sideWallThickness;
var timeOfLastFrame;



function init(allPlayerInfo, arrayIndex, allPickupInfo)
{	
	canvas.focus();
	
	allBullets = [];
	allExplosions = [];
	ufoImageList = [ufoImage, ufoImage2, brokenUfoImage, ufoTurretImage, UFO_BULLET_IMAGE];
	tankImageList = [tankImageOne, tankImageTwo, brokenTankImage, tankTurretImage, TANK_BULLET_IMAGE];
	alienImageList = [alienImage, alienImage2, brokenAlienImage, alienTurretImage, ALIEN_BULLET_IMAGE];
	truckImageList = [truckImage, truckImage2, brokenTruckImage, truckTurretImage, TRUCK_BULLET_IMAGE];
	
	hatSound = document.getElementById('hat');
	hatSound2 = document.getElementById('hat2');
	kickSound = document.getElementById('kick');
	snareSound = document.getElementById('snare');
	
	synth1Sound = document.getElementById('synth1');
	synth2Sound = document.getElementById('synth2');
	synth3Sound = document.getElementById('synth3');
	// chargeSound = document.getElementById('charge');
	// chargeShot = document.getElementById('chargeShot');	
	// backingBass = document.getElementById('backingBass');	
	// backingMelody = document.getElementById('backingMelody');
	
	//x y zoom
	// camera = [0, -canvasHeight, 1.0];
	// screen = [0, -canvasHeight];
	camera = [0, 0, 1.0];
	screen = [0, 0];
	
	if(gameMode == 'cs')
	{
		globalBulletSpeed = playerSpeed*8;
		SHOT_RATE = 0.3;
	}
	else if(gameMode == 'normal')
	{
		globalBulletSpeed = playerSpeed*2;
		SHOT_RATE = 1;
	}
	
	
	playerObjectsList = [];
	hatSound.load();	
	hatSound2.load();
	kickSound.load();
	snareSound.load();
	
	synth1Sound.load();
	synth2Sound.load();
	synth3Sound.load();
	// setInterval(function(){animateTanks(playerObjectsList)}, 250);
	sideWallThickness = 2*NORMAL_BULLET_SIZE;
	allWalls = [];
	// deadList = [];
	// allWalls.push([0.45, 0.0, 0.15, 0.5]); //stage one wall
	allWalls.push([400, 0, 200, 300]); 
	allWalls.push([900, 500, 200, 300]);
	allWalls.push([1300, 0, 200, 300]); 
	
	//map x and y here
	mapWidth = 1700;
	mapHeight = 1000;
	var boundaryThickness = shipSize;
	allWalls.push([mapWidth - boundaryThickness, 0, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	allWalls.push([-boundaryThickness, 0, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	
	allWalls.push([-boundaryThickness, 0, mapWidth, boundaryThickness]); //top boundary
	allWalls.push([-boundaryThickness, mapHeight, mapWidth, boundaryThickness]); //bottom boundary
	
	//        add isChatting to stop movement while typing
	canvas.addEventListener("keydown", keyPressed, false);	
	canvas.addEventListener("keyup", keyReleased, false);
	timeOfLastFrame = (new Date()).getTime();
	requestAnimationFrame(animate);
	messageLabel = document.getElementById("message");
	
	// randX = Math.random() * (canvasWidth*0.7)+0.2*canvasWidth;
	// randY = Math.random() * (canvasHeight*0.7)+0.2*canvasHeight;
	// randX = Math.random() * 300;
	// randY = Math.random() * 300;
	/* randX = 1;
	randY = 1; not needed, randomised with randomRespawn function*/
	playerData = {
		x: 0,
		y: 0,
		moveAngle: 0,
		isMoving: false,
		id: thisClient.id,
		index: 0,
		turretAngle: 0,
		imageList: '',
		mouseX: 0,
		mouseY: 0,
		tankType: '',
		currentHealth: 0,
		cameraX: 0,
		cameraY: 0,
		gameX: 0,
		gameY: 0
	}
	//need tankTypeList
	var randomTypeIndex = Math.floor(Math.random()*tankTypeList.length);
	var randomTankType = tankTypeList[randomTypeIndex];
	// var idAndRandomXandY = [thisClient.id, randX, randY];
	/* console.log('player connected', clientId, thisClient.id); */
	/* updatePlayerObjects(players); *///sends to all connected clients
	// thisClient.emit('newPlayerPosition', idAndRandomXandY);
	
	addPreviousPlayers(allPlayerInfo);
	addPreviousPickups(allPickupInfo);
	// if(allPickupInfo!=null)
	// {
	// }	
	/* console.log("Player amount before: ", allPlayerInfo.length()); */
	/* console.log("playerConnected", thisClient.id); */
	
	//add player after other players to decide listposition
		//playerImageList defined in addPreviousPlayers
	playersTank = new Tank("player", canvasWidth/2, canvasHeight/2,
					randomTankType, playerSpeed, globalBulletSpeed);
	//handles not spawing in walls
	
	
	// playersTank.randomRespawn();//need to split to randomPosition()
	
	
	var idPositionImage = [thisClient.id, playersTank.gameX, playersTank.gameY, randomTankType];
	thisClient.emit('newPlayerPosition', idPositionImage);
	// playerObjectsList[thisClient.id] = playersTank;	
	// playerObjectsList[arrayIndex] = playersTank;	//or .push shoudl work
	playerObjectsList.push(playersTank);
	playersArrayIndex = playerObjectsList.indexOf(playersTank);
	playerData.index = playersArrayIndex; //not needed?
	playerData.tankType = randomTankType;
	// draw();
	//    sends the data of your tank frequently but the server
	//        only tells clients to update every half second, this is
	//        to make up for any difference in animation calculations
	
	
	setInterval(function(){animateTanks(playerObjectsList);}, 250);	
	
	setInterval(function() 
	{
		refreshPlayerData();
		thisClient.emit('clientPlayerData', playerData);	
	}, 1000/30);
	
	// }, 1000/20);
}
function draw()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");		
	//for painting, if(!isPainting)
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	//loop through every player
	//need this in animate? no positions should update on server
	// var arrayIndex = 0;
	// for (var i in playerObjectsList) 
	for(i = 0; i < activePickups.length; i++)
	{
		var thisPickup = activePickups[i];
		ctx.drawImage(thisPickup.pickupImage, thisPickup.xPosition, thisPickup.yPosition, thisPickup.size , thisPickup.size);	
	}	
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		// var player = allPlayers[i] || {};	
		var playerObject = playerObjectsList[i] || {};

		if(playerObject instanceof Tank)//needed?
		{			
			// if(playerObject.id != 'player')
			// {
				
			// }
			// else
			// {
				playerObject.draw(ctx);
			// }
			
			// if(playerObject.showingMessage)
			// {				
				// playerObject.drawChatBubble(ctx);
			// }
		}
	}
	
	//Draw all bullets in bullet array	
	for(i = 0; i < allBullets.length; i++)
	{		
		allBullets[i].draw(ctx);		
	}
		//Draw all explosions
	for(i =0; i < allExplosions.length; i++)
	{
		var currentExplosion = allExplosions[i];
		var centerX = currentExplosion[0];
		var centerY = currentExplosion[1];
		var radius = currentExplosion[2];
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.fillStyle = currentExplosion[5];
		ctx.fill();
	}	
	//don't draw own dot
	for(m =0; m < opponentMousePositions.length; m++)
	{
		var mouseXY = opponentMousePositions[m];
		var mouseX = mouseXY[0];
		var mouseY = mouseXY[1];
		var dotSize = shipSize/16;
		if(m != playersArrayIndex)
		{
			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.arc(mouseX, mouseY, dotSize, 0, 2 * Math.PI);
			ctx.fill();
		}
		// ctx.beginPath();
		// ctx.fillStyle = 'red';
		// ctx.arc(mouseX, mouseY, dotSize, 0, 2 * Math.PI);
		// ctx.fill();
	}
	for(var i = 0; i < allWalls.length; i++)
	{
		drawWall(ctx,allWalls[i][0],allWalls[i][1],allWalls[i][2],allWalls[i][3]);	
	}
	
	//Draw all wall shadows and top part
	// need to be last to be above?
	for(var i = 0; i < allWalls.length; i++)
	{
		drawWallShadow(ctx,allWalls[i][0],allWalls[i][1],allWalls[i][2],allWalls[i][3]);	
	}
	
	if(gameMode == 'cs')
	{
		// drawPlayerFog(ctx);
	}
	
	//chat bubbles
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var player = allPlayers[i] || {};	
		var playerObject = playerObjectsList[i] || {};

		if(playerObject instanceof Tank)//needed?
		{			
			// playerObject.draw(ctx);
			if(playerObject.showingMessage)
			{				
				playerObject.drawChatBubble(ctx);
			}
		}
	}

}
// var length;
// var degrees;
function drawPlayerFog(ctx)
{
	//triangle from bottom corner, to top corner 
	//to where look direction = y=0
	// centerXY of playersTank to corner = x
	var pCenterX = playersTank.centerX;
	var pCenterY = playersTank.centerY;
	var theWall = allWalls[0];
	
	// var wallX = theWall[0]*canvasWidth;
	// var wallY = theWall[1]*canvasHeight;
	// var wallWidth = theWall[2]*canvasWidth;
	// var wallHeight = theWall[3]*canvasHeight;		
	var wallX = theWall[0];
	var wallY = theWall[1];
	var wallWidth = theWall[2];
	var wallHeight = theWall[3];	
	var rightX = wallX+wallWidth;
	var bottomY = wallY+wallHeight;
	
	// var fogAngle = Math.atan2(rightX - playersTank.centerX, - (bottomY - playersTank.centerY));
	var fogAngle;
	var topLength;
	var fogSideLength;
	ctx.fillStyle = '#004705';
	
	if(pCenterX < wallX && pCenterY < wallY+wallHeight)
	{		
		fogAngle = Math.atan2(wallX - playersTank.centerX, - (bottomY - playersTank.centerY));
		var asDegrees = fogAngle*180/Math.PI;
		fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * (canvasWidth-playersTank.centerX);
		
		// console.log(asDegrees-90, fogSideLength);
		
		ctx.beginPath();
		ctx.moveTo(wallX, bottomY);
		// ctx.moveTo(pCenterX, pCenterY);
		ctx.lineTo(canvasWidth, bottomY);		
		ctx.lineTo(canvasWidth, pCenterY+fogSideLength);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillRect(rightX, 0, canvasWidth - wallWidth, wallHeight);
	}
	else if(pCenterX > rightX && pCenterY < wallY+wallHeight)
	{
		fogAngle = Math.atan2(rightX - playersTank.centerX, - (bottomY - playersTank.centerY));
		var asDegrees = fogAngle*180/Math.PI;
		fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * playersTank.centerX;
		
		ctx.beginPath();
		ctx.moveTo(rightX, bottomY);
		
		// ctx.moveTo(pCenterX, pCenterY);
		ctx.lineTo(0, bottomY);		
		ctx.lineTo(0, pCenterY-fogSideLength);
		ctx.closePath();
		ctx.fill();
		
		ctx.fillRect(0, 0, wallX, wallHeight);
	}
	
	if(pCenterX < wallX+wallWidth && pCenterY > wallY+wallHeight)
	{
		fogAngle = Math.atan2(rightX - playersTank.centerX, - (bottomY - playersTank.centerY));
		//actually right length
		topLength = Math.tan(fogAngle) * playersTank.centerY;
		
		ctx.beginPath();
		ctx.moveTo(rightX, bottomY);
		ctx.lineTo(rightX, wallY);
		ctx.lineTo(playersTank.centerX+topLength, wallY);
		ctx.closePath();
		ctx.fill();
	}
	
	if(pCenterX > wallX && pCenterY > wallY+wallHeight)
	{
		
		fogAngle = Math.atan2(wallX - playersTank.centerX, - (bottomY - playersTank.centerY));
		topLength = Math.tan(fogAngle) * playersTank.centerY;
		
		ctx.beginPath();
		ctx.moveTo(wallX, bottomY);
		ctx.lineTo(wallX, wallY);
		ctx.lineTo(playersTank.centerX+topLength, wallY);
		ctx.closePath();
		ctx.fill();
	}
	
	
	
	
}
// function drawWall(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight)
function drawWall(context, x, y, width, height)
{
	/* //draw top
	var width = wallDivideWidth*canvasWidth;
	var height = wallDivideHeight*canvasHeight;
	var x = xDivideWidth*canvasWidth;
	//minus sidewall thickness so tanks can go under the top part a little
	// giving illusion of 3d
	var y = yDivideHeight*canvasHeight;
	context.fillStyle=wallColour;
	context.fillRect(x,y,width,height); */
	
	
	context.fillStyle=wallColour;
	context.fillRect(x,y,width,height);

}
//Need seperate function so can be drawn above objects
function drawWallShadow(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight)
{
	//draw shadow	
	var width = wallDivideWidth;
	var height = wallDivideHeight;
	var x = xDivideWidth;
	var y = yDivideHeight;
	context.fillStyle="#000000";
	context.globalAlpha = 0.5;
	context.fillRect(x,y+height-sideWallThickness,width,2*sideWallThickness);
	context.globalAlpha = 1.0;
	context.fillStyle=wallColour;
	context.fillRect(x,y-sideWallThickness+2,width,sideWallThickness);
	
}
function drawRotated(imageToRotate, degrees, imageCenterX, imageCenterY, size)
{
	var c = document.getElementById("myCanvas");
	var context = c.getContext("2d");
	// save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    context.save();
	// move to rotation center point
	/* context.translate(shipCenterX, shipCenterY);	 */
	context.translate(imageCenterX, imageCenterY);
	
    context.rotate(degrees*Math.PI/180); 
    // draw the image
	// context.drawImage(imageToRotate, size, size, size, size);	
	context.drawImage(imageToRotate, -0.5*size, -0.5*size, size, size);
    // we’re done with the rotating so restore the unrotated context
    context.restore();
	/* context.drawImage(imageToRotate, -0.5*shipSize, -0.5*shipSize, shipSize, shipSize); */ 
}

function animate()
{
	// draw();
	var timeOfThisFrame = (new Date()).getTime();
	//time between frames in seconds
	var delta = (timeOfThisFrame - timeOfLastFrame)/1000;
	timeOfLastFrame = timeOfThisFrame;
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	// for(var i = 0; i < playerObjectsList.length; i++)
		
	//animate all tanks, spin and move
	// for (var i in playerObjectsList) 
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var tankToAnimate = playerObjectsList[i];		
		// if(tankToAnimate.clientID != thisClient.id)
		
		if(tankToAnimate.moveKeysHeld > 0 && tankToAnimate.alive)
		// if(tankToAnimate.isMoving > 0 && tankToAnimate.alive)
		{
			graduallySpin(tankToAnimate, tankToAnimate.moveAngle, tankToAnimate.newAngle, delta);
			
			//CHANGE NEWX to use gameX/y, dont check collisions with onscreen values
			var newXOnScreen = tankToAnimate.xOnScreen + delta * tankToAnimate.speed * Math.sin(tankToAnimate.moveAngle*(Math.PI/180));
			var newYOnScreen = tankToAnimate.yOnScreen - delta * tankToAnimate.speed * Math.cos(tankToAnimate.moveAngle*(Math.PI/180));		
			var xChange = delta * tankToAnimate.speed * Math.sin(tankToAnimate.moveAngle*(Math.PI/180));
			var yChange = -delta * tankToAnimate.speed * Math.cos(tankToAnimate.moveAngle*(Math.PI/180));		
			
			// if(isOnScreen(newXOnScreen,newYOnScreen,tankToAnimate.size))		
			// {				
				var collidesResult = collidesWithAnyWall(newXOnScreen,newYOnScreen,tankToAnimate.size);
				var willCollideWithWall = collidesResult[0]=='true';
				var sideHit = collidesResult[1];
				//need to combine with camera change area
				if(willCollideWithWall)
				{
					//slide if moving diagonally
					if(sideHit == 'top')
					{
						//when trying to move UP
						// if(newY < tankToAnimate.yPosition)
						if(newYOnScreen < tankToAnimate.yOnScreen)
						{
							// tankToAnimate.yPosition = newY;
							tankToAnimate.yOnScreen = newYOnScreen;
							tankToAnimate.gameY += yChange;
						}											
						// tankToAnimate.xPosition = newX;
						tankToAnimate.xOnScreen = newXOnScreen;						
						tankToAnimate.gameX += xChange;		
					}					//checks which side hit
					else if(sideHit == 'bottom')
					{		
						//when trying to move DOWN
						// if(newY > tankToAnimate.yPosition)
						if(newYOnScreen > tankToAnimate.yOnScreen)
						{
							// tankToAnimate.yPosition = newY;
							tankToAnimate.yOnScreen = newYOnScreen;
							tankToAnimate.gameY += yChange;
						}
						// tankToAnimate.xPosition = newX;
						tankToAnimate.xOnScreen = newXOnScreen;					
						tankToAnimate.gameX += xChange;		
					}//right
					else if(sideHit == 'right')
					{
						//trying to move right
						// if(newX > tankToAnimate.xPosition)
						if(newXOnScreen > tankToAnimate.xOnScreen)
						{
							// tankToAnimate.xPosition = newX;
							tankToAnimate.xOnScreen = newXOnScreen;			
							tankToAnimate.gameX += xChange;		
						}
						// tankToAnimate.yPosition = newY;
						tankToAnimate.yOnScreen = newYOnScreen;
						tankToAnimate.gameY += yChange;
					}
					else if(sideHit == 'left')
					{						
						//trying to move left
						// if(newX < tankToAnimate.xPosition)
						if(newXOnScreen < tankToAnimate.xOnScreen)
						{
							tankToAnimate.xOnScreen = newXOnScreen;		
							tankToAnimate.gameX += xChange;		
						}
						tankToAnimate.yOnScreen = newYOnScreen;			
						tankToAnimate.gameY += yChange;		
					}						
				} //code for moving camera on edge of screen 
				// else if(tankToAnimate.id == 'player' && 
				// (newX > 0.85*canvasWidth||newY+tankToAnimate.size > 0.85*canvasHeight
				// || newX < 0.15*canvasWidth|| newY < 0.15*canvasHeight))
				else if(tankToAnimate.id == 'player')
				// (newXOnScreen > canvasWidth-2*tankToAnimate.size||newYOnScreen+tankToAnimate.size > canvasHeight-2*tankToAnimate.size
				// || newXOnScreen < 2*tankToAnimate.size|| newYOnScreen < 2*tankToAnimate.size))
				{
					//near edges of screen					
					camera[0] += xChange;
					camera[1] += yChange;
					tankToAnimate.gameX += xChange;
					tankToAnimate.gameY += yChange;
					console.log('Y tank and camera:', tankToAnimate.gameY, camera[1],
					'X', tankToAnimate.gameX, camera[0]);
					// tankToAnimate.gameX = camera[0] + tankToAnimate.xPosition;
					// tankToAnimate.gameY = camera[1] + tankToAnimate.yPosition;
					tankToAnimate.cameraX = camera[0];
					tankToAnimate.cameraY = camera[1];					
					updateScreenPositions();
				}				
				else
				{
					// tankToAnimate.xPosition = newX;
					// tankToAnimate.yPosition = newY;
					tankToAnimate.xOnScreen += xChange;
					tankToAnimate.yOnScreen += yChange;
					tankToAnimate.gameX += xChange;
					tankToAnimate.gameY += yChange;
					/* messageLabel.style.fontSize = '15px'; */
					// messageLabel.innerHTML = "Screen: "+ tankToAnimate.xOnScreen+ " Game: "+ tankToAnimate.gameX ;
				}
			// }
			/*else //slide when hitting edge of screen
			{
 				//hit right
				if(tankRight > canvasWidth
				&& tankBottom < canvasHeight
				&& tankTop > 1)
				{				
					tankToAnimate.yPosition = newY;
				}//hit left
				else if(tankLeft < 1
				&& tankBottom < canvasHeight
				&& tankTop > 1)
				{
					tankToAnimate.yPosition = newY;
				}//hit bottom
				else if(tankBottom > canvasHeight
				&& tankRight < canvasWidth
				&& tankLeft > 1)
				{
					tankToAnimate.xPosition = newX;
				}//hit top
				else if(tankTop < 1
				&& tankRight < canvasWidth
				&& tankLeft > 1)
				{
					tankToAnimate.xPosition = newX;
				}	 	
			}*/
			// tankToAnimate.gameX = tankToAnimate.cameraX + tankToAnimate.xPosition;
			// tankToAnimate.gameY = tankToAnimate.cameraY + tankToAnimate.yPosition;
			
			// tankToAnimate.gameX = camera[0] + tankToAnimate.xPosition;
			// tankToAnimate.gameY = camera[1] + tankToAnimate.yPosition;
		}			
		// tankToAnimate.centerX = tankToAnimate.xPosition+0.5*tankToAnimate.size;
		// tankToAnimate.centerY = tankToAnimate.yPosition+0.5*tankToAnimate.size;
		tankToAnimate.centerX = tankToAnimate.xOnScreen+0.5*tankToAnimate.size;
		tankToAnimate.centerY = tankToAnimate.yOnScreen+0.5*tankToAnimate.size;	
	}
		
		
		
		//debugging
		// if(i != thisClient.id)
		// {
			// opponentsTank = tankToAnimate;
		// }
	
	turretFaceMouse();
	
	//animate all bullets, check collisions
	for(i = 0; i < allBullets.length; i++)
	{
		var xVelocity = Math.sin(allBullets[i].travelAngle);
		var yVelocity = Math.cos(allBullets[i].travelAngle);
		
		allBullets[i].xPosition += xVelocity * delta * allBullets[i].speed;
		allBullets[i].yPosition -= yVelocity * delta * allBullets[i].speed;
		
		//for collision
		var currentBullet = allBullets[i];
		var bulletRight = currentBullet.xPosition+currentBullet.size;
		var bulletBottom = currentBullet.yPosition+currentBullet.size;
		var bulletTop = currentBullet.yPosition;
		var bulletLeft = currentBullet.xPosition;
		
		var detectionBuffer = NORMAL_BULLET_SIZE; 
		var bulletCollidesResult = collidesWithAnyWall(
			currentBullet.xPosition, 
			currentBullet.yPosition, 
			currentBullet.size);
		// var bulletCollidesResult = collidesWithAnyWall(
			// currentBullet.xPosition - 0.5*detectionBuffer, 
			// currentBullet.yPosition - 0.5*detectionBuffer, 
			// currentBullet.size+detectionBuffer);
		// var bulletCollidesResult = collidesWithAnyWall(
		// currentBullet.xPosition, currentBullet.yPosition, 
		// currentBullet.size);
		var willBulletCollide = bulletCollidesResult[0]=='true';
		var sideHit = bulletCollidesResult[1];
		var wallHit = allWalls[bulletCollidesResult[2]];
		//bullet hit side
		// should be currentBullet.size
		/* if(!isOnScreen(currentBullet.xPosition, currentBullet.yPosition, NORMAL_BULLET_SIZE))
		{
			//bounce or explode
			// currentBullet.bounceCount++;// justBounced(currentBullet);
			// currentBullet.toggleSpeed();
			// setTimeout(function()
			// {
				// currentBullet.toggleSpeed();
			// }, 200);
			//add || currentBullet is charged
			
			if(currentBullet.bounceCount > 3 || gameMode == 'cs')//bullets die at 3 bounces
			{
			// || currentBullet.damage > NORMAL_BULLET_DAMAGE 
			// || currentBullet.shooter.id == "boss")
				explode(currentBullet);					
				allBullets.splice(i, 1);
				// break bulletLoop;
			}//if hit sides
			else if(bulletRight > canvasWidth)
			{
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;								
				currentBullet.xPosition = canvasWidth-currentBullet.size;
			}
			else if(bulletLeft < 0)
			{				
				//in radians
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;								
				currentBullet.xPosition = 0;
			}//if hit top and bottom
			else if(bulletBottom > canvasHeight)
			{
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.yPosition = canvasHeight-currentBullet.size;
			}
			else if(bulletTop < 0)
			{
				var angleBefore = currentBullet.travelAngle;
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.yPosition = 0;
			}
			//break bulletLoop;
		} */
		/* else  */if(willBulletCollide)//bullet hit wall
		{
			currentBullet.bounceCount++;
			//todo: checker for fast mode, just die on first bounce
			// 
			if(currentBullet.bounceCount > 3
			|| currentBullet.damage > NORMAL_BULLET_DAMAGE
			|| currentBullet.shooter.id == "boss"
			|| gameMode == 'cs')			//add || currentBullet is charged
			{
				explode(allBullets[i]);					
				allBullets.splice(i, 1); 
				// break bulletLoop;
			}				
			else if(sideHit == 'top')
			{
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.yPosition = (wallHit[1])-currentBullet.size;
			}				
			//bottom
			else if(sideHit == 'bottom')
			{						
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.yPosition = (wallHit[1]+wallHit[3]);
				
			}
			//right
			else if(sideHit == 'right')
			{
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;	
				currentBullet.xPosition = (wallHit[0]+wallHit[2]);
			
			}				
			//bottom
			else if(sideHit == 'left')
			{
					//sides
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;	
				currentBullet.xPosition = (wallHit[0]-currentBullet.size);
			}
			//break bulletLoop;
		}
		// if(tank.collides(currentBullet) && (currentBullet.shooter != tank
		// || currentBullet.shooter == tank && currentBullet.bounceCount > 0))
	
		//check bullet hit tank
		//   only do damage if this client hit, other damage needs to be sent from
		//   other clients
		for (var j = 0; j < playerObjectsList.length; j++) 
		{
			var tankToCheck = playerObjectsList[j];
			// if(tankToCheck.collides(currentBullet) 
			// &&(currentBullet.shooter != tankToCheck || currentBullet.shooter == playerObjectsList[j])
			// &&currentBullet.shooter.id == 'player')	

				
			if(tankToCheck.collides(currentBullet) &&
			(tankToCheck.id != currentBullet.shooter.id || 
			(tankToCheck.id == currentBullet.shooter.id && 
			currentBullet.bounceCount > 0)))//if bouncecount > 1, can kill self
			{						
				explode(currentBullet);	
				allBullets.splice(i, 1);
				
				if(tankToCheck.id == 'player')
				{
					// if(damageAndCheckKill(tank, damage))
							//send iDied to sync respawn timers;
					damageAndCheckKill(tankToCheck, currentBullet.damage);
					thisClient.emit('iGotHit', j);//tank index
					//TODO: send time of death if dead, so respawn is same time
					
					// damage(tankToCheck, currentBullet.damage);
				}
				/* //TODO: tell server tank died	
				//if this bullet kills tank
				if(damage(tankToCheck, currentBullet.damage))//returns true when dead
				{
					// tankToCheck.dieAndRespawn();
					// enemyDies(j);
					explode(tankToCheck);
					// need die and respawn function 
					if(tankToCheck.alive)
					{
						
						tankToCheck.alive = false;
						tankToCheck.baseImage = tankToCheck.baseImages[2];
						// respawn after time
						toRespawnList.push(j);
						setTimeout(function()
						{
							playerObjectsList[toRespawnList[0]].randomRespawn();
							toRespawnList.shift();//deletes first item
							messageLabel.innerHTML = "Go!" ;
							// playerObjectsList[respawnID].randomRespawn();
						},3000);
					}
					
					//for this player
					if(tankToCheck.id == 'player')
					{
						messageLabel.innerHTML = "You Lose!" ;						
					}	
					else //(tankToCheck.id == 'opponent')
					{
						messageLabel.innerHTML = "You Win!" ;
					} */
					// setTimeout(function()
					// {
						// messageLabel.innerHTML = "Go!" ;
					// },3000);
					// messageLabel.style.display = 'block';	
				// }
			}
		}
		//bullet hit bullet
		for(var b = 0; b < allBullets.length; b++)
		{
			if(collides(currentBullet.xPosition, currentBullet.yPosition, 
			currentBullet.size, currentBullet.size, 
			allBullets[b].xPosition, allBullets[b].yPosition,
			allBullets[b].size, allBullets[b].size) &&
				b != i)//So bullets cant collide with themselves
			{	
				
					
					explode(currentBullet);	
					explode(allBullets[b]);	
					allBullets.splice(i, 1); 
				//when second bullet not bigger than first											
					//to avoid removing the wrong one after first bullet removed
					if(b > i)
					{
						allBullets.splice(b-1, 1); 
					}
					else
					{					
						allBullets.splice(b, 1); 
					}
			}
		}
		
	}
	
	//Animate explosions, change images after a certain time
	for(i =0; i < allExplosions.length; i++)
	{
		var thisTime = (new Date()).getTime();
		var explosionDelta = thisTime - allExplosions[i][4];
		var maxRadius = allExplosions[i][3];
		var radius = allExplosions[i][2];
		if(radius > maxRadius)
		// if(delta > EXPLOSION_TIME) 
		{
			allExplosions.splice(allExplosions[i], 1);
		}
		// else(thisTime - allExplosions[i][4] > EXPLOSION_TIME/2 
		// && thisTime - allExplosions[i][4]< EXPLOSION_TIME)
		else //increment radius
		{
			allExplosions[i][2] = explosionDelta*EXPLOSION_SPEED;
			// allExplosions[i][0].src = bulletExplosions[1];
		}
	}
	
	//check for collisions with pickUps, tank hit pickup
	for(i = 0; i < activePickups.length; i++)
	{
		var thisPickup = activePickups[i];//maybe play animation/noise aswel
		if(playersTank.collides(thisPickup))
		{
			// activePickups.splice(i);	
				if(activePickups.length == 0)
				{
					clearInterval(pickupAnimations);
				}
				//tell server you got pickup
				thisClient.emit('iGotPickup', [thisPickup.id, i, playerObjectsList.indexOf(playersTank)]);
				//need method tank.gotPickup('type');
				// playersTank.pickedUp(thisPickup.id);
				tankPickedUp(playersTank, thisPickup.id, i);
			// if(thisPickup.id == 'health')
			// {
				// playersTank.currentHealth = playersTank.maxHealth;
			// }
			// else if(thisPickup.id == 'speed')
			// {
				// playersTank.speed = playersTank.speed * 2;
				// canBoost = false;
				// setTimeout(function()
				// {
					// playersTank.speed = playersTank.speed / 2;
					// canBoost = true;
				// }, 3000);
			// }
			
			
			// else if(thisPickup.id == 'shotgun')
			// {
				// playersTank.primaryGun = 'shotgun'
			// }
		}
	}
	requestAnimationFrame(animate);
	draw();
}
function collides(object1x, object1y, object1width, object1height, object2x, object2y, object2width, object2height)
{	
 var doesCollide = false;
	if(object1x < object2x + object2width &&
		object1x + object1width > object2x &&
		object1y < object2y + object2height &&
		object1y + object1height > object2y) 
		{
			doesCollide = true;
		}
	return doesCollide;
}

//checks all walls, returns whether collides and which side hit
function collidesWithAnyWall(x, y, size)
{
	var objectRight = x+size;
	var objectBottom = y+size;
	var objectTop = y;
	var objectLeft = x;
	for(var wallNumber = 0; wallNumber < allWalls.length; wallNumber++)
	{
		var currentWall = allWalls[wallNumber];
		// var wallX = currentWall[0]*canvasWidth;
		// var wallY = currentWall[1]*canvasHeight;
		// var wallWidth = currentWall[2]*canvasWidth;
		// var wallHeight = currentWall[3]*canvasHeight;
		var wallX = currentWall[0];
		var wallY = currentWall[1];
		var wallWidth = currentWall[2];
		var wallHeight = currentWall[3];
		//dont need true/false? just check if(!=='none')
		var result = ["false", "none"];
	
		if(collides(x, y, size, size, 
		wallX, wallY, wallWidth, wallHeight))
		{
			result[0] = "true";			
			result[2] = wallNumber;
			var fromTop = (objectBottom - wallY);
			var fromBot = (wallY+wallHeight - y);
			var fromLeft = (objectRight -  wallX );
			var fromRight = (wallX+wallWidth -  x);
			var CHECK_DISTANCE = 20;
			//top
			if(objectBottom > wallY
			&& objectBottom < wallY+wallHeight
			&& (fromTop) < CHECK_DISTANCE) //checks which side hit
			{
				result[1] = 'top';
				break;
			}
			//bottom
			else if(objectTop > wallY
			&& objectTop < wallY+wallHeight
			&& (fromBot) < CHECK_DISTANCE)
			{
				result[1] = 'bottom';
				break;
			}
			//right
			else if(objectLeft < wallX+wallWidth 
			&& objectLeft > wallX 
			&& (fromRight) < CHECK_DISTANCE)
			{
				result[1] = 'right';
				break;
			}
			//left
			else if(objectRight > wallX 
			&& objectRight < wallX+wallWidth
			&& (fromLeft) < CHECK_DISTANCE) 
			{
				result[1] = 'left';
				break;				
			}										
		}
	}
	return result;
}
//could edit to handle camera move
function isOnScreen(newX, newY, size)
{
	var onScreen = true;
	if(newX < 0 || newY < 0 
	|| newX+size > canvasWidth
	|| newY+size > canvasHeight)
	{
		onScreen = false;
	}
	return onScreen;
}

//transitions the change of angles to make a turn effect
function graduallySpin(tankToSpin, angleFrom, angleTo, delta)
{			
		
			
		//Calculate difference in angles
		var difference = angleTo - angleFrom;		
		var changeAngle = tankToSpin.moveAngle;
		//Make sure difference is positive
		if(difference < 0)
		{
			difference=-difference;
		}		
		if(difference!=0)//no transition needed if 0 difference
		{
			//needs to be multiple of 5 or 10?
			// var step = 20*delta*ROTATE_SPEED;
			// if(step < 10)
			// {
				// step = 5;
			// }
			//Decides whether to rotate clockwise or anti
			if(difference < 180 && tankToSpin.newAngle > tankToSpin.moveAngle 
			|| difference > 180 && tankToSpin.newAngle<=90)
			{	
				// changeAngle+=ROTATE_SPEED;
				// changeAngle+=50*delta*ROTATE_SPEED;
				changeAngle+=delta*ROTATE_SPEED;
			}
			else if(difference >= 180 
			|| (difference < 180 && tankToSpin.newAngle < tankToSpin.moveAngle))
			{	
				// changeAngle-=ROTATE_SPEED;
				// changeAngle-=50*delta*ROTATE_SPEED;
				changeAngle-=delta*ROTATE_SPEED;
			}
		}
		
		
		
		//Make sure angles are between 0 and 360
		if(changeAngle >= 364)
		{
			changeAngle = 0;
		}
		if(changeAngle < 0)
		{
			changeAngle=360-changeAngle;
		}
		
		//moveAngle = changeAngle;
		if(difference < 10)
		{
			tankToSpin.moveAngle = tankToSpin.newAngle;
		}
		else
		{				
			tankToSpin.moveAngle = changeAngle;
		}
}

canvas.onmousemove = function(e)
{
	/* angleToMouse = Math.atan2(e.pageX - shipX-0.5*shipSize, -(e.pageY - shipY-0.5*shipSize) ); */
	mouseX = e.pageX;
	mouseY = e.pageY;
	if(playersTank != null)
	{		
		turretFaceMouse();
	}
 }
 
 //stop right click menu on canvas
canvas.oncontextmenu = function() {
    return false;
}
 
 //send this when bullet created?
function turretFaceMouse()
{
	// playersTank.turretAngle = Math.atan2(mouseX - playersTank.xPosition-0.5*playersTank.size, -(mouseY - playersTank.yPosition-0.5*playersTank.size) );
	playersTank.turretAngle = Math.atan2(mouseX - playersTank.xOnScreen-0.5*playersTank.size, -(mouseY - playersTank.yOnScreen-0.5*playersTank.size) );
	playersTank.turretAngle = playersTank.turretAngle*(180/Math.PI);
}
var beatTimer;
canvas.onmousedown = function(e)
{
	//only if left click?
	// better to have gameOver/stageWon variable
	if(e.which == 1 && playersTank.alive)//left click
	{
		playerShootsMouse(mouseX,mouseY);
		heldDown = true;
		clearInterval(beatTimer);
		beatTimer = setInterval(function() 
		{ 			
			playerShootsMouse(mouseX,mouseY);
		},SHOT_RATE*1000);
	}
}

canvas.onmouseup = function(e)
{
	if(e.which == 1)//left click
	{
		heldDown = false;
		clearInterval(beatTimer);
	}
}


function playerShootsMouse(mouseX, mouseY)
{
	var bulletAngle = Math.atan2(mouseX - playersTank.centerX, - (mouseY - playersTank.centerY));
	
			//change to tank.bulletSize, tank.bulletDamage //need primary and secondary damage?
		// var newBullet = new Bullet(TANK_BULLET_IMAGE, playersTank, bulletAngle, playersTank.bulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE);	
			// allBullets.push(newBullet);			
			
	// addBullet(playersTank, bulletAngle);
	var bulletInfoToSend = 
	{		
		index: playerObjectsList.indexOf(playersTank),
		angle: bulletAngle
	}
	
	thisClient.emit('addBullet', bulletInfoToSend);
	
	// thisClient.broadcast.emit('addBullet', bulletInfoToSend);	
}

//angle needs to be calculated at client side with mouseXandY
// shooter is a tank object (playersTank of each client)
function addBullet(shooter, angle)
{
	//need shooter.bulletImage
	// var newBullet = new Bullet(TANK_BULLET_IMAGE, shooter, angle, shooter.bulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE);	
	if(shooter.canShoot)
	{
		// if(soundEnabled)
	// {
		// kickSound.currentTime = 0;
		// kickSound.play();
		shooter.shootSound.currentTime = 0;
		shooter.shootSound.play();
	// }
		var newBullet = new Bullet(shooter.bulletImage, shooter, angle, shooter.bulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE);	
		allBullets.push(newBullet);	
		shooter.canShoot = false;
		setTimeout(function()
		{
			shooter.canShoot = true;
		},SHOT_RATE*1000-50);
	}	
	
	
	
	//stop bullets lasting forever off screen
	// setTimeout(function(){
		// allBullets.splice(0, 1);
	// }, 4000);
}

// function boost(tankToBoost)
function boost(tankToBoost)
{
	tankToBoost.speed = tankToBoost.speed*4;
	setTimeout(function()
	{
		tankToBoost.speed = tankToBoost.speed/4;
		
	}, 250);
	
}
function tankPickedUp(tankPicked, pickupType, pickupArrayIndex)
{
	//attempt at showing pickup a little after its picked
	//   need to add  isActive, could use for animation
	//   opacity, -y
	// setTimeout(function() 
	// {		
		// activePickups.splice(pickupArrayIndex, 1);
	// }, 500);
	activePickups.splice(pickupArrayIndex, 1);
	if(pickupType == 'health')
	{
		tankPicked.currentHealth = tankPicked.maxHealth;
		synth1Sound.currentTime = 0;
		synth1Sound.play();
	}
	else if(pickupType == 'speed')
	{
		tankPicked.speed = tankPicked.speed * 2;
		synth2Sound.currentTime = 0;
		synth2Sound.play();
		// canBoost = false;
		setTimeout(function()
		{
			tankPicked.speed = tankPicked.speed / 2;
			// canBoost = true;
		}, 3000);		
		//timer to slow down
	}
}

//tell all clients to boost the tank
thisClient.on('boostTank', function(tankIndex)
{
	var tank = playerObjectsList[tankIndex];
	if(tank.id != 'player')
	{
		boost(tank);
	}
});


//tell all clients to add the new bullet (itself included)
thisClient.on('addBullet', function(recievedBulletInfo)
{
	// var senderID = recievedBulletInfo.clientID;
	var senderIndex = recievedBulletInfo.index;
	var shooter = playerObjectsList[senderIndex];
	addBullet(shooter, recievedBulletInfo.angle);
});

function damageAndCheckKill(tank, bulletDamage)
{
	if(damage(tank, bulletDamage)
		&& tank.alive)//returns true when dead
	{
		explode(tank);
		// need die and respawn function 
		tank.alive = false;
		// tank.isMoving = false;
		tank.stopMoving();
		tank.baseImage = tank.baseImages[2];
		// respawn after time
		toRespawnList.push(playerObjectsList.indexOf(tank));
		setTimeout(function()
		{
			playerObjectsList[toRespawnList[0]].randomRespawn();
			toRespawnList.shift();//deletes first item
			// messageLabel.innerHTML = "Go!" ;
		},3000);
		
		if(tank.id == 'player')
		{
			// messageLabel.innerHTML = "You Lose!" ;					
			clearInterval(beatTimer);
		}	
		else
		{
			// messageLabel.innerHTML = "You Win!" ;
			// gotKillAnimation();//show +1 that fades and goes up
		}
	}
}
// thisClient.on('otherPlayerHit', function(playerAndBulletInfo)
thisClient.on('otherPlayerHit', function(playerTankIndex)
{
	// var playerHit = playerObjectsList[playerAndBulletInfo[0]];
	var playerHit = playerObjectsList[playerTankIndex];
	// if(damage(playerHit, currentBullet.damage)
	damageAndCheckKill(playerHit, NORMAL_BULLET_DAMAGE);	
});

//for moving animation e.g. tread moving, lights flashing
function animateTanks(tankList)
{		
	for(var i = 0; i < tankList.length; i++)
	{
		var tankToAnimate = tankList[i];
		if(tankToAnimate.isMoving)//need ismoving moved to Tank object
		{		
			// tankToAnimate.baseImage.src = tankToAnimate.baseImages[tankToAnimate.currentFrame];
			tankToAnimate.baseImage = tankToAnimate.baseImages[tankToAnimate.currentFrame];
			// tankToAnimate.currentFrame = (tankToAnimate.currentFrame + 1)	% tankToAnimate.baseImages.length; 	
			tankToAnimate.currentFrame = (tankToAnimate.currentFrame + 1) % 2; 	
			
		} 
	}  
}
//changes image of pickups
function animatePickups()
{
	//need pickup.nextFrame();
	for(var i = 0; i < activePickups.length; i++)
	{
		if(pickupsFrame < activePickups[i].imageList.length)
		{
			activePickups[i].pickupImage = activePickups[i].imageList[pickupsFrame];	
		}
		
	}
	pickupsFrame++;
	if(pickupsFrame > 2)//how many frames e.g. 1 = 2
	{
		pickupsFrame = 0;
	}
}
//decrease hit tanks health, return true if dead
function damage(hitTank, damage)
{
	hitTank.currentHealth -= damage;
	if(hitTank.currentHealth < 0)
	{
		hitTank.currentHealth = 0; //stops negative healthbar
		return true; //isdead, change isalive too?
	}
	else
	{
		return false;
	}
}
//creates radiating circle based on object parameter
function explode(object)
{
	var centerX = object.xPosition - 0.5*object.size;
	var centerY = object.yPosition - 0.5*object.size;
	var radius = 0.5*object.size; //starting radius
	var maxSize = object.size;
	var timeCreated = (new Date()).getTime();
	var doesDamage = false;
	// var explosion = new Image;	
	// explosion.src = bulletExplosions[0];	
	// var thisExplosion = [explosion,xPos,yPos,size,timeCreated];
	var thisExplosion = [centerX, centerY, radius, maxSize, timeCreated, 'white', doesDamage];
	allExplosions.push(thisExplosion);	
	// if(soundEnabled)
	// {
		/* snareSound.currentTime = 0; */
		/* snareSound.play(); */
	// }//extra explosions for tanks and explosives	
	
}


// Get the input field
var chatInput = document.getElementById("chatInput");

var isTyping = false;
// When enter pressed, show message and send to other players
chatInput.addEventListener("keydown", function(event) 
{
  // Number 13 is enter
  if (event.keyCode === 13) 
  {
	var message = chatInput.value;
	//don't do anything if its space or empty
	// if message.replaceAll(' ', '') == ''
	chatMessage(playerObjectsList.indexOf(playersTank), message);
	
	canvas.focus();
	chatInput.value = "";
	chatInput.style.opacity = '0';
  }
});
//need pass id for timer?
Tank.prototype.showChat = function(indexAndMessage)
{
	this.messageToSend = indexAndMessage.message;		
	// playerObjectsList[indexAndMessage.index].showingMessage = true;
	this.showingMessage = true;
	clearInterval(this.hideLabelTimer)
	this.hideLabelTimer = setTimeout(function()
	{
		// this.showingMessage = false;
		playerObjectsList[indexAndMessage.index].showingMessage = false;
		//need playerObjectsList(thisClient.id)
	}, 2000 );		
}

// function chatMessage(tank, theMessage)
function chatMessage(tankId, theMessage)
{
	var senderIDandMessage = 
	{
		// index: playerObjectsList.indexOf(tank),
		index: tankId,
		message: theMessage
	}			
	//send message to server
	thisClient.emit('newChat', senderIDandMessage);	
	// tank.showChat(senderIDandMessage);
	playerObjectsList[tankId].showChat(senderIDandMessage);
}


/* Client server code */



//when player connects, init and add previous players
thisClient.on('playerConnect', function(allPlayerInfo, arrayIndex, allPickupInfo)
{	
	
	
	
	init(allPlayerInfo, arrayIndex, allPickupInfo);
	
	//if clientID != thisClientId
	//  add tank at position, how get position?
	// thisClient.emit('clientSendNewPlayerPosition', randomXandY);
});

function addPreviousPlayers(allPlayerInfo){
	
	// var previousPlayerAmount = 0;
	// for (var i in allPlayerInfo) 
	// {
		// previousPlayerAmount++;		
	// }
	
	// if(previousPlayerAmount > 0)
	// {
		// playerImageList = ufoImageList;
	// }
	// else
	// {
		// playerImageList = tankImageList;
	// }
	//1 = first to connect, 2 2nd etc
	var orderPlayerConnected = 1; //can just be indexOf in playerObjects
	var opponentsImageList;
	var opponentsTurretSrc;
	var opponentsBulletSrc;
	//i is client id
	for (var i in allPlayerInfo) 
	{	
		//only first connected gets tank image
		//    if you were second then first dcs, need check for new players
		//    to know your images, send with random position?
		// if(orderPlayerConnected = 1)
		// {
			// opponentsImageList = tankImageList;
		// }
		// else
		// {
			// opponentsImageList = ufoImageList;
		// }
		//turn every object from data into tank and add to list
		if(i != thisClient.id)
		{
			var player = allPlayerInfo[i] || {};	
			var previousTank = new Tank("opponent", player.gameX, player.gameY,
						player.tankType, playerSpeed, globalBulletSpeed);
			// opponentsTank = previousTank;//for debugging
			// playerObjectsList[i] = previousTank;
			// previousTank.gameX = player.gameX;
			// previousTank.gameY = player.gameY;
			
			playerObjectsList.push(previousTank);
			// orderPlayerConnected++;
		}	
			orderPlayerConnected++;
	}
	
}
function addPreviousPickups(allPickupInfo)
{
	for (var i = 0; i < allPickupInfo.length; i++) 
	{	
		//turn every object from data into tank and add to list
		var pickUpToAdd = allPickupInfo[i];		
		var pickupObject = new Pickup(pickUpToAdd[0]*canvasWidth, pickUpToAdd[1]*canvasHeight, 1.5*shipSize, pickUpToAdd[2]);
		activePickups.push(pickupObject);
	}
}

//called each time camera moves
// need to be screenXposition and gameXposition, e.g. @ screenX = 0 stage 2, gameX = canvasWidth
function updateScreenPositions()
{	
	var idAndCamera = [playerObjectsList.indexOf(playersTank),camera[0], camera[1]];
	// thisClient.emit('cameraChanged', idAndCamera);
	var cameraXChange = camera[0] - screen[0];
	var cameraYChange = camera[1] - screen[1];
	 for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var playerObject = playerObjectsList[i] || {};		
		if(playerObject.id != 'player')
		{
			// playerObject.xPosition -= cameraXChange;		
			// playerObject.yPosition -= cameraYChange;
			playerObject.xOnScreen -= cameraXChange;		
			playerObject.yOnScreen -= cameraYChange;
		}			
	} 
	// playersTank.xPosition -= cameraXChange;
	// playersTank.yPosition -= cameraYChange;
	//all player tanks
	//all pickUps
	// for(i = 0; i < deadList.length; i++)
	// {
		// var thisDeadImageInfo = deadList[i];
		// thisDeadImageInfo[1] -= cameraXChange;	
		// thisDeadImageInfo[2] -= cameraYChange;			
	// }
	for(i = 0; i < activePickups.length; i++)
	{
		activePickups[i].xPosition -= cameraXChange;		
		activePickups[i].yPosition -= cameraYChange;	
	}
	//all enemies
	// for(var i=0; i < enemies.length; i++)
	// {		
		// enemies[i].xPosition -= cameraXChange;		
		// enemies[i].yPosition -= cameraYChange;	
	// }
	for(var i=0; i < allWalls.length; i++)
	{
		allWalls[i][0] -= cameraXChange;
		allWalls[i][1] -= cameraYChange;
	}
	for(var i=0; i < allBullets.length; i++)
	{
		allBullets[i].xPosition -= cameraXChange;
		allBullets[i].yPosition -= cameraYChange;
	}
	
	// playersTank.cameraX = camera[0];
	// playersTank.cameraY = camera[1];
	screen[0] = camera[0];
	screen[1] = camera[1];
}

//when other client joins, add tank
thisClient.on('addNewPlayer', function(idXAndY)
{
	//allPlayers updated?
	// var newPlayerX = ;
	// var newPlayerY = ;
	// var newPlayer = allPlayers[newClientId];
	var senderId = idXAndY[0];
	var x = idXAndY[1];
	var y = idXAndY[2];	
	var tankType = idXAndY[3];	
	
	// console.log("add new player"+senderId+" at: "+ x,y, thisClient.id);
	// var x = randX;
	// var y = randY;
	// newPlayerTank = new Tank("opponent", x, y,
				// ufoImageList, playerSpeed, playerSpeed*2);
	newPlayerTank = new Tank("opponent", x, y,
				tankType, playerSpeed, globalBulletSpeed);
	// newPlayerTank.gameX = x;
	// newPlayerTank.gameY = y;
	playerObjectsList.push(newPlayerTank);
	// playerObjectsList[senderId] = newPlayerTank;
	// allPlayers[senderId]
});

// thisClient.on('playerDC', function(clientID)
thisClient.on('playerDC', function(clientArrayIndex)
{
	// removePlayer(clientID);
	removePlayer(clientArrayIndex);
});

// function removePlayer(clientID)
function removePlayer(clientArrayIndex)
{
	// playerObjectsList.splice(clientID, 1);
	// playerObjectsList.splice(clientID);
	playerObjectsList.splice(clientArrayIndex, 1);
	//easier to recreate whole object list?
	console.log("player deleted.");
	console.log(allPlayers);
	
}

//recieve the data of all players and update 
//      allPlayers on this client
thisClient.on('allPlayerData', function(recievedPlayerData)
{
	updatePlayerObjects(recievedPlayerData);
});

var opponentMousePositions = [];

function updatePlayerObjects(recievedPlayerData)
{
	allPlayers = recievedPlayerData;
	//how to not include current client?
		//if(i != thisClient.id)
			var objectListIndex = 0;
	for (var i in recievedPlayerData) 
	{		
		var player = recievedPlayerData[i] || {};	
		var playerAsObject = playerObjectsList[objectListIndex] || {};
		// playerAsObject.xPosition = player.x;
		// playerAsObject.yPosition = player.y;
		      
			  //DONT DO THIS, on screen is their own screen,
				//every client has different screen positions
		// playerAsObject.xOnScreen = player.xOnMyScreen;
		// playerAsObject.yOnScreen = player.yOnMyScreen;		
		
		playerAsObject.gameX = player.gameX;
		playerAsObject.gameY = player.gameY;
		playerAsObject.xOnScreen = player.gameX-camera[0];
		playerAsObject.yOnScreen = player.gameY-camera[1];
		//should be game
		// var please = playerAsObject.xPosition+0.5*playerAsObject.size;
		// playerAsObject.centerX = playerAsObject.xPosition+0.5*playerAsObject.size;
		// playerAsObject.centerY = playerAsObject.yPosition+0.5*playerAsObject.size;
		playerAsObject.centerX = playerAsObject.gameX+0.5*playerAsObject.size;
		playerAsObject.centerY = playerAsObject.gameY+0.5*playerAsObject.size;
		
		
		playerAsObject.moveAngle = player.moveAngle;
		playerAsObject.isMoving = player.isMoving;
		playerAsObject.turretAngle = player.turretAngle;
		opponentMousePositions[objectListIndex] = [player.mouseX, player.mouseY]
		
		playerAsObject.currentHealth = player.currentHealth;;
		objectListIndex++;
	}
}

//recieve id and new angle
//          better to call this for playersTankAlso?
//          make game states more similar
thisClient.on('otherPlayerMoveKeyDown', function(recievedArrayIndexAndKeyCode)
{
	//run key press code on playerObjectsList[recievedClientID]
	
	
	// var otherPlayerObject = playerObjectsList[recievedIDandKeyCode.id];	
	var otherPlayerObject = playerObjectsList[recievedArrayIndexAndKeyCode.index];	
	// otherPlayerObject.keyPressed(recievedIDandKeyCode.keyCode);
	otherPlayerObject.keyPressed(recievedArrayIndexAndKeyCode.keyCode);
	// otherPlayerObject.newAngle = recievedIDandNewAngle.newAngle;
	// otherPlayerObject.isMoving = true;	
});

//recieve id and new angle
// thisClient.on('otherPlayerKeyReleased', function(recievedIDandKeyCode)
thisClient.on('otherPlayerKeyReleased', function(recievedIndexAndKeyCode)
{
	//run key press code on playerObjectsList[recievedClientID]
	var otherPlayerObject = playerObjectsList[recievedIndexAndKeyCode.index];	
	otherPlayerObject.keyReleased(recievedIndexAndKeyCode.keyCode);
	// otherPlayerObject.newAngle = recievedIDandNewAngle.newAngle;
	// otherPlayerObject.isMoving = true;
});

thisClient.on('otherPlayerChat', function(recievedIDandMessage)
{
	// playerObjectsList[recievedIDandMessage.index].showChat(recievedIDandMessage.message);
	var otherPlayerObject = playerObjectsList[recievedIDandMessage.index];	
	var message = recievedIDandMessage.message;
	otherPlayerObject.showChat(recievedIDandMessage);
	
});

thisClient.on('stopOtherPlayerMoving', function(recievedIndex)
{
	// playerObjectsList[recievedIDandMessage.index].showChat(recievedIDandMessage.message);
	
	var otherPlayerObject = playerObjectsList[recievedIndex];	
	otherPlayerObject.stopMoving();
	
});
var maxPickups = 3;
thisClient.on('newPickup', function(recievedPosAndType)
{
	var xPos = recievedPosAndType[0]*canvasWidth;
	var yPos = recievedPosAndType[1]*canvasHeight;
	var type = recievedPosAndType[2];
	//maybe size too? unless constant
	var newPickup = new Pickup(xPos, yPos, 1.5*shipSize, type);
	activePickups.push(newPickup);		
	//stop this when activePickups is empty
	
});

thisClient.on('otherPlayerGotPickup', function(recievedPickupIdPlayerIndex)
{
	//pickup string, pickup array index, tank index
	recievedPlayer = playerObjectsList[recievedPickupIdPlayerIndex[2]];
	tankPickedUp(recievedPlayer, recievedPickupIdPlayerIndex[0], recievedPickupIdPlayerIndex[1]);
	// recievedPlayer.pickedUp(recievedPickupIdPlayerIndex[0]);//pickupID
});

thisClient.on('otherPlayerCameraChanged', function(recievedIDandCamera)
{	
	// playerObjectsList[recievedIDandCamera[0]].cameraX = recievedIDandCamera[1];
	// playerObjectsList[recievedIDandCamera[0]].cameraY = recievedIDandCamera[2];
});



