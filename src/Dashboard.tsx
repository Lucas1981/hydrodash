import { useEffect, useState } from 'react'
import BarChart from './charts/BarChart'
import DonutChart from './charts/DonutChart'
import LineChart from './charts/LineChart'
import type { DashboardData } from './types'

const WS_URL = 'ws://localhost:3001'

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'init' || message.type === 'update') {
        setData(message.data)
      }
    }

    return () => ws.close()
  }, [])

  if (!data) return <main className="dashboard" />

  return (
    <main className="dashboard">
      <section className="chart-panel">
        <h2>Sales</h2>
        <BarChart data={data.barChart} xLabel="Time" yLabel="Money ($)" />
      </section>
      <section className="chart-panel">
        <h2>Revenue vs Costs</h2>
        <LineChart data={data.lineChart} xLabel="Time" yLabel="Money ($)" showLegend />
      </section>
      <section className="chart-panel">
        <h2>Product Mix</h2>
        <DonutChart data={data.donutChart} />
      </section>
    </main>
  )
}
