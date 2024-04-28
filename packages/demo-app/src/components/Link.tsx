import { Link as JoyLink, type LinkProps as JoyLinkProps } from '@mui/joy'
import {
	Link as RouterLink,
	type LinkProps as RouterLinkProps,
	type RoutePaths,
	type RegisteredRouter,
} from '@tanstack/react-router'
import { forwardRef } from 'react'

declare module 'react' {
	function forwardRef<T, P = object>(
		render: (props: P, ref: React.ForwardedRef<T>) => React.ReactNode | null,
	): (props: P & React.RefAttributes<T>) => React.ReactNode | null
}

export const Link = forwardRef(function Link<
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	TFrom extends RoutePaths<RegisteredRouter['routeTree']> | string = string,
	TTo extends string = '',
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	TMaskFrom extends RoutePaths<RegisteredRouter['routeTree']> | string = TFrom,
	TMaskTo extends string = '',
>(
	props: RouterLinkProps<RegisteredRouter, TFrom, TTo, TMaskFrom, TMaskTo> &
		JoyLinkProps,
	ref: React.ForwardedRef<HTMLAnchorElement>,
) {
	return <JoyLink ref={ref} {...props} component={RouterLink} />
})
