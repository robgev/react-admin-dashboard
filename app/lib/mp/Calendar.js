import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {getUser, firebase, saveEvent} from '../firebaseAPI';

BigCalendar.momentLocalizer(moment);

function mapStateToProps(state) {
    return {room: state.activeRoom}
}

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
        return {style: style};
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
        const reservationSlot = {
            'title': 'Your Reservation',
            'start': start,
            'end': end,
            'color': 'red'
        };
        this.setState({reservationSlot});
    }

    colorChooser = (n) => {
        switch (n) {
            case 1:
                return '#266CB2';
            case 2:
                return '#90EE90';
            case 3:
                return '#FFFF00';
            case 4:
                return '#FFA500';
            case 5:
                return '#A52A2A';
            default:
                return '#266CB2';
        }
    }

    componentDidMount() {
        const userInterval = setInterval(()=>{
            const user = getUser();
            if (user != null){
              this.setState({email: user.email});
              clearInterval(userInterval);
            }
        }, 500);
        firebase.database().ref('/events/').once('value').then((allRoomsEvents) => {
            allRoomsEvents = allRoomsEvents.val();
            let events = [];
            for (let i in allRoomsEvents) {
                for (let idx in allRoomsEvents[i]) {
                    events.push({'title': allRoomsEvents[i][idx].description,
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

  componentWillReceiveProps(nextProps){
    if (nextProps.room.index === this.state.roomN)
      return;
    if (nextProps.room.index === 0){
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
        this.setState({events, reservationSlot, roomN: nextProps.room.index});
      });
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
  }
    render() {
        return (
            <div className='calendar'>
                <BigCalendar selectable= { this.props.room.index === 0 ? false : 'ignoreEvents'}
                  events={[...this.state.events, this.state.reservationSlot]}
                  step={30}
                  defaultView='week'
                  onSelectSlot={(slotInfo) => {
                    let startTime = slotInfo.start.toLocaleString();
                    let endTime = slotInfo.end.toLocaleString();
                    this.onTimeSelect(startTime, endTime);
                }} onSelectEvent= {(event)=>{
                  this.setState({showPopup: !this.state.showPopup, event});
                }} eventPropGetter={this.eventStyleGetter}/> {this.state.showPopup
                    ? <div className='reservationPopup'>
                            <div className='popupWindowDescr'>
                                <div className='event-title'>
                                    Event title: {this.state.event.title}
                                </div>
                                <br/>
                                <div>
                                    Duration
                                </div>
                                {this.state.event.start.toLocaleDateString() + ' '}
                                from {this.state.event.start.toLocaleTimeString() + ' '}
                                to {this.state.event.end.toLocaleTimeString()}
                                <div className = 'descr-button'>
                                  <MuiThemeProvider>
                                    <div>
                                      {
                                        this.state.email === this.state.event.user ?
                                        <RaisedButton
                                          label='Delete'
                                          primary={true}
                                          onClick={()=>{
                                            firebase.database().ref('events/'+this.state.event.room).child(this.state.event.key).remove().then(()=>{
                                              this.setState({showPopup: false, event: ''});
                                            });
                                          }}
                                        />
                                        :
                                        <div></div>
                                      }
                                    <RaisedButton
                                      label='Close'
                                      primary={false}
                                      onClick={()=>{
                                        this.setState({showPopup: false})
                                      }}
                                    />
                                  </div>
                                  </MuiThemeProvider>
                                </div>
                            </div>
                        </div>
                    : <div></div>}
            </div>
        )
    }
}

export default connect(mapStateToProps)(Calendar);
