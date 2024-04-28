import {
	SearchRounded as SearchRoundedIcon,
	HomeRounded as HomeRoundedIcon,
	DashboardRounded as DashboardRoundedIcon,
	ShoppingCartRounded as ShoppingCartRoundedIcon,
	AssignmentRounded as AssignmentRoundedIcon,
	QuestionAnswerRounded as QuestionAnswerRoundedIcon,
	GroupRounded as GroupRoundedIcon,
	SupportRounded as SupportRoundedIcon,
	SettingsRounded as SettingsRoundedIcon,
	CloseRounded as CloseRoundedIcon,
	LogoutRounded as LogoutRoundedIcon,
	BrightnessAutoRounded as BrightnessAutoRoundedIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material'
import {
	GlobalStyles,
	Avatar,
	Box,
	Button,
	Card,
	Chip,
	Divider,
	IconButton,
	Input,
	LinearProgress,
	List,
	ListItem,
	ListItemButton,
	listItemButtonClasses,
	ListItemContent,
	Typography,
	Sheet,
	Stack,
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
		<Input
			size="sm"
			startDecorator={<SearchRoundedIcon />}
			placeholder="Search"
		/>
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
					<ListItemButton component={Link} underline="none" to="/dashboard">
						<DashboardRoundedIcon />
						<ListItemContent>
							<Typography level="title-sm">Dashboard</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>

				<ListItem>
					<ListItemButton
						component={Link}
						underline="none"
						to="/orders"
						role="menuitem"
					>
						<ShoppingCartRoundedIcon />
						<ListItemContent>
							<Typography level="title-sm">Orders</Typography>
						</ListItemContent>
					</ListItemButton>
				</ListItem>
				<ListItem nested>
					<Toggler
						renderToggle={({ open, setOpen }) => (
							<ListItemButton
								component={Link}
								underline="none"
								to="/tasks"
								onClick={() => {
									setOpen(!open)
								}}
							>
								<AssignmentRoundedIcon />
								<ListItemContent>
									<Typography level="title-sm">Tasks</Typography>
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
									to="/tasks/all"
								>
									All tasks
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/tasks/backlog"
								>
									Backlog
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/tasks/in-progress"
								>
									In progress
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/tasks/done"
								>
									Done
								</ListItemButton>
							</ListItem>
						</List>
					</Toggler>
				</ListItem>
				<ListItem>
					<ListItemButton
						component={Link}
						underline="none"
						to="/messages"
						role="menuitem"
					>
						<QuestionAnswerRoundedIcon />
						<ListItemContent>
							<Typography level="title-sm">Messages</Typography>
						</ListItemContent>
						<Chip size="sm" color="primary" variant="solid">
							4
						</Chip>
					</ListItemButton>
				</ListItem>
				<ListItem nested>
					<Toggler
						defaultExpanded
						renderToggle={({ open, setOpen }) => (
							<ListItemButton
								component={Link}
								underline="none"
								to="/users"
								onClick={() => {
									setOpen(!open)
								}}
							>
								<GroupRoundedIcon />
								<ListItemContent>
									<Typography level="title-sm">Users</Typography>
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
									selected
									component={Link}
									underline="none"
									to="/users/me"
								>
									My profile
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/users/new"
								>
									Create a new user
								</ListItemButton>
							</ListItem>
							<ListItem>
								<ListItemButton
									component={Link}
									underline="none"
									to="/users/permissions"
								>
									Roles & permission
								</ListItemButton>
							</ListItem>
						</List>
					</Toggler>
				</ListItem>
			</List>
			<List
				size="sm"
				sx={{
					mt: 'auto',
					flexGrow: 0,
					'--ListItem-radius': (theme) => theme.vars.radius.sm,
					'--List-gap': '8px',
					mb: 2,
				}}
			>
				<ListItem>
					<ListItemButton component={Link} underline="none" to="/support">
						<SupportRoundedIcon />
						Support
					</ListItemButton>
				</ListItem>
				<ListItem>
					<ListItemButton component={Link} underline="none" to="/settings">
						<SettingsRoundedIcon />
						Settings
					</ListItemButton>
				</ListItem>
			</List>
			<Card
				invertedColors
				variant="soft"
				color="warning"
				size="sm"
				sx={{ boxShadow: 'none' }}
			>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography level="title-sm">Used space</Typography>
					<IconButton size="sm">
						<CloseRoundedIcon />
					</IconButton>
				</Stack>
				<Typography level="body-xs">
					Your team has used 80% of your available space. Need more?
				</Typography>
				<LinearProgress
					variant="outlined"
					value={80}
					determinate
					sx={{ my: 1 }}
				/>
				<Button size="sm" variant="solid">
					Upgrade plan
				</Button>
			</Card>
		</Box>
		<Divider />
		<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
			<Avatar
				variant="outlined"
				size="sm"
				src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
			/>
			<Box sx={{ minWidth: 0, flex: 1 }}>
				<Typography level="title-sm">Siriwat K.</Typography>
				<Typography level="body-xs">siriwatk@test.com</Typography>
			</Box>
			<IconButton size="sm" variant="plain" color="neutral">
				<LogoutRoundedIcon />
			</IconButton>
		</Box>
	</Sheet>
)
