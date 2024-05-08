import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from '#/routeTree.gen'

const router = createRouter({
	basepath: import.meta.env.BASE_URL,
	routeTree,
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

/** Auto-generated Router */
export const Router = () => <RouterProvider router={router} />
