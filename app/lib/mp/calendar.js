import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {connect} from 'react-redux';
import { firebase, saveEvent } from '../firebaseAPI';

import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);

function mapStateToProps(state) {
    return {room: state.activeRoom}
}

class Calendar extends React.Component{

  constructor(){
    super();
    this.state = {
      email: '',
      events: []
    }
  }

  eventStyleGetter = (event) => {
    const style = {
        backgroundColor: event.color,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
  }

  onTimeSelect = (start, end) => {
    start = new Date(start);
    end = new Date(end);
    const data = {
      roomNumber: this.props.room.index,
      startDate: start,
      endDate: end,
      email: this.state.email
    }
    this.props.changeData(data);
    const date = moment(start).format('DD/MM/YYYY');
    this.props.changeTime({startTime: start, endTime: end, date: date});
  }

  componentDidMount(){
    const { email } = require('../firebaseAPI.js');
    this.setState({email});
  }

  colorChooser = (n) => {
    switch (n) {
      case 0:
        return '#266CB2';
      case 1:
        return '#90EE90';
      case 2:
        return '#FFFF00';
      case 3:
        return '#FFA500';
      case 4:
        return '#A52A2A';
      default:
        return '#266CB2';
    }
  }

  componentWillReceiveProps(nextProps){
    const events = [];

    firebase.database().ref('/events/' + nextProps.room.index).once('value').then((eventList) => {
      eventList = eventList.val();
      let idx = 0;
      for (let i in eventList){
        events[idx] = {
          'title': eventList[i].description,
          'start': new Date(eventList[i].startDate),
          'end': new Date(eventList[i].endDate),
          'color': this.colorChooser(nextProps.room.index)
        }
        idx += 1;
      }
      this.setState({events});
    });
  }

  componentDidMount(){
    const events = [];

    firebase.database().ref('/events/' + this.props.room.index).once('value').then((eventList) => {
      eventList = eventList.val();
      let idx = 0;
      for (let i in eventList){
        events[idx] = {
          'title': eventList[i].description,
          'start': new Date(eventList[i].startDate),
          'end': new Date(eventList[i].endDate),
          'color': this.colorChooser(this.props.room.index)
        }
        idx += 1;
      }
      this.setState({events});
    });
  }

  render(){
    return(
      <div className='calendar'>
        <BigCalendar
          selectable = 'ignoreEvents'
          events = { this.state.events }
          step = {30}
          defaultView='week'
          onSelectSlot={(slotInfo) => {
            let startTime = slotInfo.start.toLocaleString();
            let endTime = slotInfo.end.toLocaleString();
            this.onTimeSelect(startTime, endTime);
          }}
          eventPropGetter={this.eventStyleGetter}
        />
      </div>
    )
  }
}


export default connect(mapStateToProps)(Calendar);
