// Phaser is global from index.html CDN
import Ransom from './Ransom.js';

export default class Boss extends Ransom {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.setScale(0.6); // Match the scale used in GameScene
        this.health = 500;
        this.maxHealth = 500;
        this.isBoss = true;

        this.bossText = scene.add.text(x, y - 60, 'Lord. Rans (500/500)', {
            fontSize: '20px',
            fill: '#ff0000',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.attackState = 0; // 0: +, 1: *, 2: @ (Defense)
        this.stateTimer = 5000;
        
        this.isAttacking = true; // start attacking
        this.spawnedMinions = [];
        this.shieldBroken = false;
    }

    scheduleAttack() {
        // Boss overrides this to stop the default random attack cycle
    }
    
    startAttack() {
        // Boss handles its own state logic in update
    }
    
    stopAttack() {
        // Boss handles its own state logic in update
    }

    spawnMinions() {
        this.spawnedMinions = [];
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const dist = 120; // Spawn distance from boss
            const mx = this.x + Math.cos(angle) * dist;
            const my = this.y + Math.sin(angle) * dist;
            
            const minion = new Ransom(this.scene, mx, my);
            minion.setScale(0.15); // Standard minion scale
            minion.isChaser = true; // Make them actively hunt the player!
            
            this.scene.ransoms.add(minion);
            this.spawnedMinions.push(minion);
        }
    }

