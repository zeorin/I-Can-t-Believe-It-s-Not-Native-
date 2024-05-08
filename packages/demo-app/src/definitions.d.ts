declare module '*.ftl' {
	const content: string
	export default content
}

declare global {
	interface Window {
		__BASE_PATH__: string
	}
}
