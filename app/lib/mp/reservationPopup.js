import React from 'react';
import TimePicker from 'material-ui/TimePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { saveEvent } from '../firebaseAPI.js';

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
      date: null
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
    this.setState({...this.props.data, date: new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0])});
  }

  reserve = () => {
    const date = this.date.state.date.toString().split(' ').slice(0, 4).join(' ');
    const startTime = new Date(date.toString() +" "+this.startTime.state.time.toString().split(' ').slice(4, 7).join(' ').toString());
    const endTime = new Date(date.toString()+" "+this.endTime.state.time.toString().split(' ').slice(4, 7).join(' ').toString());

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
        <div className="reservationPopup" style={{zIndex: 4}}>
          <div className='popupWindow'>
            <DatePicker
              ref={(time) => { this.date = time; }}
              hintText="Date"
              mode="landscape"
              defaultDate={ this.state.date }
              onChange={(_, newDate)=>{this.dateChangeHandler(newDate)}}
            />
          <TimePicker
            ref={(time) => { this.startTime = time; }}
            hintText="12hr Format"
            defaultTime={ new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0], this.initialStart[0], this.initialStart[1])}
          />
          <TimePicker
            ref={(time) => { this.endTime = time; }}
            hintText="12hr Format"
            defaultTime={ new Date(this.initialDate[2], this.initialDate[1]-1, this.initialDate[0], this.initialEnd[0], this.initialEnd[1])}
          />
          <TextField
            floatingLabelText="Event description and side notes"
            multiLine={true}
            rows={3}
            onChange={this.descChangeHandler}
          />
        <div className="popup-buttons">
          <RaisedButton
            label="Reserve"
            primary={true}
            onClick={this.reserve}
          />
          <RaisedButton
            label="Close"
            primary={false}
            onClick={ this.props.close }
          />
        </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}