    update(time, delta) {
        if (!this.active || !this.scene) return;

        let shouldTickTimer = true;

        if (this.attackState === 2 && this.spawnedMinions) {
            this.spawnedMinions = this.spawnedMinions.filter(m => m.active && m.health > 0);
            if (this.spawnedMinions.length > 0) {
                // Pause boss state timer until all minions are killed
                shouldTickTimer = false;
            } else if (this.spawnedMinions.length === 0 && !this.shieldBroken) {
                // Minions eliminated! Break shield and resume battle immediately
                this.shieldBroken = true;
                this.stateTimer = 0; 
                
                const breakText = this.scene.add.text(this.x, this.y - 40, 'SHIELD BROKEN!', {
                    fontSize: '24px', fill: '#ff0000', fontFamily: 'monospace', fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(2000);
                this.scene.tweens.add({ targets: breakText, y: this.y - 80, alpha: 0, duration: 1500, onComplete: () => breakText.destroy() });
            }
        }

        if (shouldTickTimer) {
            this.stateTimer -= delta;
        }

        if (this.stateTimer <= 0) {
            this.stateTimer = 5000; // Reset timer for next skill
            this.attackState = (this.attackState + 1) % 3;
            
            if (this.attackState === 2) {
                this.spawnMinions();
                this.shieldBroken = false;
            }
            
            // Flash colour on state change to give a visual cue
            this.setTint(0xffffff);
            this.scene.time.delayedCall(100, () => {
                if (this.active) this.clearTint();
            });
        }

        // True for + and * attacks, false for @ defense
        this.isAttacking = (this.attackState !== 2);

        super.update(time, delta); // Ransom update calls drawLasers/checkLaserCollision

        if (this.bossText) {
            this.bossText.setPosition(this.x, this.y - 60);
            this.bossText.setText(`Lord. Rans (${Math.max(0, this.health)}/500)`);
        }

        if (this.attackState === 2 && this.scene.laserLayer) {
            const cam = this.scene.cameras.main;
            if (cam.worldView.contains(this.x, this.y)) {
                this.drawDefenseShield();
            }
        }
    }

    drawLasers() {
        if (!this.scene || !this.scene.laserLayer) return;
        const layer = this.scene.laserLayer;
        
        const isTelegraph = (this.stateTimer > 3500); // Telegraph for 1.5s
        
        if (isTelegraph) {
            layer.lineStyle(2, 0xff0000, 0.4); // Thin, red warning line before attack begins
        } else {
            layer.lineStyle(6, 0xff0000, 0.9); // Full beam
        }

        const length = 400; // Boss lasers are extremely long

        if (this.attackState === 0) { // + attack
            layer.lineBetween(this.x, this.y - length, this.x, this.y + length);
            layer.lineBetween(this.x - length, this.y, this.x + length, this.y);
        } else if (this.attackState === 1) { // * attack (+ and X combined)
            layer.lineBetween(this.x, this.y - length, this.x, this.y + length);
            layer.lineBetween(this.x - length, this.y, this.x + length, this.y);
            
            const diagLength = length * 0.707; // sin(45) ~ 0.707
            layer.lineBetween(this.x - diagLength, this.y - diagLength, this.x + diagLength, this.y + diagLength);
            layer.lineBetween(this.x - diagLength, this.y + diagLength, this.x + diagLength, this.y - diagLength);
        }
    }

    drawDefenseShield() {
        const layer = this.scene.laserLayer;
        // Draw the shield barrier
        layer.lineStyle(4, 0x00ffff, 0.8);
        layer.strokeCircle(this.x, this.y, 80);
        layer.lineStyle(2, 0x0000ff, 0.4);
        layer.strokeCircle(this.x, this.y, 100);
        
        // Render some '@' shaped visuals swirling around
        const numSprites = 8;
        const radius = 100;
        const timeOffset = this.scene.time.now * 0.002;
        
        for (let i = 0; i < numSprites; i++) {
            const angle = (i * Math.PI * 2) / numSprites + timeOffset;
            const px = this.x + Math.cos(angle) * radius;
            const py = this.y + Math.sin(angle) * radius;
            
            layer.lineStyle(2, 0x00ffff, 0.8);
            layer.strokeCircle(px, py, 12);
            layer.fillStyle(0x00ffff, 1);
            layer.fillCircle(px, py, 5);
        }
    }

    checkLaserCollision() {
        if (this.stateTimer > 3500) return; // Telegraph phase deals NO damage!

        const player = this.scene.player;
        if (!player || player.isDead) return;

        const length = 400;
        const pSize = 16;
        let hit = false;
        
        const dx = Math.abs(player.x - this.x);
        const dy = Math.abs(player.y - this.y);

        if (this.attackState === 0) { // + attack
            if ((dx < pSize + 8 && dy < length) || (dy < pSize + 8 && dx < length)) {
                hit = true;
            }
        } else if (this.attackState === 1) { // * attack
            if ((dx < pSize + 8 && dy < length) || (dy < pSize + 8 && dx < length)) {
                hit = true;
            } else {
                // Diagonal check for X part
                const relativeX = player.x - this.x;
                const relativeY = player.y - this.y;
                
                // Rotate by 45 degrees
                const dist1 = Math.abs(relativeX - relativeY) / 1.414;
                const dist2 = Math.abs(relativeX + relativeY) / 1.414;
                
                if ((dist1 < pSize + 8 || dist2 < pSize + 8) && (dx < length && dy < length)) {
                    hit = true;
                }
            }
        }

        if (hit) {
            this.scene.damagePlayer(0.5);
        }
    }

    takeDamage(amount) {
        if (!this.active || this.health <= 0) return;
        
        if (this.attackState === 2) {
            // Defense mode: Immunity and show BLOCKED text
            const blockText = this.scene.add.text(this.x, this.y - 40, 'BLOCKED (@ Defense) - ' + this.spawnedMinions.length + ' minions left', {
                fontSize: '16px', fill: '#00ffff', fontFamily: 'monospace', fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(2000);
            
            this.scene.tweens.add({
                targets: blockText,
                y: this.y - 80,
                alpha: 0,
                duration: 1000,
                onComplete: () => blockText.destroy()
            });
            return;
        }

        super.takeDamage(amount);
    }

    destroy() {
        if (this.bossText) this.bossText.destroy();
        super.destroy();
    }
}
