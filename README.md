# The Weaving of Ransoms

A 2D horror-RPG blending SAO’s atmosphere with glitch-horror elements.

## Concept
- **Protagonist**: A powerless, wingless spider.
- **Antagonist**: The Spider King, source of "Ransom" mutations.

## Core Mechanics
- **Bipolar World**: Map X-coordinates dictate lighting and enemies.
- **The Dark (Left)**: Deepening darkness as player moves left.
- **The Light (Right)**: Bipolar false-safety area.
- **Ransom Glitches**: Mathematical distortions (Shaders).
- **Spider Archangels**: High-contrast NPCs in the dark.

## GitHub Pages Instructions
1.  **Repository Setup**:
    - Open **GitHub Desktop**.
    - Select `File > Add local repository...`.
    - Choose the folder path where this project is located.
    - Click `Publish repository` to push to GitHub.com.
2.  **GitHub Pages Activation**:
    - Go to your repository settings on GitHub.com.
    - Go to `Settings > Pages`.
    - Under `Build and deployment`, set source to **GitHub Actions**.
    - The `deploy.yml` workflow will automatically build and publish the game.
    - The game will be available at `https://[username].github.io/Game-1/`.

## Development
- Run `npm run dev` to play locally (requires NodeJS).
- The game uses a CDN for Phaser, making it more stable on different environments.
