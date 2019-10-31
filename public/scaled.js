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
var playerSpeed = 300;
var shipSize = 60;
var grenadeSpeed = playerSpeed*3;
// var globalBulletSpeed = playerSpeed*2;


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

var explosiveImageOne = new Image();
explosiveImageOne.src = "timeBomb.png";
var	explosiveImageTwo = new Image();
explosiveImageTwo.src = "timeBomb2.png";
var bubbleImage = new Image();
bubbleImage.src = "bubble.png";
var oilImage = new Image();
oilImage.src = "oil.png";

var snareImage = new Image();
snareImage.src = "snare2.png";
var kickImage = new Image();
kickImage.src = "kick2.png";
var snare2Image = new Image();
snare2Image.src = "snare3.png";


var playersTank;
var playersArrayIndex;

var mouseX;
var mouseY;

// var ROTATE_SPEED = 10; //Multiples of 5 and 10 to avoid jiggle
var ROTATE_SPEED = 600; //Multiples of 5 and 10 to avoid jiggle

//todo change to allPlayersJSON, allPlayersObjects
var allPlayers = {};
var playerObjectsList;
var enemies;

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
var GRENADE_DAMAGE = 501;
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

var ammoImage = new Image();
ammoImage.src = 'ammo.png';
var ammoImage2 = new Image();
ammoImage2.src = 'ammo2.png';
var ammoImage3 = new Image();
ammoImage3.src = 'ammo3.png';
var ammoImageList = [ammoImage, ammoImage2, ammoImage3];

var qMarkImage = new Image();
qMarkImage.src = 'qMark.png';
var qMarkImage2 = new Image();
qMarkImage2.src = 'qMark2.png';
var qMarkImage3 = new Image();
qMarkImage3.src = 'qMark3.png';	
var qMarkImage4 = new Image();
qMarkImage4.src = 'qMark4.png';	
var qMarkImageList = [qMarkImage, qMarkImage2, qMarkImage3, qMarkImage4];

var activePickups = [];
var pickupAnimations;//timer
var pickupsFrame = 0;

var deadList;

//CS mode: bullets faster/less damage/no bounce. Can't see past walls
var gameModes = ['intro', 'select', 'normal', 'cs', 'zombies', 'race', 'f', 're', 'studio'];
var gameMode = gameModes[0];
var globalBulletSpeed;
// var SHOT_RATE = 1;//seconds between shots, should be in tank/currentWeapon
// var SHOT_RATE = 0.3;//seconds between shots, should be in tank/currentWeapon
var SHOT_RATE;
var SECONDARY_SHOT_RATE;//seconds between shots, should be in tank/currentWeapon
//could change to /s by having 1000/shotrate e.g. 1000/10 = 100ms between

var allExplosions;//after exploded
var allExplosives;//before exploded

var camera, screen;
//could have map class, width height walls, mode
var mapWidth;
var mapHeight;

var scoreAnimations;
var paused = false;

var allJoysticks, allButtons;
var stickYChange, stickXChange, maxStickChange, minStickMovement, joystickSize;
var touchable = 'createTouch' in document;
var allTouches;

var shouldPlayIntro = true;

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
	playerData.gameX = playersTank.gameX/scale;
	playerData.gameY = playersTank.gameY/scale;
	// playerData.x = playersTank.xPosition;
	// playerData.y = playersTank.yPosition;
	// playerData.xOnMyScreen = playersTank.xOnScreen;
	// playerData.yOnMyScreen = playersTank.yOnScreen;
	
	playerData.isMoving = playersTank.isMoving;
	playerData.moveAngle = playersTank.moveAngle;
	playerData.turretAngle = playersTank.turretAngle;
	playerData.mouseX = mouseX/scale;
	playerData.mouseY = mouseY/scale;
	playerData.currentHealth = playersTank.currentHealth;
	// playerData.cameraX = camera[0];
	// playerData.cameraY = camera[1];	
}

// function Tank(id, startX, startY, baseImages, turretImageUrl, moveSpeed, bulletUrl, bulletSpeed)
//base images are base1 base2 basebroken turret bullet
// function Tank(id, startX, startY, baseImages, moveSpeed, bulletSpeed)
/* class Tank { 
	constructor(id, startX, startY, tankType, moveSpeed, bulletSpeed)
	{
		this.id = id; //etc
	}
} */
function Tank(id, startX, startY, tankType, moveSpeed, bulletSpeed)
{
	this.id = id;
	this.nickname = '';
	this.index = 0;
	//not needed! gameX and screenX
	this.xPosition = startX;
    this.yPosition = startY;
	this.gameX = startX;
	this.gameY = startY;	
	
	this.xOnScreen = this.gameX;
	this.yOnScreen = this.gameY;
	this.size = shipSize;//needs to be scaled
	this.centerX = this.gameX+0.5*this.size;
	this.centerY = this.gameY+0.5*this.size;
	this.baseImages = [];
	this.tankType = tankType;
	if(tankType == 'tank')
	{
		this.baseImages = tankImageList;
		this.shootSound = kickSound;//should be based on weapon
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
	this.moveAngle = 0;
	this.newAngle = 0;
	this.turretAngle = 0;
	this.bullets = [];
	this.bulletImage = this.baseImages[4];
	this.bulletSpeed = bulletSpeed;
	this.isMoving = false;
	this.alive = true;
	//px per second
	this.speed = moveSpeed;
	//up = 300, down = -300
	//speed per second
	this.acceleration = 0; //reverse is negative
	this.maxSpeed = 300*scale;//needs scale	
	this.turningRight = false;
	this.turningLeft = false;
	this.turnAmount = null; //for joystick turning
	// this.isAccelerating = false;
	// this.isReversing = true; 
	
	this.shootTimer;
	this.moveTimer;
	this.isTank = true; //use instanceOf(tank)
	
	this.moveKeysHeld = 0;
	this.leftDown = false;
	this.upDown = false;
	this.rightDown = false;
	this.downDown = false;
	
	//will be wrong for non player tanks
	this.clientID = thisClient.id;
	
	this.maxHealth = 100;//should be TANK_MAX_HEALTH
	this.currentHealth = this.maxHealth;
	
	this.messageToSend = "";
	this.showingMessage = false;
	this.hideLabelTimer;
	
	this.currentFrame = 1;
	
	this.cameraX = 0;
	this.cameraY = 0;
	
	this.secondaryGun = 'charge';
	this.primaryGun = 'normal';
	this.canShootSecondary = true;
	this.canShoot = true;
	this.ammo = 0;
	this.maxAmmo = 10;
	
	this.killCount = 0;
	
	//for race
	this.currentCheckpoint = 0;
	this.currentLap = 1;
	this.placeChecker = 0;//should be calulated off lap and checkpoint
	this.distanceFromLastCheckpoint;
	this.racePlacing;
	
	this.isChasing;
	this.target;
	
	this.targetSelectTimer;
	
	this.isJumping = false;
	this.jumpStartTime;
	this.jumpStartY;
}	

Tank.prototype.draw = function(context)
{ 
		
    //translate canvas back to 0,0 so can draw all at gameX/Y
	// context.save();
	// if(this.id == 'player')//dont need
	// {
		// context.translate(-camera[0], -camera[1]);		
	// }
	// else
	// {
		// context.translate(-camera[0], -camera[1]);	
	// }
	//screenX Y after translation

	 //SHOULD USE *scale here instead of during all collision etc
	var screenCenterX = (this.gameX-camera[0])+0.5*this.size;
	var screenCenterY = (this.gameY-camera[1])+0.5*this.size;	
	drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, this.size);
	drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, this.size);
	// drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
	// drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
	// context.restore();	
	/* if(this.id != 'player') //to draw opponents
	{
		var screenCenterX = (camera[0]-this.gameX)+0.5*this.size;
		var screenCenterY = (camera[1]-this.gameY)+0.5*this.size;	
		var screenCenterX = (this.gameX-camera[0])+0.5*this.size;
		var screenCenterY = (this.gameY+camera[1])+0.5*this.size;	
		drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
		drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	}
	else //to draw yourself
	{
		
		var screenCenterX = (this.gameX-camera[0])+0.5*this.size;
		var screenCenterY = (this.gameY-camera[1])+0.5*this.size;	
		drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
		drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	}
	drawRotated(this.baseImage, this.moveAngle, screenCenterX, screenCenterY, shipSize);
	drawRotated(this.turretImage, this.turretAngle, screenCenterX, screenCenterY, shipSize);
	
	drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
		drawRotated(this.baseImage, this.moveAngle, this.xPosition, this.yPosition, shipSize);
	drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
	 */
	
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
	//zombies cs
	// if(this.alive && gameMode != 'race' && gameMode != 'intro' && gameMode != 'select')
	if(this.alive && (gameMode == 'zombies' || gameMode == 'cs'))
	{
		drawHealthbar(this, context);		
	}
	
	if(gameMode == 'zombies')//could be this.ammo != -1;
	{
		drawAmmoBar(this, context);
	}
	
	if(this.state == 'shielded')
	{
		drawBubble(this, context);
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
	// if (this.xOnScreen < object.xPosition + object.size &&
		// this.xOnScreen + this.size > object.xPosition &&
		// this.yOnScreen < object.yPosition + object.size &&
		// this.yOnScreen + this.size > object.yPosition) 
		// return true;
		if (this.gameX < object.gameX + object.size &&
		this.gameX + this.size > object.gameX &&
		this.gameY < object.gameY + object.size &&
		this.gameY + this.size > object.gameY) 
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
		case 72://h
		
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
		
		case 82://r
			
			break
		case 32: //space bar
			break
        case 37:
		case 65:
            // left key pressed		
			if(gameMode == 'race')
			{
				// this.moveAngle -= 10;
				// this.moveAngle-=delta*ROTATE_SPEED;@animate
				// this.turningLeft = true;
				this.leftDown = true;
			}
			else
			{				
				this.leftPressed();
			}
            break;
        case 38:		
		case 87:
            // up key pressed
			if(gameMode == 'race')
			{
				this.acceleration = 150*scale;
				if(!this.upDown)
				{				
					this.moveKeysHeld++;
				}
				// this.moveKeysHeld++;
				this.upDown = true;
			}
			else
			{
				this.upPressed();
			}
            break;
        case 39:
        case 68:
            // right key pressed			
			if(gameMode == 'race')
			{
				// this.moveAngle += 10;
				// this.turningRight = true;
				this.rightDown = true;
			}
			else
			{
				this.rightPressed();
			}
			break;
        case 40:
        case 83://s
            // down key pressed	
			if(gameMode == 'race')
			{
				//reverse
				// this.acceleration = -150*scale;
				// this.moveKeysHeld++;
			}
			else
			{			
				this.downPressed();
			}
			break;  
			
			
    }
	
	// this.moveAngle = this.newAngle;//enable for no turnrate, disable grad spin
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
            // left key released			
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
				if(gameMode == 'race' && this.upDown)
				{
					this.moveKeysHeld = 1;
				}
			}

			// if(gameMode == 'race')
			// {
				// this.turningLeft = false;
			// }
			this.leftDown = false;
            break;
        case 38:
		case 87:
            // up key released			
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
			}
			if(gameMode == 'race')
			{
				this.acceleration = -300*scale;
				//need check to not go into reverse
				
				// this.speed = 0;
				// this.rightDown = false;
				// this.leftDown = false;
			}
			this.upDown = false;
			
            break;
        case 39:
        case 68:
            // right key released
			if(this.moveKeysHeld > 0)
			{				
				this.moveKeysHeld--;
				if(gameMode == 'race' && this.upDown)
				{
					this.moveKeysHeld = 1;
				}
			}
			this.rightDown = false;
            break;
        case 40:
        case 83:
            // down key released
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
	// var bubbleX = this.xOnScreen+1.3*shipSize;
	// var bubbleY = this.yOnScreen-1.2*shipSize;
	var bubbleX = this.gameX-camera[0]+1.3*shipSize;
	var bubbleY = this.gameY-camera[1]-1.2*shipSize;	
	var bubbleWidth = 2*shipSize; //should be this.size
	var bubbleHeight = 1.5*shipSize;
	context.fillStyle='rgba(255,255,255,0.6)';
	context.font = 0.5*bubbleHeight+'px Righteous';
	var wordWidth = context.measureText(this.messageToSend).width;	
	//if on right side of screen, draw bubble on other side of tank
	// var triangleStartX = this.xOnScreen+this.size;
	var triangleStartX = this.gameX-camera[0]+this.size;
	var triangleSecondX = bubbleX;
	if(this.xOnScreen > 0.5*canvasWidth)
	{
		bubbleX -= wordWidth + this.size+1.8*shipSize;
		triangleStartX = this.gameX-camera[0];
		triangleSecondX = bubbleX + wordWidth+shipSize;
	}
	context.fillRect(bubbleX,bubbleY,wordWidth+shipSize,bubbleHeight);
	//draw triangle
	
	context.beginPath();
	// context.moveTo(triangleStartX, this.yOnScreen+0.5*this.size);
	context.moveTo(triangleStartX, this.gameY-camera[1]+0.5*this.size);
	context.lineTo(triangleSecondX, bubbleY+0.5*bubbleHeight);
	context.lineTo(triangleSecondX, bubbleY+bubbleHeight);
	context.closePath();
	context.fill();
	//draw text (font set earlier to get measureText())
	context.fillStyle='black';
	// ctx.fillText(messageToSend, bubbleX+(0.25*width), bubbleY+(0.75*height));
	context.fillText(this.messageToSend, bubbleX+(0.25*bubbleWidth), bubbleY+(0.75*bubbleHeight));
}
//could draw shadow underneath and zoom map out a bit
Tank.prototype.jump = function()
{
	if(!this.isJumping)
	{
		this.isJumping = true;
		this.jumpStartTime = new Date().getTime();
		this.jumpStartY = this.gameY;
		this.jumpStartSize = this.size;	
	}	
}
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
//for waypoints on enemies/bots
// could go through a loop of waypoints, if reached, goto next waypoint
Tank.prototype.goTo = function(x, y)
{		
	this.newAngle = Math.atan2(x - this.gameX, -(y - this.gameY) );
	this.newAngle = this.newAngle*(180/Math.PI); 
	if(this.newAngle < 0)
	{
		this.newAngle += 360;
	}
}
//should be split to randomise position and respawn
//      reusable for other objects (zombies, pickups)
// isScaled will be true after rescale(), need this to avoid
//      checking collisions with scaled xy and unscaled walls
var debugSquares = [];
Tank.prototype.randomRespawn = function(isScaled)
{
	//respawn tank
	// debugSquares = [];
	this.alive = true;
	this.baseImage = this.baseImages[0];
	this.currentHealth = this.maxHealth;
	// xWhy = [];
	//randomise position
	var respawnX;
	var respawnY;
	var safeSpawn = false;
	//needs to not include a wall
	//    checks new random position with collidesWithAnyWall
	while(!safeSpawn)
	{
		//needs to be screen size - camera change distance from side
		// respawnX = Math.random() * (canvasWidth*0.2)+0.2*canvasWidth;
		// respawnY = Math.random() * (canvasHeight*0.2)+0.2*canvasHeight;
				
		//randomise position
		if(gameMode == 'cs')
		{
			respawnX = Math.random() * mapWidth + csGamePosition[0]*mapWidth;
			respawnY = Math.random() * mapHeight + csGamePosition[1]*mapHeight;
		}
		else if(gameMode == 'zombies')
		{
			respawnX = Math.random() * mapWidth + zombieGamePosition[0]*mapWidth;
			respawnY = Math.random() * mapHeight + zombieGamePosition[1]*mapHeight;
		}
		//scale to match walls
		respawnX *= scale;
		respawnY *= scale;
		//check wont be inside a wall
		var doesCollide = collidesWithAnyWall(respawnX, respawnY, this.size)[0] == "true";
		// var test = collidesWithAnyWall(respawnX, respawnY, this.size)[0];
		if(!doesCollide)
		{
			safeSpawn = true;
		}
		else
		{
			//draw all failed spawns i.e. colliding with walls
			// debugSquares.push([respawnX,respawnY, this.size,this.size, 'red']);
		}
	}
	
	//  DELAY this instead of whole function
		//maybe change to respawn(tank, newx, newy);
	//set tank to safe random position
	// setTimeout(function()
	// {
		this.gameX = respawnX;
		this.gameY = respawnY;
	// }	
	if(cameraCentered)
	{
		centerCameraOnPlayer();
	}
	this.centerX = this.gameX+0.5*this.size;
	this.centerY = this.gameY+0.5*this.size;		
	
	//resends all data to all clients, should just send new position
	refreshPlayerData();//unscales data!
	//shouldnt send this from init?
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
	// if(this.id = 'bot')
	// {
		// this.speed = 0;
	// }
}
Tank.prototype.boost = function()
{
	// this.speed = this.speed*4;
	// setTimeout(function()
	// {
		// this.speed= this.speed/4;
	// }, 250);			
}
function drawBubble(object, context)
{
	context.globalAlpha = 0.6;
	context.drawImage(bubbleImage, (object.gameX-0.15*object.size)-camera[0], object.gameY-0.15*object.size-camera[1], 1.3*object.size, 1.3*object.size);
	context.globalAlpha = 1.0;
}

