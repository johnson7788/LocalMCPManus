import { ExtensionStateContextType } from "../context/ExtensionStateContext"

export type SetCachedStateField<K extends keyof ExtensionStateContextType> = (
	field: K,
	value: ExtensionStateContextType[K],
) => void
