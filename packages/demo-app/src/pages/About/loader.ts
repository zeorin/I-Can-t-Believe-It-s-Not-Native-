import { ensureTemplates, useTemplates } from '#/context/Localization'
import { createFluentQueryKeys } from '#/queries'

const fluentQueryKeys = createFluentQueryKeys(
	'about',
	import.meta.glob('./*.ftl', {
		query: '?raw',
		import: 'default',
	}),
)

export const loader = () => ensureTemplates(fluentQueryKeys)

export const useLoader = () => {
	useTemplates(fluentQueryKeys)
}
