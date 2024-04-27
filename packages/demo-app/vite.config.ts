import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
	plugins: [tsconfigPaths(), react()],
	esbuild: {
		jsxDev: mode !== 'production',
	},
}))
