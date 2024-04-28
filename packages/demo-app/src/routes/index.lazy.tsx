import { createLazyFileRoute } from '@tanstack/react-router'

import { Home } from '#/pages/Home'

/** Index Route */
export const Route = createLazyFileRoute('/')({
	component: Home,
})
