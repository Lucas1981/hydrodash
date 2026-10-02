# Hydrodash

This will be a test app to see how we might visualize data that Hydromancer typically might use. We will build it up like this:

## A mock backend

- [x] For the backend, we can use a very simple mock backend that we set up with a Node `server.js` file. We can use the `json-server` package to set this up.
- [x] On this backend, we want to have a websocket. This should give us updated data at pretty high frequency. We can actually let our server program make up new data points pretty much constantly and then transmit them over our websocket connection continuously. The interval of generating and transmitting new data points can be once every second. We can time-window a total data set, where we never go beyond let's say twelve points. Initially we can make up twelve points, and then push/shift every second to keep the data moving.
- [x] We will want to make separate data sets for each of the charts we will want to show. So for the bar chart it can be a simple set. For the line charts, it should be more than one set since we want to show more lines. For the donut set, we can actually just change the ratios of what we want to show.

### Backend implementation notes

- Run with `npm start` (port `3001`).
- REST API via json-server at `/api` (static metadata in `db.json`).
- WebSocket on the same port. Messages: `{ type: 'init' | 'update', data: { barChart, lineChart, donutChart } }`.
- `barChart`: single series of 12 `{ label, value }` points.
- `lineChart`: two series (`Revenue`, `Costs`), each with 12 points.
- `donutChart`: three segments (`Product A/B/C`) with shifting values.

## The frontend

- [x] We will want to set up a new React project for this. It should be a simple SPA. We can do with just a header and we will populate the dashboard.
- [x] We will have one main component `Dashboard.tsx` that will orchestrate the other components we will build. In this component, we want to set up the connection established with the websocket from our mock backend. If at all we can use `Axios` for this, let's go with that choice.
- [x] We will want to build three data vizualization components, with `D3.js`. These should provide us with:
  - [x] a bar-chart
  - [x] a line-chart
  - [x] a donut chart

The extra specifications for the line and bar charts are also:

- [x] Hovering over a band should highlight the value, shown in a popup. We can use popperjs for this if there is not a more modern alternative for it.
- [x] Axes should show the nice max and 0 of the values. They should be agnostic, so we must specify what they represent with labels that we specify. We can just use money and time for our example app. We want to tick the axes and also have the x-axis labels be tilted 45 degrees for legibility.
- [x] The charts should be able to update realtime.
- [x] On the line chart, we want to be able to plot more than one line, and we want the option to display a legend next to it, be it optionally.

We want to keep all of this very concise and clean, not using more code than we need to. Do not go optimize for errors that we don't expect. We want to keep this on a very small proof-of-concept level for now.
