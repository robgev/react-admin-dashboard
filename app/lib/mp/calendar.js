import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {connect} from 'react-redux';
import {firebase, saveEvent} from '../firebaseAPI';

import 'react-big-calendar/lib/css/react-big-calendar.css';

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
            event: ''
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
        const currentEvents = this.state.events;
        currentEvents.push(reservationSlot);
        this.setState({events: currentEvents});
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
        const {email} = require('../firebaseAPI.js');
        if (this.props.room.index === 0) {
            firebase.database().ref('/events/').once('value').then((allRoomsEvents) => {
                allRoomsEvents = allRoomsEvents.val();
                let events = [];
                for (let i in allRoomsEvents) {
                    for (let idx in allRoomsEvents[i]) {
                        console.log(allRoomsEvents[i][idx])
                        events.push({'title': allRoomsEvents[i][idx].description,
                            'start': new Date(allRoomsEvents[i][idx].startDate),
                            'end': new Date(allRoomsEvents[i][idx].endDate),
                            'color': this.colorChooser(Number(i))
                        });
                    }
                }
                const reservationSlot = {};
                this.setState({events, email, reservationSlot});
            });
        } else {
            firebase.database().ref('/events/' + this.props.room.index).once('value').then((eventList) => {
                eventList = eventList.val();
                let idx = 0;
                for (let i in eventList) {
                    events[idx] = {
                        'title': eventList[i].description,
                        'start': new Date(eventList[i].startDate),
                        'end': new Date(eventList[i].endDate),
                        'color': this.colorChooser(this.props.room.index)
                    }
                    idx += 1;
                }
                const reservationSlot = {};
                this.setState({events, email, reservationSlot});
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const events = [];

        firebase.database().ref('/events/' + nextProps.room.index).on('value', (eventList) => {
            eventList = eventList.val();
            let idx = 0;
            for (let i in eventList) {
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

    render() {
        return (
            <div className='calendar'>
                <BigCalendar selectable= { this.props.room.index === 0 ? false : 'ignoreEvents'} events={this.state.events} step={30} defaultView='week' onSelectSlot={(slotInfo) => {
                    let startTime = slotInfo.start.toLocaleString();
                    let endTime = slotInfo.end.toLocaleString();
                    this.onTimeSelect(startTime, endTime);
                }} onSelectEvent= {(event)=>{
                  this.setState({showPopup: !this.state.showPopup, event});
                }} eventPropGetter={this.eventStyleGetter}/> {this.state.showPopup
                    ? <div className="reservationPopup">
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
                                    <RaisedButton
                                      label="Delete"
                                      primary={true}

                                    />
                                    <RaisedButton
                                      label="Close"
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
