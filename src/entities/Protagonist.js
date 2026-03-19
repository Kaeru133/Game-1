// Phaser is global from index.html CDN

export default class Protagonist extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player-sprite');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Player status
        this.hp = 100;
        this.maxHp = 100;
        this.mana = 100;
        this.maxMana = 100;
        this.isDead = false;

        // Upgrade levels
        this.clawLevel = 1;
        this.spinneretLevel = 0;
        this.aimAngle = 0;
    }
}
