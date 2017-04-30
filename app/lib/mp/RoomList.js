import React, {Component} from 'react';

import {roomActivate} from '../../actions/roomActivate.action.js';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';

const paperstyle = {
  width: 212,
  margin: 0,
  overflow: 'hidden',
  height: '100%'
};

function mapStateToProps(state) {
  return {rooms: state.rooms}
};

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  };

  componentWillMount() {
    if (this.props.rooms) {
      this.props.roomActivate(this.props.rooms[0])
    }
  };

  selectRow = (room, index) => {
    this.setState({value: index})
    this.props.roomActivate(room)
  };

  renderingMenuItems() {
    return this.props.rooms.map((room, index) => {
      return (
        <div key={room.index} className = {room.class}>
          <MenuItem
            key={room.index}
            className={room.index === this.state.value ? 'selected' : ''}
            onClick={() => this.selectRow(room, index)}
            leftIcon={<div className = {room.color}/>}>
              <p>{room.name}</p>
          </MenuItem>
        </div>
      )
    })
  };

  render() {
    return (
      <MuiThemeProvider>
        <div className = 'room-list-container'>
          <Paper style={paperstyle}>
            <Menu value={this.state.value}>
              {this.renderingMenuItems()}
            </Menu>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps, {roomActivate})(RoomList);
