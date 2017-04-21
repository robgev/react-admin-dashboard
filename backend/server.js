'use strict';

var _http = require('http');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _reactRouter = require('react-router');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _App = require('../frontend/lib/App');

var _App2 = _interopRequireDefault(_App);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _getMuiTheme = require('material-ui/styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _Notfound = require('../frontend/lib/ur/components/Notfound');

var _Notfound2 = _interopRequireDefault(_Notfound);

var _index = require('../frontend/reducers/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = process.env.NODE_ENV === 'debug' ? true : false;
var favicon = require('serve-favicon');
var express = require('express');
var url = require('url');
var app = express();
var ui = [{ resource: '/', link: 'home' }, { resource: '/user', link: 'user' }, { resource: '/about', link: 'about' }, { resource: '/room', link: 'room reservation' }, { resource: '/management', link: 'management' }, { resource: '/admin', link: 'admin' }];

// const ui_routes = new Set (
//   [ui.map(({resource}) => resource)]
// );

var ui_routes = ui.map(function (_ref) {
  var resource = _ref.resource;
  return resource;
});

var store = (0, _redux.createStore)(_index.allReducers);

app.use(express.static('public'));
app.use(function (req, res, next) {
  global.navigator = {
    userAgent: req.headers['user-agent']
  };
  // This context object contains the results of the render
  var context = {};
  var muiTheme = (0, _getMuiTheme2.default)({}, { userAgent: req.headers['user-agent'] || 'all' });
  var g = url.parse(req.url).pathname;
  console.log({ URL: req.url, PARAMS: req.query, g: g });
  var html = (0, _server.renderToString)(_react2.default.createElement(
    _reactRedux.Provider,
    { store: store },
    _react2.default.createElement(
      _MuiThemeProvider2.default,
      { muiTheme: muiTheme },
      _react2.default.createElement(
        _reactRouter.StaticRouter,
        { location: req.url, context: context },
        _react2.default.createElement(_App2.default, null)
      )
    )
  ));

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    res.writeHead(302, {
      Location: context.url
    });
    res.end();
  } else {
    // if (ui_routes.has(g) === false) next();
    console.log(ui_routes);
    if (ui_routes.includes(g) === false) next();else {
      res.setHeader('Content-Type', 'text/html');
      res.end('\n  <!DOCTYPE html>\n  <html>\n    <head>\n      <meta charset="utf-8">\n      <meta name="viewport" content="width=device-width, initial-scale=1"/>\n      <link href="https://fonts.googleapis.com/css?family=Roboto:400" rel="stylesheet">\n      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">\n      <title>ApolloBytes Internal Management</title>\n      <link rel="preload" href="bundle.js" as="script"/>\n    </head>\n    <body>\n      <div id="app">' + html + '</div>\n       <script src="bundle.js"></script>\n    </body>\n  </html>\n  ');
    }
  }
});

app.use(favicon('public/images/favicon.ico'));

// No other handler picked it up yet, so this is our 404 handler
app.use(function (req, res, next) {
  var html = (0, _server.renderToString)(_react2.default.createElement(_Notfound2.default, null));
  var render = '\n<!DOCTYPE html>\n<meta charset=\'utf-8\'></meta>\n<body>\n  ' + html + '\n</body>';
  res.status(404).send(render);
});

app.listen(8080);