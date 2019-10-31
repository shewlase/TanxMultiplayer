
var canvasWidth;
var canvasHeight;
var canvas = $('canvas');
var gameStartTime;
var timeOfLastFrame;
var margin;

var mouseX;
var mouseY;

var ship;
var shipX;
var shipY;
var shipCenterX;
var shipCenterY;
var shipSize;

var tank;
var enemy;
var enemies;

var turret;
//stores bullets from all tanks
var allBullets;
var bulletImage;
var bulletSize;

var bulletXPosition = 0;
var bulletYPosition = 0;
//angles for movement and turret
var angleToMouse = 0;
var angleInDegrees = 0;
var bulletAngle = 0;

var moveKeysHeld = 0;
var playerSpeed;
var enemySpeed;
//for animations, smoke and wheels
var isMoving = false;
//registers which direction key held
var leftDown = false;
var upDown = false;
var rightDown = false;
var downDown = false;
//turn rate while tanks are moving
var ROTATE_SPEED = 10; //Multiples of 5 and 10 to avoid jiggle

var bulletExplosions = ['bulletExplode1.png','bulletExplode2.png'];
var allExplosions = [];

var soundEnabled = true;
var sideWallThickness;
var allWalls = [];

var wallColour = "#C59900";

var messageLabel;

$(document).ready(init);

