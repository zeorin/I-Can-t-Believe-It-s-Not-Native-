import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '#/components/App'

const rootElement = document.getElementById('app')

if (rootElement && !rootElement.innerHTML) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
