import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import LoginForm from './loginForm';
import RoomList from './roomList';
import Calendar from './calendar';
import RoomInfo from './roomInfo';
import ResForm from './reservationForm';
import Header from '../ur/components/Header';
import Footer from '../ur/components/Footer';
import injectTapEventPlugin from 'react-tap-event-plugin';

require('../firebaseAPI.js');

function mapStateToProps(state) {
    return {loggedIn: state.loggedIn}
}

const appBarStyle = {
    backgroundColor: '#266cb2'
}

class MainPage extends React.Component {
    constructor(){
      super();
      this.state = {
        startTime: '',
        endTime: '',
        date: '',
        reservationData: {},
        events: []
      };
    }

    render() {
        return (
            <div>
                <Header
                  user={this.props.user}
                  admin={this.props.admin}
                  signOut={this.props.signOut}
                />
                <MuiThemeProvider>
                    <AppBar style={appBarStyle} title="Rooms" iconElementLeft={< IconButton ></IconButton>}/>
                </MuiThemeProvider>
                <div className='mainpage'>
                    <RoomList/>
                    <Calendar
                      changeTime={(times)=>{
                        this.setState({
                          startTime: times.startTime,
                          endTime: times.endTime,
                          date: times.date
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
                    <div className ="room-whole-details">
                      <RoomInfo/>
                      <ResForm
                        startTime={ this.state.startTime }
                        endTime={ this.state.endTime }
                        date={ this.state.date }
                        data={ this.state.reservationData }
                        events={ this.state.events }
                      />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(mapStateToProps)(MainPage);
