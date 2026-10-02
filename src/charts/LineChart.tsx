import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import type { ChartPoint, TooltipState } from '../types'
import ChartTooltip from './ChartTooltip'
import { drawCartesianAxes, MARGIN, niceMax } from './chartUtils'

type LineChartProps = {
  data: Record<string, ChartPoint[]>
  xLabel: string
  yLabel: string
  showLegend?: boolean
  height?: number
}

const COLORS = d3.schemeCategory10

export default function LineChart({
  data,
  xLabel,
  yLabel,
  showLegend = true,
  height = 300,
}: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  const legendWidth = showLegend ? 100 : 0

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const seriesNames = Object.keys(data)
    const labels = seriesNames.length ? data[seriesNames[0]].map((d) => d.label) : []
    if (!svgRef.current || !labels.length || width === 0) return

    const innerWidth = width - MARGIN.left - MARGIN.right - legendWidth
    const innerHeight = height - MARGIN.top - MARGIN.bottom

    const allValues = seriesNames.flatMap((name) => data[name].map((d) => d.value))

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const xScale = d3.scaleBand().domain(labels).range([0, innerWidth]).padding(0.1)
    const yScale = d3.scaleLinear().domain([0, niceMax(allValues)]).range([innerHeight, 0])

    const g = drawCartesianAxes({ svg, xScale, yScale, innerWidth, innerHeight, xLabel, yLabel })

    seriesNames.forEach((name, i) => {
      const points = data[name]
      const line = d3
        .line<ChartPoint>()
        .x((d) => xScale(d.label)! + xScale.bandwidth() / 2)
        .y((d) => yScale(d.value))

      g.append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', COLORS[i % COLORS.length])
        .attr('stroke-width', 2)
        .attr('d', line)

      g.selectAll(`.dot-${i}`)
        .data(points)
        .join('circle')
        .attr('class', `dot-${i}`)
        .attr('cx', (d) => xScale(d.label)! + xScale.bandwidth() / 2)
        .attr('cy', (d) => yScale(d.value))
        .attr('r', 4)
        .attr('fill', COLORS[i % COLORS.length])
        .on('mouseenter', (event, d) => {
          setTooltip({ label: `${name} · ${d.label}`, value: d.value, x: event.clientX, y: event.clientY })
        })
        .on('mousemove', (event, d) => {
          setTooltip({ label: `${name} · ${d.label}`, value: d.value, x: event.clientX, y: event.clientY })
        })
        .on('mouseleave', () => setTooltip(null))
    })

    if (showLegend) {
      const legend = svg
        .append('g')
        .attr('transform', `translate(${width - legendWidth + 10}, ${MARGIN.top})`)

      seriesNames.forEach((name, i) => {
        const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`)
        row.append('rect').attr('width', 12).attr('height', 12).attr('fill', COLORS[i % COLORS.length])
        row.append('text').attr('x', 18).attr('y', 10).attr('font-size', 12).text(name)
      })
    }
  }, [data, width, height, xLabel, yLabel, showLegend, legendWidth])

  return (
    <div ref={containerRef} className="chart">
      <svg ref={svgRef} />
      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}
