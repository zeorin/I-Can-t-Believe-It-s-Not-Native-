import { Sheet, styled } from '@mui/joy'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useState } from 'react'
import { useDrag } from 'react-use-gesture'

const Wrapper = styled(Sheet)(`
	display: flex;
	overflow: hidden;
	align-items: center;
	height: 100%;
	justify-content: center;
`)

const Deck = styled(animated.div)(`
	user-select: none;
	cursor: move;
	cursor: grab;
  position: absolute;
  width: 300px;
  height: 200px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;

	&:active {
		cursor: grabbing;
	}

  & > div {
		touch-action: none;
		background-color: white;
		background-size: auto 85%;
		background-repeat: no-repeat;
		background-position: center center;
		width: 45vh;
		max-width: 300px;
		height: 85vh;
		max-height: 570px;
		will-change: transform;
		border-radius: 10px;
		box-shadow: 0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3);
	}
`)

const cards = [
	'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/RWS_Tarot_02_High_Priestess.jpg/690px-RWS_Tarot_02_High_Priestess.jpg',
	'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => ({
	x: 0,
	y: i * -4,
	scale: 1,
	rot: -10 + Math.random() * 20,
	delay: i * 100,
})
const from = (_: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
	`perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

export const SwipableCards = () => {
	const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
	const [props, api] = useSprings(cards.length, (i) => ({
		...to(i),
		from: from(i),
	})) // Create a bunch of springs using the helpers above
	// Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
	const bind = useDrag(
		({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
			const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
			const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
			if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
			void api.start((i) => {
				if (index !== i) return // We're only interested in changing spring-data for the current spring
				const isGone = gone.has(index)
				const x =
					isGone ? (200 + window.innerWidth) * dir
					: down ? mx
					: 0 // When a card is gone it flys out left or right, otherwise goes back to zero
				const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
				const scale = down ? 1.1 : 1 // Active cards lift up a bit
				return {
					x,
					rot,
					scale,
					delay: undefined,
					config: {
						friction: 50,
						tension:
							down ? 800
							: isGone ? 200
							: 500,
					},
				}
			})
			if (!down && gone.size === cards.length)
				setTimeout(() => {
					gone.clear()
					void api.start((i) => to(i))
				}, 600)
		},
	)
	// Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
	return (
		<Wrapper>
			{props.map(({ x, y, rot, scale }, i) => (
				<Deck key={i} style={{ x, y }}>
					{/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
					<animated.div
						{...bind(i)}
						style={{
							transform: interpolate([rot, scale], trans),
							backgroundImage: `url(${cards[i]})`,
						}}
					/>
				</Deck>
			))}
		</Wrapper>
	)
}
