var express = require('express');
var app = require('express')();
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, 'public')));
var http = require('http').Server(app);
var server = require('socket.io')(http);
var socketIO = require('socket.io');
var io = socketIO(server);

var pickupTypes;

app.get('/', function(req, res){
	//could send to menu to choose pc or mobile
  res.sendFile(__dirname + '/2player.html');
  // res.sendFile(__dirname + '/mobile.html');
});

// var players = [];
var allPlayerInfo = {};
var clientList;
var numberConnections = 0;
var activePickups;
var maxPickups = 3;
var gameMode;
function init()
{
	clientList = [];
	activePickups = [];
	pickupTypes = ['health', 'speed', 'ammo'];
	gameMode = 'intro';
	allZombieSpawns = [];
}
//on connection, add new client to players{}
// then send new players{} to everyone
server.on('connection', function(client)
{	
	clientList.push(client);
	numberConnections++;
	//tells new client to add all previous players, and which index
	// to add themselves to the list
		// todo: add previous pickups
		
	client.emit('playerConnect', allPlayerInfo, clientList.length, activePickups, gameMode);	
	//tells client to send its random position through
	//          "newPlayerPosition"
	//adds listener to client for when other new players come
	client.on('newPlayerPosition', function(idPositionType)
	{
		//tells all clients to add this player
			//should broadcast instead?
		// server.emit('addNewPlayer', idAndRandomXandY);
		console.log("New Player: ", idPositionType[1], idPositionType[2]);
		
		console.log("Number of connections: "+clientList.length);
		client.broadcast.emit('addNewPlayer', idPositionType);
	});
	
	//send new player object to all other clients
	
	//movement sent from client x times a second
	client.on('clientPlayerData', function(playerData) 
	{
		var player = allPlayerInfo[client.id] // || {};
		allPlayerInfo[client.id] = playerData;
		//update the data on the server
	});
	client.on('playerRespawn', function(playerData)
	{
		var player = allPlayerInfo[client.id] // || {};
		allPlayerInfo[client.id] = playerData;
		sendGameState(allPlayerInfo);
	});
	
	client.on('disconnect', function() 
	{
		// server.emit('playerDC', client.id);
		server.emit('playerDC', clientList.indexOf(client));
		clientList.splice(clientList.indexOf(client), 1);
		
		console.log('player DC - '+client.id+ 'New Connection#: ' + clientList.length, allPlayerInfo.length);
		
		delete allPlayerInfo[client.id];
	});
	client.on('addBullet', function(recievedBulletInfo)
	{
		// client.broadcast.emit('addBullet', recievedBulletInfo);
		server.emit('addBullet', recievedBulletInfo);
	});
	client.on('boostMe', function(tankIndex)
	{
		client.broadcast.emit('boostTank', tankIndex);
	});
	client.on('moveKeyPressed', function(arrayIndexAndKeyCode)
	{
		client.broadcast.emit('otherPlayerMoveKeyDown', arrayIndexAndKeyCode);
	});
	client.on('keyReleased', function(arrayIndexAndKeyCode)
	{
		client.broadcast.emit('otherPlayerKeyReleased', arrayIndexAndKeyCode);
	});
	client.on('newMoveAngle', function(arrayIndexAndAngle)
	{
		client.broadcast.emit('otherPlayerNewAngle', arrayIndexAndAngle);
	});	
	client.on('newChat', function(arrayIndexAndMessage)
	{
		client.broadcast.emit('otherPlayerChat', arrayIndexAndMessage);
	});
	client.on('stopMoving', function(arrayIndex)
	{
		// client.broadcast.emit('stopOtherPlayerMoving', arrayIndex);
		client.broadcast.emit('stopOtherPlayerMoving', arrayIndex);
	});
	client.on('iGotHit', function(arrayIndex)
	{		
		client.broadcast.emit('otherPlayerHit', arrayIndex);
	});
	//need index in pickups list?
	client.on('iGotPickup', function(pickupIdIndexPlayerIndex)
	{
		activePickups.splice(pickupIdIndexPlayerIndex[1],1);
		client.broadcast.emit('otherPlayerGotPickup', pickupIdIndexPlayerIndex);
	});
	
	client.on('cameraChanged', function(arrayIndexAndCameraXY)
	{		
		client.broadcast.emit('otherPlayerCameraChanged', arrayIndexAndCameraXY);
	});
	
	client.on('addMine', function(tankIndex)
	{
		client.broadcast.emit('otherPlayerMine', tankIndex);
	});
	
	client.on('shieldMe', function(tankIndex)
	{
		client.broadcast.emit('otherPlayerShield', tankIndex);
	});
	
	client.on('shootHoming', function(tankIndex)
	{
		client.broadcast.emit('shootHoming', tankIndex);
	});
	
	
	client.on('setMode', function(modeName)
	{
		gameMode = modeName;//send this on player connect
		activePickups = [];
		client.broadcast.emit('setMode', modeName);
		if(modeName == 'zombies')
		{
			//send start game timer
			var startTime = new Date().getTime();			
			//send list of all respawn positions
			for(var i = 0; i < maxZombies; i++)
			{
				var pointNumber = Math.floor(Math.random()*zombieSpawnPointNumber);
				allZombieSpawns.push(pointNumber);
			}
			server.emit('startZombies', allZombieSpawns, startTime);
		}
	});
	
	
	
});
var allZombieSpawns;
var maxZombies = 100;
var zombieSpawnPointNumber = 4; //should be taken from spawnPoints.length
//send all clients, all player data 60 times a second
setInterval(function() 
{
	// will send more than players in future
	sendGameState(allPlayerInfo);
  // server.sockets.emit('allPlayerData', players);
}, 1000/1);
// }, 1000 / 20);

//timer for new pickups
// time and positions will change based on current mode
setInterval(function() 
{
	//need different positions based on mode/map
	
	var randomX = Math.random()*0.8;
	var randomY = Math.random()*0.8;
	var type = pickupTypes[Math.floor(Math.random() * pickupTypes.length)];		
	var typeAndPosition = [randomX, randomY, type];
	// console.log(activePickups[0]);
	if(activePickups.length < maxPickups
	&& gameMode != 'race'
	&& gameMode != 'intro'
	&& gameMode != 'select')//race is set positions with constant respawn
	{
		activePickups.push(typeAndPosition);
		sendNewPickup(typeAndPosition);
	}
}, 5000);

function sendGameState(allPlayerInfo)
{
	server.sockets.emit('allPlayerData', allPlayerInfo);
}

function sendNewPickup(typeAndPosition)
{
	server.sockets.emit('newPickup', typeAndPosition);
}

var port = 3000;
http.listen(port, '0.0.0.0', function()
{
  console.log('listening on *:'+port);
  init();
});