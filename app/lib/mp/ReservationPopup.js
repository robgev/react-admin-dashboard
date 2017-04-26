import React from 'react';
import TimePicker from 'material-ui/TimePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { saveEvent } from '../firebaseAPI.js';
import moment from 'moment';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import ErrorPopup from './ErrorPopup';

const timeChecker = (t0, t1, t2, t3) => {
  const timeCheck0 = !moment(t0).isBetween(t2, t3);
  const timeCheck1 = !moment(t1).isBetween(t2, t3);
  const timeCheck2 = !moment(t2).isBetween(t0, t1);
  const timeCheck3 = !moment(t3).isBetween(t0, t1);

  return (timeCheck0 && timeCheck1 && timeCheck2 && timeCheck3);
}

const buttonStyle = {
  width: 125
}

export default
class ReservationPopup extends React.Component {

  constructor(){
    super();
    this.state = {
      description: '',
      startDate: '',
      roomNumber: null,
      endDate: '',
      email: '',
      date: null,
      events: [],
      err: false
    }
  }

  dateChangeHandler = (newDate) => {
    let date = newDate.toUTCString();
    date = new Date(date.split(' ').slice(0, 4).join(' '));
    this.setState({date});
  }

  descChangeHandler = (e) => {
    this.setState({description: e.target.value});
  }

  componentWillMount(){
    this.initialDate = this.props.date.split('/');
    this.initialStart = this.props.start.toString().split(' ')[4].split(':');
    this.initialEnd = this.props.end.toString().split(' ')[4].split(':');
    this.setState({...this.props.data,
      date: new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0]),
      events: this.props.events
    });
  }

  reserve = () => {
    const date = this.date.state.date.toString().split(' ').slice(0, 4).join(' ');
    const startTime = new Date(date.toString() +' '+this.startTime.state.time.toString().split(' ').slice(4, 7).join(' ').toString());
    const endTime = new Date(date.toString()+' '+this.endTime.state.time.toString().split(' ').slice(4, 7).join(' ').toString());

    let eventStartTime;
    let eventEndTime;
    let freeTime = true;

    for (let i in this.state.events){
      eventStartTime = this.state.events[i].start;
      eventEndTime = this.state.events[i].end;
      if (!timeChecker(startTime, endTime, eventStartTime, eventEndTime)){
        freeTime = false;
        break;
      }
    }

    if (!freeTime){
      this.setState({err: true});
      return;
    }

    const data = {
      roomNumber: this.state.roomNumber,
      startDate: startTime.toString(),
      endDate: endTime.toString(),
      description: this.state.description,
      email: this.state.email
    }
    saveEvent(data).then(()=>{
      this.props.close();
    });
  }

  render(){
    return(
      <MuiThemeProvider>
        <ModalContainer>
          <ModalDialog>
            <DatePicker
              ref={(time) => { this.date = time; }}
              hintText='Date'
              mode='landscape'
              defaultDate={ this.state.date }
              onChange={(_, newDate)=>{this.dateChangeHandler(newDate)}}
            />
            <TimePicker
              ref={(time) => { this.startTime = time; }}
              hintText='12hr Format'
              defaultTime={ new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0], this.initialStart[0], this.initialStart[1])}
            />
            <TimePicker
              ref={(time) => { this.endTime = time; }}
              hintText='12hr Format'
              defaultTime={ new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0], this.initialEnd[0], this.initialEnd[1])}
            />
            <TextField
              floatingLabelText='Event description and side notes'
              multiLine={true}
              rows={3}
              onChange={this.descChangeHandler}
            />
            <div className='popup-buttons'>

                <RaisedButton
                buttonStyle={buttonStyle}
                label='Reserve'
                primary={true}
                onClick={this.reserve}
                />


                <RaisedButton
                buttonStyle={buttonStyle}
                label='Close'
                primary={false}
                onClick={ this.props.close }
                />

            </div>
            {
              this.state.err ? <ErrorPopup
                msg='The time you selected is not free'
                close={()=>{
                  this.setState({err: false});
                }}
              /> : <div></div>
            }
          </ModalDialog>
        </ModalContainer>
      </MuiThemeProvider>
    )
  }
}
