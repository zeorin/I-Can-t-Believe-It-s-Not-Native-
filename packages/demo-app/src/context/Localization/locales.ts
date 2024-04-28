import { negotiateLanguages } from '@fluent/langneg'

export const defaultLocale = 'en-ZA'
export const supportedLocales = ['nl', defaultLocale] as const

export type SupportedLocale = (typeof supportedLocales)[number]

/*
 * TODO: listen to the `languagechange` event
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/languagechange_event
 */

export const currentLocales = negotiateLanguages(
	navigator.languages,
	supportedLocales,
	{
		defaultLocale,
	},
) as SupportedLocale[]