function Pickup(x, y, size, id)
{
	this.gameX = x;
	this.gameY = y;
	this.size = size;
	this.id = id;
	this.pickupImage;
	this.imageList = [];
	// this.currentFrame = 0;
	this.isActive = true;
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
	else if(id == 'ammo')
	{
		this.pickupImage = ammoImage;
		this.imageList = ammoImageList;
	}
	else if(id == 'random')
	{
		this.pickupImage = qMarkImage;
		this.imageList = qMarkImageList;
	}
	
	
	if(activePickups.length == 0)
	{		
		clearInterval(pickupAnimations);
		pickupAnimations = setInterval(function(){animatePickups()}, 500);	
	}
}
//need to add delay, damage, shooter?
 function Explosive(gameX, gameY, size, type)
 {
	this.type = type;
	this.gameX = gameX;
	this.gameY = gameY;
	this.size = size;	
	this.isExplosive = true;
	this.isAlive = true;
	// this.explosiveImage = new Image();
	if(type == 'mine')
	{
		this.explosiveImage = explosiveImageOne;
		this.images = [explosiveImageOne,explosiveImageTwo];
	}
	else if(type == 'oil')
	{
		this.explosiveImage = oilImage;
		this.images = [oilImage,oilImage];
	}
	
	this.timeCreated = new Date().getTime();
	this.rotation = Math.random()*360;
	this.currentImageIndex = 0;
 }
 Explosive.prototype.draw = function(context)
 {
	 drawRotated(this.explosiveImage, this.rotation, this.gameX-camera[0], this.gameY-camera[1], this.size);
 }
 Explosive.prototype.getLifeTime = function()
 {
	 var lifeTime =  (new Date().getTime() - this.timeCreated);
	 return lifeTime;
 }
 Explosive.prototype.switchImages = function()
 {
	 this.explosiveImage = this.images[this.currentImageIndex];
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

function drawAmmoBar(object, context)
{	
	var barHeight = object.size/5;
	var barWidth = object.size;
	var ammoPercent = object.ammo/object.maxAmmo;
	var ammoBarY = object.gameY-camera[1] + object.size + barHeight;
	context.fillStyle='#67E0A3';//red
	//x and y same, width = barWidth * healthPercent;
	var ammoLeftWidth = barWidth * ammoPercent;
	context.fillRect(object.gameX-camera[0],ammoBarY,ammoLeftWidth,barHeight);
}

function keyPressed(e)
{	
	if(e.keyCode === 13)
	{			
		
		chatInput.style.display = 'block';
		chatInput.focus();		
		chatInput.value = "";
		chatInput.style.left = playersTank.centerX-canvasWidth*0.05-camera[0]+'px';		
		var chatY = Math.floor(playersTank.gameY+playersTank.size+20-camera[1]);
		if(chatY > canvasHeight-50)
		{
			chatY = canvasHeight-50;
		}
		chatInput.style.top = chatY+'px';
		// chatInput.style.top = playersTank.gameY+playersTank.size+20-camera[1]+'px';
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
		useSpecialWeapon();
	}
	else if(e.keyCode == 70)//f
	{	
		// clearInterval(playersTank.beatTimer);
		// canShoot = true;
		// playerShootsMouse(mouseX, mouseY);
		// SHOT_RATE = SHOT_RATE*2;	
		// showScoreAtTank(playersTank, Math.round(mouseX*(1/scale))+' and '+Math.round(mouseY*1/scale));
		// showScoreAtTank(playersTank, Math.round(mouseX*(1/scale)+camera[0])+' and '+Math.round(mouseY*1/scale+camera[1]));
		showScoreAtTank(playersTank, Math.round(mouseX+camera[0])+' and '+Math.round(mouseY+camera[1]));
	}
	else if(e.keyCode == 71)//g
	{
		if(gameMode == 'cs')
		{			
			// flash();
			
			centerCameraOnPlayer();
			cameraCentered = !cameraCentered;
		}
		else
		{
			// placeMine(playersTank);
			//need toggle pause function, will pause all timers too
			// paused = !paused;
			// switchTanks();
			// clearInterval(playersTank.beatTimer);
			// canShoot = true;
			// playerShootsMouse(mouseX, mouseY);
			// SHOT_RATE = SHOT_RATE/2;
			// set camera to 1/2 screen above and left player
			centerCameraOnPlayer();
			cameraCentered = !cameraCentered;
		}
		
		// if(!paused)
		// {			
			// timeOfLastFrame = (new Date()).getTime();
			// animaaate();
		// }
		
	}
	else if(e.keyCode == 72)//h
	{		
		// showScoreAtTank(playersTank, playersTank.speed);
		//show scaled/unscaled x y of mouse
		// setupRace();
		//backHome(); //should be back to the start square?
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

function useSpecialWeapon()
{
		if(canBoost && gameMode != 'race')
		{			
			// playersTank.jump();
			thisClient.emit('boostMe', playerObjectsList.indexOf(playersTank));
			boost(playersTank);
			canBoost = false;
			setTimeout(function()
			{
				canBoost = true;			
			}, 2000);//boost cooldown
		}	
		else if(gameMode == 'race')
		{
			//aim bullets to move direction
			shootRaceWeapon(false);
		}
}
//could take x y parameter to view other events
function centerCameraOnPlayer()
{
	camera[0] = playersTank.gameX - 0.5*canvasWidth+ 0.5*playersTank.size;
	camera[1] = playersTank.gameY - 0.5*canvasHeight+ 0.5*playersTank.size;
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

function createPebblesAt(x, y, pebbleAmount)
{
	// var pebbleAmount = 3;	
	while(pebbleAmount > 0)
	{
		var randomX = x+Math.random()*70*scale;
		var randomY = y+Math.random()*70*scale;
		var randomSize = Math.random()*2*scale +2*scale;
		pebbles.push([randomX, randomY, randomSize]);
		pebbleAmount--;
	}
}

function drawPebble(context, x, y, size)
{	
		//doing this every draw made firework sorta explosion effect
		//while pebbleAmount > 0
		// var randomX = Math.random()*100*scale;
		// var randomY = Math.random()*100*scale;
		// var randomSize = Math.random()*10*scale +10*scale;
		// var pebbleX = x+randomX;
		// var pebbleY = y+randomY;
		
		context.beginPath();
		context.arc(x, y, size, 0, 2 * Math.PI);
		context.fillStyle = '#afafaf';
		context.fill();
	
	
}
function drawMouse(ctx, x, y, width, height)
{
	// var wX = mapWidth*scale/2;
	// var wy = mapHeight*scale*1.0;//start off screen
	var keySize = 80*scale;
	ctx.fillStyle = 'black';	
	// ctx.fillStyle = '#424242';	
	ctx.fillRect(x+2, y-0.65*keySize, width-4, keySize);
	// ctx.fillRect(x-10*scale, y-keySize, width+20*scale, keySize*1.5);
	if(mouseButtons.length > 0)
	{
		drawKeyboardLetter(ctx, x, y-keySize+5*scale, mouseButtons[0][2], mouseButtons[0][3], mouseButtons[0][4]);
		drawKeyboardLetter(ctx, x+keySize+5*scale, y-keySize+5*scale, mouseButtons[1][2], mouseButtons[1][3], mouseButtons[1][4]);
	}
	//mouse should have buttons = [] as last variable
	
	
	ctx.fillStyle = '#424242';
	ctx.fillRect(x, y, width, height);
	ctx.fillStyle = 'black';	
	ctx.fillRect(x, y+height, width, 0.3*keySize);
	
	
	
	// ctx.fillStyle = 'black';
	// ctx.fillRect(x, y+height+0.3*keySize, width, 0.8*keySize+0.3*keySize);
	
	// ctx.fillStyle = 'black';	
	// ctx.fillRect(x, y+height+0.3*keySize+0.8*keySize, width, 0.3*keySize);
	// keyboardLetters.push([x, y+height+10*scale, keySize, ' ', false]);
	// keyboardLetters.push([x+10*scale, y+height+10*scale, keySize, ' ', false]);
	// drawKeyboardLetter(ctx, x+keySize+5*scale, y+height+10*scale, keySize, ' ', mouseButtons[1][4]);
}

function drawKeyboardLetter(ctx, x, y, size, letter, isPressed)
{
	
	var height = 0.8*size;
	if(isPressed)
	{
		y = y+0.3*height;
	}
	else
	{		
		
		ctx.fillStyle = 'black';	
		ctx.fillRect(x, y+height, size, 0.3*height);
	}
	ctx.fillStyle = '#303030';
	ctx.fillRect(x, y, size, height);
	// ctx.fillRect(x, y+height, size, 0.3*height);
	//need to store height outside for animation
	
	//get font code from mouseGame
	//add a couple letters to draw method
	ctx.fillStyle = 'white';
	var fontSize = 0.6*size;
	ctx.font = fontSize+'px Righteous';
	/* ctx.fillStyle='black'; */
	ctx.fillText(letter, x+(0.5*fontSize), y+height-(0.25*size));
}

// function Bullet(bulletImage, shooter, direction, speed, size, damage, type) 
function Bullet(bulletImage, shooter, centerX, centerY, direction, speed, size, damage, type) 
{	
	//(direction, tankFrom)
	// this.xPosition = shooter.centerX;
    // this.yPosition = shooter.centerY;
	this.gameX = centerX;
    this.gameY = centerY;
	this.bulletImg = bulletImage;
	this.travelAngle = direction;
	this.type = type;
	this.size = size;
	this.width = this.size;
	this.height = this.size;
	this.timeCreated = (new Date()).getTime();
	//for max bounces
	this.bounceCount = 0;
	this.alive = true;
	//will be map?
	if(shooter!= null)
	{
		this.shooter = shooter;
	}	
	this.speed = speed;
	this.justBounced = false;
	this.damage = damage;
	this.draw();
	// drawRotated(this.bulletImg, direction*(180/Math.PI), this.gameX, this.gameY, this.size);
}

Bullet.prototype.draw = function(context) 
{
	drawRotated(this.bulletImg, this.travelAngle*(180/Math.PI), this.gameX-camera[0], this.gameY-camera[1], this.size);	
}

var allWalls;
var mapWalls;
var wallColour = "#C59900";
// var wallColour = "green";
var sideWallThickness;
var timeOfLastFrame;
var boundaryThickness;

var scale;
var lastScrollPosition;
var newScrollPosition;

var playButton;
var isTouchscreen;

var instruments;
var soundEnabled;

var cameraCentered;
function init(allPlayerInfo, arrayIndex, allPickupInfo, sentGameMode)
{	
	soundEnabled = true;
	canvas.focus();
	allBullets = [];
	allExplosions = [];
	allExplosives = [];
	deadList = [];
	enemies = [];	
	playerObjectsList = [];
	allTanks = []; //players and bots
	cameraCentered = false;
	 // cameraCentered = false;
			
	gameMode = sentGameMode;
	
	lastScrollPosition = canvas.scrollTop;
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
	reloadSound = document.getElementById('reload');
	randomSound = document.getElementById('randomSound');
	noAmmo = document.getElementById('noAmmo');
	shewlase = document.getElementById('shewlase');
	
	connectedSound = document.getElementById('connectedSound');
	grenadeBounce = document.getElementById('grenadeBounce');
	grenadeExplode = document.getElementById('grenadeExplode');
	gunshot = document.getElementById('gunshot');
	musicOne = document.getElementById('musicOne');
	musicTwo = document.getElementById('musicTwo');
	// chargeSound = document.getElementById('charge');
	// chargeShot = document.getElementById('chargeShot');	
	// backingBass = document.getElementById('backingBass');	
	// backingMelody = document.getElementById('backingMelody');
	
	//x y zoom
	// camera = [0, -canvasHeight, 1.0];
	// screen = [0, -canvasHeight];
	camera = [0, 0, 1.0];
	screen = [0, 0];
	//map x and y
	mapWidth = 1700;
	mapHeight = 750;		
	scale = window.innerWidth/mapWidth;
	
	// window.addEventListener("resize", windowResized);
	
	
	
	playButton = document.getElementById('playButton');
	
	playButton.addEventListener( 'touchstart', function()
	{
		playButtonPressed(false);
	}, false );
	
	playButton.addEventListener( 'mousedown', function()
	{
		playButtonPressed(true);
	}, false );
	
	
	
	
	scoreAnimations = [];
	// globalBulletSpeed *= scale;//set in setMode
	grenadeSpeed *= scale;
	// playerSpeed *= scale;
    shipSize *= scale;
	NORMAL_BULLET_SIZE *= scale;	
	// sideWallThickness *= scale;
	
	playerObjectsList = [];
	hatSound.load();	
	hatSound2.load();
	kickSound.load();
	snareSound.load();	
	synth1Sound.load();
	synth2Sound.load();
	synth3Sound.load();
	reloadSound.load();
	randomSound.load();
	noAmmo.load();
	connectedSound.load();
	musicOne.load();	
	// musicOne.play();		
	playSound(musicOne);
	musicOne.pause();	
	musicOne.volume = 0.5;
	musicTwo.load();
	shewlase.load();
	shewlase.volume = 0.5;
	
	grenadeBounce.load();	
	grenadeBounce.volume = 0.2;
	
	grenadeExplode.load();
	gunshot.load();
	flashbangExplode.load();
	
	// sideWallThickness = 2*NORMAL_BULLET_SIZE;
	sideWallThickness = 25*scale;
	
	allWalls = [];
	mapWalls = [];
	boundaryThickness = shipSize;
	//race
	var raceX = raceGamePosition[0]*mapWidth;
	var raceY = raceGamePosition[1]*mapHeight;
	startSquares.push([mapWidth+raceX, mapHeight*0.7, boundaryThickness, mapHeight*0.35, 'race']);
	//deathmatch
	var dmX = csGamePosition[0]*mapWidth;
	var dmY = csGamePosition[1]*mapHeight;
	startSquares.push([dmX-boundaryThickness, mapHeight*0.7+dmY, boundaryThickness, mapHeight*0.35, 'cs']);
	
	var zombieX = zombieGamePosition[0]*mapWidth;
	var zombieY = zombieGamePosition[1]*mapHeight;
	startSquares.push([(zombieX+0.8*mapWidth)-boundaryThickness, zombieY-boundaryThickness, mapWidth*0.2+boundaryThickness, boundaryThickness, 'zombies']); //top boundary
	
	// startSquares.push([dmX-mapWidth*0.1-boundaryThickness, mapHeight*0.7+dmY, mapWidth*0.1, mapHeight*0.35, 'intro']);
	
	// addBoundary();
	// addCSWalls();
	//could loop to add all after i = 3 in allwalls
	// mapWalls = [[300, 150, 200, 300], [800, 400, 200, 300], [1300, 150, 200, 300]];
	// deadList = [];
	// allWalls.push([0.45, 0.0, 0.15, 0.5]); //stage one wall.
	
	
	
	
	
	//        add isChatting to stop movement while typing
	canvas.addEventListener("keydown", keyPressed, false);	
	canvas.addEventListener("keyup", keyReleased, false);
	timeOfLastFrame = (new Date()).getTime();
	requestAnimationFrame(animate);
	messageLabel = document.getElementById("message");
	
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
	//add player after other players to decide listposition
		//playerImageList defined in addPreviousPlayers
	playersTank = new Tank("player", 0, 0,
					randomTankType, playerSpeed, 100);
					
	
					//bulletSpeed set at setMode
	
	playerObjectsList.push(playersTank);	
	rescalePlayerTanks();	
	//handles not spawing in walls
	
	
	// var idPositionImage = [thisClient.id, playersTank.gameX, playersTank.gameY, randomTankType];

	instruments = [];
	var snare = [snare2Image, 50+studioGamePosition[0]*mapWidth, 250+studioGamePosition[1]*mapHeight, 200, 200, snareSound];
	var snare2 = [snareImage, 250+studioGamePosition[0]*mapWidth, 150+studioGamePosition[1]*mapHeight, 200, 170, hatSound2];
	var kick = [kickImage, 500+studioGamePosition[0]*mapWidth, studioGamePosition[1]*mapHeight, 300, 300, kickSound];
	instruments.push(snare);
	instruments.push(snare2);
	instruments.push(kick);

	playersTank.index = playerObjectsList.length;			
			playersTank.nickname = 'Player '+playersTank.index;
	//changes when previous players disconnect
	playersArrayIndex = playerObjectsList.indexOf(playersTank);
	playerData.index = playersArrayIndex; //not needed?
	playerData.tankType = randomTankType;
	
	// if(gameMode != 'intro')
	// {		
		setUpMap();
	// }
	camera = [0, 0];
	globalBulletSpeed = (300*scale)*2;
	NORMAL_BULLET_SIZE = shipSize*0.3*scale;
	NORMAL_BULLET_DAMAGE = 51;
	setAllTankSpeeds(300* scale);
	SHOT_RATE = 0.93;	//match music tempo	
	playersTank.canShoot = true;
	if(shouldPlayIntro)
	{		
		playIntro();
	}
	else
	{		
		divBlinkOut();
		playButtonPressed(true);
	}
	// isTouchscreen = false;
	// setMode(gameMode);
	//position tanks
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var tank = playerObjectsList[i];
		tank.gameX = mapWidth*scale*0.5 +i*shipSize;
		tank.gameY = mapHeight*scale*0.4;		
		if(shouldPlayIntro)
		{
			tank.canShoot = false;//set true when picked ammo
		}
		else
		{			
			tank.canShoot = true;
		}
	}
	// setMode(gameMode); //done at button press
		var idPositionImage = [thisClient.id, playersTank.gameX/scale, playersTank.gameY/scale, randomTankType];
	//needs to send unscaled position? i.e. true gameX
	//     should just emit in random respawn? or need to know is new player
	thisClient.emit('newPlayerPosition', idPositionImage);
	// var node = document.createElement("LI");                 // Create a <li> node
	// var textnode = document.createTextNode(newPlayerTank.id+': 0');         // Create a text node
	// node.appendChild(textnode);                              // Append the text to <li>
	// document.querySelector('#scoreLabel ul').appendChild(node); 
	addToScoreBoard(playersTank);
	//    sends the data of your tank frequently but the server
	//        only tells clients to update every half second, this is
	//        to make up for any difference in animation calculations
	
	//rescales based on users screensize	
	// var otherTank = new Tank("player", 300, 300,
					// 'tank', playerSpeed, 100);
					otherTank = playersTank;
					// var otherTank = Object.assign({}, playersTank);
					controllableTanks.push(playersTank);
					controllableTanks.push(otherTank);
	setInterval(function(){animateTanks(playerObjectsList);}, 250);	
	setInterval(function(){animateTanks(enemies);}, 250);	
	setInterval(function(){animateExplosives();}, 250);	
	
	setInterval(function() 
	{
		refreshPlayerData();
		thisClient.emit('clientPlayerData', playerData);	
	}, 1000/60);
	
	// }, 1000/20);
}

function addToScoreBoard(tank)
{
	var node = document.createElement("LI");                 // Create a <li> node
	var textnode = document.createTextNode(tank.nickname+': 0');         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.querySelector('#scoreLabel ul').appendChild(node); 
}

function windowResized()
{
	//unscale then rescale to new scale
	        //need scale refactor?
			rescaleWalls(true);
			canvasWidth = window.innerWidth;
			canvasHeight = window.innerHeight;
			ctx.canvas.height = canvasHeight;
			ctx.canvas.width = canvasWidth;
			scale = window.innerWidth/mapWidth;
			rescaleWalls(false);
}

//needs to happen after all player objects are added 
//(new players are scaled on join)
function rescalePlayerTanks()
{
	
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var tankToScale = playerObjectsList[i];
		tankToScale.gameX *= scale;
		tankToScale.gameY *= scale;
		tankToScale.xOnScreen *= scale;
		tankToScale.yOnScreen *= scale;	
		tankToScale.speed *= scale;			
	}
	// rescaleWalls();
	
}

function rescaleWalls(isUnscale)
{
	for(var i = 0; i < allWalls.length; i++)
	{
		var wall = allWalls[i];
		var x = wall[0];
		var y = wall[1];
		var width = wall[2];
		var height = wall[3];
		if(!isUnscale)
		{
			wall[0] = x*scale;
			wall[1] = y*scale;
			wall[2] = width*scale;
			wall[3] = height*scale;
		}
		else
		{
			wall[0] = x/scale;
			wall[1] = y/scale;
			wall[2] = width/scale;
			wall[3] = height/scale;
		}
		
	}

	for(var i = 0; i < mapWalls.length; i++)
	{
		var wall = mapWalls[i];
		var x = wall[0];
		var y = wall[1];
		var width = wall[2];
		var height = wall[3];
		wall[0] = x*scale;
		wall[1] = y*scale;
		wall[2] = width*scale;
		wall[3] = height*scale;
	}	
	
	for(var i = 0; i < trees.length; i++)
	{
		tree = trees[i];
		for(var t = 0; t < tree.length; t++)
		{
			var wall = tree[t];
			var x = wall[0];
			var y = wall[1];
			var width = wall[2];
			var height = wall[3];
			wall[0] = x*scale;
			wall[1] = y*scale;
			wall[2] = width*scale;
			wall[3] = height*scale;
		}
	}
	// if(gameMode == 'race')
	// {
		scaleCheckPoints();
	// }

}

function scaleCheckPoints()
{
	for(var i = 0; i < checkPoints.length; i++)
	{
		var checkPoint = checkPoints[i];
		checkPoint[0] *= scale;
		checkPoint[1] *= scale;
		checkPoint[2] *= scale;
		checkPoint[3] *= scale;
	}
}

function scaleSpawnPoints()
{
	for(var i = 0; i < spawnPoints.length; i++)
	{
		var point = spawnPoints[i];
		var x = point[0];
		var y = point[1];
		point[0] = x*scale;
		point[1] = y*scale;
	}
}

var flashOpacity = 0.0;
var flashStart = 0;
var flashActive = false;
function flash()
{
	//make layer of white that decreases opacity over time
	flashOpacity = 1.0;
	flashStart = new Date().getTime();
	flashActive = true;
	
	// flashbangExplode.currentTime = 0;
	// flashbangExplode.play();
	playSound(flashbangExplode);	
}

function playSound(soundVar)
{
	if(soundEnabled)
	{
		soundVar.currentTime = 0;
		soundVar.play();
	}	
}

var pebbles = [];

//SCREEN = GAME - CAMERA (*scale?)
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
	// ctx.drawImage(snare2Image, 50, 300, 200, 200);
	// ctx.drawImage(snareImage, 250, 200, 200, 170);
	// ctx.drawImage(kickImage, 500, 50, 300, 300);
	
	
	for(i = 0; i < pebbles.length; i++)
	{
		pebble = pebbles[i];
		drawPebble(ctx, pebble[0]-camera[0], pebble[1]-camera[1], pebble[2]);
	}
	for(i = 0; i < deadList.length; i++)
	{
		var thisDeadImageInfo = deadList[i];
		var thisImage = thisDeadImageInfo[0];
		var thisX = thisDeadImageInfo[1]-camera[0];		
		var thisY = thisDeadImageInfo[2]-camera[1];		
		var thisRotation = thisDeadImageInfo[3];
		var size = thisDeadImageInfo[4];
		drawRotated(thisImage, thisRotation, thisX, thisY, size);
	}
	for (var i = 0; i < debugSquares.length; i++) 
	{
		ctx.fillStyle = debugSquares[i][4];
		ctx.fillRect(debugSquares[i][0]*scale-camera[0],debugSquares[i][1]*scale-camera[1],debugSquares[i][2]*scale,debugSquares[i][3]*scale);
	}
	if(gameMode == 'select')
	{
		for (var i = 0; i < startSquares.length; i++) 
		{
			ctx.fillStyle = 'rgba(255, 229, 0, '+startSquareOpacity+')';
			ctx.fillRect(startSquares[i][0]*scale-camera[0],startSquares[i][1]*scale-camera[1],startSquares[i][2]*scale,startSquares[i][3]*scale);
		}
	}	
	// for (var i = 0; i < checkPoints.length; i++) 
	// {
		// ctx.fillStyle = 'gray';
		// ctx.fillRect(checkPoints[i][0]-camera[0],checkPoints[i][1]-camera[1],checkPoints[i][2],checkPoints[i][3]);
	// }
	for(i = 0; i < allExplosives.length; i++)
	{		
		// if(allExplosives[i].isAlive)
		// {			
			allExplosives[i].draw(ctx);	
		// }	
		// else
		// {
			// allExplosives.splice(i);
		// }
	}
	for(i = 0; i < activePickups.length; i++)
	{
		var thisPickup = activePickups[i];
		if(thisPickup.isActive)
		{
			ctx.drawImage(thisPickup.pickupImage, thisPickup.gameX-camera[0], thisPickup.gameY-camera[1], thisPickup.size , thisPickup.size);	
		}
	}	
	for(var i = 0; i < enemies.length; i++)
	{	
		//if(aiVsAi)
		// enemyFaceTarget(enemies[i]);
	//else
	// enemiesFaceTarget(tank);
		enemies[i].draw(ctx);
		// drawDirectionLines(enemies[i]);
	}

	// controllableTanks[1].draw(ctx); //0 drawn from object list
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		// var player = allPlayers[i] || {};	
		var playerObject = playerObjectsList[i] || {};

		if(playerObject instanceof Tank)//needed?
		{			
			playerObject.draw(ctx);
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
		var centerX = currentExplosion[0]-camera[0];
		var centerY = currentExplosion[1]-camera[1];
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
		var mouseX = mouseXY[0]-camera[0];
		var mouseY = mouseXY[1]-camera[1];
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
	
	//mouse position
		// ctx.beginPath();
		// ctx.fillStyle = 'red';
		// ctx.arc(testX, testY, shipSize/16, 0, 2 * Math.PI);
		// ctx.fill();
	
	if(gameMode == 'cs'
		|| gameMode == 'zombies'//)
	|| gameMode == 'normal')
	{
		drawPlayerFog(ctx);
	}
	for(var i = 0; i < allWalls.length; i++)
	{
		drawWallShadow(ctx,allWalls[i][0]-camera[0],allWalls[i][1]-camera[1],allWalls[i][2],allWalls[i][3], wallColour);	
	}	
	for(var i = 0; i < allWalls.length; i++)
	{
		//need check if visible, new variable for wall
		// allWalls[i][4] == true
		drawWall(ctx,allWalls[i][0]-camera[0],allWalls[i][1]-camera[1],allWalls[i][2],allWalls[i][3], wallColour);	
	}
	for(i = 0; i < instruments.length; i++)
	{
		var inst = instruments[i];
		ctx.drawImage(inst[0], inst[1]*scale-camera[0], inst[2]*scale-camera[1], inst[3]*scale, inst[4]*scale);
	}
	//tree shadow
	for(var i = 0; i < trees.length; i++)
	{
		tree = trees[i];
		var color;
		for(var t = 0; t < tree.length; t++)
		{
			if(t < 9)
			{
				color = wallColour;
			}
			else if(t == 9)
			{
				// drawWallShadow(ctx,tree[t][0],tree[t][1]+4.5*sideWallThickness,tree[t][2],tree[t][3], color);	
				var shadowY = tree[0][1]-camera[1] ;
				// drawWallShadow(ctx,tree[t][0],shadowY,tree[t][2],tree[t][3], color);	
				drawShadow(ctx,tree[t][0]-camera[0],shadowY,tree[t][2],tree[t][3]);
			}
			else
			{
				color = 'green';
			}
		}
	}	
	for(var i = 0; i < trees.length; i++)
	{
		tree = trees[i];
		for(var t = 0; t < tree.length; t++)
		{
			//trunk
			if(t < 9)
			{
				color = wallColour;
			}
			else//tree top
			{
				ctx.globalAlpha = 0.5;
				color = 'green';
			}
			drawWall(ctx,tree[t][0]-camera[0],tree[t][1]-camera[1],tree[t][2],tree[t][3], color);
			// drawWallShadow(ctx,tree[i][0],tree[i][1],tree[i][2],tree[i][3]);	
		}
		ctx.globalAlpha = 1.0;
	}
	
	//Draw all wall shadows and top part
	// need to be last to be above?
	
	
	for(var i = 0; i < scoreAnimations.length; i++)
	{
		//y position goes up with time
		//opacity decreases with time
		var tankScored = scoreAnimations[i][0];
		var lifeTime = new Date().getTime() - scoreAnimations[i][1];
		var percentageOfLife = lifeTime/1000;
		var opacity = 1 - (percentageOfLife*1);
		var yChange = percentageOfLife*tankScored.size;
		ctx.font = tankScored.size+'px Righteous';
		// ctx.fillStyle='black';		
		ctx.fillStyle="rgba(255, 255, 255,"+opacity+")";
		ctx.fillText(scoreAnimations[i][2], tankScored.gameX+(tankScored.size)-camera[0], tankScored.gameY-yChange-camera[1]);
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
	// for (var i = 0; i < debugSquares.length; i++) 
	// {
		// ctx.fillStyle = debugSquares[i][4];
		// ctx.fillRect(debugSquares[i][0]*scale,debugSquares[i][1]*scale,debugSquares[i][2]*scale,debugSquares[i][3]*scale);
	// }
	//draw flash over everything
	if(gameMode == 'cs' && flashActive)
	{
		var flashLifetime = new Date().getTime() - flashStart;
		if(flashLifetime < 2000)
		{
			flashOpacity = 1;
		}
		else if(flashLifetime >= 2000)
		{
			flashOpacity = 1 - ((flashLifetime-2000)/2000)
		}		
		if(flashOpacity < 0)
		{
			flashOpacity = 0;
			flashActive = false;
		}
		ctx.fillStyle = 'rgba(255,255,255,'+flashOpacity+')';
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);		
	}
	
	
	// drawMouse(ctx, mapWidth*scale/3, mapHeight*scale*0.6, 165*scale, 165*scale);
	if(mouse != null)
	{		
		drawMouse(ctx, mouse[0], mouse[1], mouse[2], mouse[3]);
	}
	
	for(var i=0 ; i< keyboardLetters.length; i++)
	{
		var key = keyboardLetters[i];
		var x = key[0];
		var y = key[1];
		var size = key[2];
		var letter = key[3];
		var isPressed = key[4];
		drawKeyboardLetter(ctx, x, y, size, letter, isPressed);		
	}
	
	if(isTouchscreen)
	{
		drawJoysticks(ctx);
		drawButtons(ctx);
		
		// drawJoystickArea(ctx);
	}
	
}
//Draws triangles/polygons based on wall corners
function drawPlayerFog(ctx)
{
	var pCenterX = playersTank.centerX-camera[0];
	var pCenterY = playersTank.centerY-camera[1];
	// var pCenterX = playersTank.centerX;
	// var pCenterY = playersTank.centerY;
	//need a non boundary wall list
	for(var i = 0; i < mapWalls.length; i++)
	{	
		var theWall = mapWalls[i];
		
		// var wallX = theWall[0]*canvasWidth;
		// var wallY = theWall[1]*canvasHeight;
		// var wallWidth = theWall[2]*canvasWidth;
		// var wallHeight = theWall[3]*canvasHeight;		
		var wallX = theWall[0]-camera[0];
		var wallY = theWall[1]-camera[1];
		// var wallX = theWall[0];
		// var wallY = theWall[1];
		var wallWidth = theWall[2];
		var wallHeight = theWall[3];	
		var rightX = wallX+wallWidth;
		var bottomY = wallY+wallHeight;
		
		// var fogAngle = Math.atan2(rightX - playersTank.centerX, - (bottomY - playersTank.centerY));
		var fogAngle;
		var fogAngle2;
		var topLength;
		var sideLength;
		var fogSideLength;
		ctx.fillStyle = '#004705';
		
		if(pCenterX < wallX && pCenterY < wallY+wallHeight && pCenterY > wallY)
		{//left center		
			fogAngle = Math.atan2(wallX - pCenterX, - (bottomY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * (canvasWidth-pCenterX);
			
			ctx.beginPath();
			ctx.moveTo(wallX, bottomY);
			ctx.lineTo(canvasWidth, bottomY);		
			ctx.lineTo(canvasWidth, pCenterY+fogSideLength);
			ctx.closePath();
			ctx.fill();
			
			ctx.fillRect(rightX, wallY-1, canvasWidth - wallWidth, wallHeight+2);
			
			fogAngle = Math.atan2(wallX - pCenterX, - (wallY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * (canvasWidth-pCenterX);
			
			ctx.beginPath();
			ctx.moveTo(wallX, wallY);
			ctx.lineTo(canvasWidth, wallY);		
			ctx.lineTo(canvasWidth, pCenterY+fogSideLength);
			ctx.closePath();
			ctx.fill();
		}
		if(pCenterX > rightX && pCenterY < bottomY && pCenterY > wallY)
		{//right center
			fogAngle = Math.atan2(rightX - pCenterX, - (bottomY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * pCenterX;			
			ctx.beginPath();
			ctx.moveTo(rightX, bottomY);
			ctx.lineTo(0, bottomY);		
			ctx.lineTo(0, pCenterY-fogSideLength);
			ctx.closePath();
			ctx.fill();
			
			ctx.fillRect(0, wallY-1, wallX, wallHeight+2);
			
			fogAngle = Math.atan2(rightX - pCenterX, - (wallY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((asDegrees-90)*Math.PI/180) * pCenterX;
			ctx.beginPath();
			ctx.moveTo(rightX, wallY);
			ctx.lineTo(0, wallY);		
			ctx.lineTo(0, pCenterY-fogSideLength);
			ctx.closePath();
			ctx.fill();
			
			
		}
		if(pCenterX > wallX && pCenterX < rightX && pCenterY < bottomY)
		{//top center
			fogAngle = Math.atan2(rightX - pCenterX, - (wallY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((180-asDegrees)*Math.PI/180) * (canvasHeight - pCenterY);			
			ctx.beginPath();
			ctx.moveTo(rightX, wallY);
			ctx.lineTo(rightX, canvasHeight);		
			ctx.lineTo(pCenterX+fogSideLength, canvasHeight);
			ctx.closePath();
			ctx.fill();
			
			
			ctx.fillRect(wallX-1, bottomY, wallWidth+2, canvasHeight-bottomY);
			
			
			fogAngle = Math.atan2(wallX - pCenterX, - (wallY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan((180-asDegrees)*Math.PI/180) * (canvasHeight - pCenterY);
			ctx.beginPath();
			ctx.moveTo(wallX, wallY);
			ctx.lineTo(wallX, canvasHeight);		
			ctx.lineTo(pCenterX+fogSideLength, canvasHeight);
			ctx.closePath();
			ctx.fill();			
		}
		if(pCenterX > wallX && pCenterX < rightX && pCenterY > wallY)
		{//bot center
			fogAngle = Math.atan2(rightX - pCenterX, - (bottomY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan(fogAngle) * pCenterY;			
			ctx.beginPath();
			ctx.moveTo(rightX, bottomY);
			ctx.lineTo(rightX, 0);		
			ctx.lineTo(pCenterX+fogSideLength, 0);
			ctx.closePath();
			ctx.fill();
			
			ctx.fillRect(wallX-1, 0, wallWidth+2, wallY);
			
			
			fogAngle = Math.atan2(wallX - pCenterX, - (bottomY - pCenterY));
			var asDegrees = fogAngle*180/Math.PI;
			fogSideLength = Math.tan(fogAngle) * pCenterY;
			ctx.beginPath();
			ctx.moveTo(wallX, bottomY);
			ctx.lineTo(wallX, 0);		
			ctx.lineTo(pCenterX+fogSideLength, 0);
			ctx.closePath();
			ctx.fill();
			
			
		}
		
		if(pCenterX < wallX && pCenterY > wallY+wallHeight)
		{//bottom left corner			
			fogAngle = Math.atan2(rightX - pCenterX, - (bottomY - pCenterY));
			var ffs = fogAngle*180/Math.PI;
			sideLength = Math.tan((90*Math.PI/180)-fogAngle) * (canvasWidth - pCenterX);
			ctx.beginPath();
			ctx.moveTo(wallX, wallY);				
			ctx.lineTo(rightX, wallY);
			ctx.lineTo(rightX, bottomY);
			ctx.lineTo(canvasWidth, pCenterY-sideLength); //4
			ctx.lineTo(canvasWidth, 0);
			fogAngle2 = Math.atan2(wallX - pCenterX, - (wallY - pCenterY));
			topLength = Math.tan(fogAngle2) * pCenterY;			
			ctx.lineTo(pCenterX+topLength, 0);	//6
			ctx.closePath();
			ctx.fill();						
		}
		
		if(pCenterX > wallX+wallWidth && pCenterY > wallY+wallHeight)
		{//bottom right corner				
			fogAngle = Math.atan2(wallX - pCenterX, - (bottomY - pCenterY));
			// var ffs = fogAngle*180/Math.PI;
			sideLength = Math.tan(fogAngle-(270*Math.PI/180)) * (pCenterX);
			ctx.beginPath();
			ctx.moveTo(rightX, wallY);				
			ctx.lineTo(wallX, wallY);
			ctx.lineTo(wallX, bottomY);
			ctx.lineTo(0, pCenterY-sideLength); //4
			ctx.lineTo(0, 0);			
			fogAngle2 = Math.atan2(rightX - pCenterX, - (wallY - pCenterY));
			topLength = Math.tan(fogAngle2) * pCenterY;			
			ctx.lineTo(pCenterX+topLength, 0);	//6
			ctx.closePath();
			ctx.fill();	
		}	
		
		if(pCenterX < wallX && pCenterY < wallY)
		{//top left corner			
			fogAngle = Math.atan2(rightX - pCenterX, - (wallY - pCenterY));
			// var ffs = fogAngle*180/Math.PI;
			sideLength = Math.tan(fogAngle-(90*Math.PI/180)) * (canvasWidth - pCenterX);
			ctx.beginPath();
			ctx.moveTo(wallX, bottomY);				
			ctx.lineTo(rightX, bottomY);
			ctx.lineTo(rightX, wallY);
			ctx.lineTo(canvasWidth, pCenterY+sideLength); //4
			ctx.lineTo(canvasWidth, canvasHeight);			
			fogAngle2 = Math.atan2(wallX - pCenterX, - (bottomY - pCenterY));
			topLength = Math.tan((180*Math.PI/180)-fogAngle2) * (canvasHeight -pCenterY);			
			ctx.lineTo(pCenterX+topLength, canvasHeight);	//6
			ctx.closePath();
			ctx.fill();	
		}	
		
		if(pCenterX > rightX && pCenterY < wallY)
		{//top right corner			
			fogAngle = Math.atan2(wallX - pCenterX, - (wallY - pCenterY));
			// var ffs = fogAngle*180/Math.PI;
			sideLength = Math.tan(fogAngle-(90*Math.PI/180)) * (pCenterX);
			ctx.beginPath();
			ctx.moveTo(rightX, bottomY);				
			ctx.lineTo(rightX, wallY);
			ctx.lineTo(wallX, wallY);
			ctx.lineTo(0, pCenterY-sideLength); //mb minus
			ctx.lineTo(0, canvasHeight);			
			fogAngle2 = Math.atan2(rightX - pCenterX, - (bottomY - pCenterY));
			topLength = Math.tan(fogAngle2-(180*Math.PI/180)) * (canvasHeight -pCenterY);			
			ctx.lineTo(pCenterX-topLength, canvasHeight);	//6
			ctx.closePath();
			ctx.fill();	
		}	
		
	}
	
}
// function drawWall(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight)
// function drawWall(context, x, y, width, height)
function drawWall(context, x, y, width, height, color)
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
	
	
	context.fillStyle=color;
	context.fillRect(x,y,width,height);
	context.fillStyle="#000000";
	context.globalAlpha = 0.5;
	context.fillRect(x,y+height-sideWallThickness,width,sideWallThickness);
	
	context.globalAlpha = 1;
}
// function drawTree()
// {
	// shadows then other
// }
//Need seperate function so can be drawn above objects
function drawWallShadow(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight, color)
{
	//draw shadow	
	var width = wallDivideWidth;
	var height = wallDivideHeight;
	var x = xDivideWidth;
	var y = yDivideHeight;
	context.fillStyle="#000000";
	context.globalAlpha = 0.5;
	context.fillRect(x,y+height,width,sideWallThickness);
	//top of wall
	context.globalAlpha = 1.0;
	context.fillStyle=color;
	context.fillRect(x,y-sideWallThickness+2,width,sideWallThickness);
	
}
function drawShadow(ctx, x, y, width, height)
{
	ctx.fillStyle="#000000";
	ctx.globalAlpha = 0.5;
	ctx.fillRect(x,y,width,height);
	ctx.globalAlpha = 1.0;
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
	var timeOfThisFrame = (new Date()).getTime();
	//time between frames in seconds
	var delta = (timeOfThisFrame - timeOfLastFrame)/1000;
	timeOfLastFrame = timeOfThisFrame;
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	//animate tanks, spin and move
	for (var i = 0; i < playerObjectsList.length; i++)
	{
		var tankToAnimate = playerObjectsList[i];
			
		if(tankToAnimate.moveKeysHeld > 0 && tankToAnimate.alive
		|| gameMode == 'race' && tankToAnimate.moveKeysHeld == 0 &&
		tankToAnimate.speed > 0)			
		{// or race and moveKeysHeld == 0 and speed > 0
			// needs to be just !updown......
					// -speed until 0			
			if(gameMode == 'race' && tankToAnimate.acceleration != 0)
			{
				// .maxSpeed?
				if(tankToAnimate.speed < playerSpeed*scale*2
				&& tankToAnimate.speed > -playerSpeed*scale*2)
				{
					tankToAnimate.speed += delta*tankToAnimate.acceleration;
				}
				
				if(tankToAnimate.moveKeysHeld == 0 && tankToAnimate.speed > 0)
				{
					tankToAnimate.speed += delta*tankToAnimate.acceleration;
					if(tankToAnimate.speed < 0)
					{
						tankToAnimate.acceleration = 0;						
					}
				}
				
				//for keypressed
				if(tankToAnimate.leftDown)
				{
					// tankToAnimate.moveAngle-=delta*ROTATE_SPEED/3 *tankToAnimate.acceleration/(150*scale);
					if(tankToAnimate.turnAmount == null)
					{						
						tankToAnimate.moveAngle-=delta*ROTATE_SPEED/3;
					}
					else
					{						
						tankToAnimate.moveAngle-=delta*tankToAnimate.turnAmount;
					}
					//check if joystick
					//if turnAmount not null?
				}
				else if(tankToAnimate.rightDown)
				{
					if(tankToAnimate.turnAmount == null)
					{
						// tankToAnimate.moveAngle+=delta*ROTATE_SPEED/3*tankToAnimate.acceleration/(150*scale);
						tankToAnimate.moveAngle+=delta*ROTATE_SPEED/3;
					}
					else
					{
						tankToAnimate.moveAngle+=delta*tankToAnimate.turnAmount;	
					}					
				}
				// for touchscreen i.e. joystick
			}
			else if(gameMode != 'race')
			{
				graduallySpin(tankToAnimate, tankToAnimate.moveAngle, tankToAnimate.newAngle, delta);
			}
			//CHANGE NEWX to use gameX/y, dont check collisions with onscreen values
			//NEW GAME X NOT SCREEN
			var newXOnScreen = tankToAnimate.gameX + delta * tankToAnimate.speed * Math.sin(tankToAnimate.moveAngle*(Math.PI/180));
			var newYOnScreen = tankToAnimate.gameY - delta * tankToAnimate.speed * Math.cos(tankToAnimate.moveAngle*(Math.PI/180));		
			var xChange = delta * tankToAnimate.speed * Math.sin(tankToAnimate.moveAngle*(Math.PI/180));
			var yChange = -delta * tankToAnimate.speed * Math.cos(tankToAnimate.moveAngle*(Math.PI/180));		
			
			
				
			
			//if(isScaled)
			// {
				// newXOnScreen *= scale;
				// newYOnScreen *= scale;
				// xChange *= scale;
				// yChange *= scale;
			// }
			
			// if(isOnScreen(newXOnScreen,newYOnScreen,tankToAnimate.size))		
			// {				
				var collidesResult = collidesWithAnyWall(newXOnScreen,newYOnScreen,tankToAnimate.size);
				var willCollideWithWall = collidesResult[0]=='true';
				var sideHit = collidesResult[1];
				//need to combine with camera change area
				if(willCollideWithWall)
				{
					//slide if moving diagonally
					if(collidesResult[3] < 2)
					{
						if(sideHit == 'top')
						{
							//when trying to move UP
							// if(newY < tankToAnimate.yPosition)
							if(newYOnScreen < tankToAnimate.yOnScreen)
							{
								// tankToAnimate.yPosition = newY;
								tankToAnimate.yOnScreen = newYOnScreen;
								tankToAnimate.gameY += yChange;
								if(cameraCentered && tankToAnimate.id == 'player')
								{							
									camera[1] += yChange;
								}
							}											
							// tankToAnimate.xPosition = newX;
							tankToAnimate.xOnScreen = newXOnScreen;						
							tankToAnimate.gameX += xChange;		
							if(cameraCentered && tankToAnimate.id == 'player')
							{
								camera[0] += xChange;	
							}
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
								if(cameraCentered && tankToAnimate.id == 'player')
								{							
									camera[1] += yChange;
								}
							}
							// tankToAnimate.xPosition = newX;
							tankToAnimate.xOnScreen = newXOnScreen;					
							tankToAnimate.gameX += xChange;	
							if(cameraCentered && tankToAnimate.id == 'player')
							{
								camera[0] += xChange;
							}
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
								if(cameraCentered && tankToAnimate.id == 'player')
								{
									camera[0] += xChange;	
								}							
							}
							// tankToAnimate.yPosition = newY;
							tankToAnimate.yOnScreen = newYOnScreen;
							tankToAnimate.gameY += yChange;
							if(cameraCentered && tankToAnimate.id == 'player')
							{							
								camera[1] += yChange;
							}
						}
						else if(sideHit == 'left')
						{						
							//trying to move left
							// if(newX < tankToAnimate.xPosition)
							if(newXOnScreen < tankToAnimate.xOnScreen)
							{
								tankToAnimate.xOnScreen = newXOnScreen;		
								tankToAnimate.gameX += xChange;	
								if(cameraCentered && tankToAnimate.id == 'player')
								{
									camera[0] += xChange;
								}
							}
							tankToAnimate.yOnScreen = newYOnScreen;			
							tankToAnimate.gameY += yChange;	
							if(cameraCentered && tankToAnimate.id == 'player')
							{							
								camera[1] += yChange;
							}
						}			
					}
				} //code for moving camera on edge of screen 
				
						//Farewell my sweet prince
						
				// else if(tankToAnimate.id == 'player' && 
				// (newX > 0.85*canvasWidth||newY+tankToAnimate.size > 0.85*canvasHeight
				// || newX < 0.15*canvasWidth|| newY < 0.15*canvasHeight))
				else if(tankToAnimate.id == 'player' && cameraCentered)
				// (newXOnScreen > canvasWidth-2*tankToAnimate.size||newYOnScreen+tankToAnimate.size > canvasHeight-2*tankToAnimate.size
				// || newXOnScreen < 2*tankToAnimate.size|| newYOnScreen < 2*tankToAnimate.size))
				{
					//need check whether camera at edge of map, if so stop moving it
					       //move only player if 1/2screen near edge
						   
					//var nearLeftEdge, nearRightEdge, nearTopEdge, nearBottomEdge;
					//nearLeftEdge = tankToAnimate.gameX < 0.5*canvasWidth;
					
					// var movingLeft, movingRight, movingUp, movingDown;
					//movingLeft = xChange < 0;
					
					//var canMoveCameraY = camera[1] <= 0 && (movingUp || nearTopEdge) || camera[1]+canvasHeight >= mapHeight && (movingDown || nearBottomEdge)
					
					/* if(camera[0] <= 0 && (movingLeft || nearLeftEdge))
					{
						// don't move camera x
						//if near top bottom 
						if(camera[1] <= 0 && (movingUp || nearTopEdge)
							|| camera[1]+canvasHeight >= mapHeight && (movingDown || nearBottomEdge)
						{
							//dont move y either
						}
						else
						{
							//move y only
						}
					} */
					
					//left edge of map & (player move left || player near left edge)
					/* if(camera[0] <= 0
						&& (xChange < 0 || tankToAnimate.gameX < canvasWidth/2))// is positive						
					{
						//dont move camera x						
						camera[1] += yChange;
					}//right edge of map & (player move right || player near right edge)
					else if(camera[0]+canvasWidth >= mapWidth
						&& (xChange > 0 || 
						tankToAnimate.gameX > mapWidth - canvasWidth/2))						
					{
						camera[1] += yChange;
					}
					else if(camera[1] <= 0
						&& (yChange < 0 || 
						tankToAnimate.gameY < canvasHeight/2))						
					{
						camera[0] += xChange;
					}
					else if(camera[1]+canvasHeight <= mapHeight
						&& (yChange > 0 || 
						tankToAnimate.gameY < mapHeight - canvasHeight/2))						
					{
						camera[0] += xChange;
					}
					else
					{ */
						camera[0] += xChange;
						camera[1] += yChange;
					// }
							
					// camera[1] += yChange;
					tankToAnimate.gameX += xChange;
					tankToAnimate.gameY += yChange;
					// console.log('Y tank and camera:', tankToAnimate.gameY, camera[1],
					// 'X', tankToAnimate.gameX, camera[0]);
					// tankToAnimate.gameX = camera[0] + tankToAnimate.xPosition;
					// tankToAnimate.gameY = camera[1] + tankToAnimate.yPosition;
					tankToAnimate.cameraX = camera[0];
					tankToAnimate.cameraY = camera[1];					
					// updateScreenPositions();
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
			// tankToAnimate.gameX = tankToAnimate.cameraX + tankToAnimate.xPosition;
			// tankToAnimate.gameY = tankToAnimate.cameraY + tankToAnimate.yPosition;
			
			// tankToAnimate.gameX = camera[0] + tankToAnimate.xPosition;
			// tankToAnimate.gameY = camera[1] + tankToAnimate.yPosition;
		}			
		// tankToAnimate.centerX = tankToAnimate.xPosition+0.5*tankToAnimate.size;
		// tankToAnimate.centerY = tankToAnimate.yPosition+0.5*tankToAnimate.size;
		tankToAnimate.centerX = tankToAnimate.gameX+0.5*tankToAnimate.size;
		tankToAnimate.centerY = tankToAnimate.gameY+0.5*tankToAnimate.size;	
		for(var j=0; j<startSquares.length; j++)
		{
			if(collides(tankToAnimate.gameX, tankToAnimate.gameY, tankToAnimate.size, tankToAnimate.size,
				startSquares[j][0]*scale, startSquares[j][1]*scale, startSquares[j][2], startSquares[j][3]))
			{
				if(gameMode == 'select')
				{
					// startMode(startSquares[j][4]);					
					thisClient.emit('setMode', startSquares[j][4]);
					setMode(startSquares[j][4]);
				}
			}
		}
		if(checkPoints.length != 0 && tankToAnimate.currentCheckpoint > 0)
		{
			var lastCheckpoint = checkPoints[tankToAnimate.currentCheckpoint-1];                                             //should be center of checkpoint?
			tankToAnimate.distanceFromLastCheckpoint = getDistanceBetween(tankToAnimate.centerX, tankToAnimate.centerY, lastCheckpoint[0]-0.5*lastCheckpoint[2], lastCheckpoint[1]-0.5*lastCheckpoint[3]);
		}
		if(gameMode == 'race')
		{	
			for(var j=0; j<checkPoints.length; j++)
			{
				if(collides(tankToAnimate.gameX, tankToAnimate.gameY, tankToAnimate.size, tankToAnimate.size,
				checkPoints[j][0], checkPoints[j][1], checkPoints[j][2], checkPoints[j][3])
				&& j==tankToAnimate.currentCheckpoint)
				{
					//if hit last checkpoint
					if(tankToAnimate.currentCheckpoint == checkPoints.length-1)
					{
						tankToAnimate.currentCheckpoint = 0;
						tankToAnimate.currentLap++;
						tankToAnimate.placeChecker++;	
						if(tankToAnimate.currentLap == 10)
						{
							//game over, tank wins					
							showScoreAtTank(tankToAnimate, tankToAnimate.racePlacing+'!');
							//should loop for all players (wait till each one finishes?)
							setMode('select');//same mode
							thisClient.emit('setMode', gameMode);
							// allWalls.pop();
						}
						else
						{
							showScoreAtTank(tankToAnimate, 'Lap '+tankToAnimate.currentLap);
						}
						//lap*checkPoints.length +currentCheckpoint?
						updateScoreLabel();						
					}
					else
					{
						//first checkpoint, push to place list,
						tankToAnimate.currentCheckpoint++;
						tankToAnimate.placeChecker++;	
						placingList.push(tankToAnimate);
						// updateScoreLabel();					
						// showScoreAtTank(tankToAnimate, tankToAnimate.currentCheckpoint);
						// showScoreAtTank(tankToAnimate, checkPoints.length);
						
						//need to set position, if in all tanks, first to reach
						// this checkpoint number
					}
				}
			}
			recalculatePlacing();
		}
		if(tankToAnimate.isJumping)
		{
			var maxY = 2*sideWallThickness;
			var maxSize = tankToAnimate.jumpStartSize*0.15;
			var jumpDuration = 2;
			var degreesToSin = 180/jumpDuration;
			var secondsJumping = timeOfThisFrame - tankToAnimate.jumpStartTime;
			secondsJumping /= 1000;
			//camera y needs to change too
			tankToAnimate.gameY = tankToAnimate.jumpStartY - Math.sin(degreesToSin*(Math.PI/180)*secondsJumping)*maxY;
			tankToAnimate.size = tankToAnimate.jumpStartSize + Math.sin(degreesToSin*(Math.PI/180)*secondsJumping)*maxSize;
			// if(secondsJumping >= jumpDuration)
			// if(tankToAnimate.size <= tankToAnimate.jumpStartSize)
			if(Math.sin(degreesToSin*(Math.PI/180)*secondsJumping) <= 0)
			{
				tankToAnimate.isJumping = false;
				tankToAnimate.size = tankToAnimate.jumpStartSize;
			}
		}
	}
	
	//animate enemies
	for(var i = 0; i < enemies.length; i++)
	{	
		var currentEnemy = enemies[i];
		//just set new angle?
		if(currentEnemy.isChasing != null)
		{
			var chasee = currentEnemy.isChasing;
			// need offset so moves to center of chasee not xY
			var angleToChasee = 180/Math.PI*Math.atan2(chasee.gameX - currentEnemy.gameX, -(chasee.gameY - currentEnemy.gameY));;
			if(angleToChasee < 0)
			{
				angleToChasee += 360;
			}
			currentEnemy.newAngle = angleToChasee;
		}
		
		graduallySpin(currentEnemy, currentEnemy.moveAngle, currentEnemy.newAngle, delta);
		//check enemy onscreen or hittin wall
		if(currentEnemy.collides(playersTank))//needs to be any player tank
		{
			//when tank hits enemy what to do?
			//zombies, die. slide off. tag, change whos it. if boosting do damage/push back
			
			if(currentEnemy.id == 'zombie')
			{
				// if(damage(playersTank, 2))
				if(damageAndCheckKill(playersTank, 2, currentEnemy))
				{
					// playerLose();
				}
			}//to stun player
		}
		
		var enemyNewX = currentEnemy.gameX + delta * currentEnemy.speed * Math.sin(currentEnemy.moveAngle*(Math.PI/180));
		var enemyNewY = currentEnemy.gameY - delta * currentEnemy.speed * Math.cos(currentEnemy.moveAngle*(Math.PI/180));
		
		// var isHittingWall = false;
		//check all walls for colision with current enemy
		var enemyCollidesResult = collidesWithAnyWall(enemyNewX,enemyNewY,currentEnemy.size);
		var willCollideWithWall = enemyCollidesResult[0]=='true';
		var sideHit = enemyCollidesResult[1];
		if(willCollideWithWall)
		{
			//slide if moving diagonally
			if(sideHit == 'top')
			{
				//when trying to move UP
				if(enemyNewY < currentEnemy.gameY)
				{
					currentEnemy.gameY = enemyNewY;
				}
				currentEnemy.gameX = enemyNewX;
			}					//checks which side hit
			else if(sideHit == 'bottom')
			{		
				//when trying to move DOWN
				if(enemyNewY > currentEnemy.gameY)
				{
					currentEnemy.gameY = enemyNewY;
				}
				currentEnemy.gameX = enemyNewX;
			}
			//right
			else if(sideHit == 'right')
			{
				//trying to move right
				if(enemyNewX > currentEnemy.gameX)
				{
					currentEnemy.gameX = enemyNewX;
				}
				currentEnemy.gameY = enemyNewY;
			}
			else if(sideHit == 'left')
			{						
				//trying to move left
				if(enemyNewX < currentEnemy.gameX)
				{
					currentEnemy.gameX = enemyNewX;
				}
				currentEnemy.gameY = enemyNewY;
			}
		}//when not going off screen or hitting wall
		else
		{
			if(currentEnemy.alive)
			{
				currentEnemy.gameX = enemyNewX;
				currentEnemy.gameY = enemyNewY;
			}
			
		}
		currentEnemy.centerX = currentEnemy.gameX+0.5*currentEnemy.size;
		currentEnemy.centerY = currentEnemy.gameY+0.5*currentEnemy.size;	
		
	}
	
	turretFaceMouse();
	
	//animate bullets, check collisions
	for(i = 0; i < allBullets.length; i++)
	{
		
		var currentBullet = allBullets[i];
		var xVelocity;
		var yVelocity;
		if(currentBullet.type == 'homing')
		{
			//angle from bullet to target
			// var shooterCenterX = currentBullet.shooter.centerX;
			var shooterCenterX = currentBullet.gameX + 0.5 * currentBullet.size;
			var targetCenterX = currentBullet.shooter.target.centerX;
			// var shooterCenterY = currentBullet.shooter.centerY;
			var shooterCenterY = currentBullet.gameY + 0.5 * currentBullet.size;
			var targetCenterY = currentBullet.shooter.target.centerY;
			var bulletAngle = Math.atan2(targetCenterX - shooterCenterX, - (targetCenterY - shooterCenterY));
			currentBullet.travelAngle = bulletAngle;
			// xVelocity = Math.sin(allBullets[i].travelAngle);
			// yVelocity = Math.cos(allBullets[i].travelAngle);	
		}
		else
		{
			
					
		}
		xVelocity = Math.sin(allBullets[i].travelAngle);
		yVelocity = Math.cos(allBullets[i].travelAngle);	
		allBullets[i].gameX += xVelocity * delta * allBullets[i].speed;
		allBullets[i].gameY -= yVelocity * delta * allBullets[i].speed;
		
		//for collision
		var bulletRight = currentBullet.gameX+currentBullet.size;
		var bulletBottom = currentBullet.gameY+currentBullet.size;
		var bulletTop = currentBullet.gameY;
		var bulletLeft = currentBullet.gameX;
		
		var detectionBuffer = NORMAL_BULLET_SIZE; 
		var bulletCollidesResult = collidesWithAnyWall(
			currentBullet.gameX, 
			currentBullet.gameY, 
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
		
		//for grenades
		if(currentBullet.type == 'grenade')
		{
			//decrease speed
			var lifeTime = timeOfThisFrame - currentBullet.timeCreated;
			currentBullet.speed = grenadeSpeed - (lifeTime/1500)*grenadeSpeed;
			if(currentBullet.speed < 0)
			{
				currentBullet.speed = 0;
			}
			//STOP HERE for planting land mines, only self harm after one bounce
			
			//if speed at 0, start explode timer
			if(lifeTime > 2000)
			{
				//need to send shooter for score
				damageExplosionAt(currentBullet.gameX, currentBullet.gameY, 3*currentBullet.size, currentBullet.shooter)
				allBullets.splice(i, 1); 	
				// grenadeExplode.currentTime = 0;
				// grenadeExplode.play();
				playSound(grenadeExplode);
			}
		}
		
		if(willBulletCollide)//bullet hit wall
		{
			currentBullet.bounceCount++;
			if(gameMode == 'cs')
			{
				// grenadeBounce.currentTime = 0;
				// grenadeBounce.play();
				
				playSound(grenadeBounce);
			}
			
			//todo: checker for fast mode, just die on first bounce
			// || currentBullet.damage > NORMAL_BULLET_DAMAGE for charge
				//can be type == 'charge'
			//todo: check if mine, can hit self after x time
			if(currentBullet.bounceCount > 3			
			|| currentBullet.shooter.id == "boss"
			|| currentBullet.type == 'homing'
			|| (gameMode == 'cs'&& currentBullet.type == 'primary')
			|| (gameMode == 'cs'&& currentBullet.type == 'grenade')
			&& currentBullet.bounceCount > 3)			//add || currentBullet is charged
			{
				explode(allBullets[i]);					
				allBullets.splice(i, 1); 
				
				
				if(currentBullet.type == 'grenade')
				{
					// grenadeExplode.currentTime = 0;
					// grenadeExplode.play();	
					playSound(grenadeExplode);
				}				
				// break bulletLoop;
			}				
			else if(sideHit == 'top')
			{
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.gameY = (wallHit[1])-currentBullet.size;
			}				
			//bottom
			else if(sideHit == 'bottom')
			{						
				currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				currentBullet.gameY = (wallHit[1]+wallHit[3]);
				
			}
			//right
			else if(sideHit == 'right')
			{
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;	
				currentBullet.gameX = (wallHit[0]+wallHit[2]);
			
			}				
			//bottom
			else if(sideHit == 'left')
			{
					//sides
				currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;	
				currentBullet.gameX = (wallHit[0]-currentBullet.size);
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

			//if shooter is not hit tank, or if bounced once can self harm	
			if(tankToCheck.collides(currentBullet) &&
			(tankToCheck.id != currentBullet.shooter.id || 
			(tankToCheck.id == currentBullet.shooter.id && 
			(currentBullet.bounceCount > 0 ))))
			// || currentBullet.lifeTime > 500))))
			{						
				explode(currentBullet);	
				
				//other players handled on their own client
				if(tankToCheck.id == 'player'  
				&& gameMode != 'race'
				&& gameMode != 'zombies')
				{
					// if(damageAndCheckKill(tank, damage))
							//send iDied to sync respawn timers;
					damageAndCheckKill(tankToCheck, currentBullet.damage, currentBullet.shooter);
					var shotAndShooterId = [j, playerObjectsList.indexOf(currentBullet.shooter)];
					thisClient.emit('iGotHit', shotAndShooterId);//tank index
					allBullets.splice(i, 1);
					//TODO: send time of death if dead, so respawn is same time
					
					// damage(tankToCheck, currentBullet.damage);
				}
				else if(gameMode != 'race' && gameMode != 'zombies')//if other player, explode and damage but dont tell server
				{
					damageAndCheckKill(tankToCheck, currentBullet.damage, currentBullet.shooter);
					allBullets.splice(i, 1);
				}
				
				if(gameMode == 'race')
				{
					//dont damage, just stun/slow for a while
					allBullets.splice(i, 1);
					if(tankToCheck.state != 'shielded')
					{						
						slow(tankToCheck);
					}
					// tankToCheck.speed = tankToCheck.speed/4;
					// setTimeout(function()
					// {
						// tankToCheck.speed = tankToCheck.speed*4;
					// }, 1000);
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
		
		for(var e = 0; e < enemies.length; e++)
		{		
			var currentEnemy = enemies[e];
			if(currentEnemy.collides(currentBullet))
			{
				explode(currentBullet);	
				allBullets.splice(i, 1);
				// if(damage(currentEnemy, currentBullet.damage))
				if(damageAndCheckKill(currentEnemy, currentBullet.damage, currentBullet.shooter))
				{
					var newDeadImage = [currentEnemy.baseImages[2], currentEnemy.gameX+0.5*currentEnemy.size, currentEnemy.gameY+0.5*currentEnemy.size, currentEnemy.moveAngle, currentEnemy.size];
					deadList.push(newDeadImage);					
					enemies.splice(e, 1);
				}				
			}
		}
		//bullet hit bullet
		for(var b = 0; b < allBullets.length; b++)
		{
			if(collides(currentBullet.gameX, currentBullet.gameY, 
			currentBullet.size, currentBullet.size, 
			allBullets[b].gameX, allBullets[b].gameY,
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
		//bullet hit explosive
		for(e = 0; e < allExplosives.length; e++)
		{
			var explosive = allExplosives[e];
			if(collides(currentBullet.gameX, currentBullet.gameY, 
			currentBullet.size, currentBullet.size, 
			explosive.gameX, explosive.gameY,
			explosive.size, explosive.size) &&
			gameMode == 'race') //not just race?
			{
				basicExplode(explosive.gameX, explosive.gameY, explosive.size);
				allExplosives.splice(e,1);
				allBullets.splice(i, 1);
				
			}
		}
		
		
	}
	
	// put inside tank animate loop?
	// checks collision with tanks, tank hit explosive
	for(i = 0; i < allExplosives.length; i++)
	{	
		var explosive = allExplosives[i];
		for (var p = 0; p < playerObjectsList.length; p++) 
		{
			var tank = playerObjectsList[p];
			if(collides(explosive.gameX, explosive.gameY, explosive.size, explosive.size,
			tank.gameX, tank.gameY, tank.size, tank.size))
			{
				if(explosive.getLifeTime() > 500)
				{
					if(tank.state != 'shielded')
					{						
						slow(tank);//only for race
					}
					basicExplode(explosive.gameX, explosive.gameY, explosive.size);
					
					allExplosives.splice(i, 1);
					//if other modes, damageExplosionAt					
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
				if(thisPickup.isActive)
				{
					//tell server you got pickup
					thisClient.emit('iGotPickup', [thisPickup.id, i, playerObjectsList.indexOf(playersTank)]);
					//need method tank.gotPickup('type');
					// playersTank.pickedUp(thisPickup.id);
					tankPickedUp(playersTank, thisPickup.id, i);
					//need to random before sending in race
				}
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
	
	for(i = 0; i < scoreAnimations.length; i++)
	{
		//if lifetime > x, splice
		var lifeTime = timeOfThisFrame - scoreAnimations[i][1];
		if(lifeTime > 1000)//should be a constant?
		{
			scoreAnimations.splice(i, 1);
		}
	}
	
	//transition keys into screen
	var timeSinceIntroStarted = timeOfThisFrame - introStartTime;
	if(timeSinceIntroStarted < 500)
	{
		for(var i=0 ; i< keyboardLetters.length; i++)
		{
			var key = keyboardLetters[i];
			//-delta * increment to y positions
			key[1] -= delta*500*scale;
		}
	}//should check if moved a certain amount before removing
	else if(timeSinceIntroStarted > 4000)
	{
		for(var i=0 ; i< keyboardLetters.length; i++)
		{
			var key = keyboardLetters[i];
			//-delta * increment to y positions
			key[1] += delta*500*scale;
		}
	}
	else if(timeSinceIntroStarted > 5000)
	{
		keyboardLetters = [];
	}
	
	//make start squares pulse/glow
		
		//change 0.5 opacity every second, delta*0.5*
		// if(Math.floor(timeSinceIntroStarted/1000)%2 == 0)
	
	startSquareOpacity += upOrDown*delta*0.8;	
	if(startSquareOpacity > 1.0)
	{
		startSquareOpacity = 1.0;
		upOrDown = -1;
	}
	else if(startSquareOpacity < 0.2)
	{
		startSquareOpacity = 0.2;
		upOrDown = 1;
	}

	if(transitionCamera)
	{
		if(gameMode == 'race')
		{	
			//needs check whether x/y is above or below race camera to know which direction
			camera[0] -= delta/2 * xTransition; //halfcanvas per second
			camera[1] -= delta/2 * yTransition;
			// camera = [raceGamePosition[0]*w*scale, raceGamePosition[1]*h*scale];
			if(camera[0] <= raceGamePosition[0]*mapWidth*scale)//need better check && stage 1
			{
				transitionCamera = false;
			}
		}
		else if(gameMode == 'cs')
		{	
			//needs check whether x/y is above or below race camera to know which direction
			camera[0] += delta/2 * xTransition; //halfcanvas per second
			camera[1] -= delta/2 * yTransition;
			// camera = [raceGamePosition[0]*w*scale, raceGamePosition[1]*h*scale];
			if(camera[0] >= csGamePosition[0]*mapWidth*scale)//need better check && stage 1
			{
				transitionCamera = false;
			}
		}
		else if(gameMode == 'zombies')
		{
			
			camera[0] -= delta/2 * xTransition; //halfcanvas per second
			camera[1] += delta/2 * yTransition;
			if(camera[1] >= zombieGamePosition[1]*mapHeight*scale)//need better check && stage 1
			{
				transitionCamera = false;
			}
		}
		
	}
	
	if(!paused)
	{		
		requestAnimationFrame(animate);
	}
	draw();
}

function collides(object1x, object1y, object1width, object1height, object2x, object2y, object2width, object2height)
{	
 var doesCollide = false;
 var rightOfLeft = object1x < object2x + object2width;
 var leftOfRight = object1x + object1width > object2x;
 var aboveBottom = object1y < object2y + object2height;
 var belowTop = object1y + object1height > object2y;
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
		//result is didCollide, sideHit and wallNumber (+number collide)
		       //need to check how many walls colliding with
			   
	var howManyWallsHit = 0;
	var result = ["false", "none", 0, howManyWallsHit];
	
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
		
		// debugSquares.push([wallX,wallY,wallWidth,wallHeight, 'white']);
		// debugSquares.push([x,y,size,size, 'red']);
		// ctx.fillStyle = 'red';
		// ctx.fillRect(x, y, size, size);
		// ctx.fillStyle = 'white';
		// ctx.fillRect(wallX,wallY,wallWidth,wallHeight);
		
		if(collides(x, y, size, size, 
		wallX, wallY, wallWidth, wallHeight))
		{
			result[0] = "true";			
			result[2] = wallNumber;
			howManyWallsHit++;
			result[3] = howManyWallsHit;
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
				if(howManyWallsHit > 1)
				{				
					break;
				}
			}
			//bottom
			else if(objectTop > wallY
			&& objectTop < wallY+wallHeight
			&& (fromBot) < CHECK_DISTANCE)
			{
				result[1] = 'bottom';
				if(howManyWallsHit > 1)
				{				
					break;
				}
			}
			//right
			else if(objectLeft < wallX+wallWidth 
			&& objectLeft > wallX 
			&& (fromRight) < CHECK_DISTANCE)
			{
				result[1] = 'right';
				if(howManyWallsHit > 1)
				{					
					break;
				}
			}
			//left
			else if(objectRight > wallX 
			&& objectRight < wallX+wallWidth
			&& (fromLeft) < CHECK_DISTANCE) 
			{
				result[1] = 'left';
				if(howManyWallsHit > 1)
				{					
					break;
				}				
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

//for race turn, 
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

function addBoundaryAt(x, y)
{
	
	// allWalls.push([-0.5*boundaryThickness, 0, mapWidth, boundaryThickness]); //top boundary
	// allWalls.push([mapWidth - 0.5*boundaryThickness, 0, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	// allWalls.push([-0.5*boundaryThickness, 0, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	// allWalls.push([-0.5*boundaryThickness, mapHeight, mapWidth, boundaryThickness]); //bottom boundary
	allWalls.push([x-boundaryThickness, y-boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //top boundary
	allWalls.push([x+mapWidth, y, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	allWalls.push([x-boundaryThickness, y, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	allWalls.push([x-boundaryThickness, y+mapHeight+boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //bottom boundary
}

function setUpMap()
{
	addTree(200, 550, 250);
	addNormalWalls();
	addRaceWalls();//adds checkpoints and hazards	
	addCSWalls();
	addZombieWalls();
	addStudioWalls();
	rescaleWalls(false);
}

function addNormalWalls()
{
	// allWalls.push([300, 150, 200, 300]); 
	// allWalls.push([800, 400, 200, 300]);
	allWalls.push([1250, 0, 200, 400]); 
	mapWalls.push([1250, 0, 200, 400]); 
	
}

function addStudioWalls()
{
	var w = mapWidth;
	var h = mapHeight;
	var stuX = studioGamePosition[0]*w;
	var stuY = studioGamePosition[1]*h;
	
	//make all instruments un passable
	for(i = 0; i < instruments.length; i++)
	{
		var inst = instruments[i];
		// ctx.drawImage(inst[0], inst[1]*scale-camera[0], inst[2]*scale-camera[1], inst[3]*scale, inst[4]*scale);
		// allWalls.push([inst[1], inst[2], inst[3], inst[4]]);
	}
	
	allWalls.push([stuX-boundaryThickness, stuY-boundaryThickness, mapWidth, boundaryThickness]); //top boundary
	allWalls.push([stuX+mapWidth, stuY, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	allWalls.push([stuX-boundaryThickness, stuY, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	allWalls.push([stuX-boundaryThickness, stuY+mapHeight+boundaryThickness, mapWidth*0.8, boundaryThickness]); //bottom boundary

}

function addZombieWalls()
{
	var w = mapWidth;
	var h = mapHeight;
	var zombieX = zombieGamePosition[0]*w;
	var zombieY = zombieGamePosition[1]*h;
	addTree(920+zombieX, 270+zombieY, 250);
	addTree(700+zombieX, 350+zombieY, 250);
	addTree(950+zombieX, 500+zombieY, 250);
	addTree(670+zombieX, 600+zombieY, 250);
	addTree(60+zombieX, 450+zombieY, 250);
	addTree(w+zombieX-160, 400+zombieY, 250);
	// addTree(400+zombieX, 600+zombieY, 250);
	// addTree(900+zombieX, 400+zombieY, 350);
	// allWalls.push([1250+zombieX, 0+zombieY, 200, 400]); 
	// mapWalls.push([1250+zombieX, 0+zombieY, 200, 400]); 
	var newWalls = [];
	
	
	allWalls.push([1150+zombieX, 150+zombieY, 350, 150]);
	allWalls.push([200+zombieX, 150+zombieY, 350, 150]);
	allWalls.push([1150+zombieX, 550+zombieY, 350, 150]);
	allWalls.push([200+zombieX, 550+zombieY, 350, 150]);
	
	mapWalls.push([1150+zombieX, 150+zombieY, 350, 150]);
	mapWalls.push([200+zombieX, 150+zombieY, 350, 150]);
	mapWalls.push([1150+zombieX, 550+zombieY, 350, 150]);
	mapWalls.push([200+zombieX, 550+zombieY, 350, 150]);
					//why no werk :(
	// newWalls.push([1150+zombieX, 150+zombieY, 350, 150]);
	// newWalls.push([200+zombieX, 150+zombieY, 350, 150]);
	// newWalls.push([1150+zombieX, 550+zombieY, 350, 150]);
	// newWalls.push([200+zombieX, 550+zombieY, 350, 150]);
	// allWalls = allWalls.concat(newWalls);
	// mapWalls = mapWalls.concat(newWalls);
	// addBoundaryAt(zombieX*scale, zombieY*h*scale)
	
	allWalls.push([zombieX-boundaryThickness, zombieY-boundaryThickness, mapWidth*0.8, boundaryThickness]); //top boundary
	allWalls.push([zombieX+mapWidth, zombieY, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	allWalls.push([zombieX-boundaryThickness, zombieY, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	allWalls.push([zombieX-boundaryThickness, zombieY+mapHeight+boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //bottom boundary
}

function addCSWalls()
{
	var csX = csGamePosition[0]*mapWidth;
	var csY = csGamePosition[1]*mapHeight;
	allWalls.push([300+csX, 150+csY, 200, 300]); 
	allWalls.push([800+csX, 400+csY, 200, 300]);
	allWalls.push([1300+csX, 150+csY, 200, 300]); 
	
	allWalls.push([800+csX, 100+csY, 100, 100]); 
	allWalls.push([200+csX, 600+csY, 100, 100]); 
	allWalls.push([1500+csX, 600+csY, 100, 100]); 
	allWalls.push([csX-boundaryThickness, csY-boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //top boundary
	allWalls.push([csX+mapWidth, csY, boundaryThickness, mapHeight+ boundaryThickness]); //right boundary
	allWalls.push([csX-boundaryThickness, csY, boundaryThickness, 0.7*mapHeight]); //left boundary
	allWalls.push([csX-boundaryThickness, csY+mapHeight+boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //bottom boundary

	
	
	mapWalls.push([300+csX, 150+csY, 200, 300]); 
	mapWalls.push([800+csX, 400+csY, 200, 300]);
	mapWalls.push([1300+csX, 150+csY, 200, 300]); 
	
	mapWalls.push([800+csX, 100+csY, 100, 100]); 
	mapWalls.push([200+csX, 600+csY, 100, 100]); 
	mapWalls.push([1500+csX, 600+csY, 100, 100]); 
	
	// mapWalls.push([800, 100, 100, 100]); 
	// mapWalls.push([200, 600, 100, 100]); 
	// mapWalls.push([1500, 600, 100, 100]); 	
	
	// mapWalls.push([300, 150, 200, 300]); 
	// mapWalls.push([800, 400, 200, 300]);
	// mapWalls.push([1300, 150, 200, 300]); 	
}
//put players at startline, change map, initate weapon pickups, start countdown
//       init checkpoint array
var checkPoints = [];
function addRaceWalls()//andcheckpoints
{
	var w = mapWidth;
	var h = mapHeight;
	var raceX = raceGamePosition[0]*w;
	var raceY = raceGamePosition[1]*h;
	//add walls	
	
	//should add from top to bottom so shadows arent above
	
	// allWalls.push([w*0.2, h*0.2, w*0.1, h*0.4]); 
	// allWalls.push([w*0.45, h*0.0, w*0.1, h*0.35]); 	
	// allWalls.push([w*0.70, h*0.2, w*0.1, h*0.4]); 
		
	// allWalls.push([w*0.2, h*0.55, w*0.6, h*0.15]); 
	allWalls.push([raceX-boundaryThickness, raceY-boundaryThickness, mapWidth+ boundaryThickness, boundaryThickness]); //top boundary
	allWalls.push([raceX+mapWidth, raceY, boundaryThickness, mapHeight*0.7]); //right boundary
	allWalls.push([raceX-boundaryThickness, raceY, boundaryThickness, mapHeight+ boundaryThickness]); //left boundary
	allWalls.push([raceX-boundaryThickness, raceY+mapHeight+boundaryThickness, mapWidth+ 2*boundaryThickness, boundaryThickness]); //bottom boundary

	allWalls.push([w*0.2+raceX, h*0.2+raceY, w*0.1, h*0.4]); 
	allWalls.push([w*0.45+raceX, h*0.0+raceY, w*0.1, h*0.35]); 	
	allWalls.push([w*0.70+raceX, h*0.2+raceY, w*0.1, h*0.4]); 
		
	allWalls.push([w*0.2+raceX, h*0.55+raceY, w*0.6, h*0.15]); 
	
	checkPoints.push([w*0.2+raceX, h*0.65+raceY, w*0.15, h*0.35]); 
	checkPoints.push([w*0.0+raceX, h*0.45+raceY, w*0.2, h*0.1]); 
	checkPoints.push([w*0.45+raceX, h*0.35+raceY, w*0.1, h*0.25]); 
	checkPoints.push([w*0.8+raceX, h*0.45+raceY, w*0.2, h*0.1]); 	
	checkPoints.push([w*0.5+raceX, h*0.50+raceY, w*0.1, h*0.50]);
	
	// debugSquares.push([w*0.2, h*0.65, w*0.15, h*0.35, 'white']);
	// debugSquares.push([w*0.02, h*0.45, w*0.2, h*0.1, 'white']); 
	// debugSquares.push([w*0.4, h*0.25, w*0.1, h*0.25, 'white']); 	
	// debugSquares.push([w*0.8, h*0.45, w*0.2, h*0.1, 'white']); 	
	// debugSquares.push([w*0.6, h*0.50, w*0.1, h*0.50, 'white']);
	
	// debugSquares.push([startSquares[0][0], startSquares[0][1], startSquares[0][2], startSquares[0][3]]);
		//use these for finish line lol
	debugSquares.push([w*0.55+raceX, h*0.65+raceY, w*0.05, h*0.175, 'white']);
	debugSquares.push([w*0.5+raceX, h*0.65+raceY, w*0.05, h*0.175, 'black']);
	debugSquares.push([w*0.55+raceX, h*0.825+raceY, w*0.05, h*0.175, 'black']);
	debugSquares.push([w*0.5+raceX, h*0.825+raceY, w*0.05, h*0.175, 'white']);
	//need fog?
	// mapWalls.push([w*0.2, h*0.2, w*0.1, h*0.25]); 
	// mapWalls.push([w*0.4, h*0.0, w*0.1, h*0.25]); 	
	// mapWalls.push([w*0.6, h*0.2, w*0.1, h*0.25]); 
		
	// mapWalls.push([w*0.2, h*0.4, w*0.6, h*0.25]); 
	//dont need because map width and height been scaled?
	//why does it work without scale lol	
	// rescaleWalls();
}
function addHugeRaceWalls()//andcheckpoints
{
	var w = mapWidth;
	var h = mapHeight;
	//add walls	
	
	//should add from top to bottom so shadows arent above
	
	allWalls.push([w*0.2, h*-1, w*0.1, h*1.5]); 
	allWalls.push([w*0.45, h*0.0, w*0.1, h*0.35]); 	
	allWalls.push([w*0.70, h*-1, w*0.1,h*1.5]); 
		
	allWalls.push([w*0.2, h*0.55, w*0.6, h*0.15]); 
	
	
	
	// checkPoints.push([w*0.2, h*0.65, w*0.15, h*0.35]); 
	// checkPoints.push([w*0.0, h*0.45, w*0.2, h*0.1]); 
	// checkPoints.push([w*0.4, h*0.25, w*0.1, h*0.25]); 
	// checkPoints.push([w*0.8, h*0.45, w*0.2, h*0.1]); 	
	// checkPoints.push([w*0.5, h*0.50, w*0.1, h*0.50]);
	
	// debugSquares.push([w*0.2, h*0.65, w*0.15, h*0.35, 'white']);
	// debugSquares.push([w*0.02, h*0.45, w*0.2, h*0.1, 'white']); 
	// debugSquares.push([w*0.4, h*0.25, w*0.1, h*0.25, 'white']); 	
	// debugSquares.push([w*0.8, h*0.45, w*0.2, h*0.1, 'white']); 	
	// debugSquares.push([w*0.5, h*0.50, w*0.1, h*0.50, 'white']);
	
		//use these for finish line lol
	debugSquares.push([w*0.55, h*0.65, w*0.05, h*0.175, 'white']);
	debugSquares.push([w*0.5, h*0.65, w*0.05, h*0.175, 'black']);
	debugSquares.push([w*0.55, h*0.825, w*0.05, h*0.175, 'black']);
	debugSquares.push([w*0.5, h*0.825, w*0.05, h*0.175, 'white']);

	//dont need because map width and height been scaled?
	//why does it work without scale lol	
	// rescaleWalls();
}

function addRacePickupsAndHazards()
{
	var w = mapWidth*scale;
	var h = mapHeight*scale;
	var raceX = raceGamePosition[0]*w;
	var raceY = raceGamePosition[1]*h;
	// var newPickup = new Pickup(w*0.1, h*0.1, 1.5*shipSize, 'random');
	// activePickups.push(newPickup);
	
	// var newPickup2 = new Pickup(w*0.08, h*0.6, 1.5*shipSize, 'random');
	// activePickups.push(newPickup2);
	
	//trying to use mouse x and y values to choose position
	var newPickup = new Pickup(330*scale+raceX, 600*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);	
	newPickup = new Pickup(330*scale+raceX, 750*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);
	
	newPickup = new Pickup(55*scale+raceX, 150*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);
	newPickup = new Pickup(200*scale+raceX, 150*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);
	
	newPickup = new Pickup(1400*scale+raceX, 365*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);
	newPickup = new Pickup(1565*scale+raceX, 365*scale+raceY, shipSize, 'random');
	activePickups.push(newPickup);
	var randomAngle = Math.random()*360;
	//bullet only come from a tank, need a hazard class?
	// damage on contact, need another loop in animate.. easier to change bullet class?
	// var mapTank = new Tank("map", 0, 0,
						// 'none', 0, 0);
	
	var hazard = new Explosive(195*scale+raceX, 390*scale+raceY, NORMAL_BULLET_SIZE, 'oil');
	allExplosives.push(hazard);
	hazard = new Explosive(645*scale+raceX, 185*scale+raceY, NORMAL_BULLET_SIZE, 'oil');
	allExplosives.push(hazard);
	hazard = new Explosive(1450*scale+raceX, 190*scale+raceY, NORMAL_BULLET_SIZE, 'oil');
	allExplosives.push(hazard);

}

function placeMine(tank)
{
	// var randomAngle = Math.random()*360;
	
	// var hazard = new Bullet(explosiveImage, playersTank, playersTank.centerX, playersTank.centerY, randomAngle, 0, NORMAL_BULLET_SIZE, GRENADE_DAMAGE, 'mine');
	// allBullets.push(hazard);
		
	var mine = new Explosive(tank.centerX, tank.centerY, NORMAL_BULLET_SIZE, 'mine');
	allExplosives.push(mine);
}
//need scale walls?
// function setAllTankSpeeds(speedBeforeScaling)
function setAllTankSpeeds(scaledSpeed)
{
	for(var i = 0; i < playerObjectsList.length; i++)
	{
		var tank = playerObjectsList[i];
		tank.speed = scaledSpeed;
	}	
}

function setAllTankPositions(x, y)
{
	//position tanks
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var tank = playerObjectsList[i];
		// tank.gameX = mapWidth*scale*0.5 +i*shipSize;
		// tank.gameY = mapHeight*scale*0.4;	
		tank.gameX = x+i*20;
		tank.gameY = y;		
		tank.stopMoving();		
		// tank.canShoot = false;//set true when picked ammo
	}
}

var introDiv = document.getElementById('titleDiv');
var helpText = document.getElementById('helpText');
var introTitle = document.getElementById('introTitle');
var introIconOne = document.querySelectorAll('img')[0];
var introIconTwo = document.querySelectorAll('img')[1];

var countDownDiv = document.getElementById('countDownDiv');
var countDownNumbers = document.getElementById('cdNumbers');;

//need instant appear for intro, rest blink
function divBlinkIn(modeName)
{
	// div height 0 to 100, top '58vh' to 0
	introDiv.style.height = '0vh';
	introDiv.style.top  = '58vh';
	
	// introDiv.style.height = '100vh';
	// introDiv.style.top  = '0vh';
	introDiv.style.display = 'block';
	setTimeout(function()
	{
		introDiv.style.height = '100vh';
		introDiv.style.top  = '0vh';
		introTitle.style.bottom  = '40vh';			
		introIconOne.style.bottom  = '40vh';
		introIconTwo.style.bottom  = '40vh';
		
		// introTitle.style.opacity  = '0.0';
		// introIconOne.style.opacity  = '0.0';
		// introIconTwo.style.opacity  = '0.0';		
	},500);
	
	if(modeName = 'race')
	{		
		introTitle.innerHTML  = 'Race Mode';	
	}
	
	setTimeout(function()
	{
		introTitle.style.opacity  = '1.0';
		introIconOne.style.opacity  = '1.0';
		introIconTwo.style.opacity  = '1.0';
		
	},500);
}

function divBlinkOut()
{
	introDiv.style.height = '0vh';
	introDiv.style.top  = '58vh';
	
	// introTitle.style.bottom  = '-8vh';
	
	// only at intro?
	// introIconOne.style.bottom  = '-8vh';
	// introIconTwo.style.bottom  = '-8vh';
	setTimeout(function()
	{
		introDiv.style.display = 'none';
		
	},2000);
}

function clearIntroTimers()
{
	for(var i = 0; i < introTimers.length; i++)
	{
		clearInterval(introTimers[i]);
	}
}

var keyboardLetters = [];
var keyboardAnimateLooper;
var mouseAnimateLooper;
var mouse;
var mouseButtons = [];
var introStartTime;
var musicLoop;
var playFull = false;//which music to play
var startSquares = [];//to activate modes on entry
var startSquareOpacity = 1.0;
var upOrDown = -1;
var introTimers = [];
var raceStartTime;
//need lap start time?
//must add boundary before other walls first as it clears allWalls
//TODO: maxhealth/current, 
//Needs check whether from a menu or startZone
function setMode(modeName)
{
	clearIntroTimers();
	
	//pebbles should be at init
	pebbles = [];
	var pebbleCount = 5;
	while(pebbleCount > 0)
	{
		var randomX = mapWidth*Math.random()*scale;
		var randomY = mapHeight*Math.random()*scale;
		createPebblesAt(randomX, randomY, 3);
		pebbleCount--;
	}

	var previousMode = gameMode;
	gameMode = modeName;
	introDiv.style.height = '0vh';
	introDiv.style.top  = '58vh';
			
		deadList = [];
		activePickups = [];//ruins add previous pickups
		allExplosives = [];
		enemies = [];
		keyboardLetters = [];
		mouse = [];
		mouseButtons = [];
		allBullets = [];

	clearInterval(spawnTimer);//for zombies
	clearInterval(retargetTimer);//for zombies
	clearInterval(keyboardAnimateLooper);
	clearInterval(mouseAnimateLooper);
	clearInterval(musicLoop);
	playFull = false;

	introDiv.style.display = 'none';
	var w = mapWidth;
	var h = mapHeight;
	if(gameMode == 'cs')
	{
		//should be DEFAULT_PLAYER_SPEED not 300
		//need default bullet and player speed
		globalBulletSpeed = (300*scale)*8;//not needed with rayCast?
		
		NORMAL_BULLET_SIZE = shipSize*0.3*scale;
		// SHOT_RATE = 0.3;
		SHOT_RATE = 0.3;
		SECONDARY_SHOT_RATE = 3; //3
		NORMAL_BULLET_DAMAGE = 20;
		
		//need to loop for all tanks?
		playersTank.primaryGun = 'normal';
		playersTank.canShoot = true;
		
		cameraCentered = false;
		transitionCamera = true;
		xTransition = Math.abs(camera[0] - csGamePosition[0]*w*scale);
		yTransition = Math.abs(camera[1] - csGamePosition[1]*h*scale);
		helpText.style.display = 'block';
		helpText.style.top = '70vh';
		helpText.style.left = '65vw';
		helpText.innerHTML = 'Deathmatch <br> First to 5 kills wins.';
		//must respawn after walls for collide detect
			// playersTank.randomRespawn(true);//need to split to randomPosition()
		
		setTimeout(function()
		{
			playersTank.randomRespawn(true);//need to split to randomPosition()
			// reloadSound.currentTime = 0;
			// reloadSound.play();
			playSound(reloadSound);
			
			/* var bot = new Tank("bot", 0, 0,
					tankTypeList[Math.floor(Math.random()*tankTypeList.length)], 300*scale, 100);
			bot.randomRespawn();
			bot.centerX = bot.gameX+0.5*bot.size;
			bot.centerY = bot.gameY+0.5*bot.size;				
				// selectClosestTarget(newEnemy, playerObjectsList);
			bot.target = playersTank;
			bot.nickname = 'Bot 1';
			addToScoreBoard(bot); */
		
			// bot.moveSpeed = 0;
			// enemyFaceTarget(bot);
			//needs to only happen if not behind wall/in fog
			setTimeout(function()
			{
				botShootPlayer(enemies[0]);		
			},1000);//time before ai can shoot
			enemies = [];
			enemies.push(bot);
			
			setInterval(function()
			{
				var randomX = Math.random() * mapWidth + csGamePosition[0]*mapWidth;
				var randomY = Math.random() * mapHeight + csGamePosition[1]*mapHeight;
				randomX *= scale;
				randomY *= scale;
				if(enemies.length > 0)
				{
					if(enemies[0].alive)
					{
						enemies[0].goTo(randomX, randomY);
					}
				}				
				// need goToNextWaypoint()
			},1000);
			
			allTanks = playerObjectsList.concat(enemies);
			
			showScoreLabel();
			//close boundary
			allWalls.push([(csGamePosition[0]*mapWidth-boundaryThickness)*scale, csGamePosition[1]*mapWidth+0.7*mapHeight*scale, boundaryThickness, 0.4*mapHeight*scale]); //left boundary
			setAllTankSpeeds(300*scale);
		}, 3000);
		
		setTimeout(function()
		{
			helpText.style.display = 'none';
			// addCSWalls();
		}, 5000);
		// showFog = true;
	}
	else if(gameMode == 'intro')//change to tutorial
	{		
		startTutorial();
		// document.getElementById('scoreLabel').style.display = 'none';
		/* cameraCentered = false;
		document.getElementById('scoreLabel').style.height = '0px';
		document.getElementById('scoreLabel').style.padding = '0vw';
				camera = [0, 0];
		globalBulletSpeed = (300*scale)*2;
		NORMAL_BULLET_SIZE = shipSize*0.3*scale;
		NORMAL_BULLET_DAMAGE = 51;
		setAllTankSpeeds(300* scale);
		SHOT_RATE = 0.93;	//match music tempo			
		introTitle.innerHTML  = 'Tanx Cuz';
		//reset intro div back to normal
		introDiv.style.height = '100vh';
		introDiv.style.top  = '0vh';
		
		introDiv.style.display = 'block';
		
		introTitle.style.bottom  = '40vh';			
		introIconOne.style.bottom  = '40vh';
		introIconTwo.style.bottom  = '40vh';
		
		introTitle.style.opacity  = '0.0';
		introIconOne.style.opacity  = '0.0';
		introIconTwo.style.opacity  = '0.0';
		
		helpText.style.display = 'block';
		helpText.style.top = '110vh';
		helpText.style.left = '70vw';
		helpText.innerHTML = '';
		//fade title and icons in
		var firstTimer = setTimeout(function()
		{
			introTitle.style.opacity  = '1.0';
			introIconOne.style.opacity  = '1.0';
			introIconTwo.style.opacity  = '1.0';
			shewlase.currentTime = 0;
			shewlase.play();
			setTimeout(function()
			{
				playButton.style.opacity = '1.0';
			},2000);
		},500);
		introTimers.push(firstTimer); */	
		
		
		
	}
	else if(gameMode == 'normal')
	{
		globalBulletSpeed = (300*scale)*2;
		NORMAL_BULLET_SIZE = shipSize*0.3*scale;
		NORMAL_BULLET_DAMAGE = 51;
		setAllTankSpeeds(300* scale);
		SHOT_RATE = 1;
		// addCSWalls();
		// addTree(400, 400, 200);		
		setTimeout(function()
		{
			addTree(500, 300, 250);
			addTree(400, 600, 250);
			addTree(900, 400, 350);
			
			// allWalls.push([200, 200, 200, 400]);
			// addTree(1200, 600, 300);
			// addTree(150, 550, 350);
			//must respawn after walls for collide detect
			playersTank.randomRespawn(true);//need to split to randomPosition()
		}, 2100);
		// showFog = true;
	}
	else if(gameMode == 'zombies')
	{
		
		var zombieX = zombieGamePosition[0]*w;
		var zombieY = zombieGamePosition[1]*h;
	
		globalBulletSpeed = (300*scale)*2;	
		NORMAL_BULLET_SIZE = shipSize*0.3*scale;
		NORMAL_BULLET_DAMAGE = 51;		
		SHOT_RATE = 1;
		setTimeout(function()
		{
			// addCSWalls();
			//should be spawn points, together
			// playersTank.randomRespawn(true);//need to split to randomPosition()
			//delay setting speed so boost and slow methods dont mess with it
			setAllTankSpeeds(300*scale);
		}, 2100);
		setTimeout(function()
		{
			playersTank.randomRespawn(true);//need to split to randomPosition()
			// reloadSound.currentTime = 0;
			// reloadSound.play();			
			playSound(reloadSound);
			
			allWalls.push([(zombieX-boundaryThickness+mapWidth*0.8)*scale, (zombieY-boundaryThickness)*scale, mapWidth*0.25*scale, boundaryThickness*scale]); //top boundary
			helpText.style.display = 'none';
			helpText.innerHTML = '';
		}, 3000);
		showScoreLabel();
		initZombies();
		cameraCentered = false;
		transitionCamera = true;
		xTransition = Math.abs(camera[0] - zombieGamePosition[0]*mapWidth*scale);
		yTransition = Math.abs(camera[1] - zombieGamePosition[1]*mapHeight*scale);
		helpText.style.display = 'block';
		helpText.style.top = '20vh';
		helpText.style.left = '10vw';
		helpText.innerHTML = 'Zombies: <br> Survive!';
		
		for (var i = 0; i < playerObjectsList.length; i++) 
		{
			var tank = playerObjectsList[i];
			// tank.gameX = (w*0.5)*scale;
			// tank.gameY = ((h*0.70)+i*50)*scale;	
			// tank.gameX = (w*0.5+(zombieGamePosition[0]*w))*scale;
			// tank.gameY = ((h*0.70+(zombieGamePosition[1]*h))+i*50)*scale;	
		
			// tank.moveAngle = Math.random()*360;	
			tank.primaryGun = 'normal';
			tank.canShoot = true;
			tank.ammo = tank.maxAmmo;
			// tankToPos.speed *= scale;
		}
		// playersTank.randomRespawn(true);
		// limitedAmmo = true;
		//
	}
	else if(gameMode == 'race')
	{
		globalBulletSpeed = (300*scale)*3;
		// setAllTankSpeeds(300* scale*1.5);
		
		SHOT_RATE = 1;//changes with guns
		NORMAL_BULLET_SIZE = shipSize*0.6;
		
		NORMAL_BULLET_DAMAGE = 0;
		// updateScoreLabel();
			showScoreLabel();
		// checkPoints = [];	
		// divBlinkIn('intro');
		helpText.style.display = 'block';
		helpText.style.top = '70vh';
		helpText.style.left = '65vw';
		helpText.innerHTML = 'Race <br> 3 laps to win.';
		// limitedAmmo = true;
		// setTimeout(function()
		// {
			//change map, set player positions to start line
			// var w = mapWidth;
			// var h = mapHeight;
			cameraCentered = false;
			//needs to transition
			transitionCamera = true;
			xTransition = Math.abs(camera[0] - raceGamePosition[0]*w*scale);
			yTransition = Math.abs(camera[1] - raceGamePosition[1]*h*scale);
		if(isTouchscreen)
		{
			// var newButton2 = new Button(0.8*canvasWidth, 0.55*canvasHeight+0.45*joystickSize, joystickSize);
			// allButtons.push(newButton2);
			allButtons[1].x = 0.8*canvasWidth;
			allButtons[1].recalcClickableX();
		}
		
			//Puts players at start line

				//changemap here, so its behind div
			// addRaceWalls();//adds checkpoints and hazards
			// addHugeRaceWalls();//adds checkpoints and hazards
			addRacePickupsAndHazards();	
// allWalls.push([raceX+mapWidth, raceY, boundaryThickness, mapHeight*0.7]); //right boundary
			//to close boundary	
			setTimeout(function()
			{
				// should be on click of Ready!
				// divBlinkOut();				
				helpText.style.display = 'none';
				allWalls.push([(raceGamePosition[0]*mapWidth+mapWidth)*scale, (raceGamePosition[1]*mapWidth+mapHeight*0.7)*scale, boundaryThickness*scale, (mapHeight*0.4)*scale]);
				for (var i = 0; i < playerObjectsList.length; i++) 
				{
					var tank = playerObjectsList[i];
					// tank.gameX = (w*0.5)*scale;
					// tank.gameY = ((h*0.70)+i*50)*scale;	
					tank.gameX = (w*0.5+(raceGamePosition[0]*w))*scale;
					tank.gameY = ((h*0.70+(raceGamePosition[1]*h))+i*50)*scale;	
				
					tank.moveAngle = 270;	
					tank.currentLap = 1;
					tank.currentCheckpoint = 0;
					tank.primaryGun = 'none';
					//start placed as staggered
					tank.racePlacing = i+1;
					tank.distanceFromLastCheckpoint = 0;
					tank.currentCheckpoint = 0;
					tank.placeChecker = 0;
					tank.canShoot = true;
					// tankToPos.speed *= scale;
				}
				raceStartTime = new Date().getTime();
				setAllTankSpeeds(0);
			},3000);
		// }, 2000);		
		//or on 'ready click'
	}
	else if(gameMode == 'select')	
	{
		//need a from which mode? how to position all tanks, 
			//or always in middle
		if(previousMode == 'race')
		{
			setAllTankPositions(190*scale, 790*scale);
			if(isTouchscreen)
			{
				// allButtons.pop();
				allButtons[1].x = 1.1*canvasWidth;
				allButtons[1].recalcClickableX();
			}
		}
		else if(previousMode == 'cs')
		{
			setAllTankPositions(1590*scale, 630*scale);	
			//remove all bots from scorelabel
			//use enemies.length before set to []
			var list = document.querySelector('#scoreLabel ul');			
			list.children[1].remove();
			updateScoreLabel();
		}
		else //no previous mode?
		{
			setAllTankPositions(760*scale, 420*scale);	
			// setAllTankPositions(760*scale, 420*scale+mapHeight);	
			// camera = [0, mapHeight*1.3*scale]
			
		}

		if(previousMode != 'select' && previousMode != 'intro' && previousMode != 'studio')
		{
			allWalls.pop();
		}		
		backToModeSelect();
		setTimeout(function()
		{
			setAllTankSpeeds(300*scale);
		},2100);
	}
	else if(gameMode == 'studio')	
	{
		SHOT_RATE = 0.25;
		cameraCentered = false;
		//needs to transition
		// transitionCamera = true;
		// xTransition = Math.abs(camera[0] - raceGamePosition[0]*w*scale);
		// yTransition = Math.abs(camera[1] - raceGamePosition[1]*h*scale);
		camera = [studioGamePosition[0]*w*scale, studioGamePosition[1]*h*scale];
	}
	setTimeout(function()
	{
		// rescaleWalls();//and checkpoints
		// if(cameraCentered)
		// {
			// centerCameraOnPlayer();
		// }
		//changemap here, so its behind div
	},2100);
	if(gameMode != 'intro' && gameMode != 'select' && gameMode != 'studio')
	{
		countDownDiv.style.display = 'block';
		startCountDown();//could have second amount
	}
	if(gameMode != 'zombies')
	{
		allTanks = playerObjectsList.concat(enemies);
	}
	else
	{
		allTanks = playerObjectsList;
	}
}

function playButtonPressed(pressedByMouse)
{
	if(pressedByMouse)
	{
		// alert('mouse!');
		isTouchscreen = false;
		
	}
	else
	{		
		// alert('touch!');
		isTouchscreen = true;
		addJoystickAndButton();
		// if(touchable) 
		// {
			canvas.addEventListener( 'touchstart', onTouchStart, false );
			canvas.addEventListener( 'touchmove', onTouchMove, false );
			canvas.addEventListener( 'touchend', onTouchEnd, false );
			allTouches = [];
		// }		
	}
	
	playButton.removeEventListener( 'touchstart', function()
	{
		playButtonPressed(false);
	}, false );
	
	playButton.removeEventListener( 'mousedown', function()
	{
		playButtonPressed(true);
	}, false );
	
	setMode(gameMode);
	divBlinkOut();	
	// musicOne.currentTime = 0;
	// musicOne.play();
	// musicLoop = setInterval(function()
	// {
		// if(!playFull)
		// {
			// musicOne.currentTime = 0;
			// musicOne.play();
		// }
		// else
		// {
			// musicTwo.currentTime = 0;
			// musicTwo.play();
		// }

	//only if no mode set?
	setTimeout(function()
	{
		canvas.focus();
	}, 3000);
	
}

//x ys will be center x ys
//return true if wall between fromXY and toXY
function rayCheckWallBetween(fromX, fromY, toX, toY, angle)
{
	// var angleBetween = Math.atan2(toX - fromX, -(toX - fromY));
	var angleBetween = angle;
	var startX = fromX;
	var startY = fromY;
	var checkX = startX;
	var checkY = startY;
	
	var distanceBetween = getDistanceBetween(fromX, fromY, toX, toY);
		
	var checkPointCollided = false;
	var loopCounter = 0;//could just check distance of ray
	
	//check for collisions
	while(!checkPointCollided)
	{
		//if check point hits wall
		var hitWall = collidesWithAnyWall(checkX, checkY, 1)[0]=='true';
		if(hitWall)
		{				
			checkPointCollided = true;
		}			
		
		if(!checkPointCollided)
		{
			//move check point forward
			checkX += 20*scale*Math.sin(angleBetween);
			checkY -= 20*scale*Math.cos(angleBetween);
			ctx.beginPath();
			ctx.moveTo(fromX-csGamePosition[0]*mapWidth*scale, fromY-csGamePosition[1]*mapWidth*scale);
			ctx.lineTo(checkX-csGamePosition[0]*mapWidth*scale, checkY-csGamePosition[1]*mapWidth*scale);
			ctx.strokeStyle = "red";
			ctx.stroke();
			
			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.arc(checkX, checkY, shipSize/16, 0, 2 * Math.PI);
			ctx.fill();
			
			var currentCheckDistance = getDistanceBetween(fromX, fromY, checkX, checkY);
			if(currentCheckDistance >= distanceBetween)
			{
				checkPointCollided = false;
				break;
			}
		}
		//stops infinite loop
		//needs check if reached toXY (checkDistance > distanceBetween)
		if(loopCounter > 150)
		{
			// alert('boop');
			
			// break;
			checkPointCollided = true;
		}
		loopCounter++;
	}
	return checkPointCollided;
}

function playIntro()
{
	// document.getElementById('scoreLabel').style.display = 'none';
		
		document.getElementById('scoreLabel').style.height = '0px';
		document.getElementById('scoreLabel').style.padding = '0vw';
		// cameraCentered = false;
		// camera = [0, 0];
		// globalBulletSpeed = (300*scale)*2;
		// NORMAL_BULLET_SIZE = shipSize*0.3*scale;
		// NORMAL_BULLET_DAMAGE = 51;
		// setAllTankSpeeds(300* scale);
		// SHOT_RATE = 0.93;	//match music tempo			
		introTitle.innerHTML  = 'Tanx Cuz';
		//reset intro div back to normal
		introDiv.style.height = '100vh';
		introDiv.style.top  = '0vh';
		
		introDiv.style.display = 'block';
		
		introTitle.style.bottom  = '40vh';			
		introIconOne.style.bottom  = '40vh';
		introIconTwo.style.bottom  = '40vh';
		
		introTitle.style.opacity  = '0.0';
		introIconOne.style.opacity  = '0.0';
		introIconTwo.style.opacity  = '0.0';
		
		helpText.style.display = 'block';
		helpText.style.top = '110vh';
		helpText.style.left = '70vw';
		helpText.innerHTML = '';
		//fade title and icons in
		var firstTimer = setTimeout(function()
		{
			introTitle.style.opacity  = '1.0';
			introIconOne.style.opacity  = '1.0';
			introIconTwo.style.opacity  = '1.0';
			// shewlase.currentTime = 0;
			// shewlase.play();
			playSound(shewlase);
			setTimeout(function()
			{
				playButton.style.opacity = '1.0';
			},2000);
		},500);
		introTimers.push(firstTimer);		
}

function startTutorial()
{
	//blink div out
		//add music
		// var blinkOutTimer = setTimeout(function()
		// {
			// musicOne.currentTime = 0;
			// musicOne.play();
			// musicLoop = setInterval(function()
			// {
				// if(!playFull)
				// {
					// musicOne.currentTime = 0;
					// musicOne.play();
				// }
				// else
				// {
					// musicTwo.currentTime = 0;
					// musicTwo.play();
				// }				
			// }, 3720)
			// divBlinkOut();			
		// },4000);
		// introTimers.push(blinkOutTimer);
		//position tanks
		for (var i = 0; i < playerObjectsList.length; i++) 
		{
			var tank = playerObjectsList[i];
			tank.gameX = mapWidth*scale*0.5 +i*shipSize;
			tank.gameY = mapHeight*scale*0.4;			
			tank.canShoot = false;//set true when picked ammo
		}
		if(!isTouchscreen)
		{
			// drawKeyboardLetter(ctx, x, y+height+10*scale, keySize, ' ', false);
			// drawKeyboardLetter(ctx, x+keySize+5*scale, y+height+10*scale, keySize, ' ', false);
			var wX = mapWidth*scale/2;
			var wy = mapHeight*scale*1.0;//start off screen
			var keySize = 80*scale;
			//add keys and animate them into screen
			var keysEnterTimer = setTimeout(function()
			{
				keyboardLetters.push([wX, wy, keySize, 'W', true]);
				keyboardLetters.push([wX, wy+keySize*1.1, keySize, 'S', false]);
				keyboardLetters.push([wX-keySize*1.1, wy+keySize*1.1, keySize, 'A', false]);
				keyboardLetters.push([wX+keySize*1.1, wy+keySize*1.1, keySize, 'D', false]);
				
				// keyboardLetters.push([wX+4*keySize, wy, keySize, ' ↑', true]);
				// keyboardLetters.push([wX+4*keySize, wy+keySize*1.1, keySize, '↓', false]);
				// keyboardLetters.push([wX-keySize*1.1+4*keySize, wy+keySize*1.1, keySize, '←', false]);
				// keyboardLetters.push([wX+keySize*1.1+4*keySize, wy+keySize*1.1, keySize, '→', false]);
				introStartTime = new Date().getTime();
				helpText.style.top = '70vh';
				helpText.innerHTML = 'Use keys <br> to move';
				
				canvas.focus();
			}, 2000);		
			introTimers.push(keysEnterTimer);
			//add first pickup
			
			
			keyboardAnimateLooper = setInterval(function()
			{
				var key = keyboardLetters[Math.floor(Math.random() * keyboardLetters.length)];
				if(key != null)
				{				
					key[4] = !key[4];
				}
			}, 300);
			introTimers.push(keyboardAnimateLooper);
		}
		else
		{
			var joystickEnterTimer = setTimeout(function()
			{
				introStartTime = new Date().getTime();
				helpText.style.top = '70vh';
				helpText.style.left = '20vw';
				helpText.innerHTML = 'Use joystick <br> to move';
				
				canvas.focus();
			}, 2000);	
			introTimers.push(joystickEnterTimer);
		}		
		
		
		var firstPickupTimer = setTimeout(function()
		{
			activePickups.push(new Pickup(860*scale, 80*scale, 1.5*shipSize, 'speed'));
			helpText.style.top = '10vh';
			helpText.style.left = '75vh';
			helpText.innerHTML = 'Move to<br> pickup to use';
		}, 6000);
		introTimers.push(firstPickupTimer);
		
}

function addJoystickAndButton()
{
	joystickSize = 200*scale;
	var joystickOne = new Joystick(0.08*canvasWidth, 0.65*canvasHeight, joystickSize, joystickSize);
	// var joystickOne = new Joystick(0.08*canvasWidth, 0.35*canvasHeight, joystickSize, joystickSize);
	// var joystickTwo = new Joystick(0.80*canvasWidth, 0.7*canvasHeight, joystickSize, joystickSize);
	var newButton = new Button(0.69*canvasWidth, 0.65*canvasHeight+0.45*joystickSize, joystickSize);
	var newButton2 = new Button(1*canvasWidth, 0.55*canvasHeight+0.45*joystickSize, joystickSize);
			
	allJoysticks = [];
	allButtons = [];
	allJoysticks.push(joystickOne);
	allButtons.push(newButton);
	allButtons.push(newButton2);
	// allJoysticks.push(joystickTwo);
	stickYChange = 0;
	stickXChange = 0;
	maxStickChange = 0.25*joystickSize;
	minStickMovement = 0.1*joystickSize;
	
	
	
	// x, y, width
	// allButtons = [];
	// var newButton = new Button(0.7*canvasWidth, 0.7*canvasHeight+0.45*joystickSize, joystickSize);
	// allButtons.push(newButton);
}
var countDownTimer;
//3/3000 could be parameter i.e. countDownFrom
function startCountDown()
{
	var timeStarted = new Date().getTime();
	countDownTimer = setInterval(function()
	{
		var timeSinceStart = new Date().getTime() - timeStarted;
		var numberToDisplay = 3 - Math.floor(timeSinceStart/1000);
		countDownNumbers.innerHTML = numberToDisplay;
	}, 200);
	setTimeout(function()
	{
		clearInterval(countDownTimer);
		countDownNumbers.innerHTML = 'GO!';
		setTimeout(function()
		{
			countDownDiv.style.display = 'none';
			countDownNumbers.innerHTML = '3';
		}, 1000);
	}, 3000);
}
 
function startMode(modeName)
{
	gameMode = modeName;
	if(gameMode == 'cs')
	{
		startCS();
	}
	else if(gameMode == 'intro')
	{
		// backToModeSelect();		
	}
	else if(gameMode == 'zombies')
	{
	}
	else if(gameMode == 'race')
	{
		startRace();
	}
	// helpText.style.display = 'none';
}

function showScoreLabel()
{
	document.getElementById('scoreLabel').style.height = 'auto';		
	document.getElementById('scoreLabel').style.padding = '1vw';
	updateScoreLabel();
}

function hideScoreLabel()
{
	document.getElementById('scoreLabel').style.height = '0px';
	document.getElementById('scoreLabel').style.padding = '0vw';
}

function resetAllKillCounts()
{
	for(var t = 0; t < playerObjectsList.length; t++)
	{
		var tank = playerObjectsList[t];
		tank.killCount = 0;
	}
}

//sets all tanks to correct speeds, changes mode, 
function backToModeSelect()
{
	//set back to normal control/speed
	gameMode = 'select';
	activePickups = [];
	hideScoreLabel();
	centerCameraOnPlayer();
	cameraCentered = true;
	globalBulletSpeed = (300*scale)*2;
	NORMAL_BULLET_SIZE = shipSize*0.3*scale;
	NORMAL_BULLET_DAMAGE = 0;//should be 0?
	setAllTankSpeeds(300*scale);
	SHOT_RATE = 0.93;	//match music tempo	
	resetAllKillCounts(); //laps too?
	//set all health to full?
}

var transitionCamera = false;
var xTransition;
var yTransition;
var raceGamePosition = [-1.1, 0]; //x and y
var csGamePosition = [1.1, 0]; //x and y
var zombieGamePosition = [0, 1.3]; //x and y
var studioGamePosition = [-0.5, -1.5]; //x and y
function startRace()
{
	gameMode = 'race';
	globalBulletSpeed = (300*scale)*3;
	// setAllTankSpeeds(300* scale*1.5);
	setAllTankSpeeds(0);
	SHOT_RATE = 1;//changes with guns
	NORMAL_BULLET_SIZE = shipSize*0.6;
	
	NORMAL_BULLET_DAMAGE = 0;
	updateScoreLabel();
	// checkPoints = [];	
	// divBlinkIn('intro');
	
	// limitedAmmo = true;
	// setTimeout(function()
	// {
		//change map, set player positions to start line
		
		var w = mapWidth;
		var h = mapHeight;
		cameraCentered = false;
		//needs to transition
		transitionCamera = true;
		xTransition = Math.abs(camera[0] - raceGamePosition[0]*w*scale);
		yTransition = Math.abs(camera[1] - raceGamePosition[1]*h*scale);
		// camera = [raceGamePosition[0]*w*scale, raceGamePosition[1]*h*scale];
		//Puts players at start line
		for (var i = 0; i < playerObjectsList.length; i++) 
		{
			var tank = playerObjectsList[i];
			tank.gameX = (w*0.5+(raceGamePosition[0]*w))*scale;
			tank.gameY = ((h*0.70+(raceGamePosition[1]*h))+i*50)*scale;	
			tank.moveAngle = 270;	
			tank.currentLap = 1;
			tank.currentCheckpoint = 0;
			tank.primaryGun = 'none';
			//start placed as staggered
			tank.racePlacing = i+1;
			tank.distanceFromLastCheckpoint = 0;
			tank.currentCheckpoint = 0;
			tank.placeChecker = 0;
			tank.canShoot = true;
			// tankToPos.speed *= scale;
		}
		showScoreLabel();
			//changemap here, so its behind div
		// addHugeRaceWalls();//adds checkpoints and hazards
		//only need to add last wall
		// allWalls.push([raceGamePosition[0]*w+w, raceGamePosition[1]*h+y, boundaryThickness, h+ boundaryThickness]); //right boundary
	
		// addBoundaryAt(raceGamePosition[0]*w*scale, raceGamePosition[1]*h*scale);
		addRacePickupsAndHazards();
		// scaleCheckPoints();
		// addBoundaryAt(0,0);//needs to take xy to put
		// setTimeout(function()
		// {
			//should be on click of Ready!
			// divBlinkOut();
		// },2000);
	// }, 2000);	
}

function startCS()
{
	gameMode = 'cs';
	globalBulletSpeed = (300*scale)*8;//not needed with rayCast?
	setAllTankSpeeds(300* scale);
	NORMAL_BULLET_SIZE = shipSize*0.3*scale;
	// SHOT_RATE = 0.3;
	SHOT_RATE = 0.3;
	SECONDARY_SHOT_RATE = 3; //3
	NORMAL_BULLET_DAMAGE = 20;
	showScoreLabel();
	
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		var tank = playerObjectsList[i];
		//put to spawnpoints
		// tank.gameX = (w*0.5+(raceGamePosition[0]*w))*scale;
		// tank.gameY = ((h*0.70+(raceGamePosition[1]*h))+i*50)*scale;	
		tank.primaryGun = 'normal';
		tank.canShoot = true;
	}
	// cameraCentered = false;
	// camera = [csGamePosition[0]*mapWidth*scale, csGamePosition[1]*mapHeight*scale];
		
}
function showMousePic()
{
	var drawMouseX = mapWidth*scale/3;
	var drawMouseY = mapHeight*scale*0.6;
	var mouseWidth = 165*scale;
	var mouseHeight = 165*scale;
	var keySize = 80*scale;
	mouse = [drawMouseX, drawMouseY, mouseWidth, mouseHeight];
	// mouseButtons.push([drawMouseX, drawMouseY+mouseHeight+10*scale, keySize, ' ', false]);
	// mouseButtons.push([drawMouseX+keySize+5*scale, drawMouseY+mouseHeight+10*scale, keySize, ' ', false]);
	mouseButtons.push([drawMouseX, drawMouseY-keySize+5*scale, keySize, ' ', false]);
	mouseButtons.push([drawMouseX+keySize+5*scale, drawMouseY-keySize+5*scale, keySize, ' ', false]);
	var maxMouseMove = 50*scale;
	mouseAnimateLooper = setInterval(function()
	{
		//different list for mouse keys?
		// var key = mouseButtons[Math.floor(Math.random() * mouseButtons.length)];
		var key = mouseButtons[0];//only left
		key[4] = !key[4];
		setTimeout(function()
		{
			var randomX = drawMouseX + (Math.random()*maxMouseMove) - maxMouseMove/2;
			var randomY = drawMouseY + (Math.random()*maxMouseMove) - maxMouseMove/2;
			mouse[0] = randomX;
			mouse[1] = randomY;
		}, 200);
	}, 300);
}

canvas.onmousemove = function(e)
{
	/* angleToMouse = Math.atan2(e.pageX - shipX-0.5*shipSize, -(e.pageY - shipY-0.5*shipSize) ); */
	// mouseX = e.pageX/scale-camera[0];
	// mouseY = e.pageY/scale-camera[1];
	mouseX = e.pageX;
	mouseY = e.pageY;
	if(playersTank != null)
	{		
		turretFaceMouse();
	}
 }
 
 //stop menu on canvas
canvas.oncontextmenu = function() 
{
    return false;
}
 
 //send this when bullet created?
 var testX;
 var testY; 
function turretFaceMouse()
{
	// var mouseGameX = mouseX*(1/scale)+camera[0];
	// var mouseGameY = mouseY*(1/scale)+camera[1];
	var mouseGameX = mouseX+camera[0];
	var mouseGameY = mouseY+camera[1];
	testX = mouseGameX;
	testY = mouseGameY;
	// playersTank.turretAngle = Math.atan2(mouseX - playersTank.xPosition-0.5*playersTank.size, -(mouseY - playersTank.yPosition-0.5*playersTank.size) );
	// playersTank.turretAngle = Math.atan2(mouseX - playersTank.xOnScreen-0.5*playersTank.size, -(mouseY - playersTank.yOnScreen-0.5*playersTank.size) );
	// playersTank.turretAngle = Math.atan2(mouseX*(1/scale)+camera[0] - playersTank.gameX-0.5*playersTank.size, -(mouseY*(1/scale)+camera[1] - playersTank.gameY-0.5*playersTank.size) );
	playersTank.turretAngle = Math.atan2(mouseGameX - (playersTank.centerX), -(mouseGameY - (playersTank.centerY)));
	// showScoreAtTank(playersTank, Math.round(mouseX*(1/scale)+camera[0])+' and '+Math.round(mouseY*1/scale+camera[1]));
	// playersTank.turretAngle = Math.atan2(mouseX - playersTank.gameX-0.5*playersTank.size, -(mouseY - playersTank.gameY-0.5*playersTank.size) );
	playersTank.turretAngle = playersTank.turretAngle*(180/Math.PI);
}

function shieldOn(tank)
{
	tank.state = 'shielded';
	//need to clear this timer if cast again before time up
	setTimeout(function()
	{
		tank.state = 'normal';
	}, 1500);	
}
function shootRaceWeapon(mouseShot)
{
	if(playersTank.primaryGun == 'shot')
	{
		//will be different x y for pressing space		
		if(!mouseShot)
		{
			// playerShootsMouse(mouseX,mouseY);
			playerShoots(false);
			//shoot in direction of moveangle
		}
		else
		{
			playerShoots(true);
		}
		playersTank.primaryGun = 'none';
	}
	else if(playersTank.primaryGun == 'homing')
	{
		shootHoming(playersTank);
		thisClient.emit('shootHoming', playerObjectsList.indexOf(playersTank));
		playersTank.primaryGun = 'none';
	}
	else if(playersTank.primaryGun == 'mine')
	{
		placeMine(playersTank);
		thisClient.emit('addMine', playerObjectsList.indexOf(playersTank));
		playersTank.primaryGun = 'none';
	}
	else if(playersTank.primaryGun == 'boost')
	{
		boost(playersTank);
		playersTank.primaryGun = 'none';
	}
	else if(playersTank.primaryGun == 'none')
	{
		//do nothing, maybe play fail noise, empty gun
		//   car horn/beep, all different lol
	}
	else if(playersTank.primaryGun == 'shield')
	{
		shieldOn(playersTank);
		thisClient.emit('shieldMe', playerObjectsList.indexOf(playersTank));
		playersTank.primaryGun = 'none';				
	}
	//	playersTank.primaryGun = 'none';	
}
function checkMouseHitInstrument()
{
	var gameMouseX =  Math.round(mouseX+camera[0])/scale;
	var gameMouseY =  Math.round(mouseY+camera[1])/scale;
		// debugSquares.push([gameMouseX, gameMouseY, 5, 5, 'red']);
	// var hitInstrument = false;	
	for(i = 0; i < instruments.length; i++)
	{
		var instrument = instruments[i];
		if(collides(gameMouseX, gameMouseY, 5, 5, instrument[1], instrument[2], instrument[3], instrument[4]))
		{
			playSound(instrument[5]);
			hitInstrument = true;
		}
	}
}
var beatTimer;
canvas.onmousedown = function(e)
{
	//only if left click?
	// better to have gameOver/stageWon variable
	if(e.which == 1 && playersTank.alive)//left click
	{
		if(gameMode == 'race')
		{
			shootRaceWeapon(true);			
		}
		else if(gameMode == 'studio') //should be studio
		{
			//check click of instruments
			checkMouseHitInstrument();
			// if(!hitInstrument)
			// {
				// playerShoots(true);
			// }
			
			heldDown = true;
			clearInterval(beatTimer);
			beatTimer = setInterval(function() 
			{ 			
				checkMouseHitInstrument();
			},SHOT_RATE*1000);
		}
		else
		{
			playerShoots(true);
			//for auto shoot on click held
			heldDown = true;
			clearInterval(beatTimer);
			beatTimer = setInterval(function() 
			{ 			
				playerShoots(true);
			},SHOT_RATE*1000);
		}
		
	}
	else if(e.which == 3)//right click
	{
		//could be tank.secondaryShoot		
		//grenade, could start cook time
		if(gameMode == 'cs')
		{
			playerShootGrenade(mouseX, mouseY);
		}
		else
		{
			
		}		
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



var movementTouch;

var movementTouchStart = [];
var movementTouchID = null;
var acceleratorTouchID = null;

function onTouchStart(e) {
 
	//check if in joystick, add to activeTouches
	// set start position, then check changes to decide which direction
	allTouches = e.touches; 
	
	
	var newTouch = allTouches[allTouches.length-1];
	var touchX = newTouch.clientX;
	var touchY = newTouch.clientY;
	var joystick = allJoysticks[0];
	var buttonA = allButtons[1];
	var buttonB = allButtons[0];
	//need 8/9 areas, udlr, diagonals, center
	// if(collides(joystick[0], joystick[1], joystick[2], joystick[2], touchX, touchY, 3, 3)
	if(collides(joystick.x, joystick.y, joystick.width, joystick.height, touchX, touchY, 3, 3)//i.e. no current movement touch
	&& movementTouchID == null)//i.e. no current movement touch
	{
		//last item
		// moveTouches.push(newTouch);
		movementTouch = newTouch;
		movementTouchID = newTouch.identifier;
		movementTouchStart = [touchX, touchY];
	}
	else if(collides(buttonB.clickableX,buttonB.y,buttonB.clickableWidth,buttonB.clickableHeight, touchX, touchY, 3, 3))
	{
		//special weapon (boost, race shoot)
		buttonDown(0);
		acceleratorTouchID = newTouch.identifier;
	}
	else if(collides(buttonA.clickableX,buttonA.y,buttonA.clickableWidth,buttonA.clickableHeight, touchX, touchY, 3, 3))
	{
		//accelerate
		buttonDown(1);
		
	}
	else//if not tap in joystick or button
	{
		mouseX = touchX;
		mouseY = touchY;
		if(gameMode == 'race')
		{			
			shootRaceWeapon(true);
		}
		else
		{
			playerShoots(true);
		}
	}	
}

//
function buttonDown(buttonIndex)
{
	//animate the change
	allButtons[buttonIndex].sideDistanceFromTop = 0.035*allButtons[0].width;
	//if index = 0, special else, accelerate?
	if(buttonIndex == 0)
	{		
		useSpecialWeapon();
	}
	else if(buttonIndex == 1 && gameMode == 'race')
	{
		playersTank.acceleration = 150*scale;
		playersTank.moveKeysHeld = 1;
		playersTank.upDown = true;
	}
}

//
function buttonUp(buttonIndex)
{	
	allButtons[buttonIndex].sideDistanceFromTop = 0;
	if(buttonIndex == 0)
	{	
	}
	else if(buttonIndex == 1 && gameMode == 'race')
	{
		playersTank.acceleration = -300*scale;			
		playersTank.upDown = false;
		playersTank.moveKeysHeld = 0;
	}	
}

function onTouchMove(e)
{
	 // Prevent the browser from doing its default thing (scroll, zoom)
	e.preventDefault();
	allTouches = e.touches; 
	var movingTouch = e.changedTouches[0];
	// if is moveTouch, calculate direction
	// movementTouchID!=null && 
	if(movingTouch!=null && movingTouch.identifier == movementTouchID)
	{
		//do movement calculation
		var moveStartX = movementTouchStart[0];
		var moveStartY = movementTouchStart[1];
		var touchX = movingTouch.clientX;
		var touchY = movingTouch.clientY;
		stickXChange = moveStartX-touchX;
		stickYChange = moveStartY-touchY;
		//should be linked to movementTouch somehow
		var stickAngle = Math.atan2(touchX - moveStartX-0.5*2, -(touchY - moveStartY-0.5*2))*180/Math.PI;
		if(stickAngle < 0)
		{
			stickAngle = 360+stickAngle;
		}
		allJoysticks[0].changeAngle = stickAngle;
		var fakeKeyCode = 0;
		var newMoveAngle = 0;
		var thisIndex = playerObjectsList.indexOf(playersTank);
		// playersTank.stopMoving(); 
		
		if(stickAngle > 337.5 && stickAngle < 360 
		|| stickAngle > 0 && stickAngle < 22.5)
		{//UP
			newMoveAngle = 0;
		}
		else if(stickAngle > 22.5 && stickAngle <= 67.5)
		{//UP RIGHT
			newMoveAngle = 45;
		}
		else if(stickAngle > 67.5 && stickAngle <= 112.5)
		{//RIGHT
			if(gameMode == 'race')
			{
				playersTank.rightDown = true;
			}
			else
			{				
				newMoveAngle = 90;
			}
		}		
		else if(stickAngle > 112.5 && stickAngle <= 157.5)
		{//DOWN RIGHT
			newMoveAngle = 135;
		}	
		else if(stickAngle > 157.5 && stickAngle <= 202.5)
		{//DOWN
			newMoveAngle = 180;
		}
		else if(stickAngle > 202.5 && stickAngle <= 247.5)
		{//DOWN LEFT
			newMoveAngle = 225;
		}		
		else if(stickAngle > 247.5 && stickAngle <= 292.5)
		{//LEFT		
			if(gameMode == 'race')
			{
				playersTank.leftDown = true;
			}
			else
			{
				newMoveAngle = 270;
			}
		}
		else if(stickAngle > 292.5 && stickAngle <= 337.5)
		{//UP LEFT			
			newMoveAngle = 315;
		}
		
		if(gameMode == 'race' && stickAngle > 0 && stickAngle <= 135)
		{//RIGHT FOR RACE		
			playersTank.turnAmount = stickAngle/135 * ROTATE_SPEED/3
			if(playersTank.leftDown)
			{
				playersTank.leftDown = false;
			}
			playersTank.rightDown = true;	
		}
		else if(gameMode == 'race' && stickAngle > 225 && stickAngle <= 359)
		{//LEFT	FOR RACE	 		
			playersTank.turnAmount = (360-stickAngle)/135 * ROTATE_SPEED/3			
			if(playersTank.rightDown)
			{
				playersTank.rightDown = false;
			}
			playersTank.leftDown = true;
		}
		playersTank.isMoving = true;
		playersTank.moveKeysHeld = 1;
		playersTank.newAngle = newMoveAngle;	
		//how only send if changed? 
		//     newMoveAngle != playersTank.newAngle
		if(playersTank.alive)
		{
			var arrayIndexAndAngle = 
			{
				index: thisIndex,
				angle: newMoveAngle
			}
			thisClient.emit('newMoveAngle',arrayIndexAndAngle);
		}
		
		
		
		//don't need this yet?
		if(stickXChange > maxStickChange)
		{
			stickXChange = maxStickChange;
		}
		else if(stickXChange < -maxStickChange)
		{
			stickXChange = -maxStickChange;
		}
		if(stickYChange > maxStickChange)
		{
			stickYChange = maxStickChange;
		}
		else if(stickYChange < -maxStickChange)
		{
			stickYChange = -maxStickChange;
		}
		allJoysticks[0].stickXChange = stickXChange;
		allJoysticks[0].stickYChange = stickYChange;
		
		var xDifference = stickXChange;
		var yDifference = stickYChange;
		
		if(xDifference < 0)
		{
			xDifference = -xDifference;
		}
		if(yDifference < 0)
		{
			yDifference = -yDifference;
		}
		
		
		// stop moving if joystick not dragged further than 10 px				
		// if(yDifference < 0.2*joystickSize)
		// {
			// playersTank.stopMoving();
		// }
		// if(xDifference < 0.2*joystickSize)
		// {
			// playersTank.stopMoving();		
		// }
	}	
} 

function onTouchEnd(e) 
{    
   	allTouches = e.touches; 
	var endedTouch = e.changedTouches[0];
	// if(e is onjoystick)  stop all moving  
	// if(movingTouch!=null && movementTouch.identifier == movementTouchID)
	if(endedTouch.identifier == movementTouchID)
	// if(e.touches.length == 0)//need to check which touch ended
	{		
		movementTouchID = null;
		movementTouchStart = [];
		allJoysticks[0].stickXChange = 0;
		allJoysticks[0].stickYChange = 0;
		playersTank.stopMoving();
		playersTank.turnAmount = null;
		thisClient.emit('stopMoving', playerObjectsList.indexOf(playersTank));
	}	
	else if(endedTouch.identifier == acceleratorTouchID)
	{
		//deccelerates
		buttonUp(1);
	}
	else		
	{
		buttonUp(0);
	}
	//need to check which touch ends
	for(var i = 0; i < allButtons.length; i++)
	{		
		// buttonUp(i);
	}
}
//should take weapon type?
//dont need mouseX Y, global kept updated
//should just be playerShoot(isMouseShot), if(!mouseShot) angle = moveangle
// function playerShootsMouse(mouseX, mouseY, mouseShot)
function playerShoots(mouseShot)
{
	var bulletAngle;
	if(mouseShot)
	{
		// bulletAngle = Math.atan2(mouseX - playersTank.centerX, - (mouseY - playersTank.centerY))*180/Math.PI;
		
		//cant be turretAngle for touchscreens (turret only changes on touch)
		bulletAngle = Math.atan2(mouseX+camera[0] - playersTank.centerX, - (mouseY+camera[1] - playersTank.centerY));
		// console.log(mouseX, bulletAngle);
		// bulletAngle = playersTank.turretAngle*Math.PI/180;
		
	}
	else
	{
		bulletAngle = playersTank.moveAngle*Math.PI/180;
	}
	// rayCastShot(playersTank, bulletAngle);//degrees
			//change to tank.bulletSize, tank.bulletDamage //need primary and secondary damage?
		// var newBullet = new Bullet(TANK_BULLET_IMAGE, playersTank, bulletAngle, playersTank.bulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE);	
			// allBullets.push(newBullet);			
			
	// addBullet(playersTank, bulletAngle);
	var bulletInfoToSend = 
	{		
		index: playerObjectsList.indexOf(playersTank),
		angle: bulletAngle,
		type: 'primary'
	}
	//type should be tank.primaryGun
	if(gameMode == 'zombies')
	{
		if(playersTank.ammo > 0)
		{
			thisClient.emit('addBullet', bulletInfoToSend);	
			// playersTank.ammo --;
		}
		else
		{
			//play no ammo sound
			// noAmmo.currentTime = 0;
			// noAmmo.play();
			
			playSound(noAmmo);
			// grenadeBounce.currentTime = 0;
			// grenadeBounce.play();
		}
		
	}
	else
	{
		thisClient.emit('addBullet', bulletInfoToSend);		
	}
	
	// thisClient.broadcast.emit('addBullet', bulletInfoToSend);	
}

function rayCastShot(shooter, shotAngle)
{
	var startX = shooter.centerX;
	var startY = shooter.centerY;
	var checkX = startX;
	var checkY = startY;
	var checkDistance = 0;
	var checkPointCollided = false;
	if(shooter.canShoot)
	{
		//make sound quieter based on distance
		if(shooter.id != 'player')
		{
			var xDifference = Math.abs(shooter.gameX - playersTank.gameX);
			var yDifference = Math.abs(shooter.gameY - playersTank.gameY);
			var distanceBetween = Math.sqrt(Math.pow(xDifference,2)+Math.pow(yDifference,2));
			var volume = 1-(distanceBetween/1000);
			if(volume < 0.02)
			{volume = 0.02;}
			//should be handled on change mode -> tank.primaryGun
			if(gameMode == 'cs')
			{
				gunshot.volume = volume;				
				playSound(gunshot);
				// gunshot.currentTime = 0;
				// gunshot.play();	

			}
			else
			{
				shooter.shootSound.volume = volume;
				playSound(shooter.shootSound);
				// shooter.shootSound.currentTime = 0;
				// shooter.shootSound.play();
				
			}
			
		}
		else
		{
			if(gameMode == 'cs')
			{
				playSound(gunshot);
				// gunshot.currentTime = 0;
				// gunshot.play();	
			}
			else
			{
				playSound(shooter.shootSound);
				// shooter.shootSound.currentTime = 0;
				// shooter.shootSound.play();
			}
		}
		var loopCounter = 0;//could just check distance of ray
		shooter.canShoot = false;
		setTimeout(function()
		{
			shooter.canShoot = true;
		// },SHOT_RATE*1000-50); //stops shoot not going near 1000
		},SHOT_RATE*1000-50);
		//check for collisions
		while(!checkPointCollided)
		{
			
			// setTimeout(function()
			// {
				// checkPointCollided = true;
			// }, 100);
			//if ray hit wall
			var hitWall = collidesWithAnyWall(checkX, checkY, 1)[0]=='true';
			if(hitWall)
			{				
				explosionAt(checkX, checkY, NORMAL_BULLET_SIZE);
				// break;
				checkPointCollided = true;
				// alert(loopCounter);
			}			
			//ray hit bullet (grenade)
			for(i = 0; i < allBullets.length; i++)
			{
				checkBullet = allBullets[i];
				if(collides(checkX, checkY, 1, 1, 
				checkBullet.gameX, checkBullet.gameY, checkBullet.size, checkBullet.size))
				{
					explosionAt(checkBullet.gameX, checkBullet.gameY, 3*checkBullet.size)
					allBullets.splice(i, 1); 
					checkPointCollided = true;
				}
			}			
			
			//if ray hit other player
			// for (var i = 0; i < playerObjectsList.length; i++) 
			for (var i = 0; i < allTanks.length; i++) 
			{				
				// var checkTank = playerObjectsList[i] || {};	
				var checkTank = allTanks[i] || {};	
				var hitsTank = collides(checkTank.gameX, checkTank.gameY, checkTank.size, checkTank.size, 
					checkX, checkY, 1, 1)
				if(hitsTank && 
				(checkTank.id != shooter.id))
				// || (checkTank.id == shooter.id && 
				// checkDistance > checkTank.size))
				{
					checkPointCollided = true;					
					explosionAt(checkX, checkY, NORMAL_BULLET_SIZE);
					if(checkTank.id == 'player')
					{
						damageAndCheckKill(checkTank, NORMAL_BULLET_DAMAGE, shooter);				
						thisClient.emit('iGotHit', [i, playerObjectsList.indexOf(shooter)]);//tank index	
					}
					else if(checkTank.id == 'bot')
					{
						damageAndCheckKill(checkTank, NORMAL_BULLET_DAMAGE, shooter);				
					}
				}
			}
			
			if(!checkPointCollided)
			{
				//move check point forward
				checkX += 0.25*shooter.size*Math.sin(shotAngle);
				checkY -= 0.25*shooter.size*Math.cos(shotAngle);
				var xDifference = Math.abs(shooter.gameX - playersTank.gameX);
				var yDifference = Math.abs(shooter.gameY - playersTank.gameY);
				checkDistance = Math.sqrt(Math.pow(xDifference,2)+Math.pow(yDifference,2));
			}
			//stops infinite loop
			//needs to be based gamewidth/checkincrement
			if(loopCounter > 150)
			{
				// alert('boop');
				checkPointCollided = true;
			}
			loopCounter++;
		}
	}
}



//dont need to pass mouse as variables?
function shootHoming(tank)
{
	// var bulletAngle = Math.atan2(mouseX - playersTank.centerX, - (mouseY - playersTank.centerY));	
		selectClosestTarget(tank, playerObjectsList);
		
		var newBullet = new Bullet(tank.bulletImage, tank, tank.centerX, tank.centerY, tank.moveAngle, globalBulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE, 'homing');	
		allBullets.push(newBullet);	
	// var bulletInfoToSend = 
	// {		
		// index: playerObjectsList.indexOf(playersTank),
		// angle: bulletAngle,
		// type: 'grenade'
	// }
	// thisClient.emit('addBullet', bulletInfoToSend);
}

//dont need to pass mouse as variables?
function playerShootGrenade(mouseX, mouseY)
{
	// var bulletAngle = Math.atan2(mouseX - playersTank.centerX, - (mouseY - playersTank.centerY));	
	var bulletAngle = playersTank.turretAngle*Math.PI/180;	
	var bulletInfoToSend = 
	{		
		index: playerObjectsList.indexOf(playersTank),
		angle: bulletAngle,
		type: 'grenade'
	}
	thisClient.emit('addBullet', bulletInfoToSend);
}

function shootGrenade(shooter, angle)
{
	if(shooter.canShootSecondary)
	{
		var newBullet = new Bullet(explosiveImageOne, shooter, shooter.centerX, shooter.centerY, angle, grenadeSpeed, NORMAL_BULLET_SIZE*2, GRENADE_DAMAGE, 'grenade');	
		allBullets.push(newBullet);	
		shooter.canShootSecondary = false;
		setTimeout(function()
		{
			shooter.canShootSecondary = true;
		},SECONDARY_SHOT_RATE*1000-50);
	}	
}

function damageExplosionAt(x, y, size, shooter)
{
	explosionAt(x, y, size);	
	for (var j = 0; j < playerObjectsList.length; j++) 
	{
		var checkTank = playerObjectsList[j];
		if(collides(checkTank.gameX, checkTank.gameY, checkTank.size, checkTank.size,
		x-1*size, y-1*size, 2*size, 2*size))
		{
			damageAndCheckKill(checkTank, GRENADE_DAMAGE, shooter);					
			//do damage
		}
	}
}

function explosionAt(x, y, size)
{
	var centerX = x;
	var centerY = y;
	var radius = size; //starting radius
	var maxSize = size;
	var timeCreated = (new Date()).getTime();
	var doesDamage = doesDamage;
	var thisExplosion = [centerX, centerY, radius, maxSize, timeCreated, 'white', doesDamage];
	allExplosions.push(thisExplosion);		
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
		
		//make sound quieter based on distance, just for cs?
		if(shooter.id != 'player')
		{
			var xDifference = Math.abs(shooter.gameX - playersTank.gameX);
			var yDifference = Math.abs(shooter.gameY - playersTank.gameY);
			var distanceBetween = Math.sqrt(Math.pow(xDifference,2)+Math.pow(yDifference,2));
			var volume = 1-(distanceBetween/1000);
			if(volume < 0.05)
			{volume = 0.05;}
			shooter.shootSound.volume = volume;
			playSound(shooter.shootSound);
			// shooter.shootSound.currentTime = 0;
			// shooter.shootSound.play();
		}
		else
		{
			playSound(shooter.shootSound);
			// shooter.shootSound.currentTime = 0;
			// shooter.shootSound.play();
		}
		
	// }
		//globalBulletSpeed should be taken from primary/sec weapon settings
		var newBullet = new Bullet(shooter.bulletImage, shooter, shooter.centerX, shooter.centerY, angle, globalBulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE, 'primary');	
		allBullets.push(newBullet);	
		shooter.ammo--;
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
	// if(gameMode == 'cs' || gameMode == 'zombies')
	// {
		// tankToBoost.speed = 300*scale*4
		// setTimeout(function()
		// {
			// tankToBoost.speed = 300*scale;		
		// }, 250);	
	// }
	// else if(gameMode == 'race')
	// {
		
	// }
	tankToBoost.speed = tankToBoost.speed*4;
	setTimeout(function()
	{
		tankToBoost.speed = tankToBoost.speed/4;		
	}, 250);	
}

function slow(tankToSlow)
{
	if(gameMode != 'race')
	{
		tankToSlow.speed = tankToSlow.speed/4;
		setTimeout(function()
		{
			tankToSlow.speed = tankToSlow.speed*4;
		}, 1000);	
	}
	else
	{
		// tankToSlow.acceleration = 0;
		// tankToSlow.speed -= playerSpeed; //half max speed
		tankToSlow.speed *= 0.3;
		if(tankToSlow.speed < 0)
		{
			// tankToSlow.speed = 0;
		}
		setTimeout(function()
		{
			//need check if accelerator still held
			if(tankToSlow.upDown)
			{				
				// tankToSlow.acceleration = 300;
			}
		}, 1000);
	}
	
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
	if(pickupType == 'health')
	{
		tankPicked.currentHealth = tankPicked.maxHealth;
		// synth1Sound.currentTime = 0;
		// synth1Sound.play();
		playSound(synth1Sound);
		activePickups.splice(pickupArrayIndex, 1);
	}
	else if(pickupType == 'ammo')
	{
		tankPicked.ammo += 7;
		if(tankPicked.ammo > tankPicked.maxAmmo)
		{
			tankPicked.ammo = tankPicked.maxAmmo;
		}
		// reloadSound.currentTime = 0;
		// reloadSound.play();
		playSound(reloadSound);
		
		activePickups.splice(pickupArrayIndex, 1);
		if(gameMode == 'intro') //or when ammo == 0 before pickup?
		{
			tankPicked.canShoot = true;
			helpText.style.top = '55vh';
			helpText.style.left = '10vw';
			if(!isTouchscreen)
			{
				showMousePic();				
				helpText.innerHTML = 'Use mouse to <br> aim and shoot';
				setTimeout(function()
				{
					//remove mouse, start zombies
					clearInterval(mouseAnimateLooper);
					mouseButtons = [];
					mouse = [];					
				},4000);
			}
			else
			{				
				helpText.innerHTML = 'Tap screen to <br> aim and shoot';
			}
			setTimeout(function()
			{
				allZombieSpawns = [4,5,4,5];	
				initZombies();
				createZombie();
				playFull = true;
				helpText.style.top = '20vh';
				helpText.style.left = '45vw';
				helpText.innerHTML = 'Zombies! <br> Shoot em!';	
			},4000);
		}
	}
	else if(pickupType == 'speed')
	{
		tankPicked.speed = tankPicked.speed * 2;
		// synth2Sound.currentTime = 0;
		// synth2Sound.play();
		playSound(synth2Sound);
		activePickups.splice(pickupArrayIndex, 1);	
		// canBoost = false;
		//timer to slow down
		setTimeout(function()
		{
			tankPicked.speed = tankPicked.speed / 2;
			// canBoost = true;
		}, 3000);	
		if(gameMode == 'intro')
		{
			helpText.innerHTML = 'Speed increased!';
			setTimeout(function()
			{
				activePickups.push(new Pickup(1300*scale, 560*scale, 1.5*shipSize, 'ammo'));
				helpText.style.left = '72vw';
				helpText.style.top = '72vh';
				helpText.innerHTML = 'Ammo pickup';
			}, 2000);	
		}
	}
	else if(pickupType == 'random')
	{
		//give random weapon for racemode
		//really need weapon class working
		//right click will always activate primary
				//just give random primary weapon
				//tank.primaryGun == randomWeapon
		// randomSound.currentTime = 0;
		// randomSound.play();
		
		playSound(randomSound);
		//remove pickup for a time
		activePickups[pickupArrayIndex].isActive = false;
		setTimeout(function()
		{
			activePickups[pickupArrayIndex].isActive = true;
			// canBoost = true;
		}, 2000);	
		//give tank random weapon after time
		setTimeout(function()
		{
			randomWeapon(tankPicked);
		}, 700);	
	}
}

var weaponCycle = ['shot', 'mine', 'boost', 'shield', 'homing'];
// var weaponCycle = ['shot'];

function randomWeapon(tank)
{
	//shot or mine to start
	//
	tank.primaryGun = weaponCycle[Math.floor(Math.random() * weaponCycle.length)];
	if(tank.id == 'player')
	{
		showScoreAtTank(tank, tank.primaryGun);
	}		
	// tank.primaryGun == 'shot';
	// tank.primaryGun == 'mine';
}

var spawnTime = 5000;//time in milliseconds between spawns
var spawnPoints = [];
var zombieKills = 0;
var zombiesSpawned = 0;
// var MAX_ZOMBIES = 7;
var MAX_ZOMBIES = 100;
var spawnTimer;
var zombieSpeed;

function initZombies()//stage three
{	
	spawnPoints = [];
				
	zombieSpeed = (150*scale);
	zombieKills = 0;
	zombiesSpawned = 0;
	var w = mapWidth;
	var h = mapHeight;
	// spawnPoints[0] = [w/3*1, h/10];
	// spawnPoints[1] = [w/3*2, h/10];
	// spawnPoints[2] = [w/5*4, h/10];
	// spawnPoints[2] = [w/5*4, h/10]; 
	spawnPoints.push([50+zombieGamePosition[0]*w, 50+zombieGamePosition[1]*h]);
	spawnPoints.push([50+zombieGamePosition[0]*w, 750+zombieGamePosition[1]*h]);
	spawnPoints.push([1560+zombieGamePosition[0]*w, 50+zombieGamePosition[1]*h]);
	spawnPoints.push([1560+zombieGamePosition[0]*w, 750+zombieGamePosition[1]*h]);
	
	spawnPoints.push([50, 750]);
	spawnPoints.push([1560, 750]);	
	
	scaleSpawnPoints();
}
//set when server sets to zombies
var allZombieSpawns = [];
var retargetTimer;
function createZombie()
{	
	//random spawn point
	// var spawnIndex = Math.floor(Math.random()*spawnPoints.length);
	var spawnIndex = allZombieSpawns[0];
	allZombieSpawns.shift();
	var startX = spawnPoints[spawnIndex][0];
	var startY = spawnPoints[spawnIndex][1];
	// spawnPoints[0]
	// var startX = canvasWidth/5*2;
	// var startY = canvasHeight/10;
	var newEnemy = new Tank("zombie", startX, startY,
						'alien', zombieSpeed, 0);	
	// var newEnemy = new Tank("zombie", 200, 200,
						// 'alien', zombieSpeed, 0);
	// newEnemy.shotRate = SHOT_RATE;//0? only melee damage, or some stages add ranged attackers
	newEnemy.currentHealth = 0.15*newEnemy.maxHealth;
	//need to choose closest target
	// newEnemy.target = playersTank;
	// chase(newEnemy, playersTank);
	selectClosestTarget(newEnemy, playerObjectsList);
	// newEnemy.target = playerObjectsList[0];
	chase(newEnemy, newEnemy.target);
	//every second, choose closest target
	
	// newEnemy.moveAngle = 90;
	newEnemy.isMoving = true;
	enemies.push(newEnemy);	
	/* newEnemy.targetSelectTimer = setInterval(function()
	{
		// selectClosestTarget(enemies.indexOf bla, playerObjectsList);
		selectClosestTarget(enemies.length-1, playerObjectsList);
	}, 1000); */
	zombiesSpawned++;
	if(zombiesSpawned == 1)
	{
		retargetTimer = setInterval(function()
		{
			allZombiesRetarget()
		}, 1000);
	}
	if(zombiesSpawned < MAX_ZOMBIES)
	{		
		spawnTimer = setTimeout(createZombie, spawnTime);
	}
	if(spawnTime > 1500)
	{		
		spawnTime -= 300;
		zombieSpeed *= 1.03;
	}
}

function allZombiesRetarget()
{
	for(var i = 0; i< enemies.length; i++)
	{
		var enemy = enemies[i];
		selectClosestTarget(enemy, playerObjectsList);
		chase(enemy, enemy.target);
	}
}
//could just be object 1 and 2, just need game x and y
//changes tankSelecting.target to closest tank in given list
function selectClosestTarget(tankSelecting, tankList)
{
	if(tankList[0] != tankSelecting)
	{		
		tankSelecting.target = tankList[0];
	}
	else
	{
		tankSelecting.target = tankList[1];
	}
	for(var i = 0; i < tankList.length; i++)
	{
		var tankToCheck = tankList[i];
		var distanceBetween = getDistanceBetween(tankSelecting.gameX, tankSelecting.gameY, tankToCheck.gameX, tankToCheck.gameY);
		if(distanceBetween < getDistanceBetween(tankSelecting.gameX, tankSelecting.gameY, tankSelecting.target.gameX, tankSelecting.target.gameY)
			&& tankToCheck != tankSelecting)
		{
			tankSelecting.target = tankToCheck;
		}
	}	
}

// for objects, use center values
// function getDistanceBetween(object1, object2)
function getDistanceBetween(x1, y1, x2, y2)
{
	//should be the center
	var xDifference = Math.abs(x1 - x2);
	var yDifference = Math.abs(y1 - y2);
	var distanceBetween = Math.sqrt(Math.pow(xDifference,2)+Math.pow(yDifference,2));
	return distanceBetween;	
}

function chase(chaser, chasee)
{
	chaser.isChasing = chasee;
}

//tell all clients to boost the tank
thisClient.on('boostTank', function(tankIndex)
{
	var tank = playerObjectsList[tankIndex];
	if(tank.id != 'player')//should just broadcast?
	{
		boost(tank);
	}
});

thisClient.on('otherPlayerMine', function(tankIndex)
{
	var tank = playerObjectsList[tankIndex];
	if(tank.id != 'player')
	{
		placeMine(tank);
	}
});

thisClient.on('otherPlayerShield', function(tankIndex)
{
	var tank = playerObjectsList[tankIndex];
	if(tank.id != 'player')
	{
		shieldOn(tank);
	}
});


//tell all clients to add the new bullet (itself included)
thisClient.on('addBullet', function(recievedBulletInfo)
{
	// var senderID = recievedBulletInfo.clientID;
	var senderIndex = recievedBulletInfo.index;
	var shooter = playerObjectsList[senderIndex];
	if(gameMode == 'cs') // || 'studio'
	{		
		//should be type == 'grenade', cannon, homing, normal etc
		if(recievedBulletInfo.type == 'primary')
		{			
			rayCastShot(shooter, recievedBulletInfo.angle);
		}
		else if(recievedBulletInfo.type == 'grenade')
		{
			shootGrenade(shooter, recievedBulletInfo.angle);
		}
	}
	else
	{
		addBullet(shooter, recievedBulletInfo.angle);
	}
});

thisClient.on('shootHoming', function(tankIndex)
{
	var shooter = playerObjectsList[tankIndex];
	shootHoming(shooter);
});

var leadingCheckPoint;
var placingList = [];
function recalculatePlacing()
{
	placingList = [playerObjectsList];
	for (var p = 0; p < playerObjectsList.length; p++) 
	{
		var tank = playerObjectsList[p];
		for (var p2 = 0; p2 < playerObjectsList.length; p2++) 
		{
			var tank2 = playerObjectsList[p2];
			if(tank.placeChecker > tank2.placeChecker
			&& tank.racePlacing > tank2.racePlacing)
			{
				//winning, take place in array if behind
				tank.racePlacing -= 1;
				tank2.racePlacing += 1;
			}
			else if(tank.placeChecker == tank2.placeChecker
			&& tank.distanceFromLastCheckpoint > tank2.distanceFromLastCheckpoint
			&& tank.racePlacing > tank2.racePlacing)
			{
				tank.racePlacing -= 1;
				tank2.racePlacing += 1;
			}
			else //losing
			{
				
			}
		}
		//when beating other player, place at start of list
		// placingList.unshift(tank)
		// placingList.splice(index, 0, tank);
	}
	updateScoreLabel();
}
function updateScoreLabel()
{
	var listItems = document.querySelectorAll('#scoreLabel li');
	// listItems[i] should match tank array indexes

	
	for(var i = 0; i < listItems.length; i++)
	{
		// listItems[0].innerHTML = playersTank.id+': '+playersTank.killCount;
		var currentTank;
		if(gameMode == 'cs' || gameMode == 'zombies')
		{
			// currentTank = playerObjectsList[i];
			currentTank = allTanks[i];//only for cs
			listItems[i].innerHTML = currentTank.nickname+': '+currentTank.killCount;
		
		}
		else if(gameMode == 'race')//placing is order in list, 0 = first
		{
			// currentTank = placingList[i];
			currentTank = playerObjectsList[i];
			var suffix;
			if(currentTank.racePlacing == 1)
			{
				suffix = 'st';
			}
			else if(currentTank.racePlacing == 2)
			{
				suffix = 'nd';
			}
			else if(currentTank.racePlacing == 3)
			{
				suffix = 'rd';
			}
			else
			{
				suffix = 'th';
			}
			// listItems[i].innerHTML = currentTank.nickname+', lap  '+currentTank.currentLap;
			// listItems[i].innerHTML = currentTank.tankType+':  '+currentTank.racePlacing +', '+ currentTank.placeChecker+', '+Math.floor(currentTank.distanceFromLastCheckpoint);
			listItems[i].innerHTML = currentTank.nickname+':  '+currentTank.racePlacing+suffix+', Lap '+currentTank.currentLap;
			// listItems[i].innerHTML = i+': '+currentTank.nickname;
			// listItems[i].innerHTML = i;
		}
		
	}
}

//could be just show message at tank
function showScoreAtTank(tank, score)
{
	var timeScored = new Date().getTime();
	scoreAnimations.push([tank, timeScored, score]);	
}
//how to just do on reciever?
function damageAndCheckKill(shotTank, bulletDamage, shooter)
{
	if(damage(shotTank, bulletDamage)
		&& shotTank.alive)//returns true when dead
	{
		var newDeadImage = [shotTank.baseImages[2], shotTank.gameX+0.5*shotTank.size, shotTank.gameY+0.5*shotTank.size, shotTank.moveAngle, shotTank.size];
		deadList.push(newDeadImage);//drawn at draw method	
		if(deadList.length > 6)
		{
			deadList.shift();
		}
		explode(shotTank);
		shotTank.alive = false;
		shotTank.stopMoving();
		//dead image
		shotTank.baseImage = shotTank.baseImages[2];
		//need to detect shooter that killed for score		
		// if(shotTank.nickname == shooter.nickname)//suicide
		if(shotTank.id == shooter.id)//suicide
		{
			shooter.killCount -= 1;			
			// showScoreAtTank(shooter, '-1');
			showScoreAtTank(shooter, 'yikes..');
		}
		else
		{
			shooter.killCount += 1;			
			showScoreAtTank(shooter, '+1');
			if(shotTank.id == 'bot')
			{
				// var randomMessage = taunts[Math.floor(Math.random() * taunts.length)];
				// chatMessage(playerObjectsList.indexOf(playersTank), randomMessage);
				// shotTank.showChat();
			}
			if(gameMode == 'intro' && shooter.killCount == 4)
			{				
				helpText.innerHTML = 'Training Complete.';
				//to mode select
				setMode('select');//same mode
				thisClient.emit('setMode', gameMode);	
				// centerCameraOnPlayer();
				// cameraCentered = true;
				setTimeout(function()
				{
					helpText.style.display = 'none';
				}, 2000);
			}
			else if(gameMode == 'cs' && shooter.killCount == 10)
			{
				showScoreAtTank(shooter, 'Winner!');
				//should loop for all players (wait till each one finishes?)
				// setMode('intro');
				//TELL SERVER TO CHANGE ALL BACK TO MODESELECT
				// gameMode = 'intro';
				// setAllTankPositions(1590*scale, 630*scale);
				setMode('select');//same mode
				thisClient.emit('setMode', gameMode);	
			}
			else if(gameMode == 'zombies' && shooter.killCount % 5 == 0)
			{
				//drom ammo crate at deing zombies position
				//last added dead list x y
				// activePickups.push(new Pickup(deadList[deadList.length-1][1]*scale-shipSize, deadList[deadList.length-1][2]*scale-shipSize, shipSize, 'ammo'));
				if(shooter.killCount == 30)
				{
					activePickups.push(new Pickup(deadList[deadList.length-1][1]-shipSize, deadList[deadList.length-1][2]-shipSize, shipSize, 'health'));
				}
				else
				{
					activePickups.push(new Pickup(deadList[deadList.length-1][1]-shipSize, deadList[deadList.length-1][2]-shipSize, shipSize, 'ammo'));
				}
			}
			// showScoreAtTank(shooter, 'KILL CONFIRMED');
		}	
		
		updateScoreLabel();
		
		//dont respawn in zombies either, game over when no player alive
		if(shotTank.id != 'zombie')
		{
			// respawn after time
			if(shotTank.id == 'bot')
			{
				clearTimeout(shotTank.shootTimer);
				// toRespawnList.push(enemies.indexOf(shotTank));
			}
			// else
			// {
				// toRespawnList.push(playerObjectsList.indexOf(shotTank));
			// }
			
			toRespawnList.push(allTanks.indexOf(shotTank));
			//if shotTank is player, 
			//send random respawn points to other clients
			// if(shotTank.id != shooter.id)
			// {
			setTimeout(function()
			{
				// playerObjectsList[toRespawnList[0]].randomRespawn(true);
				var tankRespawning = allTanks[toRespawnList[0]];
				// var tankRespawning = playerObjectsList[toRespawnList[0]];
				tankRespawning.randomRespawn(true);
				if(tankRespawning.id == 'bot')
				{
					shooter.shootTimer = setTimeout(function() {botShootPlayer(tankRespawning)}, 2000);
				}
				tankRespawning
				toRespawnList.shift();//deletes first item
				// messageLabel.innerHTML = "Go!" ;
			},3000);
			// }
		}
		
		
		
		if(shotTank.id == 'player')
		{
			// messageLabel.innerHTML = "You Lose!" ;					
			clearInterval(beatTimer);
		}	
		else
		{
			// messageLabel.innerHTML = "You Win!" ;
			// gotKillAnimation();//show +1 that fades and goes up
		}
		return true;
	}
}
thisClient.on('otherPlayerHit', function(shotAndShooterId)
{
	var playerHit = playerObjectsList[shotAndShooterId[0]];
	var shooter = playerObjectsList[shotAndShooterId[1]];
	damageAndCheckKill(playerHit, NORMAL_BULLET_DAMAGE, shooter);	
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

function animateExplosives()
{		
	for(var i = 0; i < allExplosives.length; i++)
	{
		var explosive = allExplosives[i];		
			// tankToAnimate.baseImage.src = tankToAnimate.baseImages[tankToAnimate.currentFrame];
		explosive.currentImageIndex = (explosive.currentImageIndex + 1) % 2;
		explosive.switchImages();
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
	//should be stored in pickup class, all can be at different frame
	// then each pickup can just ++ and cycle all images
	pickupsFrame++;
	if(pickupsFrame > 3)//how many frames e.g. 1 = 2
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
	//should be game x?
	var centerX = object.gameX - 0.5*object.size;
	var centerY = object.gameY - 0.5*object.size;
/* 	var radius = 0.5*object.size; //starting radius
	var maxSize = object.size;
	var timeCreated = (new Date()).getTime();
	var doesDamage = false;
	// var explosion = new Image;	
	// explosion.src = bulletExplosions[0];	
	// var thisExplosion = [explosion,xPos,yPos,size,timeCreated];
	var thisExplosion = [centerX, centerY, radius, maxSize, timeCreated, 'white', doesDamage];
	allExplosions.push(thisExplosion);	 */
	basicExplode(centerX, centerY, object.size)
	// if(soundEnabled)
	// {
		/* snareSound.currentTime = 0; */
		/* snareSound.play(); */
	// }//extra explosions for tanks and explosives		
}

function basicExplode(centerX, centerY, size)
{
	var radius = 0.5*size;
	var maxSize = size;
	var timeCreated = (new Date()).getTime();
	var doesDamage = false; //don't need, will be damageExplosionAt
	// var explosion = new Image;	
	// explosion.src = bulletExplosions[0];	
	// var thisExplosion = [explosion,xPos,yPos,size,timeCreated];
	var thisExplosion = [centerX, centerY, radius, size, timeCreated, 'white', doesDamage];
	allExplosions.push(thisExplosion);
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
	if(message.charAt(0) == '-')
	{
		// alert('Mode');
		var isValidMode = false;
		for(var i = 0; i < gameModes.length; i++)
		{			
			if(message.substr(1) == gameModes[i])
			{
				if(message.substr(1) == 're')
				{
					setMode(gameMode);//same mode
					thisClient.emit('setMode', gameMode);
					chatMessage(playerObjectsList.indexOf(playersTank), 
					'Restarting...');
					resetAllKillCounts();
					updateScoreLabel();
				}
				else
				{
					setMode(message.substr(1));				
					thisClient.emit('setMode', message.substr(1));
					chatMessage(playerObjectsList.indexOf(playersTank), 
					'Mode: '+message.substr(1));
				}
				
				isValidMode = true;
			}			
		}
		if(!isValidMode)
		{
			chatMessage(playerObjectsList.indexOf(playersTank), 'invalid mode');
		}
	}
	else
	{
		
		chatMessage(playerObjectsList.indexOf(playersTank), message);
	}
	
	canvas.focus();
	chatInput.value = "";
	chatInput.style.display = 'none';
  }
});
//need to restore focus and remove input if canvas clicked
// chatInput.addEventListener("mousedown", function(event) 
// {
	// canvas.focus();
	// chatInput.style.display = 'none';
// });


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

var controllableTanks = [];

function switchTanks()
{
	//add current tank to the end of the list
	controllableTanks.push(playersTank);
	//switch which tank you control
	playersTank = controllableTanks[1];
	//remove the first item in list as it is now 3rd
	//      will become controllableTanks[1] after the shift
	controllableTanks.shift();
}
// function 
//doing on right click instead
var isScrollingDown;
/* document.onscroll = function(e)
{	
  // print "false" if direction is down and "true" if up
	newScrollPosition = canvas.scrollTop();  
	isScrollingDown = lastScrollPosition < newScrollPosition;

	if(isScrollingDown)
	{
		SHOT_RATE = SHOT_RATE/2;
		//should be a% of beat 
		//and only shoot at intervals
	}
	else if(!isScrollingDown) //&& (bla)
	{		
		SHOT_RATE = SHOT_RATE*2;	
	}   
	lastScrollPosition = newScrollPosition;
} */
var trees = [];
var trunks = [];
// var tree = [];
//x y trunkW, topW, h?
function addTree(x, y, width)
{
	var tree = [];
	// var piece = [x, y+sideWallThickness, 200, 90];
	// tree.push(piece);
	//trunk, different colour
	// var topX = x - 1/2 difference of top and trunk widths;
	// var x = x * scale;
	// var y = y * scale;
	// var width = width *scale;
	var trunkWidth = width/3;
	// var shadowY = y - (0.5*<<<widestSectionsWidth-0.5*trunkWidth);
	var topX = x - (0.5*width-0.5*trunkWidth);
	allWalls.push([x, y, trunkWidth, trunkWidth]);
	mapWalls.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]);
	tree.push([x, y, trunkWidth, trunkWidth]); //9 trunks
			//tree.push should include colour too
	//top part
	var nextWidth = width;
	tree.push([topX, y, nextWidth, width*0.66]);
	nextWidth = width*8/10;
	tree.push([topX+((0.5*width)-0.5*nextWidth), y, nextWidth, width*0.5]);	
	nextWidth = width*5/10;
	tree.push([topX+((0.5*width)-0.5*nextWidth), y, nextWidth, width*0.3]);	
	 
	 
	// tree.push([topX, y, width, width/3*2.5]);	
	// tree.push([topX+width/8, y, width-50, width/3*2]);	
	// tree.push([topX+width/4, y, width-100, width/3*1]);
	var currentX = x; 
	var randomRange = 20;
	for(var i = 0; i < tree.length; i++)
	{
		
		var treeSegment = tree[i];
		//for random x changes
		/* if(i < 9)
		{
			var randomXChange = (Math.random()*randomRange)-(0.5*randomRange);
			// currentX = treeSegment[0];
			currentX += randomXChange;
			treeSegment[0] = currentX;
			// currentX = tree[9][0];
		} */		
		treeSegment[1] -= i*sideWallThickness/scale;
		// treeSegment[1] -= i*20*scale;
		
		// treeSegment[1] -= i*(width/6);
	}
	//made a tunnel by accident lol
	// var piece = [x, y, 200, 90];
	// tree.push(piece);
	
	// tree.push([x+25, y, 150, 90]);	
	// tree.push([x+50, y, 100, 90]);
	// allWalls.push([tree[0][0], tree[0][1], tree[0][2], tree[0][3]]);
	// mapWalls.push(allWalls[allWalls.length-1]);
	trees.push(tree);
}

function botShootPlayer(shooter)
{
		//bullet size, damage, speed need to match primaryGun etc
	// var newBullet = new Bullet(BALL_BULLET_IMAGE, shooter, shooter.turretAngle*(Math.PI/180), 
	// shooter.bulletSpeed, shooter.bulletSize, shooter.damage);
	// selectClosestTarget(shooter, playerObjectsList);
	tankFaceTarget(shooter);
	//needs to do add bullet
	// var newBullet = new Bullet(shooter.bulletImage, shooter, shooter.centerX, shooter.centerY, shooter.moveAngle, 
	// globalBulletSpeed, NORMAL_BULLET_SIZE, NORMAL_BULLET_DAMAGE, 'primary');	
		// allBullets.push(newBullet);	
	// console.log(shooter.isAlive);
	if(gameMode == 'cs') // || 'studio'
	{	
		//only shoot if no wall between target
		if(!rayCheckWallBetween(shooter.centerX, shooter.centerY, shooter.target.centerX, shooter.target.centerY, shooter.turretAngle*Math.PI/180))
		{
			//how delay first shot only
			//add random degrees to this angle to fake human accuracy
				//could increase if target.isMoving
			var randomAccuracy = 20*Math.random()-10;
			if(shooter.alive)
			{
				rayCastShot(shooter, (shooter.turretAngle+randomAccuracy)*Math.PI/180);
			}
		}
	}
			
	
	//decides when to shoot again
	// var randomDelay = 0.5;
	var randomDelay = Math.random()*SHOT_RATE*1000;//adds up to one shotRate to the shot rate
	var randomDuration = Math.random() * randomDelay + shooter.shotRate;
		clearTimeout(shooter.shootTimer);
		shooter.shootTimer = setTimeout(function() {botShootPlayer(shooter)}, SHOT_RATE*1000+randomDelay);
		
}

function tankFaceTarget(tank)
{
	var targetCenterX = tank.target.centerX;
	var targetCenterY = tank.target.centerY;
	tank.turretAngle = Math.atan2(targetCenterX - tank.centerX, -(targetCenterY - tank.centerY))*180/Math.PI;
}







/* Client server code -----------------------------------------*/



//when player connects, init and add previous players
//     will change to intro screen (controls, name, tank select)
thisClient.on('playerConnect', function(allPlayerInfo, arrayIndex, allPickupInfo, gameMode)
{	
	init(allPlayerInfo, arrayIndex, allPickupInfo, gameMode);	
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
			var previousTank = new Tank("opponent", player.gameX*scale, player.gameY*scale,
						player.tankType, playerSpeed, globalBulletSpeed);
			// opponentsTank = previousTank;//for debugging
			// playerObjectsList[i] = previousTank;
			// previousTank.gameX = player.gameX;
			// previousTank.gameY = player.gameY;
			
			playerObjectsList.push(previousTank);
			previousTank.index = playerObjectsList.length;			
			previousTank.nickname = 'Player '+previousTank.index;
			addToScoreBoard(previousTank);
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
		var pickupObject = new Pickup(pickUpToAdd[0]*mapWidth*scale, pickUpToAdd[1]*mapHeight*scale, 1.5*shipSize, pickUpToAdd[2]);
		activePickups.push(pickupObject);
	}
}

//called each time camera moves
//need to be screenXposition and gameXposition, e.g. @ screenX = 0 stage 2, gameX = canvasWidth
//only screenX will change, game x only cchanges if that object moves
//       SHOULDNT NEED THIS AT ALL? DRAW SHOULD TAKE CAMERA
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
		activePickups[i].gameX -= cameraXChange;		
		activePickups[i].gameY -= cameraYChange;	
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
		allBullets[i].gameX -= cameraXChange;
		allBullets[i].gameY -= cameraYChange;
	}
	for(var i=0; i < pebbles.length; i++)
	{
		pebbles[i][0] -= cameraXChange;
		pebbles[i][1] -= cameraYChange;
	}
	for(var i=0; i < allExplosives.length; i++)
	{
		allExplosives[i].gameX  -= cameraXChange;
		allExplosives[i].gameY -= cameraYChange;
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
	var tankSpeed = 0;
	if(gameMode == 'race')
	{
		tankSpeed = playerSpeed*scale;
	}
	else
	{
		tankSpeed = 300* scale*1.5;
	}
	newPlayerTank = new Tank("opponent", x*scale, y*scale,
				tankType, playerSpeed*scale, globalBulletSpeed);	
	playerObjectsList.push(newPlayerTank);	
	newPlayerTank.index = playerObjectsList.length;
	newPlayerTank.nickname = 'Player '+newPlayerTank.index;
	
	// connectedSound.currentTime = 0;
	// connectedSound.play();
	playSound(connectedSound);
	// newPlayerTank.gameX = x;
	// newPlayerTank.gameY = y;
	addToScoreBoard(newPlayerTank);
	// var node = document.createElement("LI");                 // Create a <li> node
	// var textnode = document.createTextNode(newPlayerTank.id+': 0');         // Create a text node
	// node.appendChild(textnode);                              // Append the text to <li>
	// document.querySelector('#scoreLabel ul').appendChild(node); 
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
	var list = document.querySelector('#scoreLabel ul');
	list.children[clientArrayIndex].remove();
	
	playerObjectsList.splice(clientArrayIndex, 1);
	//easier to recreate whole object list?
	console.log("player deleted.");
	console.log(allPlayers);
	//nickname won't change when chosen, don't have to update label
	for (var i = 0; i < playerObjectsList.length; i++) 
	{
		playerObjectsList[i].nickname = "Player "+(i+1);
	}
	updateScoreLabel();
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
		
		playerAsObject.gameX = player.gameX*scale;
		playerAsObject.gameY = player.gameY*scale;
		
		//should be game
		// var please = playerAsObject.xPosition+0.5*playerAsObject.size;
		// playerAsObject.centerX = playerAsObject.xPosition+0.5*playerAsObject.size;
		// playerAsObject.centerY = playerAsObject.yPosition+0.5*playerAsObject.size;
		playerAsObject.centerX = playerAsObject.gameX+0.5*playerAsObject.size;
		playerAsObject.centerY = playerAsObject.gameY+0.5*playerAsObject.size;
		
		playerAsObject.xOnScreen = (player.gameX-camera[0])*scale;
		playerAsObject.yOnScreen = (player.gameY-camera[1])*scale;
		playerAsObject.moveAngle = player.moveAngle;
		playerAsObject.isMoving = player.isMoving;
		playerAsObject.turretAngle = player.turretAngle;
		opponentMousePositions[objectListIndex] = [player.mouseX*scale, player.mouseY*scale]
		
		playerAsObject.currentHealth = player.currentHealth;;
		objectListIndex++;
	}
	if(cameraCentered)
	{
		camera = [playersTank.centerX - 0.5*canvasWidth, playersTank.centerY - 0.5*canvasHeight];
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

thisClient.on('otherPlayerNewAngle', function(arrayIndexAndAngle)
{
	var otherPlayerObject = playerObjectsList[arrayIndexAndAngle.index];	
	otherPlayerObject.isMoving = true;
	otherPlayerObject.moveKeysHeld = 1;
	otherPlayerObject.newAngle = arrayIndexAndAngle.angle;
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
	//server gotta check if safe position?
	//or have set positions for each map
	// var xPos = recievedPosAndType[0]*canvasWidth;
	// var yPos = recievedPosAndType[1]*canvasHeight;	
	var xPos = recievedPosAndType[0]*mapWidth*scale;
	var yPos = recievedPosAndType[1]*mapHeight*scale;
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

thisClient.on('setMode', function(modeName)
{
	setMode(modeName);
	// alert(modeName);
});
var zombieReadyTimer;
thisClient.on('startZombies', function(generatedZombieSpawns, startTime)
{
	var timeToStart = false;
	allZombieSpawns = generatedZombieSpawns;
	// while(!timeToStart)
	zombieReadyTimer = setInterval(function()
	{
		var thisTime = new Date().getTime();
		
		// console.log(thisTime - startTime);
		
		if((thisTime - startTime)>3000)
		{
			createZombie();
			// console.log('boop');
			timeToStart = true;
			clearInterval(zombieReadyTimer);
		}
	}, 10);		
	//how to start 3 seconds after startTime
	//when timeSinceStartTime > 3000
});



