# TanxMultiplayer
Node JS server for Tanx

### Prerequisites

Node.js with Express installed for the server, Google Chrome for the client.

Install Node at https://nodejs.org/en/download/ then type the following into the command line at your chosen directory.

```
npm install express
```

Download all the files to your directory then in the Node.js CLI type the following to start the server

```
node server.js
```

This should result in the following output

```
listening on *:3000
```

Open chrome go to http://localhost:3000/. Multiple clients/players that are on the same network should be able to connect with the same URL.

### Internet Wide Hosting

To allow players to connect via the internet...

1. Open port 3000 on your router

2. Run server as above

3. Players connect via  yourIpAdress:3000 e.g. 123.12.12.123:3000  (you can get your IP by searching 'what's my ip' on google)

### Game Modes/Commands

Modes can be changed either by entering the zone or typing -modename. Currently 3 working modes so far. -race, -zombies, -cs.

Can go back to the select area via -select

Can restart each mode via -re
