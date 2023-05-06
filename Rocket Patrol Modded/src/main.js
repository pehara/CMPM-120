/*
Pehara Vidanagamachchi
Rocket Patrol goes pastel
24+ hours spent

MODS COMPLETED
    Create a new scrolling tile sprite for the background                           (5)
    Implement the speed increase that happens after 30 seconds in the original game (5)
    Create a new title screen (e.g., new artwork, typography, layout)               (10)
    Implement the 'FIRE' UI text from the original game                             (5)
    Using a texture atlas, create a new animated sprite for the Spaceship enemies   (10)
    Add your own (copyright-free) background music to the Play scene 
                                    (please be mindful of the volume)               (5)
    Create 4 new explosion sound effects and randomize which one plays on impact    (10)
    Implement parallax scrolling for the background                                 (10)
    Use Phaser's particle emitter to create a particle explosion when the rocket 
                                                            hits the spaceship      (15)

                                                                              total: 75

*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;