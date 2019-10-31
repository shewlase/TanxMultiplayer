

function Button(x, y, width)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.clickableWidth = this.width*0.55;
	this.clickableHeight = this.width*0.47;
	this.sideDistanceFromTop = 0; //changes when clicked
	this.recalcClickableX();
}

Button.prototype.recalcClickableX = function()
{	
	this.clickableX	= this.x+0.5*(this.width-this.clickableWidth);
}

function Joystick(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.centerX = this.x+(0.5*this.width);
	this.centerY = this.y+(0.5*this.height);
	this.stickThickness = 0.1*this.width;
	
	//change when moved/clicked
	this.stickXChange = 0;
	this.stickYChange = 0;		
	this.movementTouchStart = [];
	this.isHeldDown = false;
	this.ballCenterX = this.centerX-this.stickXChange;
	this.ballCenterY = this.centerY-this.stickYChange;	
	
	//for animating ball back to rest position
	this.xChangeStart = 0;
	this.yChangeStart = 0;
	this.restoring = false;
	
	//directions can be derived from this 
		//e.g. changeAngle == 90(+- leway), direction = right
	this.changeAngle = 0;
}

function drawEllipse(centerX, centerY, width, height, colour, context) {
	
  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2);
  
  context.bezierCurveTo(
    centerX + width/2, centerY - height/2,
    centerX + width/2, centerY + height/2,
    centerX, centerY + height/2); 

  context.bezierCurveTo(
    centerX - width/2, centerY + height/2,
    centerX - width/2, centerY - height/2,
    centerX, centerY - height/2);
 
  context.fillStyle = colour;
  context.fill();
  context.closePath();	
}


function drawJoysticks(context)
{	
	for(var j = 0; j < allJoysticks.length; j++)
	{
		var joyStickToDraw = allJoysticks[j];
		var centerX = joyStickToDraw.x+0.5*joyStickToDraw.width;
		var centerY = joyStickToDraw.y+0.5*joyStickToDraw.height;
		var stickThickness = joyStickToDraw.stickThickness;	
		var baseCenterY = centerY+3*stickThickness;
		
		context.lineWidth = 0.03*joyStickToDraw.width;
		//only these change
		var circleCenterX = joyStickToDraw.centerX-joyStickToDraw.stickXChange;
		var circleCenterY = joyStickToDraw.centerY-joyStickToDraw.stickYChange;
		// var circleCenterX = joyStickToDraw.centerX;
		// var circleCenterY = joyStickToDraw.centerY;
		// var baseCenterY = centerY+5*stickThickness;
		// var baseCenterY = centerY;//would be circle base
		
		//main base side
		drawEllipse(centerX, baseCenterY+0.5*stickThickness, joyStickToDraw.width*0.8, joyStickToDraw.height*0.45, '#5b0b0a', context);
		context.stroke();
		//main base top
		drawEllipse(centerX, baseCenterY, joyStickToDraw.width*0.8, joyStickToDraw.height*0.45, 'maroon', context);
		context.stroke();
		//circular bottom of stick
		context.beginPath();
		context.arc(centerX, baseCenterY, stickThickness, 0, 2 * Math.PI);
		context.fillStyle = '#c1c1c1';
		context.fill();	
		//the stick
		context.beginPath();
		context.moveTo(centerX- stickThickness, baseCenterY);
		context.lineTo(circleCenterX- stickThickness,circleCenterY);
		context.lineTo(circleCenterX+ stickThickness, circleCenterY);
		context.lineTo(centerX+ stickThickness, baseCenterY);
		context.closePath();
		context.fill();		
		
		//ball on top, outer
		context.beginPath();
		context.fillStyle='#c80012';//dark red
		context.strokeStyle = '#5b0b0a';
		context.arc(circleCenterX, circleCenterY, 0.25*joyStickToDraw.width, 0, 2 * Math.PI);
		context.stroke();	
		context.fill();
		//inner
		context.beginPath();
		context.fillStyle='#e70026';//light red
		context.arc(circleCenterX-0.015*joyStickToDraw.width, circleCenterY-0.015*joyStickToDraw.height, 0.2*joyStickToDraw.width, 0, 2 * Math.PI);
		context.fill();	
		//light reflection
		// rotated ellipse	
		context.save();
		context.translate(circleCenterX-0.8*stickThickness, circleCenterY-0.8*stickThickness);	
		context.rotate(-45*Math.PI/180); 
		// drawEllipse(circleCenterX-0.8*stickThickness, circleCenterY-0.8*stickThickness, 0.25*joystick[2], 0.125*joystick[2], 'white', context);
		context.globalAlpha = 0.6;
		drawEllipse(0, 0, 0.25*joyStickToDraw.width, 0.125*joyStickToDraw.width, 'white', context);
		context.restore();
	}
}
function drawButtons(context)
{	
	//BUTTONS
	 //should loop through allButtons
	 
	for(var i = 0; i < allButtons.length; i++)
	{			 
		var buttonToDraw = allButtons[i];
		// var buttonToDraw = allButtons[0];
		var buttonX = buttonToDraw.x;
		var buttonY = buttonToDraw.y;
		var buttonSize = buttonToDraw.width;
		var buttonCenterXY = [buttonX+0.5*buttonSize, buttonY+0.5*buttonSize];
		var topCenterY = buttonY+0.2*buttonSize;
		// var topCenterY = buttonY+0.3*buttonSize;
		var clickableWidth = buttonToDraw.clickableWidth;	
		var clickableHeight = clickableWidth.clickableHeight;
		var clickableX = clickableWidth.clickableX;
		context.lineWidth = 0.03*buttonSize;
		//base side
		drawEllipse(buttonCenterXY[0], topCenterY+0.22*buttonSize, buttonSize, buttonSize*0.5, '#5b0b0a', context);
		context.stroke();
		//base top
		drawEllipse(buttonCenterXY[0], topCenterY+0.15*buttonSize, buttonSize, buttonSize*0.5, 'maroon', context);
		context.stroke();
		
		// ------------- should match base dimensions of stick --------
		
		//main base side
		// drawEllipse(centerX, baseCenterY+0.5*stickThickness, joyStickToDraw.width*0.8, joyStickToDraw.height*0.45, '#5b0b0a', context);
		// context.stroke();
		//main base top
		// drawEllipse(centerX, baseCenterY, joyStickToDraw.width*0.8, joyStickToDraw.height*0.45, 'maroon', context);
		// context.stroke();
		
		
		//button side
		drawEllipse(buttonCenterXY[0], topCenterY+0.07*buttonSize, buttonSize*0.7, buttonSize*0.40, '#c80012', context);
		//button top
		drawEllipse(buttonCenterXY[0], topCenterY+buttonToDraw.sideDistanceFromTop, buttonSize*0.7, buttonSize*0.40, '#e70026', context);
		context.lineWidth = 0.01*buttonSize;
		context.stroke();
	}	
}

function drawJoystickArea(context)
{
	context.fillStyle='white';//red
	// context.fillRect(joystick[0],joystick[1],joystick[2],joystick[3]);
	context.fillRect(allJoysticks[0].x, allJoysticks[0].y, allJoysticks[0].clickableWidth, allJoysticks[0].clickableHeight);
	
	context.fillStyle='white';//red
	// context.fillRect(joystick[0],joystick[1],joystick[2],joystick[3]);
	context.fillRect(allButtons[0].clickableX, allButtons[0].y, allButtons[0].clickableWidth, allButtons[0].clickableHeight);
	context.fillRect(allButtons[1].clickableX, allButtons[1].y, allButtons[1].clickableWidth, allButtons[1].clickableHeight);
}