function Tank(id, startX, startY, baseImages, turretImageUrl, moveSpeed, bulletUrl, bulletSpeed)
{
	this.id = id;
	this.xPosition = startX;
    this.yPosition = startY;	
	this.size = shipSize;
	this.centerX = this.xPosition+0.5*this.size;
	this.centerY = this.yPosition+0.5*this.size;
	this.baseImages = baseImages;
	this.baseImage = new Image();
	this.baseImage = baseImages[0];
	this.currentFrame = 0;
	this.turretImage = new Image();
	this.turretImage.src = turretImageUrl;
	this.moveAngle = 0;
	this.newAngle = 0;
	this.turretAngle = 0;
	this.bullets = [];
	this.bulletImage = new Image;
	this.bulletImage.src = bulletUrl;
	this.bulletSpeed = bulletSpeed;
	this.isMoving = false;
	this.alive = true;
	this.speed = moveSpeed;
	this.shootTimer;
	this.moveTimer;
	this.isTank = true;
}
Tank.prototype.draw = function(context)
{ 
	drawRotated(this.baseImage, this.moveAngle, this.centerX, this.centerY, shipSize);
	drawRotated(this.turretImage, this.turretAngle, this.centerX, this.centerY, shipSize);
}
//Check if hit by bullet
Tank.prototype.collides = function(bullet)
{	
	if (this.xPosition < bullet.xPosition + bullet.size &&
		this.xPosition + this.size > bullet.xPosition &&
		this.yPosition < bullet.yPosition + bullet.size &&
		this.yPosition + this.size > bullet.yPosition) 
		return true;
	/* {
		this.alive = false;
	} */
}
//classes for bullets and enemy, will refactor to seperate file
//   will have to change to take which tank it is coming from
function Bullet(shooter, direction) 
{	
	//(direction, tankFrom)
	this.xPosition = shooter.centerX-0.25*bulletSize;
    this.yPosition = shooter.centerY-0.25*bulletSize;
	this.bulletImg = shooter.bulletImage;
	this.travelAngle = direction;
	this.size = bulletSize;
	this.width = this.size;
	this.height = this.size;
	//for max bounces
	this.bounceCount = 0;
	this.alive = true;
	this.shooter = shooter;
	this.speed = this.shooter.bulletSpeed;
	this.justBounced = false;
	drawRotated(this.bulletImg, direction*(180/Math.PI), this.xPosition, this.yPosition, bulletSize);
}
Bullet.prototype.draw = function(context) 
{
	drawRotated(this.bulletImg, this.travelAngle*(180/Math.PI), this.xPosition, this.yPosition, bulletSize);	
};	
var player2;
var movement = 
{
  isMoving: false,
  moveAngle: 0
}
// movement.isMoving = true;
// movement.moveAngle = 0-359
function addPlayer()
{
	console.log("yes");
	var enemyOneImageOne = new Image();
	enemyOneImageOne.src = "ship.png";
	var enemyOneImageTwo = new Image();
	enemyOneImageTwo.src = "ship2.png";
	startX = canvasWidth/5*2;
	startY = canvasHeight/10;
	player2 = new Tank("ufo", startX, startY,
				[ enemyOneImageOne, enemyOneImageTwo ], 
				"turret.png", enemySpeed, "bullet2.png", 4*enemySpeed);
	enemies.push(player2);
}
var socket = io();
function init()
{
	setInterval(function() 
	{
	  socket.emit('movement', movement);
	}, 1000 / 60);
	//disable right click menu on canvas
	$('body').on('contextmenu', '#myCanvas', function(e){ return false; });
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	gameStartTime = (new Date()).getTime();
	
	
	canvasWidth = window.innerWidth*0.7;		
	canvasHeight = canvasWidth*0.65;
	
	messageLabel = $("#message");
	
	messageLabel.css('width', canvasWidth);
	// messageLabel.css('height', 0);
	messageLabel.css('display','none');
	// var wid = messageLabel.width();
	// var hei = messageLabel.height();
	var labelY = 0.5*canvasHeight-1.5*messageLabel.height();
	var labelX = 0.5*canvasWidth;
	messageLabel.css('top', labelY);
	$(canvas).css('left', labelX-0.5*canvasWidth);
	// messageLabel.css('left', lavelX);
	// c.css('left', labelX-0.5*canvasWidth);
	
	ctx.canvas.height = canvasHeight;
    ctx.canvas.width = canvasWidth;
	//player travels 1/6th of width per second
	playerSpeed = canvasWidth/6;
	enemySpeed = 0.9*playerSpeed;
	//loop these, $(audio)
	/* snareSound = document.getElementById('laserShot');
	kickSound = document.getElementById('tankShot');
	snareSound = document.getElementById('snareSound'); */
	hatSound = document.getElementById('hat');
	kickSound = document.getElementById('kick');
	snareSound = document.getElementById('snare');
	//myAudio = new Audio('flyMusic.mp3'); 	
	hatSound.load();	
	kickSound.load();
	snareSound.load();
	//need to use this to center and recalculate angle offset
	/* margin = (window.innerWidth - canvasWidth)/2;
	c.style.left = margin; */
	allBullets = [];
	/* ship = new Image(); */
	/* ship.src =  "ship.png"; */
	/* ship.src =  "tank.png"; */
	shipSize = canvasWidth / 21;
	shipX = canvasWidth/2 - (0.5*shipSize);
	shipY = canvasHeight- (shipSize);
	
	var tankImageOne = new Image();
	tankImageOne.src = "tank.png";
	var tankImageTwo = new Image();
	tankImageTwo.src = "tank2.png";
	var brokenTankImage = new Image();
	brokenTankImage.src = "tankDead.png";
	/* tank = new Tank(canvasWidth/2 - (0.5*shipSize), 
					canvasHeight- (shipSize),
					[ "tank.png", "tank2.png" ], 
					"tankTurret.png", "bullet.png"); */
	tank = new Tank("player", canvasWidth/2 - (0.5*shipSize), 
					canvasHeight- (shipSize),
					[ tankImageOne, tankImageTwo, brokenTankImage], 
					"tankTurret.png", playerSpeed, "bullet.png", playerSpeed*2);
	//create all enemies
	enemies = [];
	var enemyOneImageOne = new Image();
	enemyOneImageOne.src = "ship.png";
	var enemyOneImageTwo = new Image();
	enemyOneImageTwo.src = "ship2.png";
	
	var enemyTwoImageOne = new Image();
	enemyTwoImageOne.src = "ship21.png";
	var enemyTwoImageTwo = new Image();
	enemyTwoImageTwo.src = "ship22.png";
	var enemyNumber = 2;
	for(var i = 0; i < enemyNumber; i++)
	{
		var startX;
		var startY;

		
		if(i == 0)
		{
			startX = canvasWidth/5*2;
			startY = canvasHeight/10;
			var newEnemy = new Tank("ufo", startX, startY,
								[ enemyOneImageOne, enemyOneImageTwo ], 
					"turret.png", enemySpeed, "bullet2.png", 4*enemySpeed);
		}
		else
		{
			startX = canvasWidth/5*3.75;
			startY = canvasHeight/10;
			var newEnemy = new Tank("truck", startX, startY,
								[ enemyTwoImageOne, enemyTwoImageTwo ], 
					"turret2.png", enemySpeed, "bullet4.png", 2*enemySpeed);
		}
		newEnemy.isMoving = true;
		enemies.push(newEnemy);
	}

	bulletSize = 0.3*shipSize;
	sideWallThickness = 2*bulletSize;
	
	document.addEventListener("keydown", keypressed, false);	
	document.addEventListener("keyup", stopMoving, false);
	/* document.addEventListener("mousedown", playerShoots, false);	
	document.addEventListener("mouseup", stopMoving, false); */
	// setInterval(animate, 30);
	timeOfLastFrame = (new Date()).getTime();
	requestAnimationFrame(animate);
	
	//To show tracks moving, lights flashing
	// need aliveList to iterate through
    setInterval(function(){animateTanks(enemies)}, 250);		
	setInterval(function(){animateTanks(tank)}, 250);		
	
	//Add walls, x, y, width, height as percentage of canvas width/height
	// allWalls.push([0.10, 0.15, 0.11, 0.67]);
	allWalls.push([0.53, 0.4, 0.5, 0.18]);
	// allWalls.push([0.43, 0.15, 0.11, 0.67]);
	// allWalls.push([0.84, 0.15, 0.11, 0.67]); 
	// allWalls.push([0.06, 0.15, 0.11, 0.16]);
	// allWalls.push([0.06, 0.75, 0.11, 0.16]);
	// allWalls.push([0.84, 0.15, 0.11, 0.16]); 
	// allWalls.push([0.84,  0.75, 0.11, 0.16]); 
	enemiesFacePlayer();
	for(var i=0; i < enemies.length; i++)
	{			
		aiShootPlayer(enemies[i]);
		randomiseAiMovements(enemies[i]);
	}
	
	draw();
	
}
function collidesWithAnyWall(x, y, size)
{
	var objectRight = x+size;
	var objectBottom = y+size;
	var objectTop = y;
	var objectLeft = x;
	for(var wallNumber = 0; wallNumber < allWalls.length; wallNumber++)
	{
		var currentWall = allWalls[wallNumber];
		var wallX = currentWall[0]*canvasWidth;
		var wallY = currentWall[1]*canvasHeight;
		var wallWidth = currentWall[2]*canvasWidth;
		var wallHeight = currentWall[3]*canvasHeight;
		//dont need true/false? just check if(!=='none')
		var result = ["false", "none"];
	
		if(collides(x, y, size, size, 
		wallX, wallY, wallWidth, wallHeight))
		{
			result[0] = "true";
			
			var fromTop = (objectBottom - wallY);
			var fromBot = (wallY+wallHeight - y);
			var fromLeft = (objectRight -  wallX );
			var fromRight = (wallX+wallWidth -  x);
			
			//top
			if(objectBottom > wallY
			&& objectBottom < wallY+wallHeight
			&& (fromTop) < 5) //checks which side hit
			{
				result[1] = 'top';
				break;
			}
			//bottom
			else if(objectTop > wallY
			&& objectTop < wallY+wallHeight
			&& (fromBot) < 5)
			{
				result[1] = 'bottom';
				break;
			}
			//right
			else if(objectLeft < wallX+wallWidth 
			&& objectLeft > wallX 
			&& (fromRight) < 5)
			{
				result[1] = 'right';
				break;
			}
			//left
			else if(objectRight > wallX 
			&& objectRight < wallX+wallWidth
			&& (fromLeft) < 5) 
			{
				result[1] = 'left';
				break;
				
			}										
		}	
	}
	return result;
}
//Called via setInterval @ 30ms so 33fps
function animate()
{	
	draw();
	var timeOfThisFrame = (new Date()).getTime();
	//time between frames in seconds
	var delta = (timeOfThisFrame - timeOfLastFrame)/1000;
	timeOfLastFrame = timeOfThisFrame;
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	//This code makes so bullet changes angle as turret angle changes
	//     sort of like a yamcha spirit ball on DBZ
	//Angle changes with mouse not static from click position
	/* var yVelocity = Math.cos(angleToMouse); */
		
	//When player is moving
	if(moveKeysHeld > 0 && tank.alive)
	{
		graduallySpin(tank, tank.moveAngle, tank.newAngle);
		var newX = tank.xPosition + delta * tank.speed * Math.sin(tank.moveAngle*(Math.PI/180));
		var newY = tank.yPosition - delta * tank.speed * Math.cos(tank.moveAngle*(Math.PI/180));		
		tank.centerX = tank.xPosition+0.5*tank.size;
		tank.centerY = tank.yPosition+0.5*tank.size;
		var tankRight = newX+tank.size;
		var tankBottom = newY+tank.size;
		var tankLeft = tank.xPosition;
		var tankTop = tank.yPosition;
		if(isOnScreen(newX,newY,tank.size))		
		{
			var collidesResult = collidesWithAnyWall(newX,newY,tank.size);
			var willCollideWithWall = collidesResult[0]=='true';
			var sideHit = collidesResult[1];
			if(willCollideWithWall)
			{
				//TODO: Need check for corners
				//slide if moving diagonally
				if(sideHit == 'top' //checks which side hit
				|| sideHit == 'bottom')
				{						
					tank.xPosition = newX;
				}
				//right
			else if(sideHit == 'right' //checks which side hit
				|| sideHit == 'left')
				{						
					tank.yPosition = newY;
				}
			}//when not going off screen or hitting wall
			else
			{
				tank.xPosition = newX;
				tank.yPosition = newY;
			}
		}
		else //slide when hitting edge of screen
		{
			//TODO: Need check for corners
			//check if hitting topbottom or sides
			if(tankRight > canvasWidth
			|| tankLeft < 1
			&& tankBottom < canvasHeight
			&& tankTop > 1)
			{				
				tank.yPosition = newY;
			}
			else if(tankBottom > canvasHeight
			|| tankTop < 1
			&& tankRight < canvasWidth
			&& tankLeft > 1)
			{
				tank.xPosition = newX;
			}
		}
			
		turretFaceMouse();
	}
	//Animate enemies
	var checkDistance = 30;
	for(var i = 0; i < enemies.length; i++)
	{		
		var currentEnemy = enemies[i];
		var enemyNewX = currentEnemy.xPosition + delta * currentEnemy.speed * Math.sin(currentEnemy.moveAngle*(Math.PI/180));
		var enemyNewY = currentEnemy.yPosition - delta * currentEnemy.speed * Math.cos(currentEnemy.moveAngle*(Math.PI/180));
		graduallySpin(currentEnemy, currentEnemy.moveAngle, currentEnemy.newAngle);
		//check enemy onscreen or hittin wall
		if(isOnScreen(enemyNewX,enemyNewY,currentEnemy.size))
		{
			// var isHittingWall = false;
			//check all walls for colision with current enemy
			var enemyCollidesResult = collidesWithAnyWall(enemyNewX,enemyNewY,currentEnemy.size);
			var willCollideWithWall = enemyCollidesResult[0]=='true';
			var sideHit = enemyCollidesResult[1];
			if(willCollideWithWall)
			{
				if(sideHit == 'top' //checks which side hit
				|| sideHit == 'bottom')
				{						
					currentEnemy.xPosition = enemyNewX;
				}
				//right
				else if(sideHit == 'right' //checks which side hit
				|| sideHit == 'left')
				{						
					currentEnemy.yPosition = enemyNewY;
				}
			}//when not going off screen or hitting wall
			else
			{
				currentEnemy.xPosition = enemyNewX;
				currentEnemy.yPosition = enemyNewY;
			}
			
			/* for(var wallNumber = 0; wallNumber < allWalls.length; wallNumber++)
			{
				var currentWall = allWalls[wallNumber];
				var wallX = currentWall[0]*canvasWidth;
				var wallY = currentWall[1]*canvasHeight;
				var wallWidth = currentWall[2]*canvasWidth;
				var wallHeight = currentWall[3]*canvasHeight;
				
				//if colliding with current wall
				if(collides(enemyNewX, enemyNewY, 
				currentEnemy.size, currentEnemy.size, 
				wallX, wallY, wallWidth, wallHeight))
				{	
				//when collides with any of the walls, dont move
					isHittingWall = true;
				}				
			} */
			// if(!isHittingWall)
			// {
				// currentEnemy.xPosition = enemyNewX;
				// currentEnemy.yPosition = enemyNewY;
			// }
			/* currentEnemy.xPosition = enemyNewX;
			currentEnemy.yPosition = enemyNewY; */
		}	
		currentEnemy.centerX = currentEnemy.xPosition+0.5*currentEnemy.size;
		currentEnemy.centerY = currentEnemy.yPosition+0.5*currentEnemy.size;
		//check if enemy will go off screen or hit wall in near future
		var checkX = currentEnemy.centerX + checkDistance*Math.sin(currentEnemy.moveAngle*(Math.PI/180));
		var checkY = currentEnemy.centerY - checkDistance*Math.cos(currentEnemy.moveAngle*(Math.PI/180));
		var checkerCollidesResult = collidesWithAnyWall(checkX,checkY,0);
		var willCollideWithWall = checkerCollidesResult[0]=='true';
		var sideHit = checkerCollidesResult[1];
		//when checker hits wall, randomise angle again
		if(willCollideWithWall
		|| !isOnScreen(checkX, checkY, 0))
		{
			// console.log("check wall or offscreen");
			clearInterval(currentEnemy.moveTimer);
			randomiseAiMovements(currentEnemy);
		}
	}	
	//Animate bullets
	bulletLoop: for(i = 0; i < allBullets.length; i++)
	{
		var xVelocity = Math.sin(allBullets[i].travelAngle);
		var yVelocity = Math.cos(allBullets[i].travelAngle);
		
		allBullets[i].xPosition += xVelocity * delta * allBullets[i].speed;
		allBullets[i].yPosition -= yVelocity * delta * allBullets[i].speed;
		
		//Check bullets hitting edge of screen and wall for bouncing
		// for(var i = 0; i < allBullets.length; i++)
		// {			
			var currentBullet = allBullets[i];
			var bulletRight = currentBullet.xPosition+currentBullet.size;
			var bulletBottom = currentBullet.yPosition+currentBullet.size;
			var bulletTop = currentBullet.yPosition;
			var bulletLeft = currentBullet.xPosition;
						//need add buffer? -buffer from x and y and add to size?
			var detectionBuffer = currentBullet.size;
			var bulletCollidesResult = collidesWithAnyWall(
				currentBullet.xPosition - 0.5*detectionBuffer, 
				currentBullet.yPosition - 0.5*detectionBuffer, 
				2*currentBullet.size);
			var willBulletCollide = bulletCollidesResult[0]=='true';
			var sideHit = bulletCollidesResult[1];
			//check edge of screen
			if(!isOnScreen(currentBullet.xPosition, currentBullet.yPosition, bulletSize))
			{
				currentBullet.bounceCount++;// justBounced(currentBullet);
				if(currentBullet.bounceCount > 3)//bullets die at 3 bounces
				{
					explode(allBullets[i]);					
					allBullets.splice(i, 1); 
					// break bulletLoop;
				}//if hit sides
				else if(bulletRight > canvasWidth
				|| bulletLeft < 0)
				{				
					currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;								
					
				}//if hit top and bottom
				else if(bulletBottom > canvasHeight
				|| bulletTop < 0)
				{
					currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				}
				//break bulletLoop;
			}//if collides with walls
			else if(willBulletCollide)
			{
				currentBullet.bounceCount++;
				if(currentBullet.bounceCount > 3)
				{
					explode(allBullets[i]);					
					allBullets.splice(i, 1); 
					// break bulletLoop;
				}				
				else if(sideHit == 'top' //checks which side hit
				//bottom
				|| sideHit == 'bottom')
				{						
					currentBullet.travelAngle = 3.14159-currentBullet.travelAngle;
				}
				//right
				else if(sideHit == 'right' //checks which side hit
				//bottom
				|| sideHit == 'left')
				{
						//sides
					currentBullet.travelAngle = 6.28318531-currentBullet.travelAngle;	
				}
				//break bulletLoop;
			}//bullet hit player
			else if(tank.collides(currentBullet) && (currentBullet.shooter != tank
			|| currentBullet.shooter == tank && currentBullet.bounceCount > 0))
			{		
				explode(currentBullet);							
				allBullets.splice(i, 1); 	
				// tankExplode(tank);
				explode(tank);
				tank.alive = false;
				console.log("player die");
				tank.baseImage = tank.baseImages[2];
				messageLabel.html( "You Lose!" );
				messageLabel.css('display', 'block');
				//break bulletLoop;
			}
			//bullet hit enemy
			for(var j = 0; j < enemies.length; j++)
			{
				if(enemies[j].collides(currentBullet) && (currentBullet.shooter !=enemies[j]
				|| currentBullet.shooter == enemies[j] && currentBullet.bounceCount > 0))
				{						
					explode(currentBullet);				
					explode(enemies[j]);
					clearInterval(enemies[j].shootTimer);
					allBullets.splice(i, 1); 					
					enemies.splice(j, 1)	
					if(enemies.length == 0)
					{								
						messageLabel.html( "You Win!" );
						messageLabel.css('display', 'block');
					}
					// tankExplode(currentBullet);
					break;
					//break bulletLoop;
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
					allBullets.splice(i, 1); 	
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
		// }	
	}
	var EXPLOSION_TIME = 300;
	var EXPLOSION_SPEED = 0.2;
	//Animate explosions, change images after a certain time
	for(i =0; i < allExplosions.length; i++)
	{
		var thisTime = (new Date()).getTime();
		var delta = thisTime - allExplosions[i][4];
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
			allExplosions[i][2] = delta*EXPLOSION_SPEED;
			// allExplosions[i][0].src = bulletExplosions[1];
		}
	}
	requestAnimationFrame(animate);
}
function drawDirectionLines(tank)
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");		
	// ctx.clearRect(0,0,canvasWidth,canvasHeight);
	var lineLength = 50;
	var plusX = lineLength * Math.sin(tank.moveAngle*(Math.PI/180));
	var plusY = lineLength * Math.cos(tank.moveAngle*(Math.PI/180));
	ctx.beginPath();
	ctx.moveTo(tank.centerX,tank.centerY);
	ctx.lineTo(tank.centerX+plusX,tank.centerY-plusY);					
	ctx.strokeStyle="#aeddcc";
	ctx.stroke();	
	
	var plusX2 = lineLength * Math.sin(tank.newAngle*(Math.PI/180));
	var plusY2 = lineLength * Math.cos(tank.newAngle*(Math.PI/180));
	ctx.beginPath();
	ctx.moveTo(tank.centerX,tank.centerY);
	ctx.lineTo(tank.centerX+plusX2,tank.centerY-plusY2);					
	ctx.strokeStyle="#FF0000";
	ctx.stroke();	
}
function draw()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");		
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	//Draw all enemies
	enemiesFacePlayer();
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw(ctx);
		// drawDirectionLines(enemies[i]);
	}
	
		movement.isMoving = tank.isMoving;
		movement.moveAngle = tank.moveAngle;
	//Draws player and turret
	// if(tank.alive)
	// {
		tank.draw(ctx);
	// }		
	// drawDirectionLines(tank);
	//draw all walls
	for(var i = 0; i < allWalls.length; i++)
	{
		drawWall(ctx,allWalls[i][0],allWalls[i][1],allWalls[i][2],allWalls[i][3]);	
	}
	
	/* enemy.draw(ctx); */	
	//Draw all bullets in bullet array	
	for(i = 0; i < allBullets.length; i++)
	{		
		allBullets[i].draw(ctx);		
	}
	//Draw all explosions
	for(i =0; i < allExplosions.length; i++)
	{
		//dont need image in array if using arc
		var currentExplosion = allExplosions[i];
		var centerX = currentExplosion[0];
		var centerY = currentExplosion[1];
		var radius = currentExplosion[2];
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.fillStyle = currentExplosion[5];
		ctx.fill();
				
		// ctx.drawImage(allExplosions[i][0], allExplosions[i][1], allExplosions[i][2], allExplosions[i][3], allExplosions[i][3]);	
		
	}	
	//Draw all wall shadows and top part
	for(var i = 0; i < allWalls.length; i++)
	{
		drawWallShadow(ctx,allWalls[i][0],allWalls[i][1],allWalls[i][2],allWalls[i][3]);	
	}
	
	
}
function drawWall(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight)
{
	//draw top
	var width = wallDivideWidth*canvasWidth;
	var height = wallDivideHeight*canvasHeight;
	var x = xDivideWidth*canvasWidth;
	//minus sidewall thickness so tanks can go under the top part a little
	// giving illusion of 3d
	var y = yDivideHeight*canvasHeight;
	context.fillStyle=wallColour;
	context.fillRect(x,y,width,height);
	//draw darker side	- juts make shadow bigger
	// context.fillStyle="#9F7B00";
	// context.fillRect(x,y+height-sideWallThickness,width,sideWallThickness);
	
}
//Need seperate function so can be drawn above objects
function drawWallShadow(context, xDivideWidth, yDivideHeight, wallDivideWidth, wallDivideHeight)
{
	//draw shadow	
	var width = wallDivideWidth*canvasWidth;
	var height = wallDivideHeight*canvasHeight;
	var x = xDivideWidth*canvasWidth;
	var y = yDivideHeight*canvasHeight;
	context.fillStyle="#000000";
	context.globalAlpha = 0.5;
	context.fillRect(x,y+height-sideWallThickness,width,2*sideWallThickness);
	context.globalAlpha = 1.0;
	context.fillStyle=wallColour;
	context.fillRect(x,y-sideWallThickness+2,width,sideWallThickness);
	
}
function justBounced(bullet)
{
	bullet.justBounced = true;
	setTimeout(function()
	{
		bullet.justBounced = false; 
	}, 200);
}

