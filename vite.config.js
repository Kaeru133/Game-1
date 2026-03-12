import { defineConfig } from 'vite';

export default defineConfig({
    // IMPORTANT: This must match your GitHub Repo name exactly
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        port: 3000,
        open: true
    }
});
