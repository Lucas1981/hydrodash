export type ChartPoint = { label: string; value: number }

export type DashboardData = {
  barChart: ChartPoint[]
  lineChart: Record<string, ChartPoint[]>
  donutChart: ChartPoint[]
}

export type TooltipState = {
  label: string
  value: number
  x: number
  y: number
} | null
