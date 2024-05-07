import { Box } from '@mui/joy'

import { Header } from '#/components/Header'
import { Sidebar } from '#/components/Sidebar/Sidebar'

/** The App's default layout */
export const Layout = ({ children }: { children: React.ReactNode }) => (
	<Box sx={{ display: 'flex', minHeight: '100dvh' }}>
		<Sidebar />
		<Header />
		<Box
			component="main"
			sx={{
				p: 0,
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
				minWidth: 0,
				height: '100dvh',
				gap: 1,
				overflow: 'auto',
			}}
		>
			{children}
		</Box>
	</Box>
)
