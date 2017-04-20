import React, {Component} from 'react';
import {connect} from 'react-redux';
import {roomActivate} from '../../actions/roomActivate.action.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';

const paperstyle = {
    width: '212px',
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
        }
    }

    componentWillMount() {
        if (this.props.rooms) {
            this.props.roomActivate(this.props.rooms[0])
        }
    }

    selectRow = (room, index) => {
        this.setState({value: index})
        this.props.roomActivate(room)
    }

    renderingMenuItems() {
        return this.props.rooms.map((room, index) => {
            return (
              <div key={room.index} className = {room.class}>
                <MenuItem key={room.index} className={room.index === this.state.value
                    ? 'selected'
                    : ''} onClick={() => this.selectRow(room, index)} leftIcon={< div className = {
                    room.color
                } > </div>}><p>{room.name}</p></MenuItem>
              </div>
            )
        })
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
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
