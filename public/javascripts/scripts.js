/* Prototyping */

var socket = io.connect(window.location.origin);


//This will be set over sockets
var player1 = pickCharacter(1,"Lumberjack One");
var player2 = pickCharacter(2,"Lumberjack Two");

function pickCharacter(player,characterName){
    var Player = {
        playerNum: player,
        character: characterName,
        health: 3
    }
    return Player;
}
//--------------------------------



//Setting up some variables and listeners
var blocker = document.getElementById('block');
var attacker = document.getElementById('attack');
var join = document.getElementById('join');
var fight = document.getElementById('fight');
var attackMode;

var tapToBlock = Hammer(blocker).on("tap", function(e){block();});
var tapToAttack = Hammer(attacker).on("tap", function(e){attack();});
tapToBlock.enable(false);
tapToAttack.enable(false);

var clickToJoin = Hammer(join).on("tap", function(){
    console.log("Joining");
    socket.emit('join', {room:"room1"});
});

var clickToFight = Hammer(fight).on("tap", function(){
    console.log("Fighting...");
    socket.emit('fight', {attacker:player1, blocker:player2});
    setFightListeners();

});

socket.on('fightEnd', function(){
    console.log("Fight Over");
    stopFightListeners();
});

//Starts the fight sequence
function fight(attacker, blocker){
    socket.emit('fight', {attacker: attacker, blocker: blocker});
}



//Starts the fight timer and actions
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
    tapToBlock.enable(true);
    tapToAttack.enable(true);
}
function stopFightListeners(){
    tapToBlock.enable(false);
    tapToAttack.enable(false);
}

//Increases the block meter
function block(){
    socket.emit('blockAttempt', {blockNum : 1});
}

socket.on('blockNum', function(block){
    console.log("BLOCK: "+block);
})


//Increases the attack meter
function attack(){
    socket.emit('attackAttempt', {attackNum : 1});
}
socket.on('attackNum', function(attack){
    console.log("ATTACK: "+attack);
})

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

