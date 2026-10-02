import jsonServer from 'json-server'
import { WebSocketServer } from 'ws'

const PORT = 3001
const WINDOW_SIZE = 12
const TICK_INTERVAL_MS = 1000

const state = {
  barChart: [],
  lineChart: {},
  donutChart: [],
}

function randomValue(min = 0, max = 100) {
  return Math.round(min + Math.random() * (max - min))
}

function makeTimeLabel(offset = 0) {
  const date = new Date(Date.now() - offset * TICK_INTERVAL_MS)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function initBarChart() {
  state.barChart = Array.from({ length: WINDOW_SIZE }, (_, i) => ({
    label: makeTimeLabel(WINDOW_SIZE - 1 - i),
    value: randomValue(20, 80),
  }))
}

function initLineChart() {
  const seriesNames = ['Revenue', 'Costs']
  state.lineChart = Object.fromEntries(
    seriesNames.map((name) => [
      name,
      Array.from({ length: WINDOW_SIZE }, (_, i) => ({
        label: makeTimeLabel(WINDOW_SIZE - 1 - i),
        value: randomValue(10, 90),
      })),
    ])
  )
}

function initDonutChart() {
  state.donutChart = [
    { label: 'Product A', value: randomValue(20, 40) },
    { label: 'Product B', value: randomValue(15, 35) },
    { label: 'Product C', value: randomValue(10, 30) },
  ]
}

function initData() {
  initBarChart()
  initLineChart()
  initDonutChart()
}

function shiftSeries(series) {
  series.shift()
  series.push({
    label: makeTimeLabel(0),
    value: randomValue(10, 90),
  })
}

function tick() {
  shiftSeries(state.barChart)

  for (const series of Object.values(state.lineChart)) {
    shiftSeries(series)
  }

  state.donutChart = state.donutChart.map((segment) => ({
    ...segment,
    value: Math.max(5, segment.value + randomValue(-8, 8)),
  }))
}

function broadcast(wss, payload) {
  const message = JSON.stringify(payload)
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message)
    }
  }
}

const app = jsonServer.create()
const router = jsonServer.router('db.json')

app.use(jsonServer.defaults({ noCors: false }))
app.use('/api', router)

const httpServer = app.listen(PORT, () => {
  initData()
  console.log(`Mock backend listening on http://localhost:${PORT}`)
  console.log(`WebSocket available on ws://localhost:${PORT}`)
})

const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', data: state }))
})

setInterval(() => {
  tick()
  broadcast(wss, { type: 'update', data: state })
}, TICK_INTERVAL_MS)
