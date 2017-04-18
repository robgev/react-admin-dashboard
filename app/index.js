import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import allReducers from './reducers/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './components/App';

const store = createStore(
  allReducers
);

ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);
