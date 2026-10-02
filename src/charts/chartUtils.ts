import * as d3 from 'd3'

export const MARGIN = { top: 20, right: 20, bottom: 70, left: 60 }

export function niceMax(values: number[]) {
  const max = d3.max(values) ?? 0
  return Math.ceil(max / 10) * 10 || 10
}

type AxisConfig = {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  xScale: d3.ScaleBand<string>
  yScale: d3.ScaleLinear<number, number>
  innerWidth: number
  innerHeight: number
  xLabel: string
  yLabel: string
}

export function drawCartesianAxes({
  svg,
  xScale,
  yScale,
  innerWidth,
  innerHeight,
  xLabel,
  yLabel,
}: AxisConfig) {
  const g = svg.append('g').attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end')
    .attr('dx', '-0.6em')
    .attr('dy', '0.15em')

  g.append('g').call(d3.axisLeft(yScale).tickFormat((d) => `$${d}`))

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 55)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .attr('font-size', 12)
    .text(xLabel)

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .attr('text-anchor', 'middle')
    .attr('fill', 'currentColor')
    .attr('font-size', 12)
    .text(yLabel)

  return g
}
