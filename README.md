# Hydrodash

<img width="1470" height="705" alt="Screenshot 2026-10-02 at 16 47 44" src="https://github.com/user-attachments/assets/274d6cc1-4403-4dcf-a636-a564b008ba68" />

This is a very simple Vibe Engineered example of how to build a simple dashboard making use of real-time data coming in through websockets. It makes use of React to display the app, uses D3.js to take care of the data visualization elements. The data right now is mock data, where our `server.js` file just adds random new data points every second, keeping the stream displayed fresh to illustrate the dynamic nature of the app.

To run this app locally, first install the dependencies with `$npm i` on the root dir, theb run `$ node server.js` and in another tab run `$ npm run dev` to bring up the dashboard.
