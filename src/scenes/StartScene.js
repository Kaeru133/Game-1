// Phaser is global from index.html CDN
export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        console.log('StartScene created');

        // Título estilizado
        const title = this.add.text(400, 100, 'THE WEAVING OF RANSOMS', {
            fontSize: '42px',
            fill: '#ff0000',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Texto Introductório
        const loreText =
            "Você é uma pequena e indefesa aranha, sem asas,\n" +
            "perdida em um mundo de gigantes alados.\n\n" +
            "O Rei Aranha espalhou mutações matemáticas\n" +
            "conhecidas como 'Ransom' por este reino distorcido.";

        this.add.text(400, 240, loreText, {
            fontSize: '18px',
            fill: '#cccccc',
            align: 'center',
            lineSpacing: 8,
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Objetivo
        const objectiveText =
            "OBJETIVO:\n" +
            "1. Explore a escuridão bipolar à esquerda.\n" +
            "2. Colete as distorções vermelhas (Ransoms).\n" +
            "3. Encontre as respostas antes que a luz apague.";

        this.add.text(400, 380, objectiveText, {
            fontSize: '18px',
            fill: '#00ff00',
            align: 'center',
            lineSpacing: 6,
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(400, 520, "Aperte duas vezes qualquer tecla ou clique duas vezes para entrar no abismo", {
            fontSize: '16px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        let lastPressTime = 0;
        let isTransitioning = false;

        const handleDoublePress = () => {
            if (isTransitioning) return;
            const currentTime = this.time.now;
            if (currentTime - lastPressTime < 500) { // 500ms for double click/tap
                isTransitioning = true;
                console.log('Transitioning to GameScene slowly...');

                // Camera fade out in 3000ms
                this.cameras.main.fadeOut(3000, 0, 0, 0);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('GameScene');
                });
            } else {
                lastPressTime = currentTime;
            }
        };

        this.input.keyboard.on('keydown', handleDoublePress);
        this.input.on('pointerdown', handleDoublePress);

        // Efeito visual sutil de glitch
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                title.setX(402);
                this.time.delayedCall(50, () => title.setX(400));
            },
            loop: true
        });
    }
}
