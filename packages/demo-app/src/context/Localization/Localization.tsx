import { LocalizationProvider } from '@fluent/react'

import { useReactLocalization } from './hooks'

/** Configured Localization provider */
export const Localization = ({
	children,
}: {
	/** Child components */
	children: React.ReactNode
}) => {
	const l10n = useReactLocalization()
	return <LocalizationProvider l10n={l10n}>{children}</LocalizationProvider>
}
