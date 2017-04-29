import React, {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ReservationPopup from './ReservationPopup';

import moment from 'moment';

const buttonStyle = {
  marginRight: 200
};

export default class ResForm extends Component {
  constructor(){
    super();
    this.state = {
      showPopup: false
    };
  };

  render() {
    return (
      <div className='resform'>
        <p>{`Date: ${this.props.date}`}</p>
        <p>{`Starting time: ${this.props.startTime ? moment(this.props.startTime).format('hh:mm a') : ''}`}</p>
        <p>{`End time: ${this.props.endTime ? moment(this.props.endTime).format('hh:mm a') : ''}`}</p>
        <MuiThemeProvider>
          <RaisedButton
            label='Reserve'
            primary={true}
            fullWidth={true}
            style = {buttonStyle}
            onClick={()=>{
              this.setState({showPopup: true})
            }}
            disabled={!this.props.date}
          />
        </MuiThemeProvider>
        {!this.state.showPopup ? null :
          <ReservationPopup
            date={ this.props.date }
            start={ this.props.startTime }
            end={ this.props.endTime }
            close={()=>{
              this.setState({showPopup: false});
            }}
            data={ this.props.data }
            events={ this.props.events }
          />
        }
      </div>
    );
  }
}
