import {
	DarkModeRounded as DarkModeRoundedIcon,
	LightMode as LightModeIcon,
} from '@mui/icons-material'
import { IconButton, type IconButtonProps, useColorScheme } from '@mui/joy'

export const ColourSchemeToggle = ({
	onClick,
	sx,
	...props
}: IconButtonProps) => {
	const { mode, setMode } = useColorScheme()
	return (
		<IconButton
			id="toggle-mode"
			size="sm"
			variant="outlined"
			color="neutral"
			{...props}
			onClick={(event) => {
				if (mode === 'light') {
					setMode('dark')
				} else {
					setMode('light')
				}
				// @ts-expect-error -- Joy UI gives us an incorrect event target type
				onClick?.(event)
			}}
			sx={[
				{
					'& > *:first-of-type': {
						display: mode === 'dark' ? 'none' : 'initial',
					},
					'& > *:last-of-type': {
						display: mode === 'light' ? 'none' : 'initial',
					},
				},
				// @ts-expect-error -- this is fine, not sure why it's giving an error
				...(Array.isArray(sx) ? sx : [sx]),
			]}
		>
			<DarkModeRoundedIcon />
			<LightModeIcon />
		</IconButton>
	)
}
