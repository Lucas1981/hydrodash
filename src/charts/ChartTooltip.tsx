import type { TooltipState } from '../types'

type ChartTooltipProps = {
  tooltip: TooltipState
}

export default function ChartTooltip({ tooltip }: ChartTooltipProps) {
  if (!tooltip) return null

  return (
    <div
      className="chart-tooltip"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <strong>{tooltip.label}</strong>
      <span>${tooltip.value}</span>
    </div>
  )
}
