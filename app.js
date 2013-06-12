
/**
 * Module dependencies.
 */
    // changes

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'mmm');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var userNum = 0;

io.sockets.on('connection', function (socket) {

    function pickCharacter(player,characterName){
        var Player = {
            playerNum: player,
            character: characterName,
            health: 3
        }
        return Player;
    }

    var playerID = pickCharacter(userNum,"user#"+userNum++)
    console.log(playerID);
    var blockCounter  = 0;
    var attackCounter = 0;

    function swing(attacker, blocker){
        console.log("FIGHT");
        setFightListeners();
        attackMode = setTimeout(function(){
            if (blockCounter > attackCounter){
                if ((blockCounter - attackCounter) >= 10 ){
                    stopFightListeners();
                    parried(attacker);
                    io.sockets.in(socket.room).emit('parried');

                } else {
                    stopFightListeners();
                    blocked();
                    io.sockets.in(socket.room).emit('blocked');
                }
            } else if (attackCounter > blockCounter){
                stopFightListeners();
                hit(blocker);
                io.sockets.in(socket.room).emit('hit');
            }

        },5000);
    }

    function setFightListeners(){
        attackCounter = 0;
        blockCounter = 0;
        socket.on('blockAttempt', function(block){
            console.log(block);
            blockCounter += block.blockNum;
            console.log(blockCounter);
            io.sockets.in(socket.room).emit('blockNum', blockCounter);
        });

        socket.on('attackAttempt', function(attack){
            console.log(attack);
            attackCounter += attack.attackNum;
            console.log(attackCounter);
            io.sockets.in(socket.room).emit('attackNum', attackCounter);
        });
    }
    function stopFightListeners(){
        socket.removeAllListeners('blockAttempt');
        socket.removeAllListeners('attackAttempt');
        attackCounter = 0;
        blockCounter = 0;
        socket.in(socket.room).emit('fightEnd');
    }

    //Actions for a succesful hit
    function hit(blocker){
        console.log("HIT");
        allocateDamage(blocker);
    }

//Actions for a successful block
    function blocked(){
        console.log("BLOCKED");
    }

//Actions for a successful parry
    function parried(attacker){
        console.log("PARRIED");
        allocateDamage(attacker);
    }

//Checks to see if player is alive
    function checkDead(player){
        var life = player.health;
        if (life <= 0){
            console.log("PLAYER "+player.playerNum + " IS DEAD");
        }
    }

//Distributes damage to a player and checks their living status
    function allocateDamage(player){
        player.health -= 1;
        console.log(player);
        checkDead(player);
    }


    socket.on('fight', function(data){
        swing(data.attacker, data.blocker);
        console.log(data.attacker, data.blocker);
    });

});

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
