import { useLocalization } from '@fluent/react'
import { Typography, Sheet } from '@mui/joy'

import { useLoader } from './loader'

/** Shown for a 404 */
export const NotFound = () => {
	useLoader()
	const { l10n } = useLocalization()
	return (
		<Sheet sx={{ p: 2, flex: 1 }}>
			<Typography level="h1">{l10n.getString('notfound-title')}</Typography>
			<Typography level="body-lg">{l10n.getString('notfound-body')}</Typography>
		</Sheet>
	)
}
