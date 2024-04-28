import { createFileRoute } from '@tanstack/react-router'

import { loader } from '#/pages/Home'

/** Index Route */
export const Route = createFileRoute('/')({
	loader,
})
