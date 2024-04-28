import { ensureTemplates, useTemplates } from '#/context/Localization'
import * as queries from '#/queries'

const fluentQueryKeys = queries.createFluentQueryKeys(
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
