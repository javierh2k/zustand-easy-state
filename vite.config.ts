import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ['src'],
		}),
	],
	build: {
		lib: {
			// fileName: 'main',
			entry: path.resolve(__dirname, 'src', 'main.ts'),
			name: "zustand-easy-state",
			// formats: ['umd'],
		},
		rollupOptions: {
			external: ['react', 'react/jsx-runtime'],
			output: {
				dir: 'dist',
				entryFileNames: `[name].[format].js`,
				sourcemap: true,
				format: ['es', 'cjs'].map((format) => ({
					format: format,
					exports: 'named',
					sourcemap: true,
					preserveModules: true,
				})),
				globals: {
					react: 'react',
					'react/jsx-runtime': 'react/jsx-runtime'
				}
			}
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',
	}
})
