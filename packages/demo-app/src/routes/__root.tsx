import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

import { Layout } from '#/components/Layout'
import { NotFound } from '#/pages/NotFound'

const TanStackRouterDevtools =
	process.env.NODE_ENV === 'production' ?
		() => null
	:	lazy(() =>
			import('@tanstack/router-devtools').then((res) => ({
				default: res.TanStackRouterDevtools,
			})),
		)

export const Route = createRootRoute({
	component: () => (
		<>
			<Layout>
				<Outlet />
			</Layout>
			<Suspense>
				<TanStackRouterDevtools />
			</Suspense>
		</>
	),
	notFoundComponent: () => <NotFound />,
})
