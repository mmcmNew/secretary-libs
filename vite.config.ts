import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  server: {
    host: true,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'secretary-libs',
      formats: ['es', 'umd'],
      fileName: (format) => `secretary-libs.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled', '@hello-pangea/dnd'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mui/material': 'MaterialUI',
          '@hello-pangea/dnd': 'dnd',
          '@mui/icons-material': 'MuiIconsMaterial',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
        },
      },
    },
  },
});
