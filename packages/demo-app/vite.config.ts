import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig(({ mode }) => ({
	plugins: [tsconfigPaths(), react(), TanStackRouterVite()],
	esbuild: {
		jsxDev: mode !== 'production',
	},
	assetsInclude: ['**/*.ftl'],
	test: {
		exclude: [...configDefaults.exclude, 'e2e/*'],
		coverage: {
			...configDefaults.coverage,
			exclude: [...(configDefaults.coverage.exclude ?? []), 'e2e/*'],
		},
	},
}))
