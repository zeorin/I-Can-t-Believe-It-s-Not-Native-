import { mergeQueryKeys } from '@lukemorales/query-key-factory'

export {
	fluentQueryRootKey,
	createFluentQueryKeys,
	type FluentQueryKeys,
	type FluentQuery,
} from './fluent'

export const queries = mergeQueryKeys()
