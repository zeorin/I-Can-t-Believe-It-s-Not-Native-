export const expandSidebar = (
	expand: boolean = !window
		.getComputedStyle(document.documentElement)
		.getPropertyValue('--SideNavigation-slideIn'),
) => {
	if (expand) {
		document.body.style.overflow = 'hidden'
		document.documentElement.style.setProperty('--SideNavigation-slideIn', '1')
	} else {
		document.documentElement.style.removeProperty('--SideNavigation-slideIn')
		document.body.style.removeProperty('overflow')
	}
}
