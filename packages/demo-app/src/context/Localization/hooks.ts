import { FluentBundle, FluentResource } from '@fluent/bundle'
import { ReactLocalization } from '@fluent/react'
import {
	useQueryClient,
	useSuspenseQueries,
	type QueryCacheNotifyEvent,
} from '@tanstack/react-query'
import { useMemo, useEffect } from 'react'
import * as R from 'remeda'
import { create } from 'zustand'

import { queryClient } from '#/context/Query'
import {
	fluentQueryRootKey,
	type FluentQueryKeys,
	type FluentQuery,
} from '#/queries'

import { supportedLocales, type SupportedLocale } from './locales'

type FluentStoreState = {
	locales: Map<
		SupportedLocale,
		{
			bundle: FluentBundle
			resources: Map<string, { template: string; resource: FluentResource }>
		}
	>
	l10n: ReactLocalization
	addTemplate: (
		key: [locale: SupportedLocale, path: string],
		template: string,
	) => void
}

const useFluentStore = create<FluentStoreState>()((set) => ({
	locales: new Map(
		supportedLocales.map((localeKey) => [
			localeKey,
			{ bundle: new FluentBundle(localeKey), resources: new Map() },
		]),
	),
	l10n: new ReactLocalization([], null, console.error),
	addTemplate: ([localeKey, pathKey], template) => {
		set((state) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const locale = state.locales.get(localeKey)!

			if (locale.resources.get(pathKey)?.template === template) return state

			const resource = new FluentResource(template)

			locale.resources.set(pathKey, { template, resource })

			locale.bundle
				.addResource(resource, { allowOverrides: true })
				.forEach((error) => {
					console.error(error)
				})

			const bundles = Array.from(state.locales.values(), ({ bundle }) => bundle)

			const l10n = new ReactLocalization(bundles, null, console.error)

			return {
				l10n,
			}
		})
	},
}))

const { addTemplate } = useFluentStore.getState()
const useL10n = () => useFluentStore((state) => state.l10n)

export const ensureTemplates = ({
	_def: _,
	...fluentQueryKeys
}: FluentQueryKeys) =>
	Promise.all(
		R.values(fluentQueryKeys).map((queryOptionsFactory) =>
			queryClient.ensureQueryData(queryOptionsFactory()),
		),
	)

export const useTemplates = ({
	_def: _,
	...fluentQueryKeys
}: FluentQueryKeys) => {
	const queries = useMemo(
		() => R.values(fluentQueryKeys).map((queryKeyFactory) => queryKeyFactory()),
		[fluentQueryKeys],
	)
	useSuspenseQueries({ queries })
}

const isFluentQuery = (
	query: QueryCacheNotifyEvent['query'],
): query is FluentQuery =>
	Array.isArray(query.queryKey) && query.queryKey[0] === fluentQueryRootKey

export const useReactLocalization = () => {
	const queryClient = useQueryClient()

	useEffect(
		() =>
			queryClient.getQueryCache().subscribe((event) => {
				if (
					isFluentQuery(event.query) &&
					['added', 'updated'].includes(event.type) &&
					event.query.state.status === 'success'
				) {
					const query = event.query as FluentQuery
					const [, ...key] = query.queryKey
					if (query.state.data !== undefined) {
						addTemplate(key as [SupportedLocale, string], query.state.data)
					}
				}
			}),
		[queryClient],
	)

	return useL10n()
}
