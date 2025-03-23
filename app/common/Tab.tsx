import { HTMLAttributes, useCallback } from "react"

import { useExtensionState } from "../context/ExtensionStateContext"
import { cn } from "../lib/utils"

type TabProps = HTMLAttributes<HTMLDivElement>

export const Tab = ({ className, children, ...props }: TabProps) => (
	<div className={cn("relative inset-0 flex flex-col overflow-hidden bg-white text-black", className)} {...props}>
		{children}
	</div>
)

export const TabHeader = ({ className, children, ...props }: TabProps) => (
	<div className={cn("px-5 py-2.5 border-b bg-white text-black", className)} {...props}>
		{children}
	</div>
)

export const TabContent = ({ className, children, ...props }: TabProps) => {
	const { renderContext } = useExtensionState()

	const onWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			if (renderContext !== "editor") {
				return
			}

			const target = e.target as HTMLElement

			// Prevent scrolling if the target is a listbox or option
			// (e.g. selects, dropdowns, etc).
			if (target.role === "listbox" || target.role === "option") {
				return
			}

			e.currentTarget.scrollTop += e.deltaY
		},
		[renderContext],
	)

	return (
		<div className={cn("flex-1 overflow-auto p-5 bg-white text-black", className)} onWheel={onWheel} {...props}>
			{children}
		</div>
	)
}