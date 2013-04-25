/* Prototyping */

var player1 = pickCharacter('one',"Lumberjack One");
var player2 = pickCharacter('two',"Lumberjack Two");
var attackMode;
var blockCounter = 0;
var attackCounter = 0;

function pickCharacter(player,characterName){
    var Player = {
        playerNum: player,
        character: characterName,
        health: 3
    }
    return Player;
}


function fight(attacker, blocker){
    attack(blocker);
//    block();
}

function attack(player){
    attackMode = setTimeout(function(){
        allocateDamage(player);
    },5000);
}

function block(){
    clearInterval(attackMode);
}

function allocateDamage(player){
    player.health -= 1;
    console.log(player);
}
