'use strict';

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import App from '../frontend/lib/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NotFound from '../frontend/lib/ur/components/Notfound';
import { allReducers } from '../frontend/reducers/index';
import admin_router from './admin_routes'

const debug = process.env.NODE_ENV === 'debug' ? true : false;
const favicon = require('serve-favicon');
const express = require('express');
const url = require('url');
const app = express();
const ui = [
  {resource: '/',      link: 'home'},
  {resource: '/user',      link: 'user'},
  {resource: '/about', link: 'about'},
  {resource: '/room',  link: 'room reservation'},
  {resource: '/management', link: 'management'},
  {resource: '/admin', link: 'admin'},
  {resource: '/management/questions', link: 'questions'},
]

// const ui_routes = new Set (
//   [ui.map(({resource}) => resource)]
// );

const ui_routes = ui.map(({resource}) => resource)

const store = createStore(
  allReducers
);

app.use(express.static('public'));
app.use((req, res, next) => {
  global.navigator = {
    userAgent: req.headers['user-agent']
  };
  // This context object contains the results of the render
  const context = {}
  const muiTheme = getMuiTheme({}, {userAgent: req.headers['user-agent'] || 'all'});
  const g = url.parse(req.url).pathname;
  console.log({URL:req.url, PARAMS: req.query, g});
  const html = renderToString(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </MuiThemeProvider>
    </Provider>
  )

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    res.writeHead(302, {
      Location: context.url
    })
    res.end()
  } else {
    // if (ui_routes.has(g) === false) next();
    if(ui_routes.includes(g) === false) next();
    else {
      res.setHeader('Content-Type', 'text/html');
      res.end(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <title>ApolloBytes Internal Management</title>
      <link rel="preload" href="/bundle.js" as="script"/>
    </head>
    <body>
      <div id="app">${html}</div>
       <script src="/bundle.js"></script>
    </body>
  </html>
  `   );
    }
  }
});

app.use(favicon('public/images/favicon.ico'));

app.get('/management/interview/:candidateId', (req, res) => {
  global.navigator = {
    userAgent: req.headers['user-agent']
  };
  // This context object contains the results of the render
  const context = {}
  const muiTheme = getMuiTheme({}, {userAgent: req.headers['user-agent'] || 'all'});
  const g = url.parse(req.url).pathname;
  console.log('candidateId:', req.params.candidateId);
  const html = renderToString(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </MuiThemeProvider>
    </Provider>
  )
  if (context.url) {
    res.writeHead(302, {
      Location: context.url
    })
    res.end()
  } else {
      res.setHeader('Content-Type', 'text/html');
      res.end(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <title>ApolloBytes Internal Management</title>
      <link rel="preload" href="/bundle.js" as="script"/>
    </head>
    <body>
      <div id="app">${html}</div>
       <script src="/bundle.js"></script>
    </body>
  </html>
  `   );
  }
});

app.use('/manageusers', admin_router);

// No other handler picked it up yet, so this is our 404 handler
app.use((req, res, next) => {
  const html = renderToString(
    <NotFound />
  )
  const render = `
<!DOCTYPE html>
<meta charset='utf-8'></meta>
<body>
  ${html}
</body>`
  res
    .status(404)
    .send(render);
});

app.listen(8080);
