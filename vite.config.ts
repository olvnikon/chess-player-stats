import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://olvnikon.github.io/chess-player-stats/dist/',
  plugins: [react()],
});