//function explode(object)
function explode(object)
{
	var centerX = object.xPosition - 0.5*object.size;
	var centerY = object.yPosition - 0.5*object.size;
	var radius = 0.5*object.size; //starting radius
	var maxSize = object.size;
	var timeCreated = (new Date()).getTime();
	// var explosion = new Image;	
	// explosion.src = bulletExplosions[0];	
	// var thisExplosion = [explosion,xPos,yPos,size,timeCreated];
	var thisExplosion = [centerX,centerY,radius, maxSize, timeCreated, 'white'];
	allExplosions.push(thisExplosion);	
	if(soundEnabled)
	{
		/* snareSound.currentTime = 0; */
		/* snareSound.play(); */
	}
	if(object.isTank)
	{
		var randomX = Math.random()*radius + object.xPosition;
		var randomY = Math.random()*radius + object.yPosition;
		thisExplosion = [randomX,randomY,radius, maxSize, timeCreated, 'red'];
		allExplosions.push(thisExplosion);	
		randomX = Math.random()*radius + object.xPosition;
		randomY = Math.random()*radius + object.yPosition;
		thisExplosion = [randomX,randomY,radius, maxSize, timeCreated, 'orange'];
		allExplosions.push(thisExplosion);	
	}
}
function graduallySpin(tankToSpin, angleFrom, angleTo)
{			
		//Calculate difference in angles
		var difference = angleTo - angleFrom;		
		var changeAngle = tankToSpin.moveAngle;
		//Make sure difference is positive
		if(difference < 0)
		{
			difference=-difference;
		}		
		if(difference!=0)
		{
			//Decides whether to rotate clockwise or anti
			if(difference < 180 && tankToSpin.newAngle > tankToSpin.moveAngle 
			|| difference > 180 && tankToSpin.newAngle<=90)
			{	
				changeAngle+=ROTATE_SPEED;
			}
			else if(difference >= 180 
			|| (difference < 180 && tankToSpin.newAngle < tankToSpin.moveAngle))
			{	
				changeAngle-=ROTATE_SPEED;
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
		tankToSpin.moveAngle = changeAngle;
}
//For track movement and lights
function animateTanks(tankList)
{		
	for(var i = 0; i < tankList.length; i++)
	{
		var tankToAnimate = tankList[i];
		if(tankToAnimate.isMoving)//need ismoving moved to Tank object
		{		
			// tankToAnimate.baseImage.src = tankToAnimate.baseImages[tankToAnimate.currentFrame];
			tankToAnimate.baseImage = tankToAnimate.baseImages[tankToAnimate.currentFrame];
			tankToAnimate.currentFrame = (tankToAnimate.currentFrame + 1)	% tankToAnimate.baseImages.length; 	
			
		} 
	}  
}
var randomShootTimer;
var randomShootTimer2;
function aiShootPlayer(enemy)
{
	// clearInterval(enemy.shootTimer);
	var duration = Math.random() * 3 + 1;
	//Delay before they can shoot
	if((new Date()).getTime()-gameStartTime> 500)
	{
		var newBullet = new Bullet(enemy, enemy.turretAngle*(Math.PI/180));	
		allBullets.push(newBullet);				
		if(soundEnabled)		
		{
			if(enemy.id == "ufo")
			{
				snareSound.currentTime = 0;
				snareSound.play();
			}
			else if(enemy.id == "truck")
			{
				kickSound.currentTime = 0;
				kickSound.play();
			}
			
		}
	}
	//only shoot again at a random time if click not held	
	if(!heldDown)
	{					
		var duration = Math.random() * 3 + 1;
		enemy.shootTimer = setTimeout(function() {aiShootPlayer(enemy)}, duration*1000);
	}
	else
	{
		//handled in mouseDown function
	}	
}
//Gives the given enemy a randomised moveAngle
// makes sure this angle wont result in a wall collision
function randomiseAiMovements(enemy)
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var perimeterSize = enemy.size*2;
	//tween 0.2*canvasWidth and canvasWidth - 0.2
	var toX = 0;
	var toY = 0;
	//with these positions whether it will hit wall in future
	var willCollide = true;
	var lineWillCollide = true;
	var interval = 5;
	var checkX = 0;
	var checkY = 0;
	var checkAngle = Math.random()*360;
	var checkDistance = 150;	

	//check if new xy line will collide
	pointCheckLoop:
	for(var pointNumber = 0; pointNumber < 100; pointNumber++)
	{
		checkAngle = Math.random()*360;
		checkX = enemy.centerX + checkDistance*Math.sin(checkAngle*(Math.PI/180));
		checkY = enemy.centerY - checkDistance*Math.cos(checkAngle*(Math.PI/180));
		var checkerCollidesResult = collidesWithAnyWall(checkX,checkY,0);
		var willCollideWithWall = checkerCollidesResult[0]=='true';
		var sideHit = checkerCollidesResult[1];
		//if point wont collide, break loop
		if(!willCollideWithWall)
		{
			// console.log(checkAngle);
			if(isOnScreen(checkX, checkY, 0))
			{
				// console.log(checkX, checkY, pointNumber);					

				break pointCheckLoop;
			}		
		}
		
		// else if()
		// {
			// console.log(checkAngle, enemy.id);
			// break;
		// }
	}
	
	/* while(lineWillCollide) */
	//creates a random x y then checks a line from center of player
	// to that point to ensure it will not collide
	
	//randomLineLoop: 
	/* for(var lineNumber = 0; lineNumber < 100; lineNumber++)
	{
		//could make different enemies have different areas they will go
		//  maybe as parameter randomise(enemy, x, y, width, height)
		// var toX = Math.random() * (canvasWidth*0.7)+0.2*canvasWidth;
		// var toY = Math.random() * (canvasHeight*0.7)+0.2*canvasHeight;
		var toX = Math.random() * canvasWidth;
		var toY = Math.random() * canvasHeight;
		// console.log(toX/canvasWidth+"y: "+toY/canvasWidth);
		// ctx.fillRect(0.2*canvasWidth, 0.2*canvasHeight, canvasWidth*0.7, canvasHeight*0.7);			
		checkX = enemy.centerX;
		checkY = enemy.centerY;
		checkAngle = Math.atan2(toX - enemy.centerX, -(toY - enemy.centerY) );
		checkAngle = Math.floor(checkAngle*(180/Math.PI));
		//go one iteration before starting loop
		checkX += interval * Math.sin(checkAngle);
		checkY += interval * Math.cos(checkAngle);
		var pointCollides = false;
		var iterations = 10;
		//check x points along the line
		// if(allWalls.length < 1)
		// {
			// break randomLineLoop;			
		// }
		pointsOnLineLoop:
		for(var pointNumber = 1; pointNumber < iterations; pointNumber++)
		{
			var pointCollides = false;
			var pointOffScreen = false;
			for(var wallNumber = 0; wallNumber < allWalls.length; wallNumber++)
			{	
				var buffer = sideWallThickness;
				var currentWall = allWalls[wallNumber];
				var wallX = currentWall[0]*canvasWidth-buffer;
				var wallY = currentWall[1]*canvasHeight-2*buffer;
				var wallWidth = currentWall[2]*canvasWidth+2*buffer;
				var wallHeight = currentWall[3]*canvasHeight+2*buffer;
				pointCollides = collides(checkX, checkY, 0, 0, wallX, wallY, wallWidth, wallHeight)
				pointOffScreen = !isOnScreen(checkX, checkY, 0);
				
				//add buffer to walls so they dont go near them
				
					
				var aacollides = collides(checkX, checkY, 0, 0, wallX, wallY, wallWidth, wallHeight);
				var aaoffscreen = !isOnScreen(checkX, checkY, 0);
				lineWillCollide = false;	
				// ctx.fillStyle="#FFFFFF";
				// ctx.globalAlpha = 0.2;
				// ctx.fillRect(wallX,wallY,wallWidth,wallHeight);
				// ctx.globalAlpha = 1;
				//keep setting will collide to collide() result until !willCollide
				//when end of all iterations stil not collided
				if(pointNumber == iterations-1)
				{
					
					lineWillCollide = false;
					ctx.beginPath();
					ctx.moveTo(enemy.centerX,enemy.centerY);
					ctx.lineTo(checkX,checkY);					
					ctx.strokeStyle="#000000";
					ctx.stroke();	
					break randomLineLoop;
				}
				
				if(pointCollides)
				{
					// wallColour = "#000000";	
					lineWillCollide = true;
					ctx.beginPath();
					ctx.moveTo(enemy.centerX,enemy.centerY);
					ctx.strokeStyle="#FF0000";
					ctx.lineTo(checkX,checkY);
					ctx.stroke(); 
					break pointsOnLineLoop;
				}
				else if(pointOffScreen)
				{						
					ctx.beginPath();
					ctx.moveTo(enemy.centerX,enemy.centerY);
					ctx.strokeStyle="#FF0000";
					ctx.lineTo(checkX,checkY);
					ctx.stroke(); 
					break pointsOnLineLoop;
				}
				else //when hasnt collided, go further on line
				{				
					// if(!pointOffScreen)
					// {
					checkX += interval * Math.sin(checkAngle);
					checkY += interval * Math.cos(checkAngle);
					// }lineWillCollide = false;
					// ctx.beginPath();
					// ctx.moveTo(enemy.centerX,enemy.centerY);
					// ctx.lineTo(checkX,checkY);					
					// ctx.strokeStyle="#000000";
					// ctx.stroke();	
					
				}				
			}
		}
		if(lineNumber == 99)
		{
			if(lineWillCollide)
			{
				console.log("all attempts collide");
			}
		}
	} */	
	// ctx.fillStyle="#C59900";
	// ctx.fillRect(enemy.xPosition-0.5*perimeterSize,enemy.centerY-0.5*perimeterSize,perimeterSize,perimeterSize);
	//random * range + from
	var duration = Math.random() * 0.5 + 0.25;
	var newAngle = checkAngle;
	// newAngle = Math.atan2(toX - enemy.centerX, -(toY - enemy.centerY) );
	// newAngle = Math.floor(newAngle*(180/Math.PI));
	if(newAngle < 0)
	{		
		newAngle = 360 + newAngle;
	}
	//round to nearest multiple of rotate speed	
	newAngle = Math.ceil(newAngle/ROTATE_SPEED)*ROTATE_SPEED; 
	enemy.newAngle = newAngle;
	// console.log(newAngle);
	//repeat this function after random time
	//create move timer in enemy and clear when collide
	enemy.moveTimer = setTimeout(function() {randomiseAiMovements(enemy)}, duration*1000);
	
	// setTimeout(function() {randomiseAiMovements(enemy)}, duration*1000);
	// setTimeout(function() {randomiseAiMovements(enemy)}, 2000);

}
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
	context.drawImage(imageToRotate, -0.5*size, -0.5*size, size, size);
    // we’re done with the rotating so restore the unrotated context
    context.restore();
	/* context.drawImage(imageToRotate, -0.5*shipSize, -0.5*shipSize, shipSize, shipSize); */ 
}
function turretFaceMouse()
{
	tank.turretAngle = Math.atan2(mouseX - tank.xPosition-0.5*tank.size, -(mouseY - tank.yPosition-0.5*tank.size) );
	tank.turretAngle = tank.turretAngle*(180/Math.PI);
}
function enemiesFacePlayer()
{
	for(var i = 0; i < enemies.length; i++)
	{
		var currentEnemy = enemies[i];
		currentEnemy.turretAngle = Math.atan2(tank.centerX - currentEnemy.centerX, -(tank.centerY - currentEnemy.centerY) );
		currentEnemy.turretAngle = currentEnemy.turretAngle*(180/Math.PI);
	}
	// enemy.turretAngle = Math.atan2(tank.centerX - enemy.centerX, -(tank.centerY - enemy.centerY) );
	// enemy.turretAngle = enemy.turretAngle*(180/Math.PI);
}
//Create a bullet and send towards mouse
function playerShootsMouse(mouseX, mouseY)
{
	bulletAngle = Math.atan2(mouseX - tank.centerX, - (mouseY - tank.centerY));
	// bulletAngle = Math.atan2(200 - tank.centerX, - (200 - tank.centerY));
			
	var newBullet = new Bullet(tank, bulletAngle);
	//bullets.push(newBullet);
	//tank.bullets.push(newBullet);
	
	allBullets.push(newBullet);
	if(soundEnabled)
	{
		hatSound.currentTime = 0;
		hatSound.play();
	}
}
var heldDown = false;
var BEAT_TIME = 700;
var timeFirstHeld = 0;
// function nothing()
var beatTimer;
var snareTimer;
var snareTimer2;

