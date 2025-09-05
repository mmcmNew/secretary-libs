import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dts from 'vite-plugin-dts';

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
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^@mui\/material.*/,          // всё, что начинается с @mui/material
        /^@mui\/icons-material.*/,    // всё, что начинается с @mui/icons-material
        /^@emotion\/react.*/,         // всё из @emotion/react
        /^@emotion\/styled.*/,        // всё из @emotion/styled
        '@hello-pangea/dnd',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mui/material': 'MaterialUI',
          '@mui/icons-material': 'MuiIconsMaterial',
          '@emotion/react': 'emotionReact',
          '@emotion/styled': 'emotionStyled',
          '@hello-pangea/dnd': 'dnd',
        },
      },
    },
  },
});
