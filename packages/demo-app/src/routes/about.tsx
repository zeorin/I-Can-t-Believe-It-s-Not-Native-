import { createFileRoute } from '@tanstack/react-router'

import { loader } from '#/pages/About'

export const Route = createFileRoute('/about')({
	loader,
})