var delayTimer;
var delayTimer2;
/* var mouseX = 0;
var mouseY = 0; */
window.onmousedown = function(e)
{
	//only if left click?
	// better to have gameOver/stageWon variable
	if(tank.alive)
	{	
		playerShootsMouse(mouseX,mouseY);
		//timer for players bullets
		heldDown = true;
		// clearInterval(enemies[0].shootTimer);
		// clearInterval(enemies[1].shootTimer);
		/* clearInterval(beatTimer);
		clearInterval(snareTimer);
		clearInterval(snareTimer2);
		clearInterval(delayTimer);
		clearInterval(delayTimer2);	
		clearInterval(randomShootTimer);
		clearInterval(randomShootTimer2); */
		beatTimer = setInterval(function() 
		{ 			
			playerShootsMouse(mouseX,mouseY);
		},0.25*BEAT_TIME);
		
		/* timer for ememy bullets to follow player */
		/* delayTimer = setTimeout(function() 
		{		
			clearInterval(enemies[0].shootTimer);
			snareTimer = setInterval(function() 
			{ 				
				aiShootPlayer(enemies[0]);
			},BEAT_TIME*2);	//rhythm
		}, BEAT_TIME); //delay
		delayTimer2 = setTimeout(function() 
		{		
			clearInterval(enemies[1].shootTimer);
			snareTimer2 = setInterval(function() 
			{ 						
				aiShootPlayer(enemies[1]);
			},BEAT_TIME);	
		}//delay to start
		, BEAT_TIME); */
	}	
}
window.onmouseup = function()
{	
	heldDown = false;
	//use tank/enemy[x].shootTimer instead?
	clearInterval(beatTimer);
	// clearInterval(snareTimer);
	// clearInterval(snareTimer2);
	// clearInterval(delayTimer);
	// clearInterval(delayTimer2);	
	// clearInterval(enemies[0].shootTimer);
	// clearInterval(enemies[1].shootTimer);
	
	//duration = (random * range) + minimum. Max = range + minimum
	//var duration = Math.random() * 3 + 1;
		//delay this so doesnt shoot on mouseup
	// enemies[0].shootTimer = setTimeout(function() {aiShootPlayer(enemies[0])}, duration*1000);
	// duration = Math.random() * 3 + 1;
	// enemies[1].shootTimer = setTimeout(function() {aiShootPlayer(enemies[1])}, duration*1000);	
}
canvas.mousemove(function(e)
{
	/* angleToMouse = Math.atan2(e.pageX - shipX-0.5*shipSize, -(e.pageY - shipY-0.5*shipSize) ); */
	mouseX = e.pageX;
	mouseY = e.pageY;
	turretFaceMouse();
 });
