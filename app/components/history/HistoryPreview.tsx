import { memo } from "react"

import { vscode } from "../../utils/vscode"
import { formatLargeNumber, formatDate } from "../../utils/format"
import { Button } from "../ui"

import { useExtensionState } from "../../context/ExtensionStateContext"
import { useAppTranslation } from "../../i18n/TranslationContext"
import { CopyButton } from "./CopyButton"

const HistoryPreview = () => {
	const { taskHistory } = useExtensionState()
	const { t } = useAppTranslation()

	return (
		<div className="flex flex-col gap-3 shrink-0 mx-5">
			{/* 修改主容器背景为白色 */}
			<div className="flex items-center justify-between text-black"> {/* 修改文字颜色 */}
				<div className="flex items-center gap-1">
					<span className="codicon codicon-comment-discussion scale-90 mr-1" />
					<span className="font-medium text-xs uppercase">{t("history:recentTasks")}</span>
				</div>
			</div>
			{taskHistory.slice(0, 3).map((item) => (
				<div
					key={item.id}
					className="bg-white rounded-xs relative overflow-hidden opacity-90 hover:opacity-100 cursor-pointer" // 移除原有背景色，改为bg-white
					onClick={() => vscode.postMessage({ type: "showTaskWithId", text: item.id })}>
					<div className="flex flex-col gap-2 p-3 pt-1">
						<div className="flex justify-between items-center">
							<span className="text-xs font-medium text-black uppercase"> {/* 文字改黑色 */}
								{formatDate(item.ts)}
							</span>
							<CopyButton itemTask={item.task} />
						</div>
						{/* 任务描述文字改为黑色 */}
						<div
							className="text-black overflow-hidden whitespace-pre-wrap"
							style={{
								display: "-webkit-box",
								WebkitLineClamp: 3,
								WebkitBoxOrient: "vertical",
								wordBreak: "break-word",
								overflowWrap: "anywhere",
							}}>
							{item.task}
						</div>
						{/* 统计信息文字改为黑色 */}
						<div className="text-xs text-black">
							<span>
								{t("history:tokens", {
									in: formatLargeNumber(item.tokensIn || 0),
									out: formatLargeNumber(item.tokensOut || 0),
								})}
							</span>
							{!!item.cacheWrites && (
								<>
									{" • "}
									<span>
										{t("history:cache", {
											writes: formatLargeNumber(item.cacheWrites || 0),
											reads: formatLargeNumber(item.cacheReads || 0),
										})}
									</span>
								</>
							)}
							{!!item.totalCost && (
								<>
									{" • "}
									<span>{t("history:apiCost", { cost: item.totalCost?.toFixed(4) })}</span>
								</>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default memo(HistoryPreview)
