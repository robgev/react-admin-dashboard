import React from 'react';

import {initialRooms} from '../../actions/roomActivate.action';
import {getRooms} from '../firebaseAPI';
import {connect} from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';

import Header from '../ur/components/Header';
import Footer from '../ur/components/Footer';

import ResForm from './ReservationForm';
import Calendar from './Calendar';
import RoomList from './RoomList';
import RoomInfo from './RoomInfo';

import colors from '../colors';

function mapStateToProps({activeRoom: room, loggedIn}) {
  return {room, loggedIn};
};

const appBarStyle = {
  zIndex: 5
};

class MainPage extends React.Component {
  constructor(){
    super();
    this.state = {
      startTime: '',
      endTime: '',
      date: '',
      reservationData: {},
      events: [],
      selected: false
    };
  };

  componentWillMount(){
    getRooms().then((rooms)=>{
      rooms = rooms.val();
      rooms[0] = {
        name: 'All',
        class: 'a',
        index: 0,
        descr: 'All rooms',
        color: 'black'
      };
      this.props.initialRooms(rooms);
    });
  };

  render() {
    return (
      <div>
        <Header
          id={1}
          user={this.props.user}
          admin={this.props.admin}
          signOut={this.props.signOut}
        />
        <MuiThemeProvider>
          <AppBar style={appBarStyle} title='Rooms' iconElementLeft={< IconButton ></IconButton>}/>
        </MuiThemeProvider>
        <div className='mainpage'>
          <RoomList
            roomChange={()=>{
              this.setState({
                startTime: '',
                endTime: '',
                date: '',
                reservationData: {},
                selected: false
              });
            }}
          />
          <Calendar
            changeTime={(times)=>{
              this.setState({
                startTime: times.startTime,
                endTime: times.endTime,
                date: times.date,
                selected: true
              });
            }}
            changeData={(data)=>{
              this.setState({
                reservationData: data
              });
            }}
            getEvents={(events)=>{
              this.setState({events});
            }}
          />
          <div className={this.props.room.index !== 0 ? 'room-whole-details' : ''}>
            <RoomInfo/>
            <ResForm
              startTime={ this.state.startTime }
              endTime={ this.state.endTime }
              date={ this.state.date }
              data={ this.state.reservationData }
              events={ this.state.events }
              selected={ this.state.selected }
              cancel={()=>{
                this.setState({
                  startTime: '',
                  endTime: '',
                  date: '',
                  reservationData: {},
                  selected: false
                });
              }}
            />
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default connect(mapStateToProps, {initialRooms})(MainPage);
