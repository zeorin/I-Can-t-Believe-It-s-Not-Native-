import { createQueryKeys } from '@lukemorales/query-key-factory'
import type { Query } from '@tanstack/query-core'
import * as R from 'remeda'

import { currentLocales, type SupportedLocale } from '#/context/Localization'

const importPath = (localeKey: SupportedLocale) => `./${localeKey}.ftl`

const moduleLocale = (modulePath: string | undefined) =>
	currentLocales.find((localeKey) => importPath(localeKey) === modulePath)

export const fluentQueryRootKey = 'fluent'

export const createFluentQueryKeys = <const PathKey extends string>(
	pathKey: PathKey,
	modules: Record<string, () => Promise<unknown>>,
) =>
	createQueryKeys(
		fluentQueryRootKey,
		R.fromEntries(
			R.entries(modules)
				.filter(([modulePath]) => Boolean(moduleLocale(modulePath)))
				.map(
					([modulePath, importFn]) =>
						[
							// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
							moduleLocale(modulePath)!,
							() => ({
								queryKey: [pathKey],
								queryFn: importFn,
							}),
						] as const,
				),
		) as Record<
			string,
			() => { queryKey: [pathKey: PathKey]; queryFn: () => Promise<string> }
		>,
	)

export type FluentQueryKeys = ReturnType<typeof createFluentQueryKeys>

type FluentQueryKey = ReturnType<FluentQueryKeys[SupportedLocale]>

type FluentData = Awaited<ReturnType<FluentQueryKey['queryFn']>>

export type FluentQuery = Query<
	FluentData,
	Error,
	FluentData,
	FluentQueryKey['queryKey']
>
