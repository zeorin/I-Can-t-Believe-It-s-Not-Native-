import { CssVarsProvider, CssBaseline } from '@mui/joy'

import '@fontsource-variable/inter'

/** Joy UI providers */
export const Theme = ({
	children,
}: {
	/** Child components */
	children: React.ReactNode
}) => (
	<CssVarsProvider>
		<CssBaseline />
		{children}
	</CssVarsProvider>
)
