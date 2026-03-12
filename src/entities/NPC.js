// Phaser is global from index.html CDN

export default class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, dialogue) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body
        this.dialogue = dialogue || "Olá, viajante... tome cuidado na escuridão.";
    }
}
