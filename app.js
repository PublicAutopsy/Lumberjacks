
/**
 * Module dependencies.
 */

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

io.sockets.on('connection', function (socket) {
    var blockCount =0;
    var attackCount=0;

    socket.on('join', function(data){
        console.log(data.room);
        socket.join(data.room);
        io.sockets.clients(data.room);
    });

    function swing(attacker, blocker){
        console.log("FIGHT");
        setFightListeners();
        attackMode = setTimeout(function(){
            if (blockCounter > attackCounter){
                if ((blockCounter - attackCounter) >= 10 ){
                    stopFightListeners();
                    parried(attacker);

                } else {
                    stopFightListeners();
                    blocked();
                }
            } else if (attackCounter > blockCounter){
                stopFightListeners();
                hit(blocker);
            }

        },5000);
    }

    function setFightListeners(){
        attackCounter = 0;
        blockCounter = 0;
        socket.on('blockAttempt', function(block){
            console.log(block);
            blockCount += block.blockNum;
            console.log(blockCount);
            io.sockets.in("room1").emit('blockNum', blockCount);
        });

        socket.on('attackAttempt', function(attack){
            console.log(attack);
            attackCount += attack.attackNum;
            console.log(attackCount);
            io.sockets.in("room1").emit('attackNum', attackCount);
        });
    }
    function stopFightListeners(){
        socket.removeAllListeners('blockAttempt');

        socket.removeAllListeners('attackAttempt');
        attackCounter = 0;
        blockCounter = 0;
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
