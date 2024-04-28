import { Localization } from '#/context/Localization'
import { Query } from '#/context/Query/Query'
import { Router } from '#/context/Router'
import { Theme } from '#/context/Theme'

/** Application root component */
export const App = () => (
	<Query>
		<Localization>
			<Theme>
				<Router />
			</Theme>
		</Localization>
	</Query>
)
