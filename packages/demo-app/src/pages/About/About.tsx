import { useLocalization } from '@fluent/react'
import { Typography } from '@mui/joy'

import { useLoader } from './loader'

/** About this app */
export const About = () => {
	useLoader()
	const { l10n } = useLocalization()
	return (
		<>
			<Typography level="h1">{l10n.getString('about-title')}</Typography>
			<Typography level="body-lg">{l10n.getString('about-body')}</Typography>
		</>
	)
}
