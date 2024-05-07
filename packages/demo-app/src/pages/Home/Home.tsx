import { useLocalization } from '@fluent/react'
import { Typography, Sheet } from '@mui/joy'

import { useLoader } from './loader'

/** Home page */
export const Home = () => {
	useLoader()
	const { l10n } = useLocalization()
	return (
		<Sheet
			sx={{
				p: 2,
				flex: 1,
			}}
		>
			<Typography level="h1">{l10n.getString('home-title')}</Typography>
		</Sheet>
	)
}
