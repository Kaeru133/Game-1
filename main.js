console.log('main.js loaded');

// Phaser is loaded FROM THE CDN in index.html, so it's available globally as 'Phaser'
import StartScene from './src/scenes/StartScene.js';
import GameScene from './src/scenes/GameScene.js';

const config = {
    // FORCE CANVAS to avoid WebGL crashes/black screens on certain GPUs
    type: Phaser.CANVAS,
    title: 'The Weaving of Ransoms',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#1a1a1a',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

console.log('Game initializing in CANVAS mode');
window.game = new Phaser.Game(config);
