/* Prototyping */
var blocker = document.getElementById('touch');
var player1 = pickCharacter('one',"Lumberjack One");
var player2 = pickCharacter('two',"Lumberjack Two");
var attackMode;
var tapToBlock = Hammer(blocker).on("tap", function(e){block();});
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

}

function attack(player){
    block();
    attackMode = setTimeout(function(){
        tapToBlock = null;
        allocateDamage(player);

    },5000);
}

function block(){
        tapToBlock.enable(true);
        blockCounter++;
        console.log(blockCounter);
        if (blockCounter >= 10){
            clearInterval(attackMode);
            tapToBlock.enable(false);
            blockCounter = 0;
        }
}

function allocateDamage(player){
    player.health -= 1;
    console.log(player);
}
