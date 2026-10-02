import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import type { ChartPoint, TooltipState } from '../types'
import ChartTooltip from './ChartTooltip'
import { drawCartesianAxes, MARGIN, niceMax } from './chartUtils'

type BarChartProps = {
  data: ChartPoint[]
  xLabel: string
  yLabel: string
  height?: number
}

export default function BarChart({ data, xLabel, yLabel, height = 300 }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipState>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.length || width === 0) return

    const innerWidth = width - MARGIN.left - MARGIN.right
    const innerHeight = height - MARGIN.top - MARGIN.bottom

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const xScale = d3.scaleBand().domain(data.map((d) => d.label)).range([0, innerWidth]).padding(0.2)
    const yScale = d3.scaleLinear().domain([0, niceMax(data.map((d) => d.value))]).range([innerHeight, 0])

    const g = drawCartesianAxes({ svg, xScale, yScale, innerWidth, innerHeight, xLabel, yLabel })

    g.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.label)!)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => innerHeight - yScale(d.value))
      .attr('fill', '#4f86f7')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('fill', '#2563eb')
        setTooltip({ label: d.label, value: d.value, x: event.clientX, y: event.clientY })
      })
      .on('mousemove', (event, d) => {
        setTooltip({ label: d.label, value: d.value, x: event.clientX, y: event.clientY })
      })
      .on('mouseleave', function () {
        d3.select(this).attr('fill', '#4f86f7')
        setTooltip(null)
      })
  }, [data, width, height, xLabel, yLabel])

  return (
    <div ref={containerRef} className="chart">
      <svg ref={svgRef} />
      <ChartTooltip tooltip={tooltip} />
    </div>
  )
}
