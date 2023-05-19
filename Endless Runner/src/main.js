/***************************************************

Pehara Vidanagamachchi
cat run
30 Hours
Creative tilt: 7/10

In my game cat run I implemented a jump mechanic that lets you jump in the air, I avoid checking if the player is on the ground
before the next jump which allows them to use the jump as much as they want, I also included sky enemies so they would not
just avoid all the ground enemies by staying up high. I am really proud of my visuals and all the art I made for it,
because it has a very cozy and warm vibe which is what I was going for. I did also make an animated sprite for the player
but I struggled to implement it.

****************************************************/

let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 640,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Load, Title, Play, GameOver ]
}

let game = new Phaser.Game(config);

// Define global variables
let highScore = 0;
let newHighScore = false;

// define globals
let centerX = game.config.width/2;
let centerY = game.config.height/2;
let w = game.config.width;
let h = game.config.height;
const textSpacer = 64;

let level;
let cursors;

