import React, {Component} from 'react';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

const paperstyle = {
  width: 320,
  margin: 10,
  height: '100%',
};

function mapStateToProps(state) {
  return {room: state.activeRoom}
};

class RoomInfo extends Component {
  render() {
    if (this.props.room) {
      return (
          <MuiThemeProvider>
            <div className='room-info'>
              <Paper zDepth={0} style={paperstyle}>
                <div className='room-name'>
                  {this.props.room.name}
                </div>
                <div className={this.props.room.index !== 0 ? 'room-details-container' : ''}>
                  <div className='room-description'>
                    {this.props.room.descr}
                  </div>
                  <div className={this.props.room.index !== 0 ? 'room-image-container' : ''}>
                    <img  className={this.props.room.index !== 0 ? 'room-image' : ''} src={this.props.room.icon}/>
                  </div>
                </div>
              </Paper>
            </div>
          </MuiThemeProvider>
      )
    }
  }
}

export default connect(mapStateToProps)(RoomInfo);
