import React from 'react';

import {getUser, firebase} from '../firebaseAPI';
import {connect} from 'react-redux';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import {ModalContainer, ModalDialog} from 'react-modal-dialog';

import colors from '../colors.js';

BigCalendar.momentLocalizer(moment);

function mapStateToProps(state) {
  return {room: state.activeRoom}
};

const buttonStyle = {
  width: 122
};

class Calendar extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      events: [],
      reservationSlot: {},
      showPopup: false,
      event: '',
      roomN: 0
    };
  };

  getAllEvents = () => {
    firebase.database().ref('/events/').once('value').then((allRoomsEvents) => {
      allRoomsEvents = allRoomsEvents.val();
      let events = [];
      for (let i in allRoomsEvents){
        for (let idx in allRoomsEvents[i]){
          events.push({
            'title': allRoomsEvents[i][idx].description,
            'start': new Date(allRoomsEvents[i][idx].startDate),
            'end': new Date(allRoomsEvents[i][idx].endDate),
            'color': this.colorChooser(Number(i)),
            'user': allRoomsEvents[i][idx].user,
            'key': idx,
            'room': i
          });
        }
      }
      const reservationSlot = {};
      this.setState({events, reservationSlot});
    });
  }

  eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      opacity: 0.8,
      color: 'black',
      border: 0,
      display: 'block'
    };
      return {style: style};
  };

  onTimeSelect = (start, end) => {
    start = new Date(start);
    end = new Date(end);
    const data = {
      roomNumber: this.props.room.index,
      startDate: start,
      endDate: end,
      email: this.state.email
    };
    this.props.changeData(data);
    const date = moment(start).format('DD/MM/YYYY');
    this.props.changeTime({startTime: start, endTime: end, date: date});
    const reservationSlot = {
      'title': 'Your Reservation',
      'start': start,
      'end': end,
      'color': colors.red
    };
    this.setState({reservationSlot});
  };

  colorChooser = (n) => {
    switch (n) {
      case 1:
        return colors.blueDark;
      case 2:
        return colors.greenDark;
      case 3:
        return colors.yellow;
      case 4:
        return colors.orange;
      case 5:
        return colors.purpleDark;
      default:
        return colors.blueDark;
    }
  };

  componentDidMount() {
    document.getElementsByClassName('rbc-month-view')[0].setAttribute('style', 'z-index: 1');
    const userInterval = setInterval(()=>{
      const user = getUser();
      if (user != null){
        this.setState({email: user.email});
        clearInterval(userInterval);
      }
    }, 500);
    this.getAllEvents();
  };

  componentWillReceiveProps(nextProps){
    if (nextProps.room.index === this.state.roomN)
      return;
    if (nextProps.room.index === 0){
      this.getAllEvents();
      this.setState({roomN: nextProps.room.index});
    }
    else {
      firebase.database().ref('/events/' + nextProps.room.index).on('value', (eventList) => {
        eventList = eventList.val();
        let events = [];
        for (let i in eventList){
          events.push({
            'title': eventList[i].description,
            'start': new Date(eventList[i].startDate),
            'end': new Date(eventList[i].endDate),
            'color': this.colorChooser(Number(nextProps.room.index)),
            'user': eventList[i].user,
            'key': i,
            'room': nextProps.room.index
          });
        }
        const reservationSlot = {};
        this.props.getEvents(events);
        this.setState({events, reservationSlot, roomN: nextProps.room.index});
      });
    }
  };

  render() {
    return (
      <div className='calendar'>
        <BigCalendar
          selectable= { this.props.room.index === 0 ? false : 'ignoreEvents'}
          events={[...this.state.events, this.state.reservationSlot]}
          step={30}
          defaultView='month'
          onSelectSlot={(slotInfo) => {
            let startTime = slotInfo.start.toLocaleString();
            let endTime = slotInfo.end.toLocaleString();
            this.onTimeSelect(startTime, endTime);
          }}
          onSelectEvent= {(event)=>{
            if (!event.user)
              event.title = 'Complete the form to save your reservation.';
            this.setState({showPopup: !this.state.showPopup, event});
          }}
          eventPropGetter={this.eventStyleGetter}
        />
        {
          !this.state.showPopup ? null :
          <ModalContainer>
            <ModalDialog>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h1 style={{color: colors.blueDark}}>
                  {this.state.event.title}
                </h1>
                <br/>
                {`From ${this.state.event.start.toLocaleDateString() + ' ' + moment(this.state.event.start).format('hh:mm a')}`}
                <br/>
                {`To ${this.state.event.end.toLocaleDateString() + ' ' + moment(this.state.event.end).format('hh:mm a')}`}
                <div className='popup-buttons2'>
                  {
                    this.state.email !== this.state.event.user ? null :
                      <RaisedButton
                        label='Delete'
                        primary={true}
                        buttonStyle={buttonStyle}
                        onClick={()=>{
                          firebase.database().ref('events/'+this.state.event.room).child(this.state.event.key).remove().then(()=>{
                            this.setState({showPopup: false, event: ''});
                          });
                        }}
                      />
                  }
                  <RaisedButton
                    label='Close'
                    primary={false}
                    buttonStyle={buttonStyle}
                    onClick={()=>{
                      this.setState({showPopup: false})
                    }}
                  />
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Calendar);
