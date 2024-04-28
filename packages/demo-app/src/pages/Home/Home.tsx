import { useLocalization } from '@fluent/react'
import { Typography } from '@mui/joy'

import { useLoader } from './loader'

/** Home page */
export const Home = () => {
	useLoader()
	const { l10n } = useLocalization()
	return <Typography level="h1">{l10n.getString('home-title')}</Typography>
}
