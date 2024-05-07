import { createFileRoute } from '@tanstack/react-router'

import { DraggableList } from '#/components/DraggableList'
import { SwipableCards } from '#/components/SwipableCards'
import { NotFound } from '#/pages/NotFound'

export const Route = createFileRoute('/animation/$example')({
	component: AnimationRouteComponent,
})

function AnimationRouteComponent() {
	const { example } = Route.useParams()
	return (
		example === 'list' ? <DraggableList />
		: example === 'cards' ? <SwipableCards />
		: <NotFound />
	)
}
