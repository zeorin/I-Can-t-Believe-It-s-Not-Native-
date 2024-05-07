/* eslint-disable */
import { useRef } from 'react'
import { useSprings, animated } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'
import { swapIndices, clamp } from 'remeda'
import { Sheet, styled } from '@mui/joy'

const Wrapper = styled(Sheet)(`
	flex: 1;
	display: flex;
	align-items: center;
	height: 100%;
	justify-content: center;
`)

const Container = styled('div')(`
	position: relative;
	width: 200px;
	height: 100px;

	& > div {
		user-select: none;
		cursor: move;
		cursor: grab;
		position: absolute;
		width: 200px;
		height: 40px;
		transform-origin: 50% 50% 0px;
		border-radius: 5px;
		color: white;
		line-height: 40px;
		padding-left: 32px;
		font-size: 14.5px;
		text-transform: uppercase;
		letter-spacing: 2px;
		touch-action: none;

		&:active {
			cursor: grabbing
		}
	}

	& > div:nth-of-type(1) {
		background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
	}
	& > div:nth-of-type(2) {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}
	& > div:nth-of-type(3) {
		background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
	}
	& > div:nth-of-type(4) {
		background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);
	}
`)

const fn =
	(order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
	(index: number) =>
		active && index === originalIndex ?
			{
				y: curIndex * 50 + y,
				scale: 1.1,
				zIndex: 1,
				shadow: 15,
				immediate: (key: string) => key === 'y' || key === 'zIndex',
			}
		:	{
				y: order.indexOf(index) * 50,
				scale: 1,
				zIndex: 0,
				shadow: 1,
				immediate: false,
			}

const items = 'Lorem ipsum dolor sit'.split(' ')

export const DraggableList = () => {
	const order = useRef(items.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
	const [springs, api] = useSprings(items.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
	const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
		const curIndex = order.current.indexOf(originalIndex)
		const curRow = clamp(Math.round((curIndex * 100 + y) / 100), {
			min: 0,
			max: items.length - 1,
		})
		const newOrder = swapIndices(order.current, curIndex, curRow)
		api.start(fn(newOrder, active, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
		if (!active) order.current = newOrder
	})
	return (
		<Wrapper>
			<Container
				style={{
					height: items.length * 50,
				}}
			>
				{springs.map(({ zIndex, shadow, y, scale }, i) => (
					<animated.div
						{...bind(i)}
						key={i}
						style={{
							zIndex,
							boxShadow: shadow.to(
								(s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
							),
							y,
							scale,
						}}
						children={items[i]}
					/>
				))}
			</Container>
		</Wrapper>
	)
}