//Handles keypressed events, will change for more inputs
function startAgain()
{
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	if(enemies.length!=0)
	{				
		clearInterval(enemies[0].shootTimer);
		clearInterval(enemies[1].shootTimer);
	}
	enemies = [];
	allBullets = [];
	allExplosions = [];
	allWalls = [];
	init();
}
function keypressed(e) 
{
    switch(e.keyCode) {
		case 71:
			//g key pressed
			
			clearInterval(beatTimer);
			break
		case 72:
		//h key pressed (debugging)	
			//try restart game
			// tank = null;
			startAgain();
			// console.log(tank.xPosition+" and "+tank.yPosition);
			break
		case 32:
			//spacebar pressed boost
			/* tank.isBoosting = true;
			setTimeout(function(){tank.isBoosting = false;} */
			tank.speed = tank.speed*4;
			setTimeout(function(){tank.speed= tank.speed/4;}, 250);
			break
        case 37:
		case 65:
            // left key pressed			
			leftPressed();
            break;
        case 38:		
		case 87:
            // up key pressed
			upPressed();
            break;
        case 39:
        case 68:
            // right key pressed			
			rightPressed();
			break;
        case 40:
        case 83:
            // down key pressed			
			downPressed();
			break;  
		
    }
	tank.newAngle = Math.ceil(tank.newAngle/ROTATE_SPEED)*ROTATE_SPEED;
}
function rightPressed()
{
	//prevent more than one added per key to keysHeld;
		newAngle = 90;
		tank.newAngle = 90;
		if(upDown)
		{
			newAngle = 45;
			tank.newAngle = 45;
		}
		else if(downDown)
		{
			newAngle = 135;
			tank.newAngle = 135;
		}
		if(!rightDown)
		{
			moveKeysHeld++;
		}
		rightDown = true;		
		tank.isMoving = true;
}
function downPressed()
{		
		newAngle = 180;
		tank.newAngle = 180;
		if(rightDown)
		{
			newAngle = 135;
			tank.newAngle = 135;
		}
		else if(leftDown)
		{
			newAngle = 225;
			tank.newAngle = 225;
		}
		if(!downDown)
		{
			moveKeysHeld++;
		}
		downDown = true;
		tank.isMoving = true;
		
}
function leftPressed()
{				
		newAngle = 270;
		tank.newAngle = 270;		
		if(upDown)
		{
			newAngle = 315;
			tank.newAngle = 315;
		}
		if(downDown)
		{
			newAngle = 225;
			tank.newAngle = 225;
		}
		if(!leftDown)
		{
			moveKeysHeld++;
		}
		leftDown = true;
		tank.isMoving = true;
}
function upPressed()
{
		newAngle = 0;
		tank.newAngle = 0;		
		if(leftDown)
		{
			newAngle = 315;
			tank.newAngle = 315;
		}
		else if(rightDown)
		{
			newAngle = 45;
			tank.newAngle = 45;
		}
		if(!upDown)
		{
			moveKeysHeld++;
		}
		upDown = true;	
		tank.isMoving = true;
}
function stopMoving(e)
{
	switch(e.keyCode) {
		case 37:
		case 65:
            // left key pressed
			moveKeysHeld--;
			leftDown = false;
            break;
        case 38:		
		case 87:
            // up key pressed
			moveKeysHeld--;
			upDown = false;
            break;
        case 39:
        case 68:
            // right key pressed
			moveKeysHeld--;
			rightDown = false;
            break;
        case 40:
        case 83:
            // down key pressed
			moveKeysHeld--;
			downDown = false;
            break; 
	}	
	tank.isMoving = false;
	if(upDown)
	{
		upPressed();
	}
	else if(leftDown)
	{
		leftPressed();
	}
	else if(downDown)
	{
		downPressed();
	}
	else if(rightDown)
	{
		rightPressed();
	}
}
// key released, stop movement
