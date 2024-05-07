import {
	HomeRounded as HomeRoundedIcon,
	DashboardRounded as DashboardRoundedIcon,
	AssignmentRounded as AssignmentRoundedIcon,
	BrightnessAutoRounded as BrightnessAutoRoundedIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import {
	GlobalStyles,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	listItemButtonClasses,
	ListItemContent,
	Typography,
	Sheet,
} from '@mui/joy'
import { useState } from 'react'

import { ColourSchemeToggle } from '#/components/ColourSchemeToggle'
import { Link } from '#/components/Link'

import { expandSidebar } from './utils'

const Toggler = ({
	defaultExpanded = false,
	renderToggle,
	children,
}: {
	defaultExpanded?: boolean
	children: React.ReactNode
	renderToggle: (params: {
		open: boolean
		setOpen: React.Dispatch<React.SetStateAction<boolean>>
	}) => React.ReactNode
}) => {
	const [open, setOpen] = useState(defaultExpanded)
	return (
		<>
			{renderToggle({ open, setOpen })}
			<Box
				sx={{
					display: 'grid',
					gridTemplateRows: open ? '1fr' : '0fr',
					transition: '0.2s ease',
					'& > *': {
						overflow: 'hidden',
					},
				}}
			>
				{children}
			</Box>
		</>
	)
}

/** Page layout sidebar */
export const Sidebar = () => (
	<Sheet
		className="Sidebar"
		sx={{
			position: { xs: 'fixed', md: 'sticky' },
			transform: {
				xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
				md: 'none',
			},
			transition: 'transform 0.4s, width 0.4s',
			zIndex: 1,
			height: '100dvh',
			width: 'var(--Sidebar-width)',
			top: 0,
			p: 2,
			flexShrink: 0,
			display: 'flex',
			flexDirection: 'column',
			gap: 2,
			borderRight: '1px solid',
			borderColor: 'divider',
		}}
	>
		<GlobalStyles
			styles={(theme) => ({
				':root': {
					'--Sidebar-width': '220px',
					[theme.breakpoints.up('lg')]: {
						'--Sidebar-width': '240px',
					},
				},
			})}
		/>
		<Box
			className="Sidebar-overlay"
			sx={{
				position: 'fixed',
				zIndex: 1,
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				opacity: 'var(--SideNavigation-slideIn)',
				backgroundColor: 'var(--joy-palette-background-backdrop)',
				transition: 'opacity 0.4s',
				transform: {
					xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
					lg: 'translateX(-100%)',
				},
			}}
			onClick={() => {
				expandSidebar(false)
			}}
		/>
		<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
			<IconButton variant="soft" color="primary" size="sm">
				<BrightnessAutoRoundedIcon />
			</IconButton>
			<Typography level="title-lg">Acme Co.</Typography>
			<ColourSchemeToggle sx={{ ml: 'auto' }} />
		</Box>
		<Box
			sx={{
				minHeight: 0,
				overflow: 'hidden auto',
				flexGrow: 1,
				display: 'flex',
				flexDirection: 'column',
				[`& .${listItemButtonClasses.root}`]: {
					gap: 1.5,
				},
			}}
		>
			<List
				size="sm"
				sx={{
					gap: 1,
					'--List-nestedInsetStart': '30px',
					'--ListItem-radius': (theme) => theme.vars.radius.sm,
				}}
			>
				<ListItem>
					<ListItemButton component={Link} underline="none" to="/">
						<HomeRoundedIcon />
						<ListItemContent>
							<Typography level="title-sm">Home</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>

				<ListItem>
					<ListItemButton component={Link} underline="none" to="/about">
						<DashboardRoundedIcon />
						<ListItemContent>
							<Typography level="title-sm">About</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>

				<ListItem nested>
					<Toggler
						defaultExpanded
						renderToggle={({ open, setOpen }) => (
							<ListItemButton
								// component={Link}
								// underline="none"
								// to="/tasks"
								onClick={() => {
									setOpen(!open)
								}}
							>
								<AssignmentRoundedIcon />
								<ListItemContent>
									<Typography level="title-sm">Animations</Typography>
								</ListItemContent>
								<KeyboardArrowDownIcon
									sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
								/>
							</ListItemButton>
						)}
					>
						<List sx={{ gap: 0.5 }}>
							<ListItem sx={{ mt: 0.5 }}>
								<ListItemButton
									component={Link}
									underline="none"
									to="/animation/list"
								>
									Draggable List
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/animation/cards"
								>
									Swipable Cards
								</ListItemButton>
							</ListItem>
						</List>
					</Toggler>
				</ListItem>
			</List>
		</Box>
		<Divider />
	</Sheet>
)
