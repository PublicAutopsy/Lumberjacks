/* Prototyping */

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
var attackMode;

var tapToBlock = Hammer(blocker).on("tap", function(e){block();});
var tapToAttack = Hammer(attacker).on("tap", function(e){attack();});
var blockCounter = 0;
var attackCounter = 0;




//Starts the fight sequence
function fight(attacker, blocker){
    swing(attacker, blocker);
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
    attackCounter = 0;
    blockCounter = 0;
    tapToBlock.enable(true);
    tapToAttack.enable(true);
}
function stopFightListeners(){
    tapToBlock.enable(false);
    tapToAttack.enable(false);
    attackCounter = 0;
    blockCounter = 0;
}

//Increases the block meter
function block(){
    blockCounter++;
    console.log("BLOCK: " +blockCounter);
}


//Increases the attack meter
function attack(){
    attackCounter++;
    console.log("ATTACK: " + attackCounter);
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

