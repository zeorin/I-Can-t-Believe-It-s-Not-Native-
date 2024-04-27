import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths(), react()],
	esbuild: {
		jsxDev: mode !== 'production',
	},
}))
