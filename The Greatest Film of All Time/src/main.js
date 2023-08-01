/*
Pehara Vidanagamachchi
Grave Of the Fireflies Game
60+ hours spent

Phasers Major Components in use:
Sprites, Camera, Physics, Animations, Audio, Tilemaps, Input controls, Text Objects & Timers.

*/

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LoadScene, MenuScene, CutsceneScene, BombScene, GameOverScene, Cutscene2Scene, GatherScene, FeedSetsukoScene, EndScene, CreditsScene], 
    // scene: [LoadScene, GatherScene],
    physics:{
        default:'arcade',
        arcade:{
            debug:true
        }
    }
};
  
const game = new Phaser.Game(config);

// let keyw, keya, keys, keyd;

let dimensions = 200;
let gameWidth = game.width
let gameHeight = game.height