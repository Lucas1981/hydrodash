import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import type { ChartPoint } from '../types'

type DonutChartProps = {
  data: ChartPoint[]
  height?: number
}

const COLORS = ['#4f86f7', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DonutChart({ data, height = 300 }: DonutChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(0)

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

    const radius = Math.min(width, height) / 2 - 20
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const pie = d3.pie<ChartPoint>().value((d) => d.value).sort(null)
    const arc = d3.arc<d3.PieArcDatum<ChartPoint>>().innerRadius(radius * 0.55).outerRadius(radius)

    g.selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (_, i) => COLORS[i % COLORS.length])

    const legend = svg
      .append('g')
      .attr('transform', `translate(16, ${height / 2 - (data.length * 22) / 2})`)

    data.forEach((segment, i) => {
      const row = legend.append('g').attr('transform', `translate(0, ${i * 22})`)
      row.append('rect').attr('width', 12).attr('height', 12).attr('fill', COLORS[i % COLORS.length])
      row
        .append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('font-size', 12)
        .text(`${segment.label} (${segment.value})`)
    })
  }, [data, width, height])

  return (
    <div ref={containerRef} className="chart">
      <svg ref={svgRef} />
    </div>
  )
}
