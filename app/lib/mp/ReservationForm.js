import React, {Component} from 'react';

import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import ReservationPopup from './ReservationPopup';
import Paper from 'material-ui/Paper';

import moment from 'moment';

const paperstyle = {
  width: 320,
  margin: 10,
  height: '100%',
};

const buttonStyle = {
  margin: '20px 200px 0 0',
};

function mapStateToProps({activeRoom: room}) {
  return {room}
};

class ResForm extends Component {
  constructor(){
    super();
    this.state = {
      showPopup: false
    };
  };

  render() {
    return (
      <div className='resform'>
        <div className='resform-content'>
        <p>{`Date: ${this.props.date}`}</p>
        <p>{`Starting time: ${this.props.startTime ? moment(this.props.startTime).format('hh:mm a') : ''}`}</p>
        <p>{`End time: ${this.props.endTime ? moment(this.props.endTime).format('hh:mm a') : ''}`}</p>
      </div>
        <MuiThemeProvider>
            <Paper zDepth={0} style={paperstyle}>
          <div>
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
            <RaisedButton
              label='Cancel'
              primary={false}
              fullWidth={true}
              style = {buttonStyle}
              onClick={()=>{
                this.props.cancel();
              }}
              disabled={!this.props.date}
            />
          </div>
        </Paper>
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

export default connect(mapStateToProps)(ResForm);
