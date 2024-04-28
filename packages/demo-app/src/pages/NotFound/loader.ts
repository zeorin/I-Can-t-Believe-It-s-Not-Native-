import { ensureTemplates, useTemplates } from '#/context/Localization'
import { createFluentQueryKeys } from '#/queries'

const fluentQueryKeys = createFluentQueryKeys(
	'home',
	import.meta.glob('./*.ftl', {
		query: '?raw',
		import: 'default',
	}),
)

export const loader = () => ensureTemplates(fluentQueryKeys)

export const useLoader = () => {
	useTemplates(fluentQueryKeys)
}
