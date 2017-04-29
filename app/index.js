import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter as Router } from 'react-router-dom';

import './scss/main.sass';
import './scss/main.scss';
import './scss/hrHome.sass';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import App from './lib/App';
import { allReducers } from './reducers/index';

injectTapEventPlugin(); // For Material design to work
const store = createStore(
  allReducers
);

class ApplicationRoot extends Component {
  render() {
    return(
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Router>
            <App />
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

ReactDOM.render(
    <ApplicationRoot />,
    document.getElementById('app')
);
