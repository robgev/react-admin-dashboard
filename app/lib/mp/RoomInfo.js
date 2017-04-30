import React, {Component} from 'react';
import {connect} from 'react-redux';

function mapStateToProps(state) {
  return {room: state.activeRoom}
};

class RoomInfo extends Component {
  render() {
    if (this.props.room) {
      return (
        <div className='room-info'>
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
        </div>
      )
    }
  }
}

export default connect(mapStateToProps)(RoomInfo);
